
  var LINKS = window.MONAIDE_LINKS || {};
  var RESULT_LINKS_CONFIG = window.MONAIDE_RESULT_LINKS_CONFIG || {};
  var RESULTS_UI_CONFIG = window.MONAIDE_RESULTS_UI_CONFIG || {};

  function matchesResultPatterns(name, patterns) {
    var normalizedName = normalizeAidText(name || '');
    return (patterns || []).some(function(pattern) {
      return normalizedName.indexOf(normalizeAidText(pattern)) !== -1;
    });
  }

  function getAidPurpose(name) {
    var rule = (RESULTS_UI_CONFIG.purposeRules || []).find(function(item) {
      return matchesResultPatterns(name, item.patterns);
    });
    return rule ? rule.text : (RESULTS_UI_CONFIG.defaultPurpose || 'Cette aide ou orientation sert à t’ouvrir une piste concrète selon ta situation.');
  }

  function getResultKind(name) {
    var rule = (RESULTS_UI_CONFIG.kindRules || []).find(function(item) {
      return matchesResultPatterns(name, item.patterns);
    });
    if (rule) return rule.value;
    return 'Aide ou piste possible';
  }

  function isSecondaryResult(name) {
    return (RESULTS_UI_CONFIG.secondaryRules || []).some(function(patterns) {
      return matchesResultPatterns(name, patterns);
    });
  }

  function getResultPriority(name, context) {
    var enEmploi = !!(context && context.enEmploi);
    var rule = (RESULTS_UI_CONFIG.priorityRules || []).find(function(item) {
      return matchesResultPatterns(name, item.patterns);
    });
    if (rule) return enEmploi && typeof rule.priorityWhenEmploi === 'number' ? rule.priorityWhenEmploi : rule.priority;
    return 50;
  }

  function getRegionalOrientation(communeNorm, communeLabel) {
    if (!communeNorm || communeNorm === 'non precise') return null;

    var match = (RESULTS_UI_CONFIG.regions || []).find(function(region) {
      return region.communes.some(function(name) {
        return communeNorm === name || communeNorm.indexOf(name) !== -1;
      });
    });

    if (!match) return null;

    return {
      label: match.label,
      commune: communeLabel,
      csrUrl: CSR_FINDER_URL,
      aasUrl: 'https://www.vd.ch/aides-financieres-et-soutien-social/trouver-une-agence-dassurance-sociale-aas/liste-des-agences-dassurances-sociales'
    };
  }

  function getActionSummary(text) {
    var cleaned = String(text || '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^\s*[•✔⚠]\s*/,'')
      .replace(/^\s*\d+\.\s*/, '')
      .trim();
    if (!cleaned) return '';
    var sentence = cleaned.split(/(?<=[.!?])\s+/)[0] || cleaned;
    if (sentence.length > 115) sentence = sentence.slice(0, 112).trim() + '…';
    return sentence;
  }

  function getResultsFirstContactMeta(results) {
    if (!results || !results.length) return null;
    var primary = results.find(function(item) {
      return item && !isSecondaryResult(item.nom || '');
    }) || results[0];
    if (!primary || !primary.nom) return null;
    var rule = (RESULTS_UI_CONFIG.firstContactRules || []).find(function(item) {
      return matchesResultPatterns(primary.nom || '', item.patterns);
    });
    if (!rule) return null;
    return {
      title: rule.title,
      text: rule.text,
      actionLabel: rule.actionLabel,
      actionUrl: rule.actionKey === 'CSR_FINDER' ? CSR_FINDER_URL : LINKS[rule.actionKey]
    };
  }

  function shouldShowWhy(result) {
    if (!result) return false;
    return !!(result.why || result.desc);
  }

  function getWhySummary(result) {
    if (!result) return '';
    var raw = String(result.why || result.desc || '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!raw) return '';
    var sentence = raw.split(/(?<=[.!?])\s+/)[0] || raw;
    if (sentence.length > 135) sentence = sentence.slice(0, 132).trim() + '…';
    return sentence;
  }

  function getResultLinkClass(label) {
    var normalized = normalizeAidText(label || '');
    var primaryHints = [
      'demander',
      'faire une demande',
      'evaluer',
      's inscrire',
      'inscrire',
      'trouver ton csr',
      'trouver une agence',
      'formulaires',
      'contacter',
      'appeler'
    ];
    return primaryHints.some(function(hint) {
      return normalized.indexOf(hint) !== -1;
    }) ? 'result-link-btn is-primary' : 'result-link-btn';
  }

  function pill(label, url) {
    return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="' + getResultLinkClass(label) + '">' + label + '</a>';
  }

  function docPill(label, blockId, accordionId) {
    return '<a href="#' + blockId + '" class="result-link-btn" onclick="event.preventDefault();openDocumentationTarget(\'' + blockId + '\',\'' + accordionId + '\')">' + label + '</a>';
  }

  function resolveDocumentationLinkTarget(item) {
    if (!item) return null;
    if (item.blockId && item.accordionId) {
      return { blockId: item.blockId, accordionId: item.accordionId };
    }
    if (window.getDocumentationTargetForAid && (item.aidId || item.aidTitle)) {
      return window.getDocumentationTargetForAid(item.aidId || item.aidTitle);
    }
    return null;
  }

  function buildConfiguredResultLink(item) {
    if (!item) return '';
    if (item.type === 'doc') {
      var docTarget = resolveDocumentationLinkTarget(item);
      return docTarget ? docPill(item.label, docTarget.blockId, docTarget.accordionId) : '';
    }
    if (item.type === 'csr') {
      return pill(item.label, CSR_FINDER_URL);
    }
    if (item.type === 'link' && item.linkKey && LINKS[item.linkKey]) {
      return pill(item.label, LINKS[item.linkKey]);
    }
    return '';
  }

  function buildResultLinksHtml(result) {
    var html = '';
    var sets = RESULT_LINKS_CONFIG.sets || {};
    (RESULT_LINKS_CONFIG.flagOrder || []).forEach(function(flag) {
      if (!result || !result[flag]) return;
      (sets[flag] || []).forEach(function(item) {
        html += buildConfiguredResultLink(item);
      });
    });
    return html;
  }

  function buildResultDetail(title, body, className, openByDefault) {
    if (!body) return '';
    return '<details class="result-detail ' + className + '"' + (openByDefault ? ' open' : '') + '><summary><span class="result-detail-title">' + title + '</span><span class="result-detail-hint">' + escapeHtml(RESULTS_UI_CONFIG.detailHint || 'Appuie pour ouvrir') + '</span></summary><div class="result-detail-body">' + body + '</div></details>';
  }

  function sortSimulationResults(results, resultContext) {
    var ordre = RESULTS_UI_CONFIG.badgeOrder || { confirme: 0, probable: 1, verifier: 2 };
    results.sort(function(a, b) {
      var priorityA = getResultPriority(a.nom || '', resultContext);
      var priorityB = getResultPriority(b.nom || '', resultContext);
      if (priorityA !== priorityB) return priorityA - priorityB;
      var ordreA = Object.prototype.hasOwnProperty.call(ordre, a.badge) ? ordre[a.badge] : 2;
      var ordreB = Object.prototype.hasOwnProperty.call(ordre, b.badge) ? ordre[b.badge] : 2;
      if (ordreA !== ordreB) return ordreA - ordreB;
      var secondaryA = isSecondaryResult(a.nom || '');
      var secondaryB = isSecondaryResult(b.nom || '');
      if (secondaryA !== secondaryB) return secondaryA ? 1 : -1;
      return 0;
    });
  }

  function getResultBadgeMeta(result) {
    if (result.badge === 'confirme') return { className: 'badge-oui', label: 'Confirmé' };
    if (result.badge === 'probable') return { className: 'badge-probable', label: 'Probablement' };
    return { className: 'badge-verifier', label: 'À vérifier' };
  }

  function buildResultMoreHtml(result, followUpHtml) {
    if (!followUpHtml) return '';
    return '<details class="result-more-shell"><summary><span class="result-more-label-open">' + escapeHtml(RESULTS_UI_CONFIG.moreDetailsLabel || 'Ouvrir le détail de cette piste') + '</span><span class="result-more-label-close">' + escapeHtml(RESULTS_UI_CONFIG.lessDetailsLabel || 'Refermer le détail') + '</span><span class="result-more-hint">' + escapeHtml(RESULTS_UI_CONFIG.moreDetailsHint || 'Explications, étapes et documents utiles') + '</span></summary><div class="result-more-body">' + followUpHtml + '</div></details>';
  }

  function buildResultNameHtml(result) {
    var resultNameHtml = escapeHtml(result.nom);
    if ((result.nom || '').indexOf('Subside LAMal') !== -1) {
      resultNameHtml += '<span class="inline-info" aria-hidden="true">i<span class="inline-info-bubble">Un subside est une aide financière. Ici, il sert à réduire le montant de la prime d’assurance maladie.</span></span>';
    }
    return resultNameHtml;
  }

  function renderResultSectionLabel(title, text) {
    return '<div class="result-section-label"><div class="result-section-title">' + escapeHtml(title) + '</div><div class="result-section-text">' + escapeHtml(text) + '</div></div>';
  }

  function renderResultCard(result, index, meta) {
    meta = meta || {};
    var detailTitles = RESULTS_UI_CONFIG.detailTitles || {};
    var detailClasses = RESULTS_UI_CONFIG.detailClasses || {};
    var purposeText = getAidPurpose(result.nom);
    var links = buildResultLinksHtml(result);
    var purposeHtml = buildResultDetail(detailTitles.purpose || 'À quoi ça peut servir', purposeText, detailClasses.purpose || 'is-purpose', false);
    var whyHtml = shouldShowWhy(result) ? buildResultDetail(detailTitles.why || 'Pourquoi cette piste apparaît', getWhySummary(result), detailClasses.why || 'is-why', false) : '';
    var actionHtml = result.action ? buildResultDetail(detailTitles.action || 'Ce que tu peux faire maintenant', '<div style="white-space:pre-line;">' + linkifyPhoneNumbersInHtml(result.action) + '</div>', detailClasses.action || 'is-action', false) : '';
    var docsHtml = result.docs && result.docs.length
      ? buildResultDetail(detailTitles.docs || 'Documents utiles à préparer', '<ul>' + result.docs.map(function(doc) { return '<li>' + doc + '</li>'; }).join('') + '</ul>', detailClasses.docs || 'is-docs', false)
      : '';
    var startSummary = getActionSummary(result.action || result.today || '');
    var startHtml = startSummary
      ? '<div class="result-start"><span class="result-start-label">' + escapeHtml((RESULTS_UI_CONFIG.summaryTitles || {}).start || 'Par quoi commencer') + '</span><div class="result-start-text">' + escapeHtml(startSummary) + '</div></div>'
      : '';
    var moreHtml = '<div class="result-link-row"><button type="button" class="result-link-btn is-secondary" data-aid-query="' + escapeHtml(result.nom) + '" onclick="openCatalogForAid(this.getAttribute(\'data-aid-query\'))">' + escapeHtml(RESULTS_UI_CONFIG.moreCatalogLabel || 'En savoir plus') + '</button></div>';
    var kindHtml = '<div class="result-kind">' + getResultKind(result.nom) + '</div>';
    var linksHtml = links ? buildResultDetail(detailTitles.links || 'Liens utiles', '<div class="result-link-row">' + links + '</div>', detailClasses.links || 'is-links', false) : '';
    var followUpHtml = whyHtml + actionHtml + docsHtml + linksHtml + purposeHtml + moreHtml;
    var badgeMeta = getResultBadgeMeta(result);
    var cardClasses = 'result-item result-reveal';
    if (meta.isPrimaryFocus) cardClasses += ' is-primary-focus';
    if (meta.isSecondary) cardClasses += ' is-secondary-track';
    var rankHtml = meta.rankLabel ? '<div class="result-rank">' + escapeHtml(meta.rankLabel) + '</div>' : '';
    return '<div class="' + cardClasses + '" style="animation-delay:' + (0.06 * Math.min(index, 8)) + 's;"><span class="result-badge ' + badgeMeta.className + '">' + badgeMeta.label + '</span><div class="result-content">' + rankHtml + kindHtml + '<div class="result-name">' + buildResultNameHtml(result) + '</div><div class="result-lead">' + escapeHtml(purposeText) + '</div>' + startHtml + buildResultMoreHtml(result, followUpHtml) + '</div></div>';
  }

  function renderResultsFooterBanner(title, bodyHtml, animationIndex, extraStyle) {
    return '<div class="results-footer-banner result-reveal" style="' + (extraStyle || '') + 'animation-delay:' + (0.06 * Math.min(animationIndex, 12)) + 's;"><div class="results-footer-banner-title">' + escapeHtml(title) + '</div>' + bodyHtml + '</div>';
  }

  function buildTopActionsBanner(topActions, resultCount) {
    if (!topActions.length) return '';
    var bodyHtml = '';
    topActions.forEach(function(item, index) {
      bodyHtml += '<div style="font-size:0.79rem;color:var(--dark);line-height:1.6;margin-bottom:' + (index === topActions.length - 1 ? '0' : '0.4rem') + ';"><strong style="color:var(--orange-dark);">' + (index + 1) + '.</strong> <strong>' + item.nom + ' :</strong> ' + item.action + '</div>';
    });
    return renderResultsFooterBanner((RESULTS_UI_CONFIG.summaryTitles || {}).start || 'Par quoi commencer', bodyHtml, Math.min(resultCount, 8), 'margin-top:0.25rem;');
  }

  function buildDocsBanner(docList, resultCount) {
    return '';
  }

  function buildRegionalBanner(regionalOrientation, resultCount) {
    if (!regionalOrientation) return '';
    var bodyHtml = '<div style="font-size:0.79rem;color:var(--dark);line-height:1.65;margin-bottom:0.6rem;">Pour <strong>' + escapeHtml(regionalOrientation.commune) + '</strong>, le rep&#232;re territorial le plus probable est <strong>' + escapeHtml(regionalOrientation.label) + '</strong>. Pour les aides financi&#232;res et les prestations sociales, v&#233;rifie ensuite le CSR et l\'agence AAS de ta r&#233;gion.</div><div class="result-link-row"><a href="' + regionalOrientation.csrUrl + '" target="_blank" rel="noopener noreferrer" class="result-link-btn">Voir le CSR</a><a href="' + regionalOrientation.aasUrl + '" target="_blank" rel="noopener noreferrer" class="result-link-btn">Voir l&#8217;agence AAS</a></div>';
    return renderResultsFooterBanner((RESULTS_UI_CONFIG.summaryTitles || {}).region || 'Dans ta région', bodyHtml, Math.min(resultCount + 3, 11));
  }

  function buildMoreCatalogBanner(resultCount) {
    var bodyHtml = '<div style="font-size:0.78rem;color:var(--warm-gray);line-height:1.6;margin-bottom:0.6rem;">' + escapeHtml(RESULTS_UI_CONFIG.noCoverageText || 'Le simulateur ne couvre pas tout. Le catalogue recense des ressources vaudoises supplémentaires — associations, services, aides spécifiques — qui pourraient te concerner.') + '</div>'
      + '<a href="#catalogue" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:var(--sage-dark);color:white;border-radius:9px;font-size:0.8rem;font-weight:600;text-decoration:none;">' + escapeHtml(RESULTS_UI_CONFIG.openCatalogLabel || 'Voir le catalogue des aides →') + '</a>';
    return renderResultsFooterBanner((RESULTS_UI_CONFIG.summaryTitles || {}).more || 'Plus d\'aides potentielles dans le catalogue', bodyHtml, Math.min(resultCount + 6, 12));
  }

  function buildFollowUpBanner(profile, results, resultCount) {
    var rules = window.MONAIDE_SIMULATOR_FOLLOWUPS || [];
    if (!rules.length || !results || !results.length) return '';

    var prompts = rules.filter(function(rule) {
      if (!rule || typeof rule.when !== 'function') return false;
      var matches = (rule.patterns || []).some(function(pattern) {
        return results.some(function(item) {
          return (item.nom || '').indexOf(pattern) !== -1;
        });
      });
      return matches && rule.when(profile, results);
    });

    if (!prompts.length) return '';

    var html = '<div style="font-size:0.78rem;color:var(--warm-gray);line-height:1.6;">';
    html += '<p style="margin:0 0 0.7rem;"><strong style="color:var(--dark);">Pour affiner ensuite si besoin :</strong> ces points peuvent changer la porte d’entrée ou le niveau de certitude.</p>';
    html += '<ul style="margin:0;padding-left:1rem;">';
    prompts.slice(0, 4).forEach(function(prompt) {
      html += '<li style="margin:0 0 0.5rem;"><strong style="color:var(--dark);">' + escapeHtml(prompt.title) + ' :</strong> ' + escapeHtml(prompt.text) + '</li>';
    });
    html += '</ul></div>';

    return renderResultsFooterBanner('Points à clarifier si nécessaire', html, Math.min(resultCount + 5, 11));
  }

  function buildLatestSimulation(profile, results, topActions, docList) {
    return {
      profile: {
        commune: profile.commune,
        age: profile.age,
        situation: profile.sitPro,
        logement: profile.logement,
        revenu: profile.revenu
      },
      results: results.map(function(item) {
        return {
          nom: item.nom,
          badgeLabel: item.badge === 'confirme' ? 'Confirmé' : item.badge === 'probable' ? 'Probablement' : 'À vérifier',
          why: getWhySummary(item),
          today: item.today || '',
          action: item.action ? item.action.replace(/\n+/g, ' ') : ''
        };
      }),
      contacts: topActions.slice(),
      docs: docList.slice()
    };
  }

  function renderSimulationResults(profile, res, resultContext) {
    sortSimulationResults(res, resultContext);

    var list = document.getElementById('results-list');
    if (list) list.setAttribute('aria-busy', 'true');
    list.innerHTML = '';
    var topActions = [];
    var docsMap = {};
    var regionalOrientation = getRegionalOrientation(profile.communeNorm, profile.commune);
    var hasPrimaryTrack = res.some(function(item) {
      return !isSecondaryResult(item.nom || '');
    });
    var primaryFocusAssigned = false;
    var secondaryLabelInserted = false;

    res.forEach(function(r, index) {
      var secondary = isSecondaryResult(r.nom || '');
      var primaryFocus = !primaryFocusAssigned && (hasPrimaryTrack ? !secondary : index === 0);
      if (primaryFocus) primaryFocusAssigned = true;
      if (secondary && !secondaryLabelInserted && index > 0) {
        list.innerHTML += renderResultSectionLabel(
          (RESULTS_UI_CONFIG.summaryTitles || {}).secondary || 'Autres pistes à regarder ensuite',
          RESULTS_UI_CONFIG.secondaryIntroText || 'Ces ressources peuvent compléter la piste principale selon ta situation, mais elles ne sont pas forcément la première démarche à faire.'
        );
        secondaryLabelInserted = true;
      }
      if (!isSecondaryResult(r.nom || '') && topActions.length < 3 && r.action) {
        topActions.push({ nom: r.nom, action: getActionSummary(r.action) });
      }
      if (r.docs && r.docs.length) {
        r.docs.forEach(function(doc) {
          docsMap[doc] = true;
        });
      }
      list.innerHTML += renderResultCard(r, index, {
        isPrimaryFocus: primaryFocus,
        isSecondary: secondary,
        rankLabel: primaryFocus ? ((RESULTS_UI_CONFIG.summaryTitles || {}).primary || 'Piste principale') : ''
      });
    });

    var docList = Object.keys(docsMap).slice(0, 8);
    if (docList.length) {
      list.innerHTML += buildDocsBanner(docList, res.length);
    }

    if (regionalOrientation) {
      list.innerHTML += buildRegionalBanner(regionalOrientation, res.length);
    }

    list.innerHTML += buildFollowUpBanner(profile, res, res.length);

    latestSimulation = buildLatestSimulation(profile, res, topActions, docList);

    list.innerHTML += buildMoreCatalogBanner(res.length);

    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var el = document.getElementById('step' + i);
      if (el) el.style.display = 'none';
    }
    revealResultsPane();
  }

  // ─── Simulateur : cerveau ────────────────────────────────────────────────
  window.analyserSituation = function() {
    quickReviewMode = false;
    resetResultsNote();

    var profile = readSimulationProfileFromForm();
    renderResultsProfileSummary(profile.summary);

    var computed = computeSimulationResults(profile);
    renderSimulationResults(profile, computed.results, computed.context);
  }

  document.querySelectorAll('a[target="_blank"]').forEach(function(link) {
    if (!link.rel || link.rel.indexOf('noopener') === -1) {
      link.rel = 'noopener noreferrer';
    }
    if (!link.getAttribute('aria-label')) {
      var baseLabel = (link.textContent || '').replace(/\s+/g, ' ').trim();
      if (baseLabel) link.setAttribute('aria-label', baseLabel + ' (s’ouvre dans un nouvel onglet)');
    }
  });

  window.MONAIDE_TEST_API__ = window.MONAIDE_TEST_API__ || {};
  window.MONAIDE_TEST_API__.sortSimulationResults = sortSimulationResults;
  window.MONAIDE_TEST_API__.getResultPriority = getResultPriority;
  window.MONAIDE_TEST_API__.isSecondaryResult = isSecondaryResult;
