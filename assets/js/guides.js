(function() {
  var GUIDE_PRIORITY_ORDER = {
    'subside-lamal': 1,
    'revenu-insertion': 2,
    'chomage-laci': 3,
    'bourses-ocbe': 4
  };

  var GUIDE_CARD_TITLES = {
    'aides-sociales-vaud': 'Aides sociales Vaud',
    'primes-maladie-vaud': 'Primes maladie',
    'plus-assez-pour-vivre': 'Budget trop serré',
    'perdre-son-emploi': 'Perte d’emploi',
    'aide-formation-vaud': 'Aide formation',
    'subside-lamal': 'Subside LAMal',
    'revenu-insertion': 'Revenu d’insertion',
    'bourses-ocbe': 'Bourse OCBE',
    'assurance-invalidite': 'Assurance invalidité',
    'agence-assurances-sociales': 'Agence AAS',
    'chomage-laci': 'Chômage et LACI'
  };

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function priorityRank(item) {
    return GUIDE_PRIORITY_ORDER[item.id] || 99;
  }

  function guideCardTitle(item) {
    return GUIDE_CARD_TITLES[item.id] || item.title;
  }

  function compareGuideCards(a, b) {
    var rankA = priorityRank(a);
    var rankB = priorityRank(b);
    if (rankA !== rankB) return rankA - rankB;
    return (a.order || 0) - (b.order || 0);
  }

  function renderGuideCard(item) {
    var classes = ['guide-card'];
    var displayTitle = guideCardTitle(item);

    return [
      '<article class="', classes.join(' '), '" data-guide-id="', escapeHtml(item.id), '" data-guide-title="', escapeHtml(item.title), '">',
      '<div class="guide-card-label">', escapeHtml(item.label), '</div>',
      '<h2 class="guide-card-title">', escapeHtml(displayTitle), '</h2>',
      '<p>', escapeHtml(item.summary), '</p>',
      '<div class="guide-inline-actions">',
      '<a href="', escapeHtml(item.href), '">', escapeHtml(item.ctaLabel || 'Ouvrir le guide'), '</a>',
      '</div>',
      '</article>'
    ].join('');
  }

  function renderGuideGrid() {
    var root = document.getElementById('guide-grid-root');
    if (!root) return;

    var store = window.MONAIDE_GUIDE_STORE || { items: [] };
    root.innerHTML = (store.items || []).slice().sort(compareGuideCards).map(renderGuideCard).join('');

    if (!root.dataset.trackingBound) {
      root.dataset.trackingBound = 'true';
      root.addEventListener('click', function(e) {
        var link = e.target && e.target.closest ? e.target.closest('a') : null;
        if (!link || !root.contains(link)) return;
        var card = link.closest('.guide-card');
        if (!card || !window.trackMonaideEvent) return;
        window.trackMonaideEvent('guide_card_click', {
          guide: card.getAttribute('data-guide-id') || '',
          title: card.getAttribute('data-guide-title') || '',
          label: (card.querySelector('.guide-card-label') || {}).textContent || ''
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGuideGrid);
  } else {
    renderGuideGrid();
  }
})();
