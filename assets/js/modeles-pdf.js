/* Génère le PDF du courrier (A4, une page) sans bibliothèque ni envoi de données. Police Helvetica standard du PDF. */
(function (root) {
  // Largeurs Helvetica (1/1000 d'em) pour les caractères ASCII 32 à 126
  var W = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,
    1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,
    333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
  var SPECIAL_W = { 0x2019: 222, 0x2018: 222, 0xB7: 333, 0xAB: 556, 0xBB: 556, 0x153: 944, 0x2013: 556, 0x2014: 1000 };
  var WIN = { 0x20AC: 0x80, 0x2018: 0x91, 0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2013: 0x96, 0x2014: 0x97, 0x153: 0x9C, 0x152: 0x8C };

  function charW(code) {
    if (SPECIAL_W[code] !== undefined) return SPECIAL_W[code];
    if (code >= 32 && code <= 126) return W[code - 32];
    return 556; // lettres accentuées : même chasse que la lettre de base, 556 couvre la plupart
  }
  function textW(s, size, bold) {
    var w = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i), base = c;
      if (c > 126 && c !== 0x2019 && c !== 0x2018 && c !== 0xB7) base = deaccent(s.charAt(i));
      w += charW(base);
    }
    return w * size / 1000 * (bold ? 1.06 : 1);
  }
  function deaccent(ch) {
    var d = ch.normalize ? ch.normalize('NFD').charCodeAt(0) : 0;
    return d >= 32 && d <= 126 ? d : 556 === 0 ? 0 : 109; // 109 = « m » : valeur moyenne prudente
  }
  // Texte Unicode → chaîne PDF en WinAnsi, tout caractère non ASCII en octal
  function pdfString(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i), b;
      if (WIN[c] !== undefined) b = WIN[c];
      else if (c < 256) b = c;
      else b = 63; // « ? »
      if (b === 40 || b === 41 || b === 92) out += '\\' + String.fromCharCode(b);
      else if (b < 32 || b > 126) out += '\\' + ('00' + b.toString(8)).slice(-3);
      else out += String.fromCharCode(b);
    }
    return '(' + out + ')';
  }
  function wrap(text, size, bold, maxW) {
    var lines = [];
    String(text).split('\n').forEach(function (para) {
      var words = para.split(' '), cur = '';
      words.forEach(function (w) {
        var test = cur ? cur + ' ' + w : w;
        if (cur && textW(test, size, bold) > maxW) { lines.push(cur); cur = w; } else cur = test;
      });
      lines.push(cur);
    });
    return lines;
  }

  // l : { sender, recipient, place, subject, ref, body[], sign } (textes bruts, sans HTML)
  function buildLetterPdf(l, title) {
    var PW = 595.28, PH = 841.89, M = 62, SIZE = 11, LEAD = 15.5;
    var maxW = PW - 2 * M;
    var ops = [], y = PH - 70;

    function put(text, x, bold) { ops.push('BT /' + (bold ? 'F2' : 'F1') + ' ' + SIZE + ' Tf ' + x.toFixed(2) + ' ' + y.toFixed(2) + ' Td ' + pdfString(text) + ' Tj ET'); y -= LEAD; }
    function block(text, x, bold, width) {
      wrap(text, SIZE, bold, width || maxW).forEach(function (ln) { if (ln !== '') put(ln, x, bold); else y -= LEAD * 0.6; });
    }

    block(l.sender, M, false);
    y -= 18;
    if (l.reco) block(l.reco, 335, true, PW - M - 335);
    block(l.recipient, 335, false, PW - M - 335);
    y -= 22;
    wrap(l.place, SIZE, false, maxW).forEach(function (ln) { put(ln, PW - M - textW(ln, SIZE, false), false); });
    y -= 22;
    block(l.subject, M, true);
    block(l.ref, M, true);
    y -= 12;
    l.body.forEach(function (p) { block(p, M, false); y -= 8; });
    y -= 46;
    block(l.sign, M, false);

    var content = ops.join('\n');
    var objs = [];
    objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
    objs[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
    objs[3] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PW + ' ' + PH + '] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>';
    objs[4] = '<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream';
    objs[5] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
    objs[6] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
    objs[7] = '<< /Title ' + pdfString(title || 'Courrier') + ' /Producer (MonAide-VD) >>';

    var pdf = '%PDF-1.4\n', offsets = [];
    for (var i = 1; i < objs.length; i++) { offsets[i] = pdf.length; pdf += i + ' 0 obj\n' + objs[i] + '\nendobj\n'; }
    var xref = pdf.length;
    pdf += 'xref\n0 ' + objs.length + '\n0000000000 65535 f \n';
    for (var j = 1; j < objs.length; j++) pdf += ('0000000000' + offsets[j]).slice(-10) + ' 00000 n \n';
    pdf += 'trailer\n<< /Size ' + objs.length + ' /Root 1 0 R /Info 7 0 R >>\nstartxref\n' + xref + '\n%%EOF';

    var bytes = new Uint8Array(pdf.length);
    for (var k = 0; k < pdf.length; k++) bytes[k] = pdf.charCodeAt(k) & 255;
    return bytes;
  }

  root.monaideBuildLetterPdf = buildLetterPdf;
  if (typeof module !== 'undefined' && module.exports) module.exports = { buildLetterPdf: buildLetterPdf };
})(typeof window !== 'undefined' ? window : globalThis);
