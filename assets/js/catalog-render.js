  function escapeCatalogRenderHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getCatalogRenderItemById(id) {
    return (window.MONAIDE_CATALOG_ITEMS || []).find(function(item) {
      return item.id === id;
    }) || null;
  }

  function buildLayoutMetadataFromConfig(layoutConfig) {
    var byNormalizedTitle = {};
    var groups = [];
    var cards = [];
    (layoutConfig.groups || []).forEach(function(group, groupIndex) {
      groups.push({
        id: group.id,
        order: groupIndex,
        title: group.title || '',
        subtitle: group.subtitle || ''
      });
      (group.items || []).forEach(function(layoutItem, itemIndex) {
        var item = getCatalogRenderItemById(layoutItem.id);
        if (!item) return;
        var normalizedTitle = normalizeAidText(item.title || '');
        var meta = {
          itemId: item.id,
          title: item.title || '',
          normalizedTitle: normalizedTitle,
          groupId: group.id,
          groupTitle: group.title || '',
          groupSubtitle: group.subtitle || '',
          dataCat: layoutItem.dataCat || item.category || '',
          tier: layoutItem.tier || 'known',
          order: itemIndex
        };
        byNormalizedTitle[normalizedTitle] = meta;
        cards.push(meta);
      });
    });
    return {
      byNormalizedTitle: byNormalizedTitle,
      groups: groups,
      cards: cards
    };
  }

  function resolveCatalogLayout() {
    return buildLayoutMetadataFromConfig(window.MONAIDE_CATALOG_LAYOUT_DATA || { groups: [] });
  }

  var CATALOG_LAYOUT = resolveCatalogLayout();
  window.MONAIDE_CATALOG_LAYOUT = CATALOG_LAYOUT;

  function renderCatalogRenderLink(link) {
    var icon = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
    var isInternal = /^\/(?!\/)/.test(link.url || '');
    var attrs = isInternal ? '' : ' target="_blank" rel="noopener noreferrer"';
    return '<a href="' + escapeCatalogRenderHtml(link.url) + '"' + attrs + '>' + icon + escapeCatalogRenderHtml(link.label) + '</a>';
  }

  function catalogRenderHasGuideLink(item) {
    return (item.links || []).some(function(link) {
      var label = normalizeAidText(link.label || '');
      var url = link.url || '';
      return /^\/(?!\/)/.test(url) && label.indexOf('guide') !== -1;
    });
  }

  function getCatalogRenderGuide(item) {
    if (!item || typeof window.getRelatedGuideForAid !== 'function') return null;
    return window.getRelatedGuideForAid(item);
  }

  function renderCatalogRenderDocLink(target) {
    if (!target || !target.blockId || !target.accordionId) return '';
    return '';
  }

  function renderCatalogRenderLinks(item) {
    var parts = [];
    (item.links || []).forEach(function(link) {
      if (link && link.url && link.label) parts.push(renderCatalogRenderLink(link));
    });
    var guide = getCatalogRenderGuide(item);
    if (guide && guide.href && !catalogRenderHasGuideLink(item)) {
      parts.push(renderCatalogRenderLink({ label: guide.label || 'Guide détaillé', url: guide.href }));
    }
    if (item.documentationTarget) {
      var docLink = renderCatalogRenderDocLink(item.documentationTarget);
      if (docLink) parts.push(docLink);
    }
    return parts.join('');
  }

  function renderCatalogRenderSections(item) {
    if (!item.sections || !item.sections.length) return '';
    return '<div class="catalog-detail-grid">' + item.sections.map(function(section) {
      return '<div class="catalog-detail-box"><div class="expand-subtitle">' + escapeCatalogRenderHtml(section.title) + '</div><ul class="expand-list">' + (section.items || []).map(function(entry) {
        return '<li>' + escapeCatalogRenderHtml(entry) + '</li>';
      }).join('') + '</ul></div>';
    }).join('') + '</div>';
  }

  function renderCatalogRenderCallouts(item) {
    if (!item.callouts || !item.callouts.length) return '';
    return item.callouts.map(function(callout) {
      var className = callout.kind === 'tip' ? 'catalog-callout-tip' : 'catalog-callout';
      return '<div class="' + className + '">' + (callout.html || escapeCatalogRenderHtml(callout.text || '')) + '</div>';
    }).join('');
  }

  function renderCatalogFirstSteps(item) {
    if (!item.firstSteps || !item.firstSteps.length) return '';
    return '<div class="catalog-first-step">'
      + '<div class="catalog-first-step-label">Premier geste</div>'
      + '<ul>' + item.firstSteps.map(function(step) {
        return '<li>' + escapeCatalogRenderHtml(step) + '</li>';
      }).join('') + '</ul>'
      + '</div>';
  }

  function renderCatalogRenderTrust(item) {
    if (!item) return '';
    var note = item.reviewNote || 'Contenu relu avec une logique d’orientation sociale, mais ne remplace pas une décision officielle.';
    var decision = item.decisionBy || 'À confirmer auprès du service indiqué dans la fiche';
    var meta = '<div class="catalog-trust-meta"><strong>Qui traite ou décide</strong><span>' + escapeCatalogRenderHtml(decision) + '</span></div>';
    return '<div class="catalog-trust"><div class="catalog-trust-note">' + escapeCatalogRenderHtml(note) + '</div>' + meta + '</div>';
  }

  function renderCatalogNextStep(item) {
    if (!item) return '';
    var guide = getCatalogRenderGuide(item);
    var guideLink = guide && guide.href
      ? '<a href="' + escapeCatalogRenderHtml(guide.href) + '">' + escapeCatalogRenderHtml(guide.label || 'Guide détaillé') + ' <span aria-hidden="true">→</span></a>'
      : '';
    var nextStepText = guideLink
      ? 'Commence par le premier geste ci-dessus. Ouvre le guide si tu veux les étapes détaillées, ou relance le simulateur si tu hésites.'
      : 'Commence par le premier geste ci-dessus. Si tu hésites, ouvre un lien utile ou relance le simulateur.';
    return '<div class="catalog-next-step" onclick="event.stopPropagation()">'
      + '<div><strong>Tu veux continuer avec cette piste ?</strong><span>' + nextStepText + '</span></div>'
      + '<div class="catalog-next-step-actions">' + guideLink + '<a href="#simulateur">Faire le simulateur <span aria-hidden="true">→</span></a></div>'
      + '</div>';
  }

  function renderCatalogRenderBody(item) {
    return '<div class="cat-card-body" style="display:none;">'
      + renderCatalogRenderTrust(item)
      + renderCatalogFirstSteps(item)
      + '<p>' + (item.bodyIntro || '') + '</p>'
      + renderCatalogRenderSections(item)
      + renderCatalogRenderCallouts(item)
      + '<div class="expand-links">' + renderCatalogRenderLinks(item) + '</div>'
      + renderCatalogNextStep(item)
      + '</div>';
  }

  function renderCatalogRenderQuicklinks(item) {
    return '<div class="cat-quicklinks" onclick="event.stopPropagation()">' + renderCatalogRenderLinks(item) + '</div>';
  }

  function renderCatalogRenderHeader(item) {
    return '<div class="cat-card-header"><div style="flex:1;min-width:0;"><div class="cat-card-title">' + escapeCatalogRenderHtml(item.title) + '</div><div class="cat-card-desc">' + escapeCatalogRenderHtml(item.summary || '') + '</div></div><span class="cat-card-arrow" aria-hidden="true"></span></div>';
  }

  function renderCatalogCardMarkup(item, dataCat) {
    var meta = CATALOG_LAYOUT.byNormalizedTitle[normalizeAidText(item.title || '')] || {};
    var tier = meta.tier || 'known';
    var extraClass = tier === 'essential' ? ' is-essential' : '';
    return '<div class="cat-card' + extraClass + '" data-tier="' + escapeCatalogRenderHtml(tier) + '" data-cat="' + escapeCatalogRenderHtml(dataCat || item.category || '') + '" data-aid-id="' + escapeCatalogRenderHtml(item.id) + '" data-render-source="catalog-data" onclick="toggleCatCard(this)">'
      + renderCatalogRenderHeader(item)
      + renderCatalogRenderQuicklinks(item)
      + renderCatalogRenderBody(item)
      + '</div>';
  }

  function renderCatalogGroupMarkup(groupMeta) {
    var groupCards = CATALOG_LAYOUT.cards
      .filter(function(cardMeta) { return cardMeta.groupId === groupMeta.id; })
      .sort(function(a, b) { return a.order - b.order; });
    var cardsMarkup = groupCards
      .map(function(meta) {
        var item = getCatalogRenderItemById(meta.itemId);
        if (!item) return '';
        return renderCatalogCardMarkup(item, meta.dataCat);
      })
      .join('');
    var countLabel = groupCards.length + ' aide' + (groupCards.length > 1 ? 's' : '');

    return '<div class="cat-group" id="' + escapeCatalogRenderHtml(groupMeta.id) + '">'
      + '<div class="cat-group-header"><button type="button" class="cat-group-toggle" onclick="toggleCatalogGroupMobile(this)" aria-expanded="false">'
      + '<span class="cat-group-copy"><span class="cat-group-title">' + escapeCatalogRenderHtml(groupMeta.title || '') + '</span><span class="cat-group-sub">' + escapeCatalogRenderHtml(groupMeta.subtitle || '') + '</span></span>'
      + '<span class="cat-group-count">' + escapeCatalogRenderHtml(countLabel) + '</span><span class="cat-group-chevron" aria-hidden="true"></span>'
      + '</button></div>'
      + '<div class="cat-cards-grid">' + cardsMarkup + '</div>'
      + '</div>';
  }

  function renderCatalogGroupsFromData() {
    var root = document.getElementById('catalog-groups-root');
    if (!root || !CATALOG_LAYOUT.groups || !CATALOG_LAYOUT.groups.length) return;
    root.innerHTML = CATALOG_LAYOUT.groups
      .slice()
      .sort(function(a, b) { return a.order - b.order; })
      .map(renderCatalogGroupMarkup)
      .join('');
  }

  window.renderCatalogCardsFromData = renderCatalogGroupsFromData;
  window.renderCatalogCardsFromData();
