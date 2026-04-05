  function buildDocumentationStoreFromData() {
    var data = window.MONAIDE_DOCUMENTATION_DATA || { items: [] };
    var items = (data.items || []).map(function(item) {
      var accordion = item.accordion || {};
      return {
        id: item.blockId || item.id,
        accordionId: item.accordionId || '',
        title: accordion.title || item.menuLabel || item.id || '',
        normalizedTitle: normalizeAidText(accordion.title || item.menuLabel || item.id || ''),
        subtitle: accordion.subtitle || '',
        lead: (accordion.leadHtml || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
        contact: {
          label: ((accordion.contact || {}).label || ''),
          text: ((accordion.contact || {}).text || '')
        },
        infoBoxes: accordion.infoBoxes || [],
        listLabel: accordion.checklistLabel || 'Documents à préparer',
        checklist: accordion.checklist || [],
        plainList: accordion.plainList || [],
        notes: (accordion.preChecklistNotes || []).concat(accordion.notes || []),
        actions: (accordion.actions || []).map(function(action) {
          return {
            label: action.label,
            normalizedLabel: normalizeAidText(action.label),
            href: action.href,
            target: '_blank',
            primary: !!action.primary,
            kind: /\.pdf($|[?#])/i.test(action.href || '') ? 'pdf' : (action.primary ? 'action' : 'info')
          };
        })
      };
    });
    var shortcuts = (data.items || []).filter(function(item) {
      return !!(item.shortcut && item.shortcut.href);
    }).map(function(item, index) {
      return {
        id: item.id || ('docs-shortcut-' + (index + 1)),
        kicker: (item.shortcut || {}).kicker || '',
        title: (item.shortcut || {}).title || '',
        text: (item.shortcut || {}).text || '',
        href: (item.shortcut || {}).href || ''
      };
    });
    var byId = {};
    var byAccordionId = {};
    var byNormalizedTitle = {};
    items.forEach(function(item) {
      byId[item.id] = item;
      if (item.accordionId) byAccordionId[item.accordionId] = item;
      byNormalizedTitle[item.normalizedTitle] = item;
    });
    return { items: items, shortcuts: shortcuts, byId: byId, byAccordionId: byAccordionId, byNormalizedTitle: byNormalizedTitle };
  }

  function buildCatalogStoreFromData() {
    var layout = window.MONAIDE_CATALOG_LAYOUT || { byNormalizedTitle: {} };
    var items = (window.MONAIDE_CATALOG_ITEMS || []).map(function(item, index) {
      var layoutMeta = layout.byNormalizedTitle
        ? layout.byNormalizedTitle[normalizeAidText(item.title || '')]
        : null;
      return {
        id: item.id,
        title: item.title,
        normalizedTitle: normalizeAidText(item.title),
        category: ((layoutMeta && layoutMeta.dataCat) || item.category || '').split(' ')[0] || '',
        groupId: layoutMeta ? layoutMeta.groupId : '',
        groupTitle: layoutMeta ? (layoutMeta.groupTitle || '') : '',
        summary: item.summary || '',
        purpose: item.purpose || item.bodyIntro || '',
        detailSections: item.sections || [],
        callouts: item.callouts || [],
        quickLinks: (item.links || []).map(function(link) {
          return {
            label: link.label,
            normalizedLabel: normalizeAidText(link.label),
            href: link.url,
            target: '_blank',
            onclick: '',
            kind: link.kind || 'info',
            docTarget: null
          };
        }),
        links: (item.links || []).map(function(link) {
          return {
            label: link.label,
            normalizedLabel: normalizeAidText(link.label),
            href: link.url,
            target: '_blank',
            onclick: '',
            kind: link.kind || 'info',
            docTarget: null
          };
        }),
        documentationTarget: item.documentationTarget || null,
        override: item,
        order: layoutMeta ? layoutMeta.order : index
      };
    });
    items.sort(function(a, b) {
      if (a.groupId !== b.groupId) return 0;
      return (a.order || 0) - (b.order || 0);
    });
    var byId = {};
    var byNormalizedTitle = {};
    items.forEach(function(item) {
      byId[item.id] = item;
      byNormalizedTitle[item.normalizedTitle] = item;
    });
    return { items: items, byId: byId, byNormalizedTitle: byNormalizedTitle };
  }

  function buildAidContentIndex(catalogStore, documentationStore) {
    var byAidId = {};
    (catalogStore.items || []).forEach(function(catalogItem) {
      var docTarget = catalogItem.documentationTarget || null;
      var documentationItem = docTarget
        ? (documentationStore.byId[docTarget.blockId] ||
          documentationStore.byAccordionId[docTarget.accordionId] ||
          null)
        : null;
      byAidId[catalogItem.id] = {
        aidId: catalogItem.id,
        title: catalogItem.title,
        category: catalogItem.category,
        catalogItem: catalogItem,
        documentationTarget: docTarget,
        documentationItem: documentationItem
      };
    });
    return { byAidId: byAidId };
  }

  window.MONAIDE_CATALOG_STORE = buildCatalogStoreFromData();
  window.MONAIDE_DOCUMENTATION_STORE = buildDocumentationStoreFromData();
  window.MONAIDE_CONTENT_INDEX = buildAidContentIndex(window.MONAIDE_CATALOG_STORE, window.MONAIDE_DOCUMENTATION_STORE);

  window.getCatalogStoreItem = function(idOrTitle) {
    if (!idOrTitle || !window.MONAIDE_CATALOG_STORE) return null;
    return window.MONAIDE_CATALOG_STORE.byId[idOrTitle] ||
      window.MONAIDE_CATALOG_STORE.byNormalizedTitle[normalizeAidText(idOrTitle)] ||
      null;
  };

  window.getDocumentationStoreItem = function(idOrTitle) {
    if (!idOrTitle || !window.MONAIDE_DOCUMENTATION_STORE) return null;
    return window.MONAIDE_DOCUMENTATION_STORE.byId[idOrTitle] ||
      window.MONAIDE_DOCUMENTATION_STORE.byAccordionId[idOrTitle] ||
      window.MONAIDE_DOCUMENTATION_STORE.byNormalizedTitle[normalizeAidText(idOrTitle)] ||
      null;
  };

  window.getDocumentationTargetForAid = function(idOrTitle) {
    var catalogItem = window.getCatalogStoreItem ? window.getCatalogStoreItem(idOrTitle) : null;
    return catalogItem ? (catalogItem.documentationTarget || null) : null;
  };

  window.inspectCatalogStore = function() {
    return window.MONAIDE_CATALOG_STORE;
  };

  window.inspectDocumentationStore = function() {
    return window.MONAIDE_DOCUMENTATION_STORE;
  };

  window.getAidContentBundle = function(idOrTitle) {
    var catalogItem = window.getCatalogStoreItem ? window.getCatalogStoreItem(idOrTitle) : null;
    if (!catalogItem || !window.MONAIDE_CONTENT_INDEX) return null;
    return window.MONAIDE_CONTENT_INDEX.byAidId[catalogItem.id] || null;
  };
