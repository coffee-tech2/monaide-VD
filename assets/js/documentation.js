  var DOCUMENTATION_DATA = window.MONAIDE_DOCUMENTATION_DATA || { items: [] };

  function escapeDocHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderDocumentationMenuItem(item) {
    return '<a href="#' + escapeDocHtml(item.blockId) + '" onclick="event.preventDefault();openDocumentationTarget(\'' + escapeDocHtml(item.blockId) + '\',\'' + escapeDocHtml(item.accordionId) + '\')">' + escapeDocHtml(item.menuLabel) + '</a>';
  }

  function renderDocumentationShortcut(item) {
    if (!item || !item.shortcut || !item.shortcut.href) return '';
    return '<a href="' + escapeDocHtml(item.shortcut.href) + '" target="_blank" rel="noopener noreferrer" class="docs-shortcut-card">'
      + '<div class="docs-shortcut-kicker">' + escapeDocHtml(item.shortcut.kicker) + '</div>'
      + '<div class="docs-shortcut-title">' + escapeDocHtml(item.shortcut.title) + '</div>'
      + '<div class="docs-link-text">' + escapeDocHtml(item.shortcut.text) + '</div>'
      + '</a>';
  }

  function renderDocumentationInfoBoxes(boxes) {
    if (!boxes || !boxes.length) return '';
    return '<div class="doc-info-grid">' + boxes.map(function(box) {
      return '<div class="doc-info-box"><div class="doc-info-label">' + escapeDocHtml(box.label) + '</div><div class="doc-mini-text">' + escapeDocHtml(box.text) + '</div></div>';
    }).join('') + '</div>';
  }

  function renderDocumentationChecklist(items) {
    if (!items || !items.length) return '';
    return '<div class="doc-checklist">' + items.map(function(item) {
      return '<div class="doc-check-item"><span class="doc-check-icon">&#9744;</span><div class="doc-check-text">' + escapeDocHtml(item) + '</div></div>';
    }).join('') + '</div>';
  }

  function renderDocumentationPlainList(items) {
    if (!items || !items.length) return '';
    return '<ul class="doc-plain-list">' + items.map(function(item) {
      return '<li>' + escapeDocHtml(item) + '</li>';
    }).join('') + '</ul>';
  }

  function renderDocumentationNotes(notes) {
    if (!notes || !notes.length) return '';
    return notes.map(function(note) {
      return '<div class="doc-note">' + note + '</div>';
    }).join('');
  }

  function renderDocumentationActions(actions) {
    if (!actions || !actions.length) return '';
    return actions.map(function(action) {
      var isInternal = /^\/(?!\/)/.test(action.href || '');
      var attrs = isInternal ? '' : ' target="_blank" rel="noopener noreferrer"';
      return '<a href="' + escapeDocHtml(action.href) + '"' + attrs + ' class="doc-action-link' + (action.primary ? ' primary' : '') + '"><span class="doc-action-text">' + escapeDocHtml(action.label) + '</span><span class="doc-action-arrow">&#8594;</span></a>';
    }).join('');
  }

  function renderDocumentationAccordion(item) {
    var accordion = item && item.accordion;
    if (!accordion) return '';
    return '<div id="' + escapeDocHtml(item.blockId) + '" class="doc-accordion-shell">'
      + '<button type="button" onclick="toggleAccordion(\'' + escapeDocHtml(item.accordionId) + '\')" class="doc-accordion-btn">'
      + '<div class="doc-accordion-copy"><div class="doc-accordion-title">' + escapeDocHtml(accordion.title) + '</div><div class="doc-accordion-subtitle">' + escapeDocHtml(accordion.subtitle) + '</div></div>'
      + '<span id="' + escapeDocHtml(item.accordionId) + '-icon" class="doc-accordion-icon">&#8595;</span>'
      + '</button>'
      + '<div id="' + escapeDocHtml(item.accordionId) + '" class="doc-content">'
      + '<div class="doc-lead">' + (accordion.leadHtml || '') + '</div>'
      + '<div class="doc-contact-card"><div class="doc-contact-label">' + escapeDocHtml((accordion.contact || {}).label || '') + '</div><div class="doc-contact-text">' + escapeDocHtml((accordion.contact || {}).text || '') + '</div></div>'
      + renderDocumentationInfoBoxes(accordion.infoBoxes)
      + renderDocumentationNotes(accordion.preChecklistNotes)
      + renderDocumentationPlainList(accordion.plainList)
      + '<div class="doc-list-label">' + escapeDocHtml(accordion.checklistLabel || 'Documents à préparer') + '</div>'
      + renderDocumentationChecklist(accordion.checklist)
      + renderDocumentationNotes(accordion.notes)
      + renderDocumentationActions(accordion.actions)
      + '</div>'
      + '</div>';
  }

  function renderDocumentationMenu() {
    var root = document.getElementById('documentation-nav-menu');
    if (!root) return;
    root.innerHTML = (DOCUMENTATION_DATA.items || []).map(renderDocumentationMenuItem).join('');
  }

  function renderDocumentationShortcuts() {
    var root = document.getElementById('docs-shortcuts-root');
    if (!root) return;
    root.innerHTML = (DOCUMENTATION_DATA.items || [])
      .filter(function(item) { return !!(item.shortcut && item.shortcut.href); })
      .map(renderDocumentationShortcut)
      .join('');
  }

  function renderDocumentationAccordionsFromData() {
    var root = document.getElementById('documentation-accordions-root');
    if (!root) return;
    root.innerHTML = (DOCUMENTATION_DATA.items || []).map(function(item) {
      if (!item || !item.accordion || !item.blockId) return '';
      return renderDocumentationAccordion(item);
    }).join('');
  }

  renderDocumentationMenu();
  renderDocumentationShortcuts();
  renderDocumentationAccordionsFromData();
