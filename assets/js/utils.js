  function normalizeAidText(value) {
    return (value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[()]/g, ' ')
      .replace(/[—–-]/g, ' ')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function extractPhoneNumbersFromText(text) {
    var raw = String(text || '').replace(/\u00a0/g, ' ');
    var matches = raw.match(/(?:0\d{2}\s\d{3}\s\d{2}\s\d{2}|0800\s\d{2}\s\d{2}\s\d{2}|0\d{3}\s\d{3}\s\d{3}|079\s\d{3}\s\d{2}\s\d{2}|078\s\d{3}\s\d{2}\s\d{2}|077\s\d{3}\s\d{2}\s\d{2}|076\s\d{3}\s\d{2}\s\d{2}|\b143\b|\b147\b)/g);
    return matches ? Array.from(new Set(matches)) : [];
  }

  function buildPhoneLinkHtml(number) {
    var raw = String(number || '').trim();
    if (!raw) return '';
    var tel = raw.replace(/[^\d+]/g, '');
    return '<a href="tel:' + tel + '">' + escapeHtml(raw) + '</a>';
  }

  function linkifyPhoneNumbersInHtml(text) {
    var escaped = escapeHtml(String(text || ''));
    return escaped.replace(/(?:0\d{2}\s\d{3}\s\d{2}\s\d{2}|0800\s\d{2}\s\d{2}\s\d{2}|0\d{3}\s\d{3}\s\d{3}|079\s\d{3}\s\d{2}\s\d{2}|078\s\d{3}\s\d{2}\s\d{2}|077\s\d{3}\s\d{2}\s\d{2}|076\s\d{3}\s\d{2}\s\d{2}|\b143\b|\b147\b)/g, function(match) {
      return buildPhoneLinkHtml(match);
    });
  }

  function linkifyPhoneNumbersInElement(root) {
    if (!root || !('createTreeWalker' in document)) return;
    var phonePattern = /(?:0\d{2}\s\d{3}\s\d{2}\s\d{2}|0800\s\d{2}\s\d{2}\s\d{2}|0\d{3}\s\d{3}\s\d{3}|079\s\d{3}\s\d{2}\s\d{2}|078\s\d{3}\s\d{2}\s\d{2}|077\s\d{3}\s\d{2}\s\d{2}|076\s\d{3}\s\d{2}\s\d{2}|\b143\b|\b147\b)/g;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        if (!node || !node.parentNode) return NodeFilter.FILTER_REJECT;
        var parent = node.parentNode;
        phonePattern.lastIndex = 0;
        if (!node.nodeValue || !phonePattern.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        phonePattern.lastIndex = 0;
        if (parent.closest && parent.closest('a, button, script, style, svg')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function(node) {
      var text = node.nodeValue || '';
      phonePattern.lastIndex = 0;
      var matches = text.match(phonePattern);
      if (!matches || !matches.length) return;
      var fragment = document.createDocumentFragment();
      var lastIndex = 0;
      text.replace(phonePattern, function(match, offset) {
        if (offset > lastIndex) fragment.appendChild(document.createTextNode(text.slice(lastIndex, offset)));
        var wrapper = document.createElement('span');
        wrapper.innerHTML = buildPhoneLinkHtml(match);
        fragment.appendChild(wrapper.firstChild);
        lastIndex = offset + match.length;
        return match;
      });
      if (lastIndex < text.length) fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      node.parentNode.replaceChild(fragment, node);
    });
  }

  function expandSearchQueries(query) {
    var normalizedQuery = normalizeAidText(query);
    if (!normalizedQuery) return [];
    var conceptMap = SEARCH_CONFIG.conceptMap || {};
    var expanded = [normalizedQuery];
    Object.keys(conceptMap).forEach(function(key) {
      if (normalizedQuery.indexOf(key) !== -1) expanded = expanded.concat(conceptMap[key]);
    });
    return Array.from(new Set(expanded));
  }

  function findCatalogCardForAid(query) {
    var normalizedQuery = normalizeAidText(query);
    if (!normalizedQuery) return null;
    var aliasMap = SEARCH_CONFIG.aliasMap || {};
    var candidateQueries = [normalizedQuery].concat(aliasMap[normalizedQuery] || []);
    var catalogStore = window.MONAIDE_CATALOG_STORE;
    var cards = Array.from(document.querySelectorAll('.cat-card'));

    if (catalogStore && catalogStore.items && catalogStore.items.length) {
      for (var s = 0; s < candidateQueries.length; s++) {
        var candidateStoreQuery = candidateQueries[s];
        var matchedItem = catalogStore.byId[candidateStoreQuery] ||
          catalogStore.byNormalizedTitle[candidateStoreQuery] ||
          catalogStore.items.find(function(item) {
            return normalizeAidText(item.title || '') === candidateStoreQuery ||
              normalizeAidText(item.summary || '') === candidateStoreQuery ||
              normalizeAidText(item.id || '') === candidateStoreQuery;
          }) ||
          catalogStore.items.find(function(item) {
            return normalizeAidText(item.title || '').indexOf(candidateStoreQuery) !== -1 ||
              normalizeAidText(item.summary || '').indexOf(candidateStoreQuery) !== -1 ||
              normalizeAidText(item.purpose || '').indexOf(candidateStoreQuery) !== -1;
          });
        if (matchedItem) {
          var matchedCard = document.querySelector('.cat-card[data-aid-id="' + matchedItem.id + '"]');
          if (matchedCard) return matchedCard;
        }
      }
    }

    for (var i = 0; i < candidateQueries.length; i++) {
      var candidate = candidateQueries[i];
      var exact = cards.find(function(card) {
        var titleEl = card.querySelector('.cat-card-title');
        return titleEl && normalizeAidText(titleEl.textContent) === candidate;
      });
      if (exact) return exact;
    }

    for (var j = 0; j < candidateQueries.length; j++) {
      var partial = candidateQueries[j];
      var contains = cards.find(function(card) {
        var titleEl = card.querySelector('.cat-card-title');
        return titleEl && normalizeAidText(titleEl.textContent).indexOf(partial) !== -1;
      });
      if (contains) return contains;
    }

    return cards.find(function(card) {
      var text = normalizeAidText(card.innerText);
      return text.indexOf(normalizedQuery) !== -1;
    }) || null;
  }
  var SEARCH_CONFIG = window.MONAIDE_SEARCH_CONFIG || {};
