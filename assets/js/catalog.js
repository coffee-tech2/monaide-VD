  function keepCatalogCardOpeningDownward(card, previousTop) {
    window.requestAnimationFrame(function() {
      window.requestAnimationFrame(function() {
        var newTop = card.getBoundingClientRect().top;
        var delta = newTop - previousTop;
        if (Math.abs(delta) > 1) {
          window.scrollBy({ top: delta, behavior: 'auto' });
        }
      });
    });
  }

  window.toggleCatCard = function(card) {
    var body = card.querySelector('.cat-card-body');
    if (!body) return;
    var isOpen = card.classList.contains('open');
    var previousTop = card.getBoundingClientRect().top;
    var grid = card.closest('.cat-cards-grid');
    if (grid) {
      grid.querySelectorAll('.cat-card').forEach(function(other) {
        if (other !== card) {
          other.classList.remove('open');
          other.setAttribute('aria-expanded', 'false');
          var b = other.querySelector('.cat-card-body');
          if (b) { b.style.display = 'none'; b.style.visibility = 'hidden'; }
        }
      });
    }
    if (isOpen) {
      card.classList.remove('open');
      card.setAttribute('aria-expanded', 'false');
      body.style.display = 'none';
      body.style.visibility = 'hidden';
    } else {
      card.classList.add('open');
      card.setAttribute('aria-expanded', 'true');
      body.style.display = 'block';
      body.style.visibility = 'visible';
      keepCatalogCardOpeningDownward(card, previousTop);
    }
  };

  function scrollCatalogFilterIntoView(btn) {
    if (!btn) return;
    try {
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } catch (e) {}
  }

  function setActiveCatalogFilterButton(btn) {
    document.querySelectorAll('.cat-filter').forEach(function(filterBtn) {
      filterBtn.classList.remove('active');
      filterBtn.setAttribute('aria-pressed', 'false');
    });
    if (!btn) return;
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    scrollCatalogFilterIntoView(btn);
  }

  window.setCatFilter = function(cat, btn) {
    setActiveCatalogFilterButton(btn);
    document.getElementById('cat-search').value = '';
    document.querySelectorAll('.cat-card.open').forEach(function(cc) {
      cc.classList.remove('open');
      var b = cc.querySelector('.cat-card-body');
      if (b) b.style.display = 'none';
    });
    var count = 0;
    document.querySelectorAll('.cat-card').forEach(function(item) {
      var cats = (item.dataset.cat || '').split(' ');
      var show = cat === 'tous' || cats.includes(cat);
      item.style.display = show ? '' : 'none';
      if (show) count++;
    });
    document.querySelectorAll('.cat-group').forEach(function(group) {
      var hasVisible = Array.from(group.querySelectorAll('.cat-card')).some(function(cc) { return cc.style.display !== 'none'; });
      group.style.display = hasVisible ? '' : 'none';
    });
    var noResult = document.getElementById('cat-no-result');
    if (noResult) {
      noResult.innerHTML = 'Aucun r&#233;sultat pour cette recherche.';
      noResult.style.display = count === 0 ? '' : 'none';
    }
  };

  window.filtrerCatalogue = function() {
    var rawQuery = document.getElementById('cat-search').value || '';
    var q = normalizeAidText(rawQuery);
    var expandedQueries = expandSearchQueries(rawQuery);
    setActiveCatalogFilterButton(document.querySelector('.cat-filter'));
    var count = 0;
    document.querySelectorAll('.cat-card').forEach(function(item) {
      var text = normalizeAidText(item.innerText);
      var show = !q || expandedQueries.some(function(candidate) { return text.indexOf(candidate) !== -1; });
      item.style.display = show ? '' : 'none';
      if (show) count++;
    });
    document.querySelectorAll('.cat-group').forEach(function(group) {
      var hasVisible = Array.from(group.querySelectorAll('.cat-card')).some(function(cc) { return cc.style.display !== 'none'; });
      group.style.display = hasVisible ? '' : 'none';
    });
    var noResult = document.getElementById('cat-no-result');
    if (noResult) {
      if (count === 0 && q) {
        noResult.innerHTML = '<strong>Aucun r&#233;sultat exact.</strong> Essaie plut&#244;t : caisse maladie, permis, loyer, emploi ou habits pas chers.';
        noResult.style.display = '';
      } else {
        noResult.style.display = 'none';
      }
    }
  };

  function ouvrirCarteCatalogue(card, smooth) {
    if (!card) return;
    var grid = card.closest('.cat-cards-grid');
    if (grid) {
      grid.querySelectorAll('.cat-card').forEach(function(other) {
        if (other !== card) {
          other.classList.remove('open');
          var otherBody = other.querySelector('.cat-card-body');
          if (otherBody) {
            otherBody.style.display = 'none';
            otherBody.style.visibility = 'hidden';
          }
        }
      });
    }
    var body = card.querySelector('.cat-card-body');
    card.classList.add('open');
    if (body) {
      body.style.display = 'block';
      body.style.visibility = 'visible';
    }
    try {
      var navOffset = 86;
      var top = card.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: top, behavior: smooth ? 'smooth' : 'auto' });
    } catch(e) {}
  }

  function shouldHaveCatalogContactCallout(card) {
    if (!card) return false;
    var title = normalizeAidText(((card.querySelector('.cat-card-title') || {}).textContent || ''));
    var eligibleTitles = CATALOG_CONFIG.contactPromptTitles || [];
    return eligibleTitles.indexOf(title) !== -1;
  }

  function isInlineYellowCallout(node) {
    if (!node || node.nodeType !== 1) return false;
    var style = (node.getAttribute('style') || '').replace(/\s+/g, '').toLowerCase();
    return !!style && style.indexOf('background:#fff8e8') !== -1;
  }

  function getExistingCatalogCallout(body) {
    if (!body) return null;
    return Array.from(body.children).find(function(child) {
      return child.classList.contains('catalog-callout') || isInlineYellowCallout(child);
    }) || null;
  }

  function calloutAlreadyContainsContactPrompt(text) {
    var normalized = String(text || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
    return normalized.indexOf('n’hésite pas à appeler') !== -1 ||
      normalized.indexOf("n'hesite pas a appeler") !== -1 ||
      normalized.indexOf('n’hésite pas à contacter') !== -1 ||
      normalized.indexOf("n'hesite pas a contacter") !== -1;
  }

  function enhanceStaticPhoneLinks() {
    document.querySelectorAll('.cat-card-body, .doc-content, .results-note, .results-profile-summary').forEach(function(root) {
      linkifyPhoneNumbersInElement(root);
    });
  }

  function getCatalogCalloutTip(card, callout) {
    if (!card) return '';
    var title = (card.querySelector('.cat-card-title') || {}).textContent || '';
    var textPool = [
      title,
      card.textContent || '',
      callout ? callout.textContent || '' : ''
    ].join(' ');
    var phoneMap = CATALOG_CONFIG.contactPromptPhoneMap || {};
    var numbers = extractPhoneNumbersFromText(textPool);
    if (!numbers.length && phoneMap[title]) numbers = [phoneMap[title]];
    if (numbers.length) {
      return 'N’hésite pas à appeler si tu as une question ou un doute : ' + buildPhoneLinkHtml(numbers[0]) + '. Ils sont aussi là pour ça.';
    }
    return 'N’hésite pas à les contacter via les liens ci-dessous si tu as une question ou un doute.';
  }

  window.openInfoTarget = function(target) {
    if (!target) return;
    openCatalogForAid(target);
  };

  function getCatalogStickyOffset() {
    var nav = document.querySelector('nav');
    var filterBar = document.querySelector('.catalog-filter-sticky');
    var navHeight = nav ? nav.offsetHeight : 0;
    var filterHeight = filterBar ? filterBar.offsetHeight : 0;
    return navHeight + filterHeight + 30;
  }

  function getCatalogAnchorTop(target) {
    if (!target) return 0;
    return target.getBoundingClientRect().top + window.pageYOffset - getCatalogStickyOffset();
  }

  window.openCatalogGroup = function(groupId) {
    var group = document.getElementById(groupId);
    if (!group) return;
    var filterMap = {
      'groupe-urgences': 'urgence',
      'groupe-sante': 'sante',
      'groupe-revenus': 'financier',
      'groupe-emploi': 'emploi',
      'groupe-logement': 'logement',
      'groupe-petit-budget': 'petitbudget',
      'groupe-migration': 'migration',
      'groupe-culture': 'culture'
    };
    var selectedFilter = document.querySelector('.cat-filter[onclick*="setCatFilter(\'' + (filterMap[groupId] || 'tous') + '\'"]');
    var firstFilter = document.querySelector('.cat-filter');
    var activeFilter = selectedFilter || firstFilter;
    setActiveCatalogFilterButton(activeFilter);
    var catInput = document.getElementById('cat-search');
    if (catInput) catInput.value = '';
    document.querySelectorAll('.cat-card').forEach(function(card) {
      card.style.display = '';
    });
    document.querySelectorAll('.cat-group').forEach(function(otherGroup) {
      otherGroup.style.display = otherGroup === group ? '' : 'none';
    });
    document.querySelectorAll('.cat-card.open').forEach(function(card) {
      card.classList.remove('open');
      var body = card.querySelector('.cat-card-body');
      if (body) {
        body.style.display = 'none';
        body.style.visibility = 'hidden';
      }
    });
    var noResult = document.getElementById('cat-no-result');
    if (noResult) noResult.style.display = 'none';
    window.requestAnimationFrame(function() {
      try {
        var top = getCatalogAnchorTop(group);
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      } catch(e) {
        group.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  window.openCatalogForAid = function(query) {
    var catInput = document.getElementById('cat-search');
    if (!catInput || !query) return;
    var storeItem = window.getCatalogStoreItem ? window.getCatalogStoreItem(query) : null;
    var matchedCard = null;
    if (storeItem && storeItem.id) {
      matchedCard = document.querySelector('.cat-card[data-aid-id="' + storeItem.id + '"]');
    }
    if (!matchedCard) {
      matchedCard = findCatalogCardForAid(query);
    }
    if (matchedCard) {
      var firstFilter = document.querySelector('.cat-filter');
      setActiveCatalogFilterButton(firstFilter);
      document.querySelectorAll('.cat-card').forEach(function(card) {
        card.style.display = card === matchedCard ? '' : 'none';
      });
      document.querySelectorAll('.cat-group').forEach(function(group) {
        group.style.display = group.contains(matchedCard) ? '' : 'none';
      });
      catInput.value = matchedCard.querySelector('.cat-card-title').textContent.trim();
      document.getElementById('cat-no-result').style.display = 'none';
      ouvrirCarteCatalogue(matchedCard, true);
    } else {
      catInput.value = query;
      filtrerCatalogue();
      var target = document.getElementById('catalogue');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  window.closeCatalogNote = function() {
    var note = document.getElementById('catalog-note');
    if (!note) return;
    note.style.display = 'none';
  };

  document.addEventListener('DOMContentLoaded', function() {
    var catalogNote = document.getElementById('catalog-note');
    if (catalogNote) {
      var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduceMotion && 'IntersectionObserver' in window) {
        catalogNote.classList.add('is-awaiting-reveal');
        var noteObserver = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            catalogNote.classList.remove('is-awaiting-reveal');
            catalogNote.classList.add('is-visible');
            observer.unobserve(catalogNote);
          });
        }, { threshold: 0.28 });
        noteObserver.observe(catalogNote);
      } else {
        catalogNote.classList.add('is-visible');
      }
    }

    document.querySelectorAll('.cat-card').forEach(function(card) {
      var body = card.querySelector('.cat-card-body');
      if (!body) return;
      var hidden = body.style.display === 'none' || body.style.display === '';
      if (hidden) {
        card.classList.remove('open');
        body.style.display = 'none';
        body.style.visibility = 'hidden';
      }

      var existingCallout = getExistingCatalogCallout(body);
      if (existingCallout) existingCallout.classList.add('catalog-callout');

      if (shouldHaveCatalogContactCallout(card)) {
        var tipText = getCatalogCalloutTip(card, existingCallout);
        if (existingCallout) {
          if (calloutAlreadyContainsContactPrompt(existingCallout.textContent || '')) {
            existingCallout.innerHTML = tipText;
          } else {
            var tip = existingCallout.nextElementSibling && existingCallout.nextElementSibling.classList && existingCallout.nextElementSibling.classList.contains('catalog-callout-tip')
              ? existingCallout.nextElementSibling
              : null;
            if (!tip) {
              tip = document.createElement('div');
              tip.className = 'catalog-callout-tip';
              existingCallout.insertAdjacentElement('afterend', tip);
            }
            tip.innerHTML = tipText;
          }
        } else {
          var newCallout = document.createElement('div');
          newCallout.className = 'catalog-callout';
          newCallout.innerHTML = tipText;
          var links = body.querySelector('.expand-links');
          if (links) body.insertBefore(newCallout, links);
          else body.appendChild(newCallout);
        }
      }
    });

    enhanceStaticPhoneLinks();
  });
  var CATALOG_CONFIG = window.MONAIDE_CATALOG_CONFIG || {};
