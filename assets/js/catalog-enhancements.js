  var LINKS = window.MONAIDE_LINKS || {};
  var CATALOG_CONFIG = window.MONAIDE_CATALOG_CONFIG || {};

  function getCatalogStoreItemFromCard(card) {
    if (!card) return null;
    var aidId = card.getAttribute('data-aid-id') || '';
    if (aidId && window.getCatalogStoreItem) {
      return window.getCatalogStoreItem(aidId);
    }
    var title = ((card.querySelector('.cat-card-title') || {}).textContent || '').trim();
    return title && window.getCatalogStoreItem ? window.getCatalogStoreItem(title) : null;
  }

  function getCatalogLinkMeta(link) {
    var label = normalizeAidText(link.textContent || '');
    var href = normalizeAidText(link.getAttribute('href') || '');
    var directActionHints = CATALOG_CONFIG.directActionHints || [];
    var isDirectAction = directActionHints.some(function(hint) {
      return label.indexOf(hint) !== -1 || href.indexOf(hint) !== -1;
    });
    return isDirectAction
      ? { className: 'is-direct-action', kind: 'Démarche' }
      : { className: 'is-info-link', kind: 'Infos' };
  }

  function matchesCatalogLabelRule(href, rawLabel, rule) {
    if (!rule) return false;
    var hrefMatches = false;
    var label = String(rawLabel || '').toLowerCase();
    if (rule.hrefExactList && rule.hrefExactList.indexOf(href) !== -1) hrefMatches = true;
    if (!hrefMatches && rule.hrefLinkKeys) {
      hrefMatches = rule.hrefLinkKeys.some(function(key) {
        return LINKS[key] && LINKS[key] === href;
      });
    }
    if (!hrefMatches && rule.hrefIncludesList) {
      hrefMatches = rule.hrefIncludesList.some(function(part) {
        return href.indexOf(part) !== -1;
      });
    }
    if (!hrefMatches) return false;
    if (rule.labelIncludesAny && !rule.labelIncludesAny.some(function(part) { return label.indexOf(part) !== -1; })) {
      return false;
    }
    return true;
  }

  function normalizeCatalogLinkLabel(link) {
    var href = link.getAttribute('href') || '';
    var label = (link.textContent || '').replace(/\s+/g, ' ').trim();
    var rule = (CATALOG_CONFIG.normalizedLabelRules || []).find(function(item) {
      return matchesCatalogLabelRule(href, label, item);
    });
    return rule ? rule.label : label;
  }

  function appendCatalogLinkGroup(group, kind, label, items) {
    if (!items.length) return;
    var row = document.createElement('div');
    row.className = 'catalog-link-group ' + kind;
    var rowLabel = document.createElement('span');
    rowLabel.className = 'catalog-link-group-label';
    rowLabel.textContent = label;
    var linksWrap = document.createElement('div');
    linksWrap.className = 'catalog-link-group-links';
    items.forEach(function(link) {
      linksWrap.appendChild(link);
    });
    row.appendChild(rowLabel);
    row.appendChild(linksWrap);
    group.appendChild(row);
  }

  function enhanceCatalogLinkHierarchy() {
    document.querySelectorAll('.cat-card .expand-links, .cat-card .cat-quicklinks').forEach(function(group) {
      var links = Array.from(group.querySelectorAll('a'));
      if (!links.length) return;

      links.forEach(function(link) {
        var normalizedLabel = normalizeCatalogLinkLabel(link);
        if (normalizedLabel && normalizedLabel !== link.textContent.trim()) {
          var textNodes = Array.from(link.childNodes).filter(function(node) {
            return node.nodeType === Node.TEXT_NODE;
          });
          if (textNodes.length) {
            textNodes[textNodes.length - 1].textContent = normalizedLabel;
          } else {
            link.appendChild(document.createTextNode(normalizedLabel));
          }
        }
        link.classList.remove('is-direct-action', 'is-info-link');
        var meta = getCatalogLinkMeta(link);
        link.classList.add(meta.className);
        link.setAttribute('data-link-kind', meta.kind);
      });

      var directLinks = links.filter(function(link) {
        return link.classList.contains('is-direct-action');
      });
      var infoLinks = links.filter(function(link) {
        return !link.classList.contains('is-direct-action');
      });

      group.innerHTML = '';
      appendCatalogLinkGroup(group, 'is-action', 'Démarches', directLinks);
      appendCatalogLinkGroup(group, 'is-info', 'Infos', infoLinks);
    });
  }

  function getCatalogRiInfoHtml() {
    return '<span class="inline-info catalog-ri-info" tabindex="0" aria-label="RI : Revenu d’insertion">i<span class="inline-info-bubble">RI = Revenu d’insertion. C’est une aide financière de dernier recours qui se demande via le CSR.</span></span>';
  }

  function enhanceCatalogRiHints() {
    document.querySelectorAll('.cat-card-title, .cat-card-body p, .expand-list li, .expand-links a, .cat-quicklinks a').forEach(function(el) {
      if (el.innerHTML.indexOf('catalog-ri-info') !== -1) return;
      if (el.innerHTML.indexOf('RI') === -1) return;

      var card = el.closest('.cat-card');
      var cardItem = getCatalogStoreItemFromCard(card);
      if (cardItem && cardItem.id === 'ri') return;

      el.innerHTML = el.innerHTML.replace(/\bRI\b(?![^<]*catalog-ri-info)/, 'RI ' + getCatalogRiInfoHtml());
    });
  }

  function enhanceCatalogCardAccessibility() {
    document.querySelectorAll('.cat-card').forEach(function(card, index) {
      var body = card.querySelector('.cat-card-body');
      var catalogItem = getCatalogStoreItemFromCard(card);

      if (catalogItem) card.setAttribute('data-aid-id', catalogItem.id);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', card.classList.contains('open') ? 'true' : 'false');

      if (body) {
        if (!body.id) body.id = 'cat-card-body-' + (index + 1);
        card.setAttribute('aria-controls', body.id);
      }

      card.addEventListener('keydown', function(e) {
        if (e.target && e.target.closest('.cat-quicklinks')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCatCard(card);
        }
      });
    });

    document.querySelectorAll('.cat-card a, .cat-card button').forEach(function(control) {
      if (control.classList.contains('cat-card')) return;
      control.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    });
  }

  function enhanceDocumentationAccessibility() {
    document.querySelectorAll('.doc-accordion-shell').forEach(function(shell) {
      var button = shell.querySelector('.doc-accordion-btn');
      var content = shell.querySelector('.doc-content');
      if (!button || !content || !content.id) return;
      if (!button.id) button.id = content.id + '-button';
      button.setAttribute('type', 'button');
      button.setAttribute('aria-controls', content.id);
      content.setAttribute('aria-labelledby', button.id);
      updateDocAccordionState(content.id, content.style.display === 'block');
    });
  }

  window.getCatalogItemById = function(id) {
    return window.getCatalogStoreItem ? window.getCatalogStoreItem(id) : null;
  };

  enhanceCatalogCardAccessibility();
  enhanceDocumentationAccessibility();
  enhanceCatalogRiHints();
  enhanceCatalogLinkHierarchy();
