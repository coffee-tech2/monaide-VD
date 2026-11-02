  function buildPdfDocument(data, mode) {
    if (!data || !data.results || !data.results.length) return '';

    var isChecklist = mode === 'checklist';
    var title = isChecklist ? 'Checklist de démarches' : 'Compte rendu de simulation';
    var intro = isChecklist
      ? 'Une version courte pour garder les prochaines démarches sous les yeux.'
      : 'Synthèse abrégée de la simulation, avec les pistes prioritaires et les prochaines étapes.';
    var generatedAt = new Date().toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });

    function formatText(value) {
      if (!value) return '';
      var text = String(value).trim();
      var numbered = text.split(/\s*(?=\d+\.\s)/).filter(Boolean);
      if (numbered.length > 1) {
        return '<ol>' + numbered.map(function(part) {
          return '<li>' + escapeHtml(part.replace(/^\d+\.\s*/, '')) + '</li>';
        }).join('') + '</ol>';
      }
      return escapeHtml(text);
    }

    var profileRows = [
      ['Commune', data.profile.commune || 'non précisé'],
      ['Âge', data.profile.age || 'non précisé'],
      ['Situation', data.profile.situation || 'non précisé'],
      ['Revenu', data.profile.revenu || 'non précisé']
    ].map(function(row) {
      return '<div class="meta-row"><span>' + escapeHtml(row[0]) + '</span><strong>' + escapeHtml(row[1]) + '</strong></div>';
    }).join('');

    var printableResults = isChecklist ? data.results.slice(0, 3) : data.results.slice(0, 2);

    var resultsHtml = printableResults.map(function(item, index) {
      var sections = '';
      if (item.today) sections += '<div class="box"><div class="box-title">Pour avancer</div><div>' + formatText(item.today) + '</div></div>';
      if (item.action) sections += '<div class="box"><div class="box-title">Prochaine étape</div><div>' + formatText(item.action) + '</div></div>';
      if (!isChecklist && item.why) sections += '<div class="box soft"><div class="box-title">Pourquoi cette piste sort</div><div>' + formatText(item.why) + '</div></div>';
      return '<section class="result-card">'
        + '<div class="result-head"><div class="result-index">' + (index + 1) + '</div><div><div class="result-name">' + escapeHtml(item.nom) + '</div><div class="result-badge">' + escapeHtml(item.badgeLabel) + '</div></div></div>'
        + sections
        + '</section>';
    }).join('');

    var contactsHtml = data.contacts && data.contacts.length
      ? '<section class="panel"><h2>Qui contacter</h2><ul>' + data.contacts.slice(0, 3).map(function(item) {
          return '<li><strong>' + escapeHtml(item.nom) + ' :</strong> ' + escapeHtml(item.action) + '</li>';
        }).join('') + '</ul></section>'
      : '';

    var docsHtml = data.docs && data.docs.length
      ? '<section class="panel"><h2>Documents utiles</h2><ul>' + data.docs.slice(0, 4).map(function(doc) {
          return '<li>' + escapeHtml(doc) + '</li>';
        }).join('') + '</ul></section>'
      : '';

    var checklistHtml = data.results.slice(0, 4).map(function(item) {
      var line = item.today || item.action || item.nom;
      return '<li><span class="check"></span><div><strong>' + escapeHtml(item.nom) + '</strong><br>' + escapeHtml(line) + '</div></li>';
    }).join('');

    var nextStepsHtml = data.results.slice(0, 4).map(function(item) {
      return '<li><span class="check"></span><div><strong>' + escapeHtml(item.nom) + '</strong>' + (item.today ? '<br>' + formatText(item.today) : '') + '</div></li>';
    }).join('');

    var checklistMainHtml = '<div class="section-title">À faire maintenant</div>'
      + '<section class="checklist"><ul>' + nextStepsHtml + '</ul></section>'
      + '<div class="two-col compact"><div>' + contactsHtml + '</div><div>' + docsHtml + '</div></div>';

    return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>' + title + ' - MonAide-VD</title>'
      + '<style>'
      + '@font-face{font-family:"Fira Sans";src:url(' + window.location.origin + '/assets/fonts/FiraSans-400.woff2) format("woff2");font-weight:400;font-display:swap;}'
      + '@font-face{font-family:"Fira Sans";src:url(' + window.location.origin + '/assets/fonts/FiraSans-600.woff2) format("woff2");font-weight:600;font-display:swap;}'
      + '@font-face{font-family:"Fira Sans";src:url(' + window.location.origin + '/assets/fonts/FiraSans-700.woff2) format("woff2");font-weight:700;font-display:swap;}'
      + '@page{size:A4;margin:14mm;}'
      + 'body{font-family:"Fira Sans",Arial,sans-serif;margin:0;background:#fff;color:#2C4460;}'
      + '.page{max-width:800px;margin:0 auto;padding:18px;}'
      + '.top{border-bottom:2px solid #17293C;padding:0 0 10px;margin-bottom:12px;}'
      + '.eyebrow{display:flex;justify-content:space-between;gap:12px;font-size:11px;font-weight:600;color:#4A5568;margin-bottom:6px;}'
      + 'h1{font-size:24px;line-height:1.15;font-weight:600;margin:0 0 6px;color:#17293C;}'
      + '.intro{font-size:12px;line-height:1.5;color:#2C4460;margin:0 0 10px;}'
      + '.meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 18px;}'
      + '.meta-row{display:flex;justify-content:flex-start;gap:10px;padding:5px 0;border-bottom:1px solid #D7DEE6;font-size:11.5px;}'
      + '.meta-row span{color:#4A5568;min-width:68px;}'
      + '.section-title{font-size:13px;font-weight:600;color:#17293C;margin:14px 0 6px;}'
      + '.result-card{border-top:1px solid #C4CED8;padding:8px 0 2px;margin-bottom:8px;page-break-inside:avoid;}'
      + '.result-head{display:flex;gap:8px;align-items:flex-start;margin-bottom:4px;}'
      + '.result-index{width:18px;height:18px;border-radius:3px;background:#EEF2F7;color:#17293C;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;}'
      + '.result-name{font-size:14px;font-weight:600;color:#17293C;margin-bottom:1px;}'
      + '.result-badge{font-size:11px;font-weight:600;color:#4A5568;}'
      + '.box{margin:0 0 5px;padding:2px 0;font-size:11.5px;line-height:1.45;}'
      + '.box.soft{background:transparent;}'
      + '.box-title{font-size:11.5px;font-weight:600;color:#17293C;margin-bottom:2px;}'
      + 'ol{margin:0;padding-left:16px;}ol li{margin:0 0 3px;}'
      + '.two-col{display:grid;grid-template-columns:1.15fr .85fr;gap:18px;align-items:start;}'
      + '.two-col.compact{grid-template-columns:1fr 1fr;margin-top:6px;}'
      + '.panel{border-top:1px solid #C4CED8;padding:8px 0;page-break-inside:avoid;}'
      + '.panel h2{font-size:13px;font-weight:600;color:#17293C;margin:0 0 4px;}'
      + '.panel ul{margin:0;padding-left:15px;font-size:11.5px;line-height:1.45;}'
      + '.checklist{border-top:1px solid #C4CED8;padding:6px 0;margin-bottom:6px;page-break-inside:avoid;}'
      + '.checklist ul{list-style:none;margin:0;padding:0;}'
      + '.checklist li{display:flex;gap:8px;align-items:flex-start;padding:6px 0;border-bottom:1px solid #D7DEE6;font-size:11.5px;line-height:1.45;}'
      + '.checklist li:last-child{border-bottom:none;padding-bottom:0;}'
      + '.check{width:12px;height:12px;border:1.5px solid #17293C;border-radius:3px;flex-shrink:0;margin-top:2px;background:#fff;}'
      + '.foot{margin-top:10px;padding-top:6px;border-top:1px solid #C4CED8;font-size:10px;line-height:1.4;color:#4A5568;}'
      + '@media print{.page{padding:0;max-width:none;}}'
      + '</style></head><body><div class="page">'
      + '<div class="top"><div class="eyebrow"><span>MonAide-VD</span><span>' + generatedAt + '</span></div><h1>' + title + '</h1><p class="intro">' + intro + '</p><div class="meta">' + profileRows + '</div></div>'
      + (isChecklist ? checklistMainHtml : '<div class="section-title">Résumé</div><section class="checklist"><ul>' + checklistHtml + '</ul></section>')
      + (isChecklist ? '' : '<div class="section-title">Pistes principales</div><div class="two-col"><div>' + resultsHtml + '</div><div>' + contactsHtml + docsHtml + '</div></div>')
      + '<div class="foot">Ce document est un résumé automatique du simulateur. Il aide à préparer les démarches, mais ne remplace pas une décision officielle.</div>'
      + '</div></body></html>';
  }

  function showExportNote(message) {
    var note = document.getElementById('results-export-note');
    if (!note) return;
    note.textContent = message;
    note.hidden = false;
  }

  function openPdfWindow(mode, autoPrint) {
    if (!latestSimulation) return;
    var html = buildPdfDocument(latestSimulation, mode);
    if (!html) return;
    var win = window.open('', '_blank');
    if (!win) {
      showExportNote('Le navigateur a bloqué l’ouverture de la fenêtre. Autorise les pop-up pour ce site (ou ouvre la page dans Safari/Chrome si tu es dans une appli comme Instagram ou Facebook), puis réessaie.');
      return;
    }
    var note = document.getElementById('results-export-note');
    if (note) note.hidden = true;
    win.document.open();
    win.document.write(html);
    win.document.close();
    if (autoPrint) {
      win.onload = function() {
        setTimeout(function() {
          win.focus();
          win.print();
        }, 250);
      };
    }
  }

  window.telechargerChecklist = function() {
    openPdfWindow('checklist', true);
  };

  window.imprimerResultats = function() {
    openPdfWindow('resume', true);
  };
