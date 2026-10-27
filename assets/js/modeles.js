/* Modèle « Résilier son assurance de base » : on écrit directement dans la lettre.
   Tout reste dans le navigateur, rien n'est envoyé ni enregistré. */
(function () {
  var form = document.getElementById('modele-form');
  if (!form) return;

  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var PLACEHOLDERS = {
    nom: 'Prénom et nom',
    rue: 'Rue et numéro',
    npa: 'NPA et lieu',
    assure: 'numéro d’assuré',
    naiss: 'date de naissance',
    caisseMail: 'adresse e-mail de ta caisse',
    caisse: 'Nom de ta caisse actuelle',
    caisseRue: 'Rue et numéro de la caisse',
    caisseNpa: 'NPA et lieu de la caisse',
    lieu: 'Lieu',
    date: 'date'
  };

  function el(id) { return document.getElementById(id); }
  function today() { return new Date(); }
  function formatDate(d) { return d.getDate() + ' ' + MOIS[d.getMonth()] + ' ' + d.getFullYear(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Année de l'effet : après le 30 novembre, la prochaine échéance est celle de l'an suivant.
  function defaultYear() {
    var d = today();
    var passed = d.getMonth() === 11 || (d.getMonth() === 10 && d.getDate() > 30);
    return d.getFullYear() + (passed ? 1 : 0);
  }

  var yearSelect = el('f-annee');
  var y0 = defaultYear();
  [y0, y0 + 1].forEach(function (y, i) {
    var o = document.createElement('option');
    o.value = String(y); o.textContent = '31 décembre ' + y;
    if (i === 0) o.selected = true;
    yearSelect.appendChild(o);
  });
  el('f-date').value = formatDate(today());

  var lieuTouched = false;
  function lieuFromNpa(npa) { return npa.replace(/^\s*(CH-)?\d{4}\s*/i, '').trim(); }

  function values() {
    return {
      nom: el('f-nom').value.trim(),
      rue: el('f-rue').value.trim(),
      npa: el('f-npa').value.trim(),
      assure: el('f-assure').value.trim(),
      naiss: el('f-naiss').value.trim(),
      caisse: el('f-caisse').value.trim(),
      caisseRue: el('f-caisse-rue').value.trim(),
      caisseNpa: el('f-caisse-npa').value.trim(),
      caisseMail: el('f-caisse-mail').value.trim(),
      lieu: el('f-lieu').value.trim(),
      date: el('f-date').value.trim(),
      annee: parseInt(yearSelect.value, 10)
    };
  }

  // Un champ vide devient un emplacement entre crochets.
  function slot(v, key) { return v[key] || '[' + PLACEHOLDERS[key] + ']'; }

  function lettre(v) {
    var s = function (k) { return slot(v, k); };
    var effet = '31 décembre ' + v.annee;
    var debut = '1er janvier ' + (v.annee + 1);
    return {
      sender: [s('nom'), s('rue'), s('npa')].join('\n'),
      recipient: [s('caisse'), s('caisseRue'), s('caisseNpa')].join('\n'),
      reco: 'RECOMMANDÉ',
      place: s('lieu') + ', ' + s('date'),
      subject: 'Résiliation de l’assurance de base',
      ref: 'Numéro d’assuré : ' + s('assure') + '\nDate de naissance : ' + s('naiss'),
      body: [
        'Bonjour,',
        'Je vous informe par la présente que je résilie ma couverture d’assurance obligatoire des soins selon la LAMal avec effet au ' + effet + '.',
        'Dès le ' + debut + ', je serai assuré·e auprès d’un autre assureur-maladie selon la LAMal.',
        'En vous remerciant d’avance pour l’exécution de cette demande de résiliation et en vous priant de m’envoyer une confirmation, je vous adresse mes salutations distinguées.'
      ],
      sign: s('nom')
    };
  }

  function courrierTexte(v) {
    var l = lettre(v);
    return [l.sender, '', l.reco, l.recipient, '', l.place, '', l.subject, l.ref, '', l.body.join('\n\n'), '', '', l.sign].join('\n');
  }

  // Message d'accompagnement : la lettre signée est jointe en photo ou en PDF
  function mail(v) {
    var s = function (k) { return slot(v, k); };
    var effet = '31 décembre ' + v.annee;
    return {
      to: s('caisseMail'),
      subject: 'Résiliation de mon assurance de base au ' + effet + ' (n° d’assuré ' + s('assure') + ')',
      body: [
        'Bonjour,',
        '',
        'Vous trouverez ci-joint ma lettre de résiliation de l’assurance de base, signée, avec effet au ' + effet + '.',
        '',
        'Numéro d’assuré : ' + s('assure'),
        'Date de naissance : ' + s('naiss'),
        '',
        'En vous remerciant d’avance pour l’exécution de cette demande de résiliation et en vous priant de m’envoyer une confirmation, je vous adresse mes salutations distinguées.',
        '',
        s('nom')
      ].join('\n')
    };
  }

  function softPh(text) { return esc(text).replace(/\[[^\]]+\]/g, '<span class="m-ph">$&</span>'); }

  // Un champ s'agrandit avec ce qu'on y écrit, comme une ligne de formulaire papier.
  function fit(input) {
    if (!input.classList.contains('m-fit')) return;
    var len = input.value ? input.value.length : input.placeholder.length;
    input.style.width = Math.max(len, 4) + 0.6 + 'ch';
  }

  function render() {
    // la commune du domicile sert de lieu tant qu'on n'a pas écrit autre chose
    var lieuEl = el('f-lieu');
    if (!lieuTouched) lieuEl.value = lieuFromNpa(el('f-npa').value);

    var v = values();
    el('m-sign').textContent = slot(v, 'nom');
    el('m-debut').textContent = '1er janvier ' + (v.annee + 1);

    var m = mail(v);
    el('mail-subject').innerHTML = softPh(m.subject);
    el('mail-body').innerHTML = softPh(m.body);

    var info = el('modele-delai');
    if (info) info.textContent = 'Pour une fin de contrat au 31 décembre ' + v.annee + ', la date est le 30 novembre ' + v.annee + '.';
    Array.prototype.forEach.call(form.querySelectorAll('.m-fit'), fit);
    Array.prototype.forEach.call(form.querySelectorAll('.m-grow'), function (t) { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; });
  }

  el('f-lieu').addEventListener('input', function () { lieuTouched = el('f-lieu').value.trim() !== ''; });
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  render();

  /* Caisse actuelle : choisir une caisse remplit son adresse (liste officielle de l'OFSP) */
  var assureurs = window.MONAIDE_ASSUREURS || [];
  var caisseEl = el('f-caisse');
  var sug = el('m-suggest');
  var sugItems = [];
  var sugIdx = -1;
  var autoFilled = null; // dernière adresse remplie toute seule

  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function grow(t) { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }

  function hideSug() {
    sug.hidden = true; sugItems = []; sugIdx = -1;
    caisseEl.setAttribute('aria-expanded', 'false');
  }
  function paintSug() {
    Array.prototype.forEach.call(sug.children, function (li, i) { li.setAttribute('aria-selected', i === sugIdx ? 'true' : 'false'); });
  }
  function showSug(q) {
    var n = norm(q.trim());
    sugItems = n ? assureurs.filter(function (x) { return norm(x.k + ' ' + (x.alias || '')).indexOf(n) !== -1; }).slice(0, 8) : [];
    if (!sugItems.length) { hideSug(); return; }
    sug.innerHTML = '';
    sugItems.forEach(function (a, i) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.id = 'm-suggest-' + i;
      li.textContent = a.k + (a.alias ? ' (' + a.alias + ')' : '');
      li.addEventListener('mousedown', function (e) { e.preventDefault(); pick(a); });
      sug.appendChild(li);
    });
    sugIdx = -1; paintSug();
    sug.hidden = false;
    caisseEl.setAttribute('aria-expanded', 'true');
  }
  function pick(a) {
    caisseEl.value = a.nom;
    el('f-caisse-rue').value = a.rue;
    el('f-caisse-npa').value = a.npa;
    el('f-caisse-mail').value = a.mail || '';
    autoFilled = a;
    hideSug();
    render();
    status('Adresse reprise de la liste officielle de l’OFSP. Vérifie-la avec ton dernier courrier de caisse.');
  }

  caisseEl.addEventListener('input', function () {
    var q = norm(this.value.trim());
    var exact = assureurs.filter(function (x) { return norm(x.k) === q; })[0];
    if (exact) { pick(exact); return; }
    // le nom a changé : on retire l'ancienne adresse si c'est nous qui l'avions remplie
    if (autoFilled && this.value !== autoFilled.nom) {
      if (el('f-caisse-rue').value === autoFilled.rue) el('f-caisse-rue').value = '';
      if (el('f-caisse-npa').value === autoFilled.npa) el('f-caisse-npa').value = '';
      if (autoFilled.mail && el('f-caisse-mail').value === autoFilled.mail) el('f-caisse-mail').value = '';
      autoFilled = null;
      render();
    }
    if (autoFilled && this.value === autoFilled.nom) hideSug(); else showSug(this.value);
  });
  caisseEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); if (sugIdx >= 0 && sugItems[sugIdx]) pick(sugItems[sugIdx]); return; }
    if (sug.hidden) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); sugIdx = (sugIdx + 1) % sugItems.length; paintSug(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sugIdx = (sugIdx - 1 + sugItems.length) % sugItems.length; paintSug(); }
    else if (e.key === 'Escape') { hideSug(); }
  });
  caisseEl.addEventListener('blur', hideSug);
  window.addEventListener('resize', function () { Array.prototype.forEach.call(form.querySelectorAll('.m-grow'), grow); });

  /* Copier / PDF / imprimer */
  function status(msg) { el('modele-status').textContent = msg; }
  function copy(text, okMsg) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      status(ok ? okMsg : 'La copie n’a pas fonctionné. Tu peux sélectionner le texte à la main.');
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { status(okMsg); }, fallback);
    } else { fallback(); }
  }
  el('btn-copy-courrier').addEventListener('click', function () { copy(courrierTexte(values()), 'Courrier copié.'); });

  el('btn-copy-subject').addEventListener('click', function () { copy(mail(values()).subject, 'Objet copié.'); });
  el('btn-copy-body').addEventListener('click', function () { copy(mail(values()).body, 'Message copié.'); });

  el('btn-pdf').addEventListener('click', function () {
    if (!window.monaideBuildLetterPdf) { status('Le PDF n’a pas pu être créé. Tu peux copier le texte ou l’imprimer.'); return; }
    try {
      var bytes = window.monaideBuildLetterPdf(lettre(values()), 'Résiliation de l\'assurance de base');
      var blob = new Blob([bytes], { type: 'application/pdf' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'resiliation-assurance-de-base.pdf';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      status('PDF téléchargé.');
    } catch (e) { status('Le PDF n’a pas pu être créé. Tu peux copier le texte ou l’imprimer.'); }
  });

  el('btn-print').addEventListener('click', function () {
    document.body.classList.add('modeles-printing');
    var done = function () { document.body.classList.remove('modeles-printing'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
  });
})();
