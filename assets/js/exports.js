  function buildPdfDocument(data, mode) {
    if (!data || !data.results || !data.results.length) return '';

    var isChecklist = mode === 'checklist';
    var title = isChecklist ? 'Checklist de démarches' : 'Compte rendu de simulation';
    var intro = isChecklist
      ? 'Version condensée pour agir, préparer les documents et garder un fil simple.'
      : 'Synthèse abrégée de la simulation, avec les pistes prioritaires et les prochaines étapes.';

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
      if (item.today) sections += '<div class="box"><div class="box-title">Pour avancer</div><div>' + escapeHtml(item.today) + '</div></div>';
      if (item.action) sections += '<div class="box"><div class="box-title">Prochaine étape</div><div>' + escapeHtml(item.action) + '</div></div>';
      if (!isChecklist && item.why) sections += '<div class="box soft"><div class="box-title">Pourquoi</div><div>' + escapeHtml(item.why) + '</div></div>';
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

    return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>' + title + ' - MonAide-VD</title>'
      + '<style>'
      + '@page{size:A4;margin:8mm;}'
      + 'body{font-family:Arial,sans-serif;margin:0;background:#f7f2eb;color:#222;}'
      + '.page{max-width:800px;margin:0 auto;padding:14px 14px 16px;}'
      + '.top{background:#fffdf9;border:1px solid #e6dbcf;border-radius:16px;padding:12px 12px 10px;margin-bottom:8px;}'
      + '.eyebrow{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#e8693a;margin-bottom:8px;}'
      + 'h1{font-size:21px;line-height:1.08;margin:0 0 6px;color:#2d5a32;}'
      + '.intro{font-size:11px;line-height:1.35;color:#5f5a54;margin:0 0 8px;}'
      + '.meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 8px;}'
      + '.meta-row{display:flex;justify-content:space-between;gap:8px;padding:6px 8px;background:#faf6f0;border-radius:9px;border:1px solid #ece0d4;font-size:10px;}'
      + '.meta-row span{color:#746f69;}'
      + '.section-title{font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#2d5a32;margin:8px 0 5px;}'
      + '.result-card{background:#fffdf9;border:1px solid #e6dbcf;border-radius:12px;padding:8px 8px 1px;margin-bottom:6px;page-break-inside:avoid;}'
      + '.result-head{display:flex;gap:8px;align-items:flex-start;margin-bottom:4px;}'
      + '.result-index{width:18px;height:18px;border-radius:999px;background:#eef5ef;color:#2d5a32;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;}'
      + '.result-name{font-size:12px;font-weight:700;color:#201d1a;margin-bottom:1px;}'
      + '.result-badge{font-size:10px;font-weight:700;color:#a24a21;}'
      + '.box{margin:0 0 5px;background:#faf6f0;border:1px solid #ece0d4;border-radius:9px;padding:6px 7px;font-size:10px;line-height:1.3;}'
      + '.box.soft{background:#f3f7f1;border-color:#dce8dd;}'
      + '.box-title{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#2d5a32;margin-bottom:4px;}'
      + '.two-col{display:grid;grid-template-columns:1.15fr .85fr;gap:6px;align-items:start;}'
      + '.panel{background:#fffdf9;border:1px solid #e6dbcf;border-radius:12px;padding:8px 10px;page-break-inside:avoid;}'
      + '.panel h2{font-size:12px;color:#2d5a32;margin:0 0 4px;}'
      + '.panel ul{margin:0;padding-left:14px;font-size:10px;line-height:1.35;}'
      + '.checklist{background:#fffdf9;border:1px solid #e6dbcf;border-radius:12px;padding:8px 10px;margin-bottom:6px;page-break-inside:avoid;}'
      + '.checklist ul{list-style:none;margin:0;padding:0;}'
      + '.checklist li{display:flex;gap:8px;align-items:flex-start;padding:5px 0;border-bottom:1px solid #efe4d9;font-size:10px;line-height:1.3;}'
      + '.checklist li:last-child{border-bottom:none;padding-bottom:0;}'
      + '.check{width:12px;height:12px;border:1.5px solid #d9c8b9;border-radius:4px;flex-shrink:0;margin-top:1px;background:white;}'
      + '.foot{margin-top:6px;font-size:9px;line-height:1.3;color:#746f69;}'
      + '@media print{body{background:white;}.page{padding:0;max-width:none;}.top,.result-card,.panel,.checklist{box-shadow:none;}h1{font-size:19px;}.intro{font-size:10px;}}'
      + '</style></head><body><div class="page">'
      + '<div class="top"><div class="eyebrow">MonAide-VD</div><h1>' + title + '</h1><p class="intro">' + intro + '</p><div class="meta">' + profileRows + '</div></div>'
      + '<div class="section-title">Résumé</div>'
      + '<section class="checklist"><ul>' + checklistHtml + '</ul></section>'
      + (isChecklist ? '' : '<div class="section-title">Pistes principales</div><div class="two-col"><div>' + resultsHtml + '</div><div>' + contactsHtml + docsHtml + '</div></div>')
      + '<div class="foot">Ce document est un résumé automatique du simulateur. Il aide à préparer les démarches, mais ne remplace pas une décision officielle.</div>'
      + '</div></body></html>';
  }

  function openPdfWindow(mode, autoPrint) {
    if (!latestSimulation) return;
    var html = buildPdfDocument(latestSimulation, mode);
    if (!html) return;
    var win = window.open('', '_blank');
    if (!win) return;
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
