(function() {
  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderGuideCard(item) {
    var classes = ['guide-card'];
    if (item.featured) classes.push('guide-card-primary');

    return [
      '<article class="', classes.join(' '), '" data-guide-id="', escapeHtml(item.id), '" data-guide-title="', escapeHtml(item.title), '">',
      '<div class="guide-card-label">', escapeHtml(item.label), '</div>',
      '<h2 class="guide-card-title">', escapeHtml(item.title), '</h2>',
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
    root.innerHTML = (store.items || []).map(renderGuideCard).join('');

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
