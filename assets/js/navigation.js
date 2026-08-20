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
    if (window.trackMonaideEvent) {
      window.trackMonaideEvent('site_search', {
        source: 'nav',
        length: query.length
      });
    }
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
    if (window.trackMonaideEvent) {
      window.trackMonaideEvent('site_search_suggestion', {
        source: 'catalogue',
        label: query
      });
    }
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
    if (normalized.indexOf('a quoi ca sert') !== -1) return 'Conditions';
    if (normalized.indexOf('conditions') !== -1) return 'Conditions';
    if (normalized.indexOf('demande') !== -1) return 'Démarche';
    if (normalized.indexOf('par ou commencer') !== -1) return 'Démarche';
    if (normalized.indexOf('premier repere') !== -1) return 'Démarche';
    if (normalized.indexOf('a noter') !== -1) return 'Démarche';
    if (normalized.indexOf('point sensible') !== -1) return 'Démarche';
    if (normalized.indexOf('suite logique') !== -1) return 'Démarche';
    if (normalized.indexOf('a preparer') !== -1) return 'Documents';
    if (normalized.indexOf('documents') !== -1) return 'Documents';
    if (normalized.indexOf('relais') !== -1) return 'Relais utile';
    if (normalized.indexOf('guides proches') !== -1) return 'Relais utile';
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

    var cards = [];
    document.querySelectorAll('main .guide-section .guide-grid').forEach(function(grid) {
      Array.prototype.slice.call(grid.children || []).forEach(function(node) {
        if (node && node.classList && node.classList.contains('guide-card')) cards.push(node);
      });
    });
    if (!cards.length) return;

    var recognized = cards.some(function(card) {
      var category = guideDetailCategoryForCard(card);
      return category === 'retain' || category === 'conditions' || category === 'action' || category === 'documents' || category === 'faq';
    });
    if (!recognized) return;

    var parentSection = primarySection.closest('.guide-section');
    if (!parentSection) return;

    document.querySelectorAll('main .guide-section').forEach(function(section) {
      if (section !== parentSection) section.remove();
    });

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
      faq: [],
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
      if (blockCards.length === 1) {
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
    appendBlock('faq', groups.faq);

    if (groups.misc.length) {
      var miscBlock = document.createElement('div');
      miscBlock.className = 'guide-detail-block guide-detail-block-misc';
      var miscGrid = document.createElement('div');
      miscGrid.className = 'guide-grid';
      groups.misc.forEach(function(card) { miscGrid.appendChild(card); });
      miscBlock.appendChild(miscGrid);
      container.appendChild(miscBlock);
    }

  }

  function applyGuideLabelClasses() {
    document.querySelectorAll('.guide-card-label').forEach(function(label) {
      var normalized = normalizeGuideText(label.textContent);
      label.classList.remove('is-human', 'is-official', 'is-conditions', 'is-action', 'is-docs', 'is-relay', 'is-faq');
      if (normalized.indexOf('a retenir') !== -1) label.classList.add('is-human');
      else if (normalized.indexOf('source officielle') !== -1 || normalized.indexOf('a quoi ca sert') !== -1) label.classList.add('is-official');
      else if (normalized.indexOf('conditions') !== -1) label.classList.add('is-conditions');
      else if (normalized.indexOf('demande') !== -1 || normalized.indexOf('par ou commencer') !== -1 || normalized.indexOf('premier repere') !== -1 || normalized.indexOf('a noter') !== -1 || normalized.indexOf('point sensible') !== -1 || normalized.indexOf('suite logique') !== -1) label.classList.add('is-action');
      else if (normalized.indexOf('a preparer') !== -1 || normalized.indexOf('documents') !== -1) label.classList.add('is-docs');
      else if (normalized.indexOf('relais') !== -1 || normalized.indexOf('guides proches') !== -1) label.classList.add('is-relay');
      else if (normalized.indexOf('faq') !== -1) label.classList.add('is-faq');
    });
  }

  function fitGuideCardTitles() {
    if (!document.body || !document.body.classList.contains('guide-detail-page')) return;
    document.querySelectorAll('.guide-card-title').forEach(function(title) {
      title.style.fontSize = '';
      title.style.whiteSpace = 'nowrap';
      var computed = window.getComputedStyle(title);
      var size = parseFloat(computed.fontSize) || 18;
      var minSize = window.innerWidth <= 600 ? 8.5 : 11;
      var guard = 0;
      while (title.scrollWidth > title.clientWidth && size > minSize && guard < 28) {
        size -= 0.75;
        title.style.fontSize = size + 'px';
        guard += 1;
      }
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
    return;
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

  function guideHasActionLink(container, target) {
    if (!container) return false;
    return !!Array.prototype.slice.call(container.querySelectorAll('a[href]')).find(function(link) {
      return (link.getAttribute('href') || '').indexOf(target) !== -1;
    });
  }

  function addGuideLayerLinks() {
    if (!document.body || !document.body.classList.contains('guide-detail-page')) return;
    var heroShell = document.querySelector('.guide-shell');
    var guideActions = heroShell && heroShell.querySelector('.guide-actions');
    if (guideActions && !guideHasActionLink(guideActions, '#simulateur')) {
      var simulatorLink = document.createElement('a');
      simulatorLink.href = '/#simulateur';
      simulatorLink.className = 'btn-secondary';
      simulatorLink.innerHTML = 'Faire le simulateur <span class="btn-arrow">→</span>';
      guideActions.appendChild(simulatorLink);
    }

    var main = document.querySelector('main');
    if (!main || main.querySelector('.guide-next-step')) return;
    var bridge = document.createElement('section');
    bridge.className = 'guide-next-step';
    bridge.innerHTML = '<div class="guide-next-step-inner"><div><strong>Pas sûr·e que cette page corresponde à ta situation ?</strong><span>Le simulateur peut t’aider à faire un premier tri. Le répertoire permet ensuite de comparer les aides et les services proches.</span></div><div class="guide-next-step-actions"><a href="/#simulateur">Faire le simulateur <span aria-hidden="true">→</span></a><a href="/#catalogue">Retour au répertoire</a></div></div>';
    main.appendChild(bridge);
  }

  function getCurrentGuideSlug() {
    return window.location.pathname.replace(/^\/+|\/+$/g, '').split('/').pop() || 'accueil';
  }

  function getGuideLinkDestination(href) {
    if (!href) return 'unknown';
    if (href.indexOf('#simulateur') !== -1) return 'simulator';
    if (href.indexOf('#catalogue') !== -1) return 'catalogue';
    if (/^\/(?!\/)/.test(href)) return 'internal';
    if (/^https?:\/\//.test(href)) return 'external';
    if (href.charAt(0) === '#') return 'section';
    return 'other';
  }

  function bindGuideDetailTracking() {
    if (!document.body || !document.body.classList.contains('guide-detail-page') || !window.trackMonaideEvent) return;
    var guideSlug = getCurrentGuideSlug();
    window.trackMonaideEvent('guide_detail_view', {
      guide: guideSlug,
      title: document.title || ''
    });

    var main = document.querySelector('main');
    if (!main || main.dataset.guideTrackingBound) return;
    main.dataset.guideTrackingBound = 'true';
    main.addEventListener('click', function(e) {
      var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!link || !main.contains(link)) return;
      var href = link.getAttribute('href') || '';
      window.trackMonaideEvent('guide_detail_link_click', {
        guide: guideSlug,
        label: (link.textContent || '').trim(),
        destination: getGuideLinkDestination(href)
      });
    });
  }

  function initMonaideMotionReveal() {
    if (window.__monaideMotionRevealInit) return;
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.__monaideMotionRevealInit = true;

    var selectors = [
      '.section > .section-inner',
      '.cat-group',
      '.guide-story-section',
      '.guide-card',
      '.doc-accordion-shell',
      '.community-inner'
    ].join(',');
    var targets = Array.from(document.querySelectorAll(selectors)).filter(function(el) {
      return !el.closest('#simulateur') && !el.classList.contains('result-item') && !el.classList.contains('result-reveal');
    });
    if (!targets.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach(function(el) {
      el.classList.add('motion-reveal');
      observer.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    var betaBanner = document.getElementById('beta-banner');
    var betaBannerClose = document.getElementById('beta-banner-close');
    var betaBannerStorageKey = 'monaide-beta-banner-dismissed';

    try {
      if (betaBanner && window.localStorage && localStorage.getItem(betaBannerStorageKey) === '1') {
        betaBanner.style.display = 'none';
        document.body.classList.add('beta-banner-dismissed');
      }
    } catch (error) {}

    if (betaBanner && betaBannerClose) {
      betaBannerClose.addEventListener('click', function() {
        betaBanner.style.display = 'none';
        document.body.classList.add('beta-banner-dismissed');
        try {
          if (window.localStorage) localStorage.setItem(betaBannerStorageKey, '1');
        } catch (error) {}
      });
    }

    document.querySelectorAll('a[href="https://www.vd.ch/prestation/contacter-un-centre-social-regional-csr"]').forEach(function(link) {
      link.setAttribute('href', CSR_FINDER_URL);
    });

    document.querySelectorAll('.nav-dropdown > a').forEach(function(a) {
      a.setAttribute('aria-haspopup', 'true');
      a.setAttribute('aria-expanded', 'false');
      a.addEventListener('click', function(e) {
        var menu = this.nextElementSibling;
        if (!menu) return;
        if (window.innerWidth <= 600) {
          e.preventDefault();
          e.stopPropagation();
          var willOpen = !menu.classList.contains('open');
          closeMobileNavDropdowns();
          menu.classList.toggle('open', willOpen);
          this.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
          return;
        }
        closeMobileNavDropdowns();
      });
    });
    // Fermer le dropdown en cliquant ailleurs
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-dropdown')) {
        closeMobileNavDropdowns();
      }
    });
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeMobileNavDropdowns();
    });
    if (window.innerWidth <= 600) {
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
    addGuideLayerLinks();
    fitGuideCardTitles();
    bindGuideDetailTracking();
    initMonaideMotionReveal();
  });

  window.addEventListener('resize', function() {
    fitGuideCardTitles();
  });
