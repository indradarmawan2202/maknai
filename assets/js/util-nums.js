/* Membaca nominal dari kalimat bebas: "1,5 juta", "Rp400.000", "500 ribu", "300k". */
export function scanNums(t) {
  const out = [], re = /(?:rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)\s*(juta|jt|ribu|rb|k)?/gi; let m;
  while ((m = re.exec(t))) {
    const raw = m[1], unit = (m[2] || '').toLowerCase();
    let v = /^\d{1,3}([.,]\d{3})+$/.test(raw) ? parseInt(raw.replace(/[.,]/g, ''), 10) : parseFloat(raw.replace(',', '.'));
    if (unit === 'juta' || unit === 'jt') v *= 1e6; else if (unit) v *= 1e3;
    out.push({ v: Math.round(v) });
  }
  return out;
}
