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
    'subside-lamal': 'Subside assurance maladie',
    'revenu-insertion': 'Revenu d’insertion',
    'bourses-ocbe': 'Bourse OCBE',
    'assurance-invalidite': 'Assurance invalidité',
    'agence-assurances-sociales': 'Agence AAS',
    'chomage-laci': 'Chômage et LACI'
  };

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

  var GUIDE_GROUPS = [
    { id: 'argent', title: 'Argent et budget', labels: ['Revenus', 'Budget'] },
    { id: 'sante', title: 'Santé', labels: ['Santé', 'Handicap'] },
    { id: 'emploi-formation', title: 'Emploi et formation', labels: ['Emploi', 'Formation'] },
    { id: 'famille', title: 'Famille', labels: ['Famille'] },
    { id: 'logement', title: 'Logement', labels: ['Logement'] },
    { id: 'retraite', title: 'Retraite, AVS et AI', labels: ['Retraite', 'AVS / AI'] },
    { id: 'premiers-contacts', title: 'Premiers contacts', labels: ['Orientation', 'Migration'] },
    { id: 'culture', title: 'Culture', labels: ['Culture'] }
  ];

  function groupFor(item) {
    for (var i = 0; i < GUIDE_GROUPS.length; i++) {
      if (GUIDE_GROUPS[i].labels.indexOf(item.label) !== -1) return GUIDE_GROUPS[i];
    }
    return { id: 'autres', title: 'Autres guides', labels: [] };
  }

  function renderGuideItem(item, group) {
    return [
      '<li data-guide-id="', escapeHtml(item.id), '" data-guide-title="', escapeHtml(item.title), '" data-guide-group="', escapeHtml(group.title), '">',
      '<a href="', escapeHtml(item.href), '">', escapeHtml(guideCardTitle(item)), '</a>',
      '<span>', escapeHtml(item.summary), '</span>',
      '</li>'
    ].join('');
  }

  function renderGuideGrid() {
    var root = document.getElementById('guide-list-root');
    if (!root) return;

    var store = window.MONAIDE_GUIDE_STORE || { items: [] };
    var groups = [];
    var byId = {};
    (store.items || []).slice().sort(compareGuideCards).forEach(function(item) {
      var group = groupFor(item);
      if (!byId[group.id]) {
        byId[group.id] = { group: group, items: [] };
        groups.push(byId[group.id]);
      }
      byId[group.id].items.push(item);
    });
    var order = GUIDE_GROUPS.map(function(g) { return g.id; });
    groups.sort(function(a, b) {
      var ia = order.indexOf(a.group.id); var ib = order.indexOf(b.group.id);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

    var toc = '<nav class="gs-toc" aria-label="Sur cette page"><p>Sur cette page</p><ul>' + groups.map(function(g) {
      return '<li><a href="#' + g.group.id + '">' + escapeHtml(g.group.title) + '</a></li>';
    }).join('') + '</ul></nav>';

    root.innerHTML = toc + groups.map(function(g) {
      return '<h2 id="' + g.group.id + '">' + escapeHtml(g.group.title) + '</h2>' +
        '<ul class="gs-list">' + g.items.map(function(item) { return renderGuideItem(item, g.group); }).join('') + '</ul>';
    }).join('');

    if (!root.dataset.trackingBound) {
      root.dataset.trackingBound = 'true';
      root.addEventListener('click', function(e) {
        var link = e.target && e.target.closest ? e.target.closest('li a') : null;
        if (!link || !root.contains(link)) return;
        var item = link.closest('li[data-guide-id]');
        if (!item || !window.trackMonaideEvent) return;
        window.trackMonaideEvent('guide_card_click', {
          guide: item.getAttribute('data-guide-id') || '',
          title: item.getAttribute('data-guide-title') || '',
          label: item.getAttribute('data-guide-group') || ''
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
