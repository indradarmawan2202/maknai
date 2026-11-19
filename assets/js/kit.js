/* Generator Maknai Brand Kit — simulasi "eksplorasi AI" di perangkat (prosedural, tanpa server).
   Di layanan nyata, hasil ini hanyalah titik awal yang disempurnakan desainer. */
import { esc, ic } from './core.js';
import { PALETTES, TYPE, SHAPES, SHAPE_MEANING } from './data.js';

const hash = s => [...String(s)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const PREFIX = /^(al|ar|an|as|at|ad|az|bu|pak|toko|kedai|warung|ummi|umi|ibu|mbak|cv|ud|pt|koperasi|pondok|pesantren)[\s-]+/i;
export function initials(name, n = 1) {
  const w = String(name || 'M').trim().replace(PREFIX, '').split(/[\s-]+/).filter(Boolean);
  return (n === 2 && w.length > 1 ? w[0][0] + w[1][0] : (w[0] || 'M')[0]).toUpperCase();
}
const score = (tags, biz, vals) => tags.reduce((s, t) => s + (t === biz ? 3 : vals.includes(t) ? 2 : 0), 0);

export function buildKit(inp) {
  const vals = inp.values && inp.values.length ? inp.values : ['Amanah'];
  const h = hash((inp.name || '') + inp.biz) + (inp.seed || 0) * 7;
  const pals = PALETTES.map((p, i) => ({ ...p, s: score(p.tags, inp.biz, vals) * 10 + ((h >> i) % 7) })).sort((a, b) => b.s - a.s);
  const pal = pals[(inp.seed || 0) % 3];
  const types = TYPE.map((t, i) => ({ ...t, s: score(t.tags, inp.biz, vals) * 10 + ((h >> (i + 3)) % 5) })).sort((a, b) => b.s - a.s);
  const type = types[(inp.seed || 0) % 2];
  return { ...inp, vals, pal, type, alt: pals.slice(0, 4).filter(p => p.n !== pal.n).slice(0, 3), shape: inp.shape || SHAPES[h % 4], ini: initials(inp.name), ini2: initials(inp.name, 2) };
}

/* ---------- logo ---------- */
const star8 = (cx, cy, r) => { const pts = []; for (let i = 0; i < 16; i++) { const a = Math.PI / 8 * i - Math.PI / 2, rr = i % 2 ? r * .74 : r; pts.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1)); } return pts.join(' '); };
export function logoSVG(k, shape = k.shape, size = 120, label) {
  const [c0, c1, c2, c3] = k.pal.c, F = k.type.h, L = shape === 'kotak' || shape === 'lingkar' ? k.ini2 : k.ini, fs = L.length > 1 ? 44 : 58;
  let g = '';
  if (shape === 'kotak') g = `<rect x="10" y="10" width="100" height="100" rx="22" fill="${c0}"/><rect x="18" y="18" width="84" height="84" rx="16" fill="none" stroke="${c2}" stroke-width="2"/><text x="60" y="${L.length > 1 ? 75 : 80}" text-anchor="middle" font-family="${F}, serif" font-size="${fs}" font-weight="700" fill="${c3}">${esc(L)}</text>`;
  if (shape === 'lengkung') g = `<path d="M18 112V58a42 42 0 0 1 84 0v54z" fill="${c0}"/><path d="M28 112V60a32 32 0 0 1 64 0v52" fill="none" stroke="${c2}" stroke-width="2"/><polygon points="${star8(60, 30, 7)}" fill="${c2}"/><text x="60" y="92" text-anchor="middle" font-family="${F}, serif" font-size="46" font-weight="700" fill="${c3}">${esc(L)}</text>`;
  if (shape === 'bintang') g = `<polygon points="${star8(60, 60, 54)}" fill="${c0}"/><circle cx="60" cy="60" r="32" fill="${c3}"/><circle cx="60" cy="60" r="27" fill="none" stroke="${c2}" stroke-width="2"/><text x="60" y="78" text-anchor="middle" font-family="${F}, serif" font-size="46" font-weight="700" fill="${c0}">${esc(L)}</text>`;
  if (shape === 'lingkar') g = `<circle cx="60" cy="60" r="48" fill="${c3}" stroke="${c0}" stroke-width="7"/><path d="M60 14c10 8 12 18 0 26-12-8-10-18 0-26z" fill="${c1}"/><text x="60" y="${L.length > 1 ? 80 : 84}" text-anchor="middle" font-family="${F}, serif" font-size="${fs}" font-weight="700" fill="${c0}">${esc(L)}</text><circle cx="60" cy="106" r="4" fill="${c2}"/>`;
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="${esc(label || 'Konsep logo ' + shape + ' ' + k.name)}">${g}</svg>`;
}
export function lockupSVG(k, w = 320) {
  const [c0] = k.pal.c;
  return `<svg viewBox="0 0 320 100" width="${w}" role="img" aria-label="Logo ${esc(k.name)} dengan nama"><g transform="translate(6 6) scale(.733)">${logoSVG(k, k.shape, 120).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g><text x="108" y="58" font-family="${k.type.h}, serif" font-size="${k.name.length > 12 ? 26 : 34}" font-weight="700" fill="${c0}">${esc(k.name)}</text><text x="110" y="80" font-family="${k.type.b}, sans-serif" font-size="11" letter-spacing="2.5" fill="${k.pal.c[1]}">${esc(bizWord(k.biz).toUpperCase())}</text></svg>`;
}
const bizWord = b => ({ 'Kuliner & camilan': 'Camilan rumahan', 'Air minum & minuman': 'Air minum', 'Fesyen muslim': 'Busana muslim', 'Kerajinan & suvenir': 'Kerajinan tangan', 'Produk santri': 'Produk santri', 'Madu & herbal': 'Madu murni' }[b] || b);

/* ---------- kemasan ---------- */
export function labelSVG(k, o = {}) {
  const [c0, c1, c2, c3, c4] = k.pal.c, F = o.font || k.type.h, B = k.type.b, claim = o.claim || tagline(k)[0];
  const halal = o.halalBadge === 'fake' ? `<g><circle cx="196" cy="236" r="17" fill="#2E7D32"/><text x="196" y="240" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="${B}">HALAL</text></g>`
    : k.halal ? `<g><rect x="176" y="218" width="40" height="36" rx="6" fill="none" stroke="${c4}" stroke-dasharray="3 2"/><text x="196" y="234" text-anchor="middle" font-size="6.5" fill="${c4}" font-family="${B}">Logo halal</text><text x="196" y="243" text-anchor="middle" font-size="6.5" fill="${c4}" font-family="${B}">resmi</text></g>`
      : `<g><rect x="172" y="218" width="48" height="36" rx="6" fill="none" stroke="${c1}" stroke-dasharray="3 2"/><text x="196" y="233" text-anchor="middle" font-size="6" fill="${c1}" font-family="${B}">Ruang logo halal</text><text x="196" y="242" text-anchor="middle" font-size="6" fill="${c1}" font-family="${B}">setelah sertifikat</text></g>`;
  const ill = o.ill ? `<g opacity=".9"><ellipse cx="62" cy="140" rx="10" ry="7" fill="${c2}"/><ellipse cx="56" cy="134" rx="7" ry="4" fill="#fff" opacity=".8"/><ellipse cx="68" cy="134" rx="7" ry="4" fill="#fff" opacity=".8"/></g>` : '';
  const kind = o.kind || ({ 'Air minum & minuman': 'botol', 'Madu & herbal': 'toples', 'Kuliner & camilan': 'pouch', 'Fesyen muslim': 'tag', 'Kerajinan & suvenir': 'box', 'Produk santri': 'box' }[k.biz] || 'pouch');
  let body = '';
  if (kind === 'botol') body = `<path d="M100 18h40v26c0 8 22 14 22 34v196c0 9-6 14-14 14H92c-8 0-14-5-14-14V78c0-20 22-26 22-34z" fill="#E6F2F4" stroke="${c4}" stroke-opacity=".25"/><rect x="98" y="6" width="44" height="16" rx="4" fill="${c0}"/><rect x="78" y="118" width="84" height="118" fill="${c3}"/><rect x="78" y="118" width="84" height="6" fill="${c0}"/><rect x="78" y="230" width="84" height="6" fill="${c0}"/>`;
  else if (kind === 'toples') body = `<rect x="44" y="40" width="152" height="24" rx="6" fill="${c0}"/><path d="M50 64h140c8 0 12 6 12 14v188c0 12-8 20-20 20H58c-12 0-20-8-20-20V78c0-8 4-14 12-14z" fill="${c2}" opacity=".35"/><rect x="38" y="96" width="164" height="168" rx="4" fill="${c3}"/>`;
  else if (kind === 'tag') body = `<path d="M60 20h120l20 30v230c0 6-4 10-10 10H50c-6 0-10-4-10-10V50z" fill="${c3}" stroke="${c0}" stroke-width="2"/><circle cx="120" cy="44" r="7" fill="var(--paper)" stroke="${c0}" stroke-width="2"/><path d="M120 37C110 10 100 4 92 2" stroke="${c4}" fill="none"/>`;
  else if (kind === 'box') body = `<path d="M40 70l80-34 80 34v190l-80 34-80-34z" fill="${c0}" opacity=".18"/><rect x="40" y="70" width="160" height="210" rx="4" fill="${c3}" stroke="${c0}" stroke-width="2"/><path d="M40 70l80-34 80 34" fill="${c1}" opacity=".6"/>`;
  else body = `<path d="M50 30h140l-6 20c10 10 14 24 14 40v176c0 10-8 18-18 18H60c-10 0-18-8-18-18V90c0-16 4-30 14-40z" fill="${c3}" stroke="${c0}" stroke-width="2"/><rect x="50" y="30" width="140" height="10" fill="${c0}"/><path d="M60 50h120" stroke="${c0}" stroke-dasharray="4 3"/>`;
  const big = kind === 'botol' ? { y: 150, s: .42, tx: 120, ty: 196, fs: 15, cy: 212, w: 84 } : { y: 100, s: .55, tx: 120, ty: 182, fs: 22, cy: 202, w: 150 };
  return `<svg viewBox="0 0 240 300" class="mock" role="img" aria-label="Mock-up kemasan ${esc(k.name)}">${body}${ill}
    <g transform="translate(${120 - 60 * big.s} ${big.y - 4}) scale(${big.s})">${logoSVG(k, k.shape, 120).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>
    <text x="${big.tx}" y="${big.ty}" text-anchor="middle" font-family="${F}, serif" font-size="${big.fs}" font-weight="700" fill="${c0}">${esc(k.name)}</text>
    <foreignObject x="${120 - big.w / 2}" y="${big.cy}" width="${big.w}" height="30"><div xmlns="http://www.w3.org/1999/xhtml" style="font:600 ${kind === 'botol' ? 6.5 : 8}px/1.25 ${B},sans-serif;color:${o.claimBad ? '#B3402A' : c1};text-align:center">${esc(claim)}</div></foreignObject>
    ${kind === 'botol' ? '' : halal}</svg>`;
}

/* ---------- konten media sosial ---------- */
export function postsSVG(k) {
  const [c0, c1, c2, c3] = k.pal.c, F = k.type.h, B = k.type.b, lg = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${logoSVG(k, k.shape, 120).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`;
  return [
    `<svg viewBox="0 0 200 200" class="post" role="img" aria-label="Template promo"><rect width="200" height="200" fill="${c0}"/><circle cx="170" cy="30" r="60" fill="${c1}" opacity=".35"/>${lg(16, 16, .22)}<text x="18" y="102" font-family="${F}, serif" font-size="24" font-weight="700" fill="${c3}">Jumat</text><text x="18" y="128" font-family="${F}, serif" font-size="24" font-weight="700" fill="${c2}">Berkah</text><rect x="18" y="146" width="84" height="24" rx="12" fill="${c2}"/><text x="60" y="162" text-anchor="middle" font-family="${B}" font-size="10" font-weight="700" fill="${c0}">Potongan 10%</text></svg>`,
    `<svg viewBox="0 0 200 200" class="post" role="img" aria-label="Template edukasi"><rect width="200" height="200" fill="${c3}"/><text x="18" y="38" font-family="${B}" font-size="8" letter-spacing="2" fill="${c1}">TAHUKAH KAMU?</text><text x="18" y="64" font-family="${F}, serif" font-size="17" font-weight="700" fill="${c0}">Dari mana</text><text x="18" y="84" font-family="${F}, serif" font-size="17" font-weight="700" fill="${c0}">${esc(k.name.slice(0, 14))} berasal?</text>${[0, 1, 2].map(i => `<rect x="18" y="${106 + i * 16}" width="${150 - i * 30}" height="7" rx="3.5" fill="${c1}" opacity="${.55 - i * .12}"/>`).join('')}<rect x="0" y="180" width="200" height="20" fill="${c0}"/><text x="18" y="194" font-family="${B}" font-size="8" fill="${c3}">Geser untuk cerita lengkap →</text></svg>`,
    `<svg viewBox="0 0 200 200" class="post" role="img" aria-label="Template cerita"><rect width="200" height="200" fill="${c2}"/><text x="18" y="70" font-family="${F}, serif" font-size="60" fill="${c0}" opacity=".35">“</text><foreignObject x="18" y="64" width="164" height="80"><div xmlns="http://www.w3.org/1999/xhtml" style="font:700 15px/1.3 ${F},serif;color:${c0}">${esc(tagline(k)[1])}</div></foreignObject>${lg(150, 150, .3)}<text x="18" y="176" font-family="${B}" font-size="9" fill="${c0}">@${esc(k.name.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 16))}</text></svg>`
  ];
}

/* ---------- kata-kata ---------- */
const VAL_TEXT = { Amanah: 'menjaga kepercayaan pelanggan dengan takaran, harga, dan klaim yang jujur', Sederhana: 'tampil apa adanya tanpa berlebihan', Segar: 'menghadirkan kesegaran yang terasa sejak pertama kali dicoba', Hangat: 'melayani seperti keluarga sendiri', Modern: 'terbuka pada cara baru tanpa meninggalkan akar', Tradisional: 'merawat resep dan cara kerja warisan', Elegan: 'menghadirkan keindahan yang santun', Ceria: 'membawa semangat dan senyum di setiap kemasan' };
const VOICE = { Amanah: 'Bicara jujur dan jelas; tidak melebih-lebihkan.', Sederhana: 'Kalimat pendek, kata sehari-hari.', Segar: 'Ringan dan energik, banyak kata kerja aktif.', Hangat: 'Menyapa akrab: "Kak", "Bunda", "Sahabat".', Modern: 'Lugas, rapi, sedikit istilah kekinian.', Tradisional: 'Santun dengan sentuhan bahasa daerah.', Elegan: 'Tenang, pilihan kata yang halus.', Ceria: 'Ceria dan bersahabat, boleh pakai emoji secukupnya.' };
const ORIGIN = { 'Kuliner & camilan': 'dapur rumahan yang mengolah resep keluarga', 'Air minum & minuman': 'sumber air pegunungan yang diolah dengan higienis', 'Fesyen muslim': 'kecintaan pada busana yang santun dan nyaman', 'Kerajinan & suvenir': 'tangan-tangan terampil pengrajin lokal', 'Produk santri': 'kreativitas santri yang belajar sambil berkarya', 'Madu & herbal': 'hutan dan kebun yang dirawat turun-temurun' };
export function tagline(k) {
  const v = (k.vals || k.values || ['Amanah'])[0], w = bizWord(k.biz).toLowerCase();
  const T = { Amanah: [`${bizWordCap(k.biz)} yang jujur takarannya`, `Amanah di setiap ${w}`], Sederhana: [`${bizWordCap(k.biz)}, apa adanya`, 'Sederhana, tapi bermakna'], Segar: ['Segar dari sumbernya', `Kesegaran yang bisa dipercaya`], Hangat: ['Rasa rumah di setiap kemasan', 'Hangatnya buatan keluarga'], Modern: ['Tradisi yang bergerak maju', `${bizWordCap(k.biz)} untuk hari ini`], Tradisional: ['Warisan yang dijaga', 'Resep lama, niat yang sama'], Elegan: ['Anggun dalam kesantunan', 'Indah, sopan, berkelas'], Ceria: ['Senyum di setiap gigitan', 'Bikin hari lebih berkah'] };
  return T[v] || T.Amanah;
}
const bizWordCap = b => { const w = bizWord(b); return w[0].toUpperCase() + w.slice(1); };
export function story(k) {
  const v = k.vals.slice(0, 2), city = esc(k.city || 'Malang'), nm = esc(k.name);
  return [
    ['Asal', `${nm} lahir di ${city}, dari ${ORIGIN[k.biz] || 'usaha kecil yang tekun'}. ${k.story ? esc(k.story) : ''}`],
    ['Nilai', `Kami ${v.map(x => VAL_TEXT[x]).join(', dan ')}. Nilai ini kami pegang dalam setiap keputusan, dari bahan hingga cara menyapa pelanggan.`],
    ['Tujuan', `Kami ingin ${nm} menjadi pilihan yang ${v.map(x => x.toLowerCase()).join(' dan ')} bagi ${k.target ? esc(k.target) : 'keluarga muslim di sekitar kami'}, sekaligus membuka rezeki yang berkah bagi orang-orang yang terlibat.`]
  ];
}

/* ---------- tampilan kit lengkap ---------- */
const swatch = (c, n) => `<button class="swatch" data-act="copy" data-v="${c}" title="Salin ${c}"><i style="background:${c}"></i><b>${n}</b><span class="mono">${c}</span></button>`;
export function kitHTML(k, o = {}) {
  const [c0, c1, c2, c3, c4] = k.pal.c, posts = postsSVG(k), tl = tagline(k);
  return `<div class="kit ${o.draft ? 'draft' : ''}" id="${o.id || 'kitDoc'}">
  ${o.draft ? '<div class="kit-wm" aria-hidden="true">DRAF · belum dikurasi</div>' : ''}
  <div class="kit-cover" style="background:${c0};color:${c3}"><div class="kit-cover-logo" style="background:${c3}">${logoSVG(k, k.shape, 96)}</div><div><span class="lbl" style="color:${c2}">Maknai Brand Kit</span><h3 style="font-family:'${k.type.h}',serif;color:${c3}">${esc(k.name)}</h3><p style="color:${c3};opacity:.8">${esc(tl[0])}</p></div></div>
  <div class="kit-grid">
    <section><h4>${ic('spark', 16)} Logo & makna bentuk</h4><div class="kit-logo-row">${lockupSVG(k, 300)}</div><p class="note">${SHAPE_MEANING[k.shape]}</p></section>
    <section><h4>${ic('layers', 16)} Palet "${k.pal.n}"</h4><div class="swatches">${swatch(c0, 'Utama')}${swatch(c1, 'Pendukung')}${swatch(c2, 'Aksen')}${swatch(c3, 'Latar')}${swatch(c4, 'Teks')}</div><p class="note">Klik warna untuk menyalin kode hex.</p></section>
    <section><h4>${ic('doc', 16)} Tipografi "${k.type.n}"</h4><div class="type-spec"><div style="font-family:'${k.type.h}',serif;font-size:30px;color:${c0}">Aa ${esc(k.name)}</div><span class="note">Judul — ${k.type.h}</span><div style="font-family:'${k.type.b}',sans-serif;font-size:15px">Isi teks yang mudah dibaca untuk kemasan dan konten.</div><span class="note">Isi — ${k.type.b} · keduanya berlisensi SIL Open Font License</span></div></section>
    <section><h4>${ic('user', 16)} Gaya bahasa</h4><ul class="ticks dark">${k.vals.slice(0, 3).map(v => `<li>${ic('check', 15)}<span><b>${v}:</b> ${VOICE[v]}</span></li>`).join('')}</ul><div class="chips" style="margin-top:10px">${tl.map(t => `<span class="pill">“${esc(t)}”</span>`).join('')}</div></section>
    <section class="wide"><h4>${ic('book', 16)} Brand story "Makna"</h4><div class="story-cols">${story(k).map(([h, t]) => `<div><span class="lbl" style="color:${c1}">${h}</span><p>${t}</p></div>`).join('')}</div></section>
    <section><h4>${ic('tag', 16)} Mock-up kemasan</h4><div class="mock-wrap" style="background:linear-gradient(160deg, ${c3}, #fff)">${labelSVG(k)}</div></section>
    <section><h4>${ic('play', 16)} Template media sosial</h4><div class="posts">${posts.join('')}</div><p class="note">Di Maknai Kit, template ini tersedia sebagai berkas yang bisa disunting.</p></section>
  </div></div>`;
}
