  window.toggleAidSearch = function() {
    var panel = document.getElementById('nav-search-panel');
    if (!panel) return;
    function setNavSearchState(open) {
      panel.classList.toggle('open', open);
      document.querySelectorAll('.nav-search-toggle').forEach(function(btn) {
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    if (window.innerWidth <= 600) {
      var nav = document.getElementById('nav-links');
      var btn = document.getElementById('hamburger');
      if (nav && !nav.classList.contains('open')) nav.classList.add('open');
      if (btn && !btn.classList.contains('open')) btn.classList.add('open');
      if (btn) btn.setAttribute('aria-expanded', 'true');
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
      panel.classList.remove('open');
      document.querySelectorAll('.nav-search-toggle').forEach(function(btn) {
        btn.setAttribute('aria-expanded', 'false');
      });
    }
    if (window.innerWidth <= 600) {
      var nav = document.getElementById('nav-links');
      var btn = document.getElementById('hamburger');
      if (nav) nav.classList.remove('open');
      if (btn) {
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
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
    var btn = document.getElementById('hamburger');
    var open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
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
          e.preventDefault();
          e.stopPropagation();
          var menu = this.nextElementSibling;
          if (!menu) return;
          var willOpen = !menu.classList.contains('open');
          closeMobileNavDropdowns();
          menu.classList.toggle('open', willOpen);
          this.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });
      });
    }

    document.querySelectorAll('.nav-links a[href]').forEach(function(a) {
      a.addEventListener('click', function() {
        if (window.innerWidth <= 600 && this.parentElement && this.parentElement.classList.contains('nav-dropdown') && this.nextElementSibling && this.nextElementSibling.classList.contains('nav-dropdown-menu')) {
          return;
        }
        var nav = document.getElementById('nav-links');
        var btn = document.getElementById('hamburger');
        var panel = document.getElementById('nav-search-panel');
        if (nav) nav.classList.remove('open');
        if (btn) {
          btn.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        }
        if (panel) panel.classList.remove('open');
        closeMobileNavDropdowns();
        document.querySelectorAll('.nav-search-toggle').forEach(function(searchBtn) {
          searchBtn.setAttribute('aria-expanded', 'false');
        });
      });
    });

    var navSearchInput = document.getElementById('nav-aid-search');
    if (navSearchInput) {
      navSearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          var panel = document.getElementById('nav-search-panel');
          var nav = document.getElementById('nav-links');
          var btn = document.getElementById('hamburger');
          if (panel) panel.classList.remove('open');
          document.querySelectorAll('.nav-search-toggle').forEach(function(searchBtn) {
            searchBtn.setAttribute('aria-expanded', 'false');
          });
          if (window.innerWidth <= 600 && nav) nav.classList.remove('open');
          closeMobileNavDropdowns();
          if (btn) {
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }

    document.addEventListener('click', function(e) {
      var navLinks = document.getElementById('nav-links');
      var hamburger = document.getElementById('hamburger');
      var searchPanel = document.getElementById('nav-search-panel');
      var clickedInNav = e.target && e.target.closest && e.target.closest('nav');
      if (!clickedInNav) {
        if (searchPanel) searchPanel.classList.remove('open');
        document.querySelectorAll('.nav-search-toggle').forEach(function(searchBtn) {
          searchBtn.setAttribute('aria-expanded', 'false');
        });
        closeMobileNavDropdowns();
        if (window.innerWidth <= 600 && navLinks) navLinks.classList.remove('open');
        if (hamburger) {
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
