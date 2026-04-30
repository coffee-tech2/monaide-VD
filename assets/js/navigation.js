  function setNavSearchState(open) {
    var panel = document.getElementById('nav-search-panel');
    if (panel) panel.classList.toggle('open', open);
    document.querySelectorAll('.nav-search-toggle').forEach(function(btn) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function closeNavSearchPanel() {
    setNavSearchState(false);
  }

  function syncMobileBodyState(isOpen) {
    document.body.classList.toggle('nav-open', !!isOpen && window.innerWidth <= 600);
  }

  function setMobileNavState(open) {
    var nav = document.getElementById('nav-links');
    var btn = document.getElementById('hamburger');
    if (nav) nav.classList.toggle('open', open);
    if (btn) {
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (!open) closeMobileNavDropdowns();
    syncMobileBodyState(open);
  }

  window.toggleAidSearch = function() {
    var panel = document.getElementById('nav-search-panel');
    if (!panel) return;
    if (window.innerWidth <= 600) {
      setMobileNavState(true);
      setNavSearchState(true);
      setTimeout(function() {
        var mobileInput = document.getElementById('nav-aid-search');
        if (mobileInput) mobileInput.focus();
      }, 80);
      return;
    }
    var open = !panel.classList.contains('open');
    setNavSearchState(open);
    if (open) {
      setTimeout(function() {
        var input = document.getElementById('nav-aid-search');
        if (input) input.focus();
      }, 80);
    }
  };

  window.submitAidSearch = function() {
    var navInput = document.getElementById('nav-aid-search');
    var catInput = document.getElementById('cat-search');
    var query = navInput ? navInput.value.trim() : '';
    if (!query || !catInput) return;
    catInput.value = query;
    var matchedCard = findCatalogCardForAid(query);
    if (matchedCard) openCatalogForAid(query);
    else filtrerCatalogue();
    var panel = document.getElementById('nav-search-panel');
    if (panel) {
      closeNavSearchPanel();
    }
    if (window.innerWidth <= 600) {
      setMobileNavState(false);
    }
  };

  window.applySearchSuggestion = function(query) {
    var catInput = document.getElementById('cat-search');
    if (!catInput || !query) return;
    catInput.value = query;
    var matchedCard = findCatalogCardForAid(query);
    if (matchedCard) openCatalogForAid(query);
    else filtrerCatalogue();
  };

  window.toggleMenu = function() {
    var nav = document.getElementById('nav-links');
    if (!nav) return;
    var open = !nav.classList.contains('open');
    if (!open) closeNavSearchPanel();
    setMobileNavState(open);
  };

  function closeMobileNavDropdowns() {
    document.querySelectorAll('.nav-dropdown-menu.open').forEach(function(menu) {
      menu.classList.remove('open');
    });
    document.querySelectorAll('.nav-dropdown > a[aria-expanded]').forEach(function(link) {
      link.setAttribute('aria-expanded', 'false');
    });
  }

  function normalizeGuideText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function simplifyGuideLabel(label) {
    var normalized = normalizeGuideText(label);
    if (normalized.indexOf('a retenir') !== -1) return 'À retenir';
    if (normalized.indexOf('source officielle') !== -1) return 'Source officielle';
    if (normalized.indexOf('conditions') !== -1) return 'Conditions';
    if (normalized.indexOf('demande') !== -1) return 'Démarche';
    if (normalized.indexOf('a preparer') !== -1) return 'Documents';
    if (normalized.indexOf('relais') !== -1) return 'Relais utile';
    if (normalized.indexOf('faq') !== -1) return 'FAQ';
    return String(label || '').trim();
  }

  function guideDetailCategoryForCard(card) {
    if (!card) return '';
    if (card.classList.contains('guide-support-card')) return 'retain';
    var label = card.querySelector('.guide-card-label');
    var shortLabel = simplifyGuideLabel(label ? label.textContent : '');
    if (shortLabel === 'À retenir') return 'retain';
    if (shortLabel === 'Source officielle' || shortLabel === 'Conditions') return 'conditions';
    if (shortLabel === 'Démarche' || shortLabel === 'Relais utile') return 'action';
    if (shortLabel === 'Documents') return 'documents';
    if (shortLabel === 'FAQ') return 'faq';
    return '';
  }

  function buildGuideDetailSections() {
    if (!document.body || !document.body.classList.contains('guide-detail-page')) return;
    if (document.querySelector('.guide-detail-block')) return;

    var primarySection = document.querySelector('main .guide-section .guide-grid');
    if (!primarySection) return;

    var cards = Array.prototype.slice.call(primarySection.children || []).filter(function(node) {
      return node && node.classList && node.classList.contains('guide-card');
    });
    if (!cards.length) return;

    var recognized = cards.some(function(card) {
      var category = guideDetailCategoryForCard(card);
      return category === 'retain' || category === 'conditions' || category === 'action' || category === 'documents';
    });
    if (!recognized) return;

    var parentSection = primarySection.closest('.guide-section');
    if (!parentSection) return;

    var sectionMeta = {
      retain: { id: 'guide-retenir', summary: 'Ce qu’il faut retenir' },
      conditions: { id: 'guide-conditions', summary: 'Conditions d’accès', title: 'Conditions d’accès', copy: 'Ce que cette aide couvre et qui peut en bénéficier.' },
      action: { id: 'guide-demande', summary: 'Comment faire la demande', title: 'Comment faire la demande', copy: 'Par où commencer, même sans avoir tout préparé.' },
      documents: { id: 'guide-documents', summary: 'Documents à préparer', title: 'Documents à préparer', copy: 'Une liste de ce qui est généralement demandé — tu peux commencer sans tout avoir.' },
      faq: { id: 'guide-faq', summary: 'Questions fréquentes', title: 'Questions fréquentes', copy: '' }
    };

    var groups = {
      retain: [],
      conditions: [],
      action: [],
      documents: [],
      misc: []
    };

    cards.forEach(function(card) {
      var category = guideDetailCategoryForCard(card);
      if (category && groups[category]) groups[category].push(card);
      else groups.misc.push(card);
    });

    parentSection.innerHTML = '';
    var container = document.createElement('div');
    container.className = 'container';
    parentSection.appendChild(container);

    function appendBlock(key, blockCards) {
      if (!blockCards || !blockCards.length) return;
      var meta = sectionMeta[key];
      if (!meta) return;

      var block = document.createElement('div');
      block.className = 'guide-detail-block guide-detail-block-' + key;
      block.id = meta.id;
      block.setAttribute('data-summary-label', meta.summary);

      if (key !== 'retain') {
        var head = document.createElement('div');
        head.className = 'guide-detail-heading';
        var title = document.createElement('h2');
        title.textContent = meta.title;
        head.appendChild(title);
        if (meta.copy) {
          var copy = document.createElement('p');
          copy.textContent = meta.copy;
          head.appendChild(copy);
        }
        block.appendChild(head);
      }

      var grid = document.createElement('div');
      grid.className = 'guide-grid';
      if (key === 'documents' && blockCards.length === 1) {
        grid.classList.add('guide-detail-grid-single');
      }
      blockCards.forEach(function(card) { grid.appendChild(card); });
      block.appendChild(grid);
      container.appendChild(block);
    }

    appendBlock('retain', groups.retain);
    appendBlock('conditions', groups.conditions);
    appendBlock('action', groups.action);
    appendBlock('documents', groups.documents);

    if (groups.misc.length) {
      var miscBlock = document.createElement('div');
      miscBlock.className = 'guide-detail-block guide-detail-block-misc';
      var miscGrid = document.createElement('div');
      miscGrid.className = 'guide-grid';
      groups.misc.forEach(function(card) { miscGrid.appendChild(card); });
      miscBlock.appendChild(miscGrid);
      container.appendChild(miscBlock);
    }

    var faqPanel = document.querySelector('.guide-faq-panel');
    var faqSection = faqPanel && faqPanel.closest('.guide-section');
    if (faqPanel && faqSection) {
      faqSection.innerHTML = '';
      var faqContainer = document.createElement('div');
      faqContainer.className = 'container';
      var faqBlock = document.createElement('div');
      faqBlock.className = 'guide-detail-block guide-detail-block-faq';
      faqBlock.id = sectionMeta.faq.id;
      faqBlock.setAttribute('data-summary-label', sectionMeta.faq.summary);

      var faqHead = document.createElement('div');
      faqHead.className = 'guide-detail-heading';
      var faqTitle = document.createElement('h2');
      faqTitle.textContent = sectionMeta.faq.title;
      faqHead.appendChild(faqTitle);
      faqBlock.appendChild(faqHead);
      faqBlock.appendChild(faqPanel);
      faqContainer.appendChild(faqBlock);
      faqSection.appendChild(faqContainer);
    }
  }

  function applyGuideLabelClasses() {
    document.querySelectorAll('.guide-card-label').forEach(function(label) {
      var normalized = normalizeGuideText(label.textContent);
      label.classList.remove('is-human', 'is-official', 'is-conditions', 'is-action', 'is-docs', 'is-relay', 'is-faq');
      if (normalized.indexOf('a retenir') !== -1) label.classList.add('is-human');
      else if (normalized.indexOf('source officielle') !== -1) label.classList.add('is-official');
      else if (normalized.indexOf('conditions') !== -1) label.classList.add('is-conditions');
      else if (normalized.indexOf('demande') !== -1) label.classList.add('is-action');
      else if (normalized.indexOf('a preparer') !== -1) label.classList.add('is-docs');
      else if (normalized.indexOf('relais') !== -1) label.classList.add('is-relay');
      else if (normalized.indexOf('faq') !== -1) label.classList.add('is-faq');
    });
  }

  function buildGuideSummary() {
    var body = document.body;
    if (!body || !body.classList.contains('guide-detail-page')) return;
    var heroShell = document.querySelector('.guide-shell');
    var guideActions = heroShell && heroShell.querySelector('.guide-actions');
    if (!guideActions || heroShell.querySelector('.guide-summary')) return;

    var items = [];
    var seen = {};

    var blocks = Array.prototype.slice.call(document.querySelectorAll('.guide-detail-block[data-summary-label]'));
    blocks.forEach(function(block) {
      var label = block.getAttribute('data-summary-label');
      if (!label || seen[label]) return;
      seen[label] = true;
      items.push({ href: '#' + block.id, text: label });
    });

    if (items.length < 2) return;

    var summary = document.createElement('nav');
    summary.className = 'guide-summary';
    summary.setAttribute('aria-label', 'Sur cette page');

    var kicker = document.createElement('strong');
    kicker.className = 'guide-summary-kicker';
    kicker.textContent = 'Sur cette page';
    summary.appendChild(kicker);

    var links = document.createElement('div');
    links.className = 'guide-summary-links';
    items.forEach(function(item) {
      var link = document.createElement('a');
      link.className = 'guide-summary-link';
      link.href = item.href;
      link.textContent = item.text;
      links.appendChild(link);
    });
    summary.appendChild(links);
    guideActions.insertAdjacentElement('afterend', summary);
  }

  function buildGuideFaqPanels() {
    if (!document.body || !document.body.classList.contains('guide-detail-page')) return;

    document.querySelectorAll('.guide-section-soft .guide-grid').forEach(function(grid) {
      if (!grid || grid.querySelector('.guide-faq-panel')) return;

      var faqCards = Array.prototype.slice.call(grid.children || []).filter(function(node) {
        if (!node || !node.classList || !node.classList.contains('guide-card')) return false;
        var label = node.querySelector('.guide-card-label');
        return label && simplifyGuideLabel(label.textContent) === 'FAQ';
      });

      if (faqCards.length < 2) return;

      var panel = document.createElement('article');
      panel.className = 'guide-faq-panel';

      var panelLabel = document.createElement('div');
      panelLabel.className = 'guide-card-label is-faq';
      panelLabel.textContent = 'FAQ';
      panel.appendChild(panelLabel);

      var list = document.createElement('div');
      list.className = 'guide-faq-list';

      faqCards.forEach(function(card, index) {
        var title = card.querySelector('.guide-card-title, h2, h3');
        var body = card.querySelector('p');
        if (!title || !body) return;

        var row = document.createElement('details');
        row.className = 'guide-faq-row';
        if (index === 0) row.open = true;

        var summary = document.createElement('summary');
        var summaryText = document.createElement('span');
        summaryText.textContent = title.textContent.trim();
        var chevron = document.createElement('span');
        chevron.className = 'guide-faq-chevron';
        chevron.setAttribute('aria-hidden', 'true');
        chevron.textContent = '›';
        summary.appendChild(summaryText);
        summary.appendChild(chevron);

        var answer = document.createElement('div');
        answer.className = 'guide-faq-answer';
        answer.textContent = body.textContent.trim();

        row.appendChild(summary);
        row.appendChild(answer);
        list.appendChild(row);
      });

      if (!list.children.length) return;

      panel.appendChild(list);
      grid.innerHTML = '';
      grid.appendChild(panel);
    });
  }

  function buildGuideActionLayouts() {
    if (!document.body || !document.body.classList.contains('guide-detail-page')) return;

    document.querySelectorAll('.guide-inline-actions').forEach(function(group) {
      var links = group.querySelectorAll('a');
      group.classList.remove('is-grid-links', 'is-two-links');
      if (links.length >= 3) {
        group.classList.add('is-grid-links');
      } else if (links.length === 2) {
        group.classList.add('is-two-links');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    var betaBanner = document.getElementById('beta-banner');
    var betaBannerClose = document.getElementById('beta-banner-close');
    var betaBannerStorageKey = 'monaide-beta-banner-dismissed';

    try {
      if (betaBanner && window.localStorage && localStorage.getItem(betaBannerStorageKey) === '1') {
        betaBanner.style.display = 'none';
      }
    } catch (error) {}

    if (betaBanner && betaBannerClose) {
      betaBannerClose.addEventListener('click', function() {
        betaBanner.style.display = 'none';
        try {
          if (window.localStorage) localStorage.setItem(betaBannerStorageKey, '1');
        } catch (error) {}
      });
    }

    document.querySelectorAll('a[href="https://www.vd.ch/prestation/contacter-un-centre-social-regional-csr"]').forEach(function(link) {
      link.setAttribute('href', CSR_FINDER_URL);
    });

    if (window.innerWidth <= 600) {
      document.querySelectorAll('.nav-dropdown > a').forEach(function(a) {
        a.setAttribute('aria-haspopup', 'true');
        a.setAttribute('aria-expanded', 'false');
        a.setAttribute('role', 'button');
        a.addEventListener('click', function(e) {
          var menu = this.nextElementSibling;
          if (!menu) return;
          if (menu.classList.contains('open')) {
            setMobileNavState(false);
            closeNavSearchPanel();
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          var willOpen = !menu.classList.contains('open');
          closeMobileNavDropdowns();
          menu.classList.toggle('open', willOpen);
          this.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });
      });
    }

    document.querySelectorAll('.nav-links a[href]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        if (e.defaultPrevented) return;
        setMobileNavState(false);
        closeNavSearchPanel();
        closeMobileNavDropdowns();
      });
    });

    var navSearchInput = document.getElementById('nav-aid-search');
    if (navSearchInput) {
      navSearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          closeNavSearchPanel();
          closeMobileNavDropdowns();
          setMobileNavState(false);
        }
      });
    }

    document.addEventListener('click', function(e) {
      var clickedInNav = e.target && e.target.closest && e.target.closest('nav');
      if (!clickedInNav) {
        closeNavSearchPanel();
        closeMobileNavDropdowns();
        setMobileNavState(false);
      }
    });

    window.addEventListener('resize', function() {
      if (window.innerWidth > 600) {
        closeMobileNavDropdowns();
        syncMobileBodyState(false);
        var nav = document.getElementById('nav-links');
        var btn = document.getElementById('hamburger');
        if (nav) nav.classList.remove('open');
        if (btn) {
          btn.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        }
      } else {
        var nav = document.getElementById('nav-links');
        syncMobileBodyState(!!(nav && nav.classList.contains('open')));
      }
    });

    applyGuideLabelClasses();
    buildGuideFaqPanels();
    buildGuideDetailSections();
    buildGuideSummary();
    buildGuideActionLayouts();
  });
