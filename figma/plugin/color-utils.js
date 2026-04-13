function expandShortHex(v) {
  if (/^#[0-9a-f]{3}$/i.test(v)) {
    return '#' + v.slice(1).split('').map(function(ch) { return ch + ch; }).join('');
  }
  if (/^#[0-9a-f]{4}$/i.test(v)) {
    return '#' + v.slice(1).split('').map(function(ch) { return ch + ch; }).join('');
  }
  return v;
}

function toHex(v) {
  if (/^#[0-9a-f]{3,8}$/i.test(v)) {
    var normalized = expandShortHex(String(v).toLowerCase());
    if (/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(normalized)) {
      return normalized.slice(0, 7);
    }
  }
  var m = String(v).match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  return m
    ? '#'+[m[1],m[2],m[3]].map(function(x){return Math.round(parseFloat(x)).toString(16).padStart(2,'0')}).join('')
    : null;
}

function toPx(v) {
  if (/^[\d.]+$/.test(v)) return parseFloat(v);
  if (/^[\d.]+px$/.test(v)) return parseFloat(v);
  var r = String(v).match(/^(-?[\d.]+)rem$/);
  return r ? parseFloat(r[1]) * 16 : null;
}

function toFW(v) {
  if (/^\d{1,4}$/.test(v)) return parseInt(v, 10);
  var map = {
    'thin': 100,
    'extra-light': 200,
    'extralight': 200,
    'light': 300,
    'normal': 400,
    'regular': 400,
    'medium': 500,
    'semi-bold': 600,
    'semibold': 600,
    'bold': 700,
    'extra-bold': 800,
    'extrabold': 800,
    'black': 900,
  };
  var k = String(v).replace(/[\s_]+/g, '-');
  return map[k] !== undefined ? map[k] : null;
}

function valuesMatch(a, b) {
  if (a === null || b === null) return false;
  var sa = String(a).toLowerCase().trim();
  var sb = String(b).toLowerCase().trim();
  if (sa === sb) return true;
  var ha = toHex(sa), hb = toHex(sb);
  if (ha && hb) return ha === hb;
  var pa = toPx(sa), pb = toPx(sb);
  if (pa !== null && pb !== null) return Math.abs(pa - pb) < 0.5;
  var fa = toFW(sa), fb = toFW(sb);
  if (fa !== null && fb !== null) return fa === fb;
  return false;
}

module.exports = {
  expandShortHex,
  toHex,
  valuesMatch,
};
