#!/usr/bin/env node

// Contrôle les contrastes de couleurs du CSS (norme WCAG 2.1 AA : 4,5:1 pour du texte
// normal, 3:1 pour du grand texte). Ne fait aucune requête réseau et ne modifie rien.
//
//   node scripts/contrast-check.js
//
// Il relève chaque règle CSS qui définit une couleur de texte :
// - avec un fond défini dans la même règle : couleurs « certaines » (erreur si trop faible) ;
// - sans fond dans la règle : on ne sait pas sur quel fond le texte sera posé, donc on le
//   teste sur les deux fonds du site (page et cartes) et on le signale seulement « à vérifier ».
// Limites : il ne voit pas les fonds hérités d'un élément parent, ni les images ou dégradés.

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const SEUIL_NORMAL = 4.5;
const SEUIL_GRAND = 3;

function lireCss() {
  const blocs = [{ nom: 'assets/css/main.css', css: fs.readFileSync(path.join(root, 'assets/css/main.css'), 'utf8') }];
  // Pages avec une feuille de style intégrée (ex. 404.html)
  fs.readdirSync(root, { withFileTypes: true }).forEach((entree) => {
    if (entree.isFile() && entree.name.endsWith('.html')) {
      const html = fs.readFileSync(path.join(root, entree.name), 'utf8');
      for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) blocs.push({ nom: entree.name, css: m[1] });
    }
  });
  return blocs;
}

// Découpe un CSS en règles { selecteur, declarations }, en entrant dans les @media.
function lireRegles(css) {
  const texte = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const regles = [];
  function parcourir(source) {
    let i = 0;
    while (i < source.length) {
      const ouvre = source.indexOf('{', i);
      if (ouvre === -1) break;
      const entete = source.slice(i, ouvre).trim();
      let profondeur = 1;
      let j = ouvre + 1;
      while (j < source.length && profondeur > 0) {
        if (source[j] === '{') profondeur += 1;
        else if (source[j] === '}') profondeur -= 1;
        j += 1;
      }
      const corps = source.slice(ouvre + 1, j - 1);
      if (/^@(media|supports)/.test(entete)) parcourir(corps);
      else if (!/^@/.test(entete)) regles.push({ selecteur: entete.replace(/\s+/g, ' '), corps });
      i = j;
    }
  }
  parcourir(texte);
  return regles;
}

function lireDeclarations(corps) {
  const dec = {};
  corps.split(';').forEach((ligne) => {
    const k = ligne.indexOf(':');
    if (k === -1) return;
    const nom = ligne.slice(0, k).trim().toLowerCase();
    if (nom) dec[nom] = ligne.slice(k + 1).trim();
  });
  return dec;
}

const blocs = lireCss();

// Variables CSS : chaque feuille de style (main.css, ou celle intégrée à une page) a les siennes
const variables = {};
function chargerVariables(reglesDuBloc) {
  Object.keys(variables).forEach((k) => delete variables[k]);
  reglesDuBloc.filter((r) => /(^|,)\s*:root\s*(,|$)/.test(r.selecteur)).forEach((r) => {
    for (const m of r.corps.matchAll(/(--[\w-]+)\s*:\s*([^;]+);?/g)) variables[m[1]] = m[2].trim();
  });
}

function resoudre(valeur, profondeur = 0) {
  if (!valeur || profondeur > 8) return valeur;
  return valeur.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)/g, (tout, nom, secours) => {
    const v = variables[nom];
    return v !== undefined ? resoudre(v, profondeur + 1) : (secours ? resoudre(secours.trim(), profondeur + 1) : tout);
  });
}

const nomsCouleurs = { white: [255, 255, 255, 1], black: [0, 0, 0, 1], transparent: [0, 0, 0, 0] };

// Retourne [r, g, b, alpha] ou null si la valeur n'est pas une couleur unie lisible.
function lireCouleur(brut) {
  const valeur = resoudre(brut || '').trim().toLowerCase();
  if (!valeur || /gradient|url\(|inherit|currentcolor|initial|unset|var\(/.test(valeur)) return null;
  if (nomsCouleurs[valeur]) return nomsCouleurs[valeur];
  let m = valeur.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
    if (h.length === 6 || h.length === 8) {
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
    }
    return null;
  }
  m = valeur.match(/^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+%?))?\s*\)$/);
  if (m) {
    let a = m[4] === undefined ? 1 : parseFloat(m[4]);
    if (m[4] && m[4].endsWith('%')) a /= 100;
    return [Number(m[1]), Number(m[2]), Number(m[3]), a];
  }
  return null;
}

function melanger(avant, arriere) {
  const a = avant[3];
  return [0, 1, 2].map((i) => Math.round(avant[i] * a + arriere[i] * (1 - a))).concat(1);
}

function luminance(c) {
  const [r, g, b] = c.slice(0, 3).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function hex(c) {
  return '#' + c.slice(0, 3).map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function estGrandTexte(dec) {
  const t = /^([\d.]+)(px|rem|em)$/.exec((dec['font-size'] || '').trim());
  if (!t) return false;
  const px = t[2] === 'px' ? Number(t[1]) : Number(t[1]) * 16;
  const gras = /^(bold|[6-9]00)$/.test((dec['font-weight'] || '').trim());
  return px >= 24 || (px >= 18.66 && gras);
}

// Éléments que la norme dispense du contraste minimal (logos) ou qui sont purement décoratifs.
// Ils sont comptés et affichés à part pour que rien ne soit caché.
const exemptions = [
  { re: /\.nav-logo|(^|[ ,])\.brand\b/, raison: 'logotype' },
  { re: /-sep\b/, raison: 'séparateur décoratif' },
  { re: /::marker/, raison: 'puce de liste' }
];

const certains = [];
const aVerifier = [];
const exemptes = [];

let nbRegles = 0;
let nbVariables = 0;

blocs.forEach((bloc) => {
const regles = lireRegles(bloc.css).map((r) => Object.assign({ fichier: bloc.nom }, r));
chargerVariables(regles);
nbRegles += regles.length;
nbVariables = Math.max(nbVariables, Object.keys(variables).length);

// Fonds du site utilisés quand une règle ne donne pas son fond
const fondPage = lireCouleur(variables['--cream']) || [247, 248, 250, 1];
const fondCarte = lireCouleur(variables['--surface']) || [255, 255, 255, 1];
const fondSombre = lireCouleur(variables['--forest']) || [23, 41, 60, 1];

regles.forEach((r) => {
  const dec = lireDeclarations(r.corps);
  const texte = lireCouleur(dec.color);
  if (!texte) return;
  const exemption = exemptions.find((e) => e.re.test(r.selecteur));
  if (exemption) {
    exemptes.push({ selecteur: r.selecteur, raison: exemption.raison });
    return;
  }
  const grand = estGrandTexte(dec);
  // Éléments ajoutés par ::before / ::after : icônes ou décor, seuil des composants d'interface (3:1)
  const seuil = (grand || /::(before|after)/.test(r.selecteur)) ? SEUIL_GRAND : SEUIL_NORMAL;
  const declFond = dec['background-color'] || dec.background;
  const fond = lireCouleur(declFond);
  const ligne = { selecteur: r.selecteur.length > 90 ? r.selecteur.slice(0, 89) + '…' : r.selecteur, fichier: r.fichier, grand: seuil === SEUIL_GRAND };

  if (fond && fond[3] >= 0.95) {
    // Fond défini et opaque dans la même règle : couple certain
    const texteOpaque = texte[3] < 1 ? melanger(texte, fond) : texte;
    const ratio = contraste(texteOpaque, fond);
    if (ratio < seuil) certains.push(Object.assign(ligne, { ratio, seuil, texte: hex(texteOpaque), fond: hex(fond) }));
  } else if (!declFond || fond) {
    // Fond absent ou semi-transparent : on ne sait pas ce qu'il y a dessous.
    // Texte clair → on suppose le fond sombre du site ; texte foncé → page ou carte (on garde le pire).
    const claire = luminance(texte) > 0.6;
    const candidats = claire ? [fondSombre] : [fondPage, fondCarte];
    const pire = candidats.map((f) => {
      const t = texte[3] < 1 ? melanger(texte, f) : texte;
      return { ratio: contraste(t, f), texte: hex(t), fond: hex(f) };
    }).sort((a, b) => a.ratio - b.ratio)[0];
    if (pire.ratio < seuil) aVerifier.push(Object.assign(ligne, { ratio: pire.ratio, seuil }, { texte: pire.texte, fond: pire.fond }));
  }
});
});

function afficher(titre, liste) {
  console.log('\n' + titre + ' (' + liste.length + ')');
  liste.sort((a, b) => a.ratio - b.ratio).forEach((l) => {
    console.log('  ' + l.ratio.toFixed(2) + ':1 (min ' + l.seuil + (l.grand ? ', grand texte' : '') + ')  ' + l.texte + ' sur ' + l.fond + '  ' + l.selecteur + '  [' + l.fichier + ']');
  });
}

console.log('Contrastes : ' + nbRegles + ' règles lues, ' + nbVariables + ' variables de couleur (feuille principale).');
afficher('Contrastes insuffisants (fond défini dans la règle)', certains);
afficher('À vérifier (fond non défini dans la règle, testé sur la page et sur les cartes)', aVerifier);
console.log('\nExemptés ou décoratifs, non comptés (' + exemptes.length + ') : ' + exemptes.map((e) => e.selecteur + ' [' + e.raison + ']').join(' ; '));

if (certains.length || aVerifier.length) {
  console.log('\nÉchec : ' + (certains.length + aVerifier.length) + ' contraste(s) à corriger ou à confirmer.');
  console.log('Pour accepter un cas volontairement (logo, décor), l\'ajouter à `exemptions` en haut de ce fichier avec sa raison.');
  process.exit(1);
}
console.log('\nAucun contraste insuffisant ni douteux.');
