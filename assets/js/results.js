
  var LINKS = window.MONAIDE_LINKS || {};
  var RESULT_LINKS_CONFIG = window.MONAIDE_RESULT_LINKS_CONFIG || {};
  var RESULTS_UI_CONFIG = window.MONAIDE_RESULTS_UI_CONFIG || {};

  function matchesResultPatterns(name, patterns) {
    var normalizedName = normalizeAidText(name || '');
    return (patterns || []).some(function(pattern) {
      var normalizedPattern = normalizeAidText(pattern);
      if (normalizedPattern === 'subside lamal') {
        return normalizedName.indexOf('subside lamal') !== -1 ||
          normalizedName.indexOf('subside assurance maladie') !== -1;
      }
      return normalizedName.indexOf(normalizedPattern) !== -1;
    });
  }

  function getAidPurpose(name) {
    var rule = (RESULTS_UI_CONFIG.purposeRules || []).find(function(item) {
      return matchesResultPatterns(name, item.patterns);
    });
    return rule ? rule.text : (RESULTS_UI_CONFIG.defaultPurpose || 'Cette piste donne une première porte à vérifier selon les réponses indiquées.');
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
    var retraite = !!(context && context.retraite);
    if (retraite) {
      if (matchesResultPatterns(name, ['prestations complementaires', 'pc avs', 'pc'])) return 0;
      if (matchesResultPatterns(name, ['pro senectute', 'aas'])) return 1;
      if (matchesResultPatterns(name, ['subside lamal'])) return 3;
      if (matchesResultPatterns(name, ['carteculture'])) return 8;
    }
    var jeuneEnFormation = !!(context && context.age === '18-25' && context.enFormation);
    if (jeuneEnFormation) {
      if (matchesResultPatterns(name, ['bourses', 'ocbe'])) return 0;
      if (matchesResultPatterns(name, ['jet service'])) return 1;
      if (matchesResultPatterns(name, ['subside lamal'])) return 6;
    }
    var sansRevenuEtSansEmploi = !!(context && context.sansRevenuEtSansEmploi);
    if (sansRevenuEtSansEmploi) {
      if (matchesResultPatterns(name, ['revenu d insertion', 'centre social regional'])) return 0;
      if (matchesResultPatterns(name, ['parlons cash', 'dettes'])) return 1;
      if (matchesResultPatterns(name, ['aide alimentaire'])) return 2;
      if (matchesResultPatterns(name, ['assurance chomage'])) return 3;
      if (matchesResultPatterns(name, ['subside lamal'])) return 6;
    }
    var chomageNonIndem = !!(context && context.chomageNonIndem);
    if (chomageNonIndem) {
      if (matchesResultPatterns(name, ['assurance chomage'])) return 0;
      if (matchesResultPatterns(name, ['revenu d insertion', 'centre social regional'])) return 1;
      if (matchesResultPatterns(name, ['subside lamal'])) return 6;
    }
    var urgenceLogement = !!(context && context.urgenceLogement);
    if (urgenceLogement) {
      if (matchesResultPatterns(name, ['expulsion', 'asloca'])) return 0;
      if (matchesResultPatterns(name, ['centre social regional', 'revenu d insertion'])) return 1;
      if (matchesResultPatterns(name, ['aides logement'])) return 2;
      if (matchesResultPatterns(name, ['parlons cash', 'dettes'])) return 3;
      if (matchesResultPatterns(name, ['subside lamal'])) return 8;
    }
    var dettesActives = !!(context && context.dettesActives);
    if (dettesActives) {
      if (matchesResultPatterns(name, ['parlons cash', 'dettes'])) return 0;
      if (matchesResultPatterns(name, ['centre social regional', 'revenu d insertion'])) return 1;
      if (matchesResultPatterns(name, ['aide alimentaire'])) return 2.5;
      if (matchesResultPatterns(name, ['prestations communales'])) return 3;
      if (matchesResultPatterns(name, ['subside lamal'])) return 6;
    }
    var separationEnCours = !!(context && context.separationEnCours);
    if (separationEnCours) {
      if (matchesResultPatterns(name, ['separation', 'divorce'])) return 0.5;
      if (matchesResultPatterns(name, ['pc familles'])) return 2.5;
      if (matchesResultPatterns(name, ['subside lamal'])) return 8;
    }
    var aEnfants = !!(context && context.aEnfants);
    if (aEnfants && !urgenceLogement && !dettesActives) {
      if (matchesResultPatterns(name, ['pc familles'])) return 0;
      if (matchesResultPatterns(name, ['allocations familiales'])) return 1;
      if (matchesResultPatterns(name, ['prestations communales'])) return 2;
      if (context.loyerEleve && matchesResultPatterns(name, ['aides logement'])) return 2.5;
      if (matchesResultPatterns(name, ['garde d enfants malades'])) return 4;
      if (matchesResultPatterns(name, ['subside lamal'])) return 6;
      if (matchesResultPatterns(name, ['carteculture'])) return 8;
    }
    var incapaciteDurable = !!(context && context.incapaciteDurable);
    if (incapaciteDurable) {
      if (matchesResultPatterns(name, ['assurance invalidite'])) return 1.5;
      if (matchesResultPatterns(name, ['pro infirmis', 'cms'])) return 4.5;
      if (matchesResultPatterns(name, ['subside lamal'])) return 8;
    }
    var procheAidant = !!(context && context.procheAidant);
    if (procheAidant) {
      if (matchesResultPatterns(name, ['proches aidant'])) return 1.5;
      if (matchesResultPatterns(name, ['cms'])) return 4.5;
      if (matchesResultPatterns(name, ['subside lamal'])) return 8;
    }
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

  function getProfileWhyReasons(result, profile) {
    var reasons = [];
    var name = result && result.nom ? result.nom : '';
    if (!profile || !name) return reasons;

    var revenuFaible = profile.revenu === 'aucun' || profile.revenu === 'moins1000' || profile.revenu === '1000-2000';
    var revenuModere = profile.revenu === '2000-3500';
    var primeElevee = profile.primeLamal === '250-400' || profile.primeLamal === 'plus400';
    var enFormation = profile.formation === 'oui_apres_obligatoire';
    var jeuneEnFormation = profile.age === '18-25' && enFormation;
    var famille = String(profile.famille || '');
    var aEnfants = (profile.enfants && profile.enfants !== 'non') || /avec enfants/i.test(famille) || /parent seul/i.test(famille);
    var chomage = profile.sitPro === 'Au chômage' || String(profile.sitPro || '').indexOf('Sans emploi') !== -1;
    var logementFragile = String(profile.logement || '').indexOf('Locataire') !== -1 && (profile.loyer === '1200-1800' || profile.loyer === 'plus1800');
    var logementInstable = String(profile.logement || '').indexOf('Sans logement fixe') !== -1 || String(profile.logement || '').indexOf('structure d’accueil') !== -1;
    var permisNuance = /Permis (B|F|L|S|G|N)/.test(profile.permis || '') || String(profile.permis || '').indexOf('sans statut') !== -1;
    var aidesListe = profile.aidesListe || [];
    var dejaAideSociale = aidesListe.indexOf('RI') !== -1 || aidesListe.indexOf('PC') !== -1 || aidesListe.indexOf('lamal') !== -1 || aidesListe.indexOf('bourse') !== -1;

    if (jeuneEnFormation && matchesResultPatterns(name, ['bourses', 'ocbe'])) {
      reasons.push('Car tu es en formation et entre 18 et 25 ans : une bourse OCBE peut parfois aider à couvrir une partie des frais de formation.');
    } else if (jeuneEnFormation && matchesResultPatterns(name, ['jet service'])) {
      reasons.push('Car Jet Service aide les jeunes en formation à faire le point sur les bourses, le budget, le travail ou les démarches qui deviennent floues.');
    }
    if (profile.age === '65plus' && matchesResultPatterns(name, ['prestations complementaires', 'pro senectute', 'aas'])) {
      reasons.push('Car tu indiques être à l’âge AVS.');
    }
    if (jeuneEnFormation && matchesResultPatterns(name, ['subside lamal'])) {
      reasons.push('Car en formation, la prime maladie peut vite peser lourd dans le budget : le subside LAMal sert à vérifier si elle peut être réduite.');
    } else if (revenuFaible && matchesResultPatterns(name, ['revenu d insertion', 'centre social regional', 'subside lamal', 'aide alimentaire', 'carteculture'])) {
      reasons.push('Car tes revenus indiqués sont bas.');
    }
    if (revenuModere && primeElevee && matchesResultPatterns(name, ['subside lamal'])) {
      reasons.push('Car ta prime maladie semble peser lourd dans le budget.');
    }
    if (aEnfants && matchesResultPatterns(name, ['allocations familiales', 'pc familles', 'prestations communales', 'garde d enfants malades'])) {
      reasons.push('Car tu indiques avoir des enfants à charge.');
    }
    if (chomage && matchesResultPatterns(name, ['assurance chomage', 'revenu d insertion', 'centre social regional'])) {
      reasons.push('Car ta situation professionnelle indique une perte ou absence d’emploi.');
    }
    if (logementFragile && matchesResultPatterns(name, ['aides logement', 'centre social regional', 'revenu d insertion'])) {
      reasons.push('Car ton loyer semble lourd par rapport à la situation indiquée.');
    }
    if (logementInstable && matchesResultPatterns(name, ['centre social regional', 'aides logement', 'urgence', 'expulsion'])) {
      reasons.push('Car ton logement semble instable ou déjà fragile.');
    }
    if (permisNuance && matchesResultPatterns(name, ['fraternite', 'evam', 'permis', 'subside lamal', 'assurance chomage', 'revenu d insertion'])) {
      reasons.push('Car ton statut de séjour peut changer la bonne démarche.');
    }
    if (profile.incapacite && profile.incapacite !== 'non' && matchesResultPatterns(name, ['assurance invalidite', 'pro infirmis', 'cms'])) {
      reasons.push('Car tu indiques une limite de santé ou une incapacité.');
    }
    if (profile.dettes === 'loyer' && matchesResultPatterns(name, ['expulsion', 'asloca', 'centre social regional', 'dettes', 'parlons cash'])) {
      reasons.push('Car tu indiques un retard de loyer ou une pression sur le logement.');
    } else if (profile.dettes && profile.dettes !== 'non' && matchesResultPatterns(name, ['dettes', 'parlons cash', 'centre social regional', 'aide alimentaire'])) {
      reasons.push('Car tu indiques des dettes ou des factures difficiles à gérer.');
    }
    if (profile.separationEnCours === 'oui' && matchesResultPatterns(name, ['separation', 'brapa', 'centre social regional'])) {
      reasons.push('Car une séparation peut changer le budget, le logement ou les démarches familiales.');
    }
    if (profile.procheAidant === 'oui' && matchesResultPatterns(name, ['proches aidant', 'cms'])) {
      reasons.push('Car tu indiques aider régulièrement un proche.');
    }
    if (dejaAideSociale && matchesResultPatterns(name, ['carteculture', 'subside lamal'])) {
      reasons.push('Car tu indiques déjà une aide qui peut servir de repère ou de justificatif.');
    }
    return reasons;
  }

  function combineReasons(reasons) {
    if (!reasons || !reasons.length) return '';
    var simple = [];
    var complex = [];
    reasons.forEach(function(reason) {
      if (reason.indexOf(':') !== -1) {
        complex.push(reason);
      } else {
        simple.push(reason.replace(/^Car\s+/, '').replace(/\.\s*$/, ''));
      }
    });
    var parts = [];
    if (simple.length === 1) {
      parts.push('Car ' + simple[0] + '.');
    } else if (simple.length > 1) {
      var last = simple.pop();
      parts.push('Car ' + simple.join(', ') + ' et ' + last + '.');
    }
    return parts.concat(complex).join(' ');
  }

  function getWhySummary(result, profile) {
    if (!result) return '';
    var raw = String(result.why || result.desc || '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    var reasons = getProfileWhyReasons(result, profile);
    if (!raw && !reasons.length) return '';
    var sentence = raw.split(/(?<=[.!?])\s+/)[0] || raw;
    if (sentence.length > 135) sentence = sentence.slice(0, 132).trim() + '…';
    if (reasons.length && matchesResultPatterns(result.nom || '', ['jet service'])) {
      sentence = sentence.replace(/^Comme tu as entre 18 et 25 ans(?: et que tu es en formation)?,\s*/i, '');
    }
    return [combineReasons(reasons), sentence].filter(Boolean).join(' ');
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

  function getResultLinkGroup(label, fallback) {
    var normalized = normalizeAidText(label || '');
    if (normalized.indexOf('document') !== -1 || normalized.indexOf('preparer') !== -1 || normalized.indexOf('papiers') !== -1) return 'prepare';
    if (normalized.indexOf('guide') !== -1 || normalized.indexOf('infos') !== -1 || normalized.indexOf('comprendre') !== -1) return 'understand';
    if (getResultLinkClass(label).indexOf('is-primary') !== -1) return 'act';
    return fallback || 'understand';
  }

  function resultLinkObject(label, html, group) {
    if (!label || !html) return null;
    return {
      label: label,
      html: html,
      group: group || getResultLinkGroup(label, 'understand')
    };
  }

  function buildConfiguredResultLink(item) {
    if (!item) return null;
    if (item.type === 'doc') {
      var docTarget = resolveDocumentationLinkTarget(item);
      return docTarget ? resultLinkObject(item.label, docPill(item.label, docTarget.blockId, docTarget.accordionId), 'prepare') : null;
    }
    if (item.type === 'csr') {
      return resultLinkObject(item.label, pill(item.label, CSR_FINDER_URL), 'act');
    }
    if (item.type === 'link' && item.linkKey && LINKS[item.linkKey]) {
      return resultLinkObject(item.label, pill(item.label, LINKS[item.linkKey]), getResultLinkGroup(item.label, 'act'));
    }
    return null;
  }

  function getCatalogItemForResult(result) {
    if (!result || !result.nom || !window.getCatalogStoreItem) return null;
    var direct = window.getCatalogStoreItem(result.nom);
    if (direct) return direct;
    var normalizedName = normalizeAidText(result.nom || '');
    var items = ((window.MONAIDE_CATALOG_STORE || {}).items || []);
    return items.find(function(item) {
      var title = item.normalizedTitle || normalizeAidText(item.title || '');
      return title && (normalizedName.indexOf(title) !== -1 || title.indexOf(normalizedName) !== -1);
    }) || null;
  }

  function getGuideLinkForResult(result) {
    var catalogItem = getCatalogItemForResult(result);
    if (!catalogItem) return null;
    var existingGuide = (catalogItem.links || []).find(function(link) {
      var href = link.href || '';
      var label = link.normalizedLabel || normalizeAidText(link.label || '');
      return /^\/(?!\/)/.test(href) && label.indexOf('guide') !== -1;
    });
    if (existingGuide) return existingGuide;
    var relatedGuide = catalogItem.relatedGuide ||
      (typeof window.getRelatedGuideForAid === 'function' ? window.getRelatedGuideForAid(catalogItem.id || catalogItem) : null);
    return relatedGuide && relatedGuide.href
      ? {
          label: relatedGuide.label || 'Guide détaillé',
          normalizedLabel: normalizeAidText(relatedGuide.label || 'Guide détaillé'),
          href: relatedGuide.href,
          kind: 'guide'
        }
      : null;
  }

  function buildResultGuideLink(result) {
    var link = getGuideLinkForResult(result);
    if (!link || !link.href) return null;
    var label = link.label || 'Guide détaillé';
    return resultLinkObject(label, '<a href="' + escapeHtml(link.href) + '" class="result-link-btn" data-result-guide-link="true" data-aid-name="' + escapeHtml(result.nom || '') + '">' + escapeHtml(label) + '</a>', 'understand');
  }

  function buildResultLinks(result) {
    var links = [];
    var sets = RESULT_LINKS_CONFIG.sets || {};
    (RESULT_LINKS_CONFIG.flagOrder || []).forEach(function(flag) {
      if (!result || !result[flag]) return;
      (sets[flag] || []).forEach(function(item) {
        var link = buildConfiguredResultLink(item);
        if (link) links.push(link);
      });
    });
    var guideLink = buildResultGuideLink(result);
    if (guideLink) links.push(guideLink);
    return links;
  }

  function buildResultLinksHtml(result) {
    var links = buildResultLinks(result);
    if (!links.length) return '';
    var groups = [
      { key: 'understand', label: 'Comprendre' },
      { key: 'prepare', label: 'Préparer' },
      { key: 'act', label: 'Faire la démarche' }
    ];
    return groups.map(function(group) {
      var groupLinks = links.filter(function(link) { return link.group === group.key; });
      if (!groupLinks.length) return '';
      return '<div class="result-link-group"><div class="result-link-group-label">' + group.label + '</div><div class="result-link-group-actions">' + groupLinks.map(function(link) { return link.html; }).join('') + '</div></div>';
    }).join('');
  }

  function buildResultFooter(result) {
    var guideLink = getGuideLinkForResult(result);
    var guideHtml = guideLink && guideLink.href
      ? '<a href="' + escapeHtml(guideLink.href) + '" class="result-link-btn" data-result-guide-link="true" data-aid-name="' + escapeHtml(result.nom || '') + '">' + escapeHtml(guideLink.label || 'Guide détaillé') + ' →</a>'
      : '';
    return '<div class="result-card-footer">'
      + '<button type="button" class="result-link-btn is-primary" data-aid-query="' + escapeHtml(result.nom) + '" onclick="if(window.trackMonaideEvent){trackMonaideEvent(\'result_catalog_open\', { source: \'result_card\', aid: this.getAttribute(\'data-aid-query\') || \'\' });} openCatalogForAid(this.getAttribute(\'data-aid-query\'))">Fiche du répertoire →</button>'
      + guideHtml
      + '</div>';
  }

  function buildResultDetail(title, body, className, openByDefault) {
    if (!body) return '';
    var subtitles = RESULTS_UI_CONFIG.detailSubtitles || {};
    var subtitle = subtitles[className] || subtitles[title] || '';
    return '<details class="result-detail ' + className + '" data-detail-title="' + escapeHtml(title) + '"' + (openByDefault ? ' open' : '') + '><summary><span class="result-detail-copy"><span class="result-detail-title">' + title + '</span>' + (subtitle ? '<span class="result-detail-hint">' + escapeHtml(subtitle) + '</span>' : '') + '</span><span class="result-detail-chevron" aria-hidden="true"></span></summary><div class="result-detail-body">' + body + '</div></details>';
  }

  function sortSimulationResults(results, resultContext) {
    var ordre = RESULTS_UI_CONFIG.badgeOrder || { probable: 0, verifier: 1 };
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
    if (result.badge === 'probable' && result.strongProbable) return { className: 'badge-probable', confidenceClass: 'confidence-probablement', label: 'Probablement' };
    if (result.badge === 'probable') return { className: 'badge-probable', confidenceClass: 'confidence-probablement', label: 'Probablement' };
    return { className: 'badge-verifier', confidenceClass: 'confidence-verifier', label: 'À vérifier' };
  }

  function buildResultNameHtml(result) {
    var resultNameHtml = escapeHtml(result.nom);
    if ((result.nom || '').indexOf('Subside assurance maladie') !== -1 || (result.nom || '').indexOf('Subside LAMal') !== -1) {
      resultNameHtml += '<span class="inline-info" aria-hidden="true">i<span class="inline-info-bubble">Un subside est une aide financière. Ici, il sert à réduire le montant de la prime d’assurance maladie.</span></span>';
    }
    return resultNameHtml;
  }

  function renderResultCard(result, index, meta) {
    meta = meta || {};
    var detailTitles = RESULTS_UI_CONFIG.detailTitles || {};
    var detailClasses = RESULTS_UI_CONFIG.detailClasses || {};
    var purposeText = getAidPurpose(result.nom);
    var links = buildResultLinksHtml(result);
    var whyHtml = shouldShowWhy(result) ? buildResultDetail(detailTitles.why || 'Pourquoi cette piste apparaît', getWhySummary(result, meta.profile), detailClasses.why || 'is-why', false) : '';
    var actionHtml = result.action ? buildResultDetail(detailTitles.action || 'Ce que tu peux faire maintenant', '<div style="white-space:pre-line;">' + linkifyPhoneNumbersInHtml(result.action) + '</div>', detailClasses.action || 'is-action', !!meta.isPrimaryFocus) : '';
    var docsHtml = result.docs && result.docs.length
      ? buildResultDetail(detailTitles.docs || 'Documents utiles à préparer', '<ul>' + result.docs.map(function(doc) { return '<li>' + doc + '</li>'; }).join('') + '</ul>', detailClasses.docs || 'is-docs', false)
      : '';
    var linksHtml = links
      ? buildResultDetail('Liens utiles', '<div class="result-link-row is-grouped">' + links + '</div>', 'is-links', false)
      : '';
    var startHtml = '';
    var kindHtml = '<div class="result-kind">' + getResultKind(result.nom) + '</div>';
    var followUpHtml = whyHtml + actionHtml + docsHtml + linksHtml;
    var badgeMeta = getResultBadgeMeta(result);
    var cardClasses = 'result-item result-reveal ' + badgeMeta.confidenceClass;
    if (meta.isPrimaryFocus) cardClasses += ' is-primary-focus';
    if (meta.isSecondary) cardClasses += ' is-secondary-track';
    var rankHtml = meta.rankLabel ? '<div class="result-rank">' + escapeHtml(meta.rankLabel) + '</div>' : '';
    var footerHtml = buildResultFooter(result);
    return '<article class="' + cardClasses + '" data-result-name="' + escapeHtml(result.nom) + '"><div class="result-card-header"><span class="result-badge ' + badgeMeta.className + '">' + badgeMeta.label + '</span><div class="result-content">' + rankHtml + kindHtml + '<div class="result-name">' + buildResultNameHtml(result) + '</div><div class="result-lead">' + escapeHtml(purposeText) + '</div></div></div>' + startHtml + '<div class="result-card-accordion">' + followUpHtml + '</div>' + footerHtml + '</article>';
  }

  function bindResultDetailTracking(list) {
    if (!list || !window.trackMonaideEvent) return;
    list.querySelectorAll('.result-detail').forEach(function(detail) {
      detail.addEventListener('toggle', function() {
        if (!detail.open) return;
        window.trackMonaideEvent('result_detail_open', {
          detail: detail.getAttribute('data-detail-title') || ''
        });
      });
    });
    list.querySelectorAll('[data-result-guide-link]').forEach(function(link) {
      link.addEventListener('click', function() {
        window.trackMonaideEvent('result_guide_open', {
          source: 'result_card',
          aid: link.getAttribute('data-aid-name') || ''
        });
      });
    });
  }

  function renderResultsFooterBanner(title, bodyHtml, animationIndex, extraStyle, extraClass) {
    return '<div class="results-footer-banner ' + (extraClass || '') + ' result-reveal" style="' + (extraStyle || '') + '"><div class="results-footer-banner-title">' + escapeHtml(title) + '</div><div class="results-footer-banner-body">' + bodyHtml + '</div></div>';
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
    var bodyHtml = '<div><div style="font-size:0.88rem;color:rgba(235,245,239,.72);line-height:1.55;">' + escapeHtml(RESULTS_UI_CONFIG.noCoverageText || 'Le simulateur ne couvre pas tout. Le répertoire permet aussi de chercher par besoin : budget, logement, santé, famille, formation ou séjour.') + '</div></div>'
      + '<a href="#catalogue" class="results-footer-banner-btn" onclick="if(window.trackMonaideEvent){trackMonaideEvent(\'result_catalog_open\', { source: \'results_footer\', aid: \'catalogue_des_aides\' });}">' + escapeHtml(RESULTS_UI_CONFIG.openCatalogLabel || 'Répertoire des aides →') + '</a>';
    return renderResultsFooterBanner((RESULTS_UI_CONFIG.summaryTitles || {}).more || 'Tu veux aller plus loin ?', bodyHtml, Math.min(resultCount + 6, 12), 'margin-top:1.6rem;', 'is-cta');
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
    html += '<ul style="margin:0;padding-left:1rem;">';
    prompts.slice(0, 4).forEach(function(prompt) {
      html += '<li style="margin:0 0 0.5rem;"><strong style="color:var(--dark);">' + escapeHtml(prompt.title) + ' :</strong> ' + escapeHtml(prompt.text) + '</li>';
    });
    html += '</ul></div>';

    return renderResultsFooterBanner('Points à clarifier si nécessaire', html, Math.min(resultCount + 5, 11));
  }

  function buildLatestSimulation(profile, results, topActions, docList) {
    var summary = profile.summary || {};
    return {
      profile: {
        commune: profile.commune,
        age: summary.age || profile.age,
        situation: summary.travail || profile.sitPro,
        logement: summary.logement || profile.logement,
        revenu: summary.revenu || profile.revenu
      },
      results: results.map(function(item) {
        return {
          nom: item.nom,
          badgeLabel: item.badge === 'probable' ? 'Probablement' : 'À vérifier',
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

    list.innerHTML = '<div class="results-count-label">' + res.length + ' piste' + (res.length > 1 ? 's' : '') + ' identifiée' + (res.length > 1 ? 's' : '') + '</div>';

    res.forEach(function(r, index) {
      var secondary = isSecondaryResult(r.nom || '');
      var primaryFocus = !primaryFocusAssigned && (hasPrimaryTrack ? !secondary : index === 0);
      if (primaryFocus) primaryFocusAssigned = true;
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
        rankLabel: '',
        profile: profile
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
    if (window.trackMonaideEvent) {
      var probableCount = res.filter(function(item) { return item.badge === 'probable'; }).length;
      window.trackMonaideEvent('simulator_results_view', {
        count: res.length,
        probable: probableCount,
        verifier: res.length - probableCount
      });
    }

    list.innerHTML += buildMoreCatalogBanner(res.length);
    bindResultDetailTracking(list);

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
