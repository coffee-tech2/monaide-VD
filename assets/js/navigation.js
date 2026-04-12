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
  });
