/* Landing Maknai — tata letak bergaya "frame" (bingkai membulat, hero gradasi + kartu melayang),
   dengan warna asli Maknai: hijau tua, emas, krem. */
import { S, A, I, C, F, $, $$, esc, rp, num, slot, ic, LOGO, themeBtn, chipBtn, toast, initials, avc } from './core.js';
import { PKG, EXTRA, STEPS, COMPETITORS, TEAM, FAQ, BIZ, VALUES, SHAPES, REF_DISC } from './data.js';
import { buildKit, logoSVG, labelSVG, kitHTML } from './kit.js';
import { drawCheck } from './check.js';

const NAV = [['cara-kerja', 'Cara kerja'], ['coba-kit', 'Brand Kit'], ['syariah-check', 'Syariah Check'], ['alur', 'Alur'], ['paket', 'Paket'], ['tim', 'Tim']];
const LAPIS = [
  { k: 'ai', ic: 'spark', tab: 'Eksplorasi AI', t: 'Eksplorasi AI', d: 'Puluhan arah visual dieksplorasi dalam hitungan jam, jadi biaya dan waktu produksi turun.', m: 'Langkah 3', s: '12 konsep / proyek' },
  { k: 'kurasi', ic: 'user', tab: 'Kurasi desainer', t: 'Kurasi desainer + Syariah Check', d: 'Desainer menyempurnakan hasil AI, lalu 8 butir kesesuaian syariah dan etika AI diperiksa.', m: 'Langkah 4–5', s: '8 / 8 butir lolos' },
  { k: 'kit', ic: 'layers', tab: 'Maknai Kit', t: 'Maknai Kit', d: 'Panduan merek dan berkas siap sunting, supaya kamu bisa mengelola merekmu sendiri.', m: 'Langkah 7', s: 'Palet · tipografi · template' }
];
const SEGMENTS = [['home', 'Unit usaha pesantren'], ['store', 'UMKM kuliner'], ['tag', 'Fesyen muslim'], ['star', 'Madu & herbal'], ['layers', 'Kerajinan santri'], ['user', 'Koperasi pondok'], ['grad', 'Madrasah & TPQ'], ['heart', 'Komunitas UMKM']];
const badge = (t, icn = 'spark') => `<span class="lx-badge"><i>${ic(icn, 11)}</i>${t}</span>`;
const glass = () => `<span class="lx-pat" aria-hidden="true"></span><span class="lx-glass g1"></span><span class="lx-glass g2"></span><span class="lx-glass g3"></span><span class="lx-glass g4"></span>`;
const STAR = (s = 14) => `<svg class="lx-star" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.00 0.50L15.37 3.87L20.13 3.87L20.13 8.63L23.50 12.00L20.13 15.37L20.13 20.13L15.37 20.13L12.00 23.50L8.63 20.13L3.87 20.13L3.87 15.37L0.50 12.00L3.87 8.63L3.87 3.87L8.63 3.87z" fill="currentColor"/></svg>`;
const orn = () => `<span class="lx-orn" aria-hidden="true"><i></i>${STAR(12)}<i></i></span>`;

export function landingHTML() {
  const hk = buildKit({ name: 'Al-Hikmah', biz: 'Produk santri', values: ['Amanah', 'Tradisional'], shape: 'lengkung' });
  return `<div class="lx-page"><div class="lx-frame">

  <section class="lx-hero" id="beranda">${glass()}
    <header class="lx-nav"><a class="lx-logo" href="#beranda" data-act="toTop" aria-label="Maknai beranda">${LOGO(34)}<span>Maknai</span></a>
      <nav class="lx-links" aria-label="Navigasi utama">${NAV.map(([h, l]) => `<a href="#${h}" data-act="jump" data-to="${h}">${l}</a>`).join('')}</nav>
      <div class="lx-nav-r">${themeBtn()}<span id="navAuth"><button class="lx-ghost" data-act="start">Masuk</button></span><span id="navApp" hidden><button class="lx-ghost" data-act="openDash">Portal saya</button></span><button class="lx-menu" data-act="mnav" aria-label="Buka menu" aria-expanded="false"><i>${ic('menu', 14)}</i>Menu</button></div></header>
    <nav class="lx-mnav" id="mnav" hidden aria-label="Menu">${NAV.map(([h, l]) => `<a href="#${h}" data-act="jump" data-to="${h}">${l}</a>`).join('')}<div class="lx-mnav-cta"><button class="lx-btn ghost" data-act="start">Masuk</button><button class="lx-btn gold" data-act="startOrder">Pesan sekarang</button></div></nav>

    <div class="lx-hero-in"><span class="lx-ar-wm" aria-hidden="true" lang="ar">مَعْنَى</span>
      <span class="lx-ar" lang="ar" title="ma'na: makna">مَعْنَى</span>
      <span class="lx-badge on-dark"><i>${ic('shield', 11)}</i>Studio branding AI · kurasi syariah</span>
      <h1>Bangun brand usahamu yang <br class="d">bermakna, bersama <span class="lx-inlogo">${LOGO(46)}</span> Maknai</h1>
      <form class="lx-pill-in" data-form="heroStart"><input type="text" id="heroName" maxlength="28" placeholder="Nama usahamu" aria-label="Nama usaha"><button type="submit"><i>${ic('play', 12)}</i>Racik sekarang</button></form>
      <p class="lx-hero-note">Mulai Rp350.000 · 3–10 hari kerja · <button class="lx-link" data-act="demoKlien">lihat portal klien</button></p>
    </div>

    <div class="lx-float">
      <div class="lx-fc left"><div class="lx-mini"><span class="lx-dot">${ic('user', 13)}</span><b>+396</b><span class="lx-chip ok sm">Malang Raya</span></div>
        <div class="lx-fc-b"><div class="row"><div><span class="lx-k">Paket pilihanmu</span><b>Starter</b></div><b class="lx-price">Rp350<small>rb</small></b></div><div class="lx-mini-row"><span>${ic('calc', 12)} 3 hari kerja</span><span>${ic('spark', 12)} 2× revisi</span></div></div></div>
      <div class="lx-fc mid"><div class="row start" style="gap:10px"><span class="lx-dot gold">${ic('layers', 13)}</span><div><span class="lx-k">Maknai Kit</span><b>Al-Hikmah</b></div></div>
        <div class="lx-fc-logo" style="background:${hk.pal.c[3]}">${logoSVG(hk, 'lengkung', 76)}<div class="lx-sw">${hk.pal.c.map(c => `<i style="background:${c}"></i>`).join('')}</div></div>
        <span class="lx-k" style="margin-top:12px;display:block">Syariah Check</span><div class="lx-bar"><i style="width:100%"></i></div><div class="row" style="margin-top:6px"><span class="lx-k">8 / 8 butir lolos</span><span class="lx-chip ok sm">Siap diserahkan</span></div></div>
      <div class="lx-fc right"><div class="lx-mini"><span class="lx-av ${avc('Fatimah Zahra')}">FZ</span><div><span class="lx-k">Klien</span><b>Fatimah Zahra</b></div></div>
        <div class="lx-fc-b center"><span class="lx-k">Paket Brand · akad ijarah</span><b class="lx-big">Rp900.000</b><div class="lx-two"><div><span class="lx-k">${ic('check', 11)} Uang muka</span><b>Rp450.000</b></div><div><span class="lx-k">${ic('calc', 11)} Pelunasan</span><b>Rp450.000</b></div></div></div></div>
    </div>
  </section>

  <section class="lx-trust">${orn()}<h2>Dirancang untuk <em>396 pesantren</em> & UMKM halal</h2>
    <div class="lx-marq" aria-hidden="true"><div class="lx-track">${[...SEGMENTS, ...SEGMENTS].map(([i, t]) => `<span class="lx-seg">${ic(i, 16)}${t}</span><span class="lx-seg-star">${STAR(14)}</span>`).join('')}</div></div></section>

  <section class="lx-sec" id="cara-kerja"><div class="lx-head rv">${badge('Maknai · cara kerja', 'spark')}<h2>AI untuk cepat,<br><em>manusia</em> untuk makna</h2></div>
    <div class="lx-tabs rv" role="tablist" id="lapisTabs"></div>
    <div class="lx-stackcards rv" id="lapisCards"></div></section>

  <section class="lx-sec lx-lines" id="coba-kit"><div class="lx-head rv">${badge('Prototipe · Brand Kit', 'layers')}<h2>Coba racik <em>identitas</em><br>usahamu sekarang</h2><p>Isi nama, jenis usaha, dan nilai merek. Hasilnya simulasi eksplorasi awal — desainer menyempurnakannya di layanan asli.</p></div>
    <div class="lx-formwrap rv"><span class="ln l1"></span><span class="ln l2"></span><span class="ln r1"></span><span class="ln r2"></span><span class="bx b1"></span><span class="bx b2"></span><span class="bx b3"></span><span class="bx b4"></span>
      <form class="lx-form" data-form="kitGen" onsubmit="return false">
        <div class="lx-form-h"><span class="lx-dot big" id="kHeadLogo"></span><div style="min-width:0;flex:1"><b id="kHeadName">Brand Kit</b><span class="lx-k">Simulasi eksplorasi AI · gratis</span></div><div class="lx-form-p"><b>Rp0</b><span class="lx-k">tanpa akun</span></div></div>
        <div class="lx-grid2"><label class="lx-field"><span>${ic('store', 13)}</span><input id="kName" type="text" maxlength="28" value="${esc(S.land.kit.name)}" data-in="kName" placeholder="Nama usaha" aria-label="Nama usaha"></label><label class="lx-field"><span>${ic('pin', 13)}</span><input id="kCity" type="text" maxlength="24" value="${esc(S.land.kit.city)}" data-in="kCity" placeholder="Kota" aria-label="Kota"></label></div>
        <div class="lx-grid2"><label class="lx-field"><span>${ic('tag', 13)}</span><select id="kBizSel" data-ch="kBizSel" aria-label="Jenis usaha">${BIZ.map(b => `<option ${S.land.kit.biz === b ? 'selected' : ''}>${b}</option>`).join('')}</select></label><label class="lx-field check"><input type="checkbox" data-act="kHalal" ${S.land.kit.halal ? 'checked' : ''}><span>Sertifikat halal sudah terbit</span></label></div>
        <div class="lx-vals"><span class="lx-k">Nilai merek (1–3)</span><div class="chips" id="kVals"></div></div>
        <div class="lx-form-btns"><button type="button" class="lx-btn grad" data-act="kReroll">${ic('spark', 15)} Eksplorasi ulang</button><button type="button" class="lx-btn dark" data-act="kOrder">Pesan dengan brief ini ${ic('arrow', 15)}</button></div>
      </form></div>
    <div class="lx-kitout rv"><div class="lx-concepts" id="kConcepts"></div><div id="kOut"></div></div></section>

  <section class="lx-sec lx-lines" id="syariah-check"><div class="lx-head rv">${badge('Prototipe · Maknai Syariah Check', 'shield')}<h2>Karya diserahkan setelah <em>8 / 8</em> lolos</h2><p>Periksa rancangan label di tengah. Butir yang bermasalah bisa langsung diperbaiki.</p></div>
    <div class="lx-orbit rv"><div class="lx-orb-col" id="chkOrbL"></div>
      <div class="lx-orb-center"><div class="lx-orb-card"><div class="lx-orb-mock" id="chkMock2"></div><div class="lx-orb-score" id="chkScore"></div><div class="lx-orb-detail" id="chkDetail"></div><div class="lx-orb-act" id="chkAct"></div></div></div>
      <div class="lx-orb-col r" id="chkOrbR"></div></div></section>

  <section class="lx-sec lx-split" id="alur"><div class="lx-split-l rv">${badge('Maknai · alur produksi', 'kanban')}<h2>Dari brief ke Maknai Kit<br>dalam <em>3–10 hari</em></h2><p>AI hanya dipakai di langkah 3. Sebelum dan sesudahnya, selalu ada keputusan manusia.</p>
      <ol class="lx-steps">${STEPS.map((s, i) => `<li class="${s.gold ? 'gold' : ''}"><span>${i + 1}</span><b>${s.t}</b><em>${s.d}</em></li>`).join('')}</ol>
      <div class="lx-pills">${[['shield', 'Akad ijarah'], ['wallet', 'DP 50%'], ['spark', '2× revisi'], ['check', 'Syariah Check']].map(([i, t]) => `<span><i>${ic(i, 12)}</i>${t}</span>`).join('')}</div></div>
    <div class="lx-split-r rv"><div class="lx-paycard"><div class="row start" style="gap:10px"><span class="lx-dot">${ic('brief', 13)}</span><div><span class="lx-k">Pesanan</span><b>Paket Brand</b></div></div><b class="lx-big" style="margin:14px 0 2px">Rp900.000</b><span class="lx-chip ok sm">Tanpa bunga</span>
        <span class="lx-k" style="display:block;margin:16px 0 8px">Maknai Kit</span><div class="lx-kitcard"><span class="lx-pat" aria-hidden="true"></span><div class="row"><span class="kc-logo">${LOGO(30)}</span><span class="kc-wave">${ic('spark', 18)}</span></div><b class="kc-no">AL-HIKMAH · 7 HARI KERJA</b><div class="row"><span>Unit usaha pesantren</span><span>2026</span></div></div></div>
      <div class="lx-okcard"><span class="lx-dot">${ic('check', 13)}</span><b>Uang muka Rp450.000 diterima</b></div></div></section>

  <section class="lx-sec" id="paket"><div class="lx-head rv">${badge('Paket & harga', 'tag')}<h2>Mulai dari <em>Rp350.000</em></h2><p>Semua paket termasuk 2× revisi dan Maknai Syariah Check.</p></div>
    <div class="lx-prices">${PKG.map(p => `<div class="lx-pc ${p.hot ? 'hot' : ''} rv">${p.hot ? '<span class="lx-chip gold sm">Paling dipilih</span>' : ''}<span class="lx-dot ${p.hot ? 'light' : ''}">${ic(p.id === 'starter' ? 'tag' : p.id === 'brand' ? 'layers' : 'star', 14)}</span><h3>${p.name}</h3><b class="lx-big">${rp(p.price)}</b><span class="lx-k">${p.days} hari kerja</span><ul>${(p.short || p.feat.slice(0, 3)).map(t => `<li>${ic('check', 13)}${t}</li>`).join('')}</ul><button class="lx-btn ${p.hot ? 'gold' : 'dark'}" data-act="startOrder" data-pkg="${p.id}">Pilih ${p.name}</button></div>`).join('')}</div>
    <div class="lx-extras rv">${EXTRA.map(e => `<div><span class="lx-k">${e.name}</span><b>${rp(e.price)}<small> ${e.unit}</small></b></div>`).join('')}<div><span class="lx-k">Diskon rujukan</span><b>${REF_DISC}%</b></div></div></section>

  <section class="lx-sec lx-two-col" id="faq"><div class="lx-head left rv">${badge('Tanya jawab', 'book')}<h2>Yang sering <em>ditanyakan</em></h2><p><button class="lx-link dark" data-act="chatToggle">Tanya asisten Maknai →</button></p></div>
    <div class="lx-faq rv">${[0, 2, 3, 4].map(i => FAQ[i]).map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></section>

  <section class="lx-sec" id="tim"><div class="lx-head rv">${badge('Tim INVICTA · UIN Malang', 'user')}<h2>Orang-orang di balik <em>Maknai</em></h2></div>
    <div class="lx-team">${TEAM.map(m => `<div class="lx-member rv"><span class="lx-arch-av ${avc(m.n)}"><span>${initials(m.n)}</span></span><b>${m.n}</b><span class="lx-k">${m.r}</span></div>`).join('')}</div>
    <p class="lx-foot-note rv">Penasihat: Fery Dwi Riyanto & penasihat syariah</p></section>

  <section class="lx-cta rv">${glass()}<span class="lx-ar-wm" aria-hidden="true" lang="ar">مَعْنَى</span>${orn()}<h2>Mulai beri makna<br>dalam 3 menit</h2>
    <form class="lx-pill-in" data-form="ctaStart"><input type="text" id="ctaName" maxlength="28" placeholder="Nama usahamu" aria-label="Nama usaha"><button type="submit"><i>${ic('play', 12)}</i>Mulai pesan</button></form></section>

  <footer class="lx-footer"><div class="lx-foot-grid">
    <div><p>Maknai membantu pesantren dan UMKM halal membangun brand yang bermakna: cepat dengan AI, rapi oleh desainer, selaras nilai syariah.</p><a class="lx-logo dark" href="#beranda" data-act="toTop">${LOGO(40)}<span>Maknai</span></a></div>
    <div><h4>Layanan</h4>${[['cara-kerja', 'Cara kerja'], ['coba-kit', 'Brand Kit'], ['syariah-check', 'Syariah Check'], ['paket', 'Paket']].map(([h, l]) => `<a href="#${h}" data-act="jump" data-to="${h}">${l}</a>`).join('')}</div>
    <div><h4>Akun</h4><button data-act="startOrder">Pesan sekarang</button><button data-act="start">Masuk portal</button><button data-act="demoKlien">Portal klien (demo)</button><button data-act="demoTim">Ruang tim (demo)</button></div>
    <div><h4>Hubungi</h4><div class="lx-social"><button data-act="waOpen" data-text="Assalamu'alaikum Maknai, saya ingin konsultasi branding." aria-label="WhatsApp">${ic('send', 16)}</button><button data-act="chatToggle" aria-label="Chat asisten">${ic('bot', 16)}</button></div><span class="lx-k" style="margin-top:10px;display:block">Malang, Jawa Timur</span></div>
  </div><div class="lx-bottom"><span>Maknai · Tim INVICTA, UIN Maulana Malik Ibrahim Malang</span><span>© 2026 · Prototipe NBPC 2026</span></div></footer>
  </div></div>`;
}

/* ---------- peta posisi (dipakai di Ruang Tim) ---------- */
export function posMap() {
  const W = 520, H = 360, P = 44, X = v => P + (W - 2 * P) * v / 100, Y = v => H - P - (H - 2 * P) * v / 100;
  return `<svg viewBox="0 0 ${W} ${H}" class="chart posmap" role="img" aria-label="Peta posisi Maknai terhadap pesaing"><rect x="${P}" y="${P}" width="${W - 2 * P}" height="${H - 2 * P}" fill="var(--surface-2)" rx="12"/><line x1="${W / 2}" y1="${P}" x2="${W / 2}" y2="${H - P}" class="gl"/><line x1="${P}" y1="${H / 2}" x2="${W - P}" y2="${H / 2}" class="gl"/>
  <text x="${W / 2}" y="${H - 12}" text-anchor="middle" class="ax">Harga →</text><text x="14" y="${H / 2}" class="ax" transform="rotate(-90 14 ${H / 2})" text-anchor="middle">Nilai syariah & makna merek →</text>
  ${COMPETITORS.map(c => `<g><circle cx="${X(c.x)}" cy="${Y(c.y)}" r="${c.me ? 16 : 10}" fill="${c.me ? 'var(--emerald)' : 'var(--ink-3)'}" opacity="${c.me ? 1 : .55}"/>${c.me ? `<text x="${X(c.x)}" y="${Y(c.y) + 5}" text-anchor="middle" font-family="Fraunces" font-weight="700" font-size="14" fill="var(--saffron)">M</text>` : ''}<text x="${c.x > 70 ? X(c.x) - 14 : X(c.x) + (c.me ? 22 : 14)}" y="${Y(c.y) + 4}" text-anchor="${c.x > 70 ? 'end' : 'start'}" font-size="12.5" font-weight="${c.me ? 700 : 500}" fill="var(--ink)">${c.n}</text></g>`).join('')}</svg>`;
}

/* ---------- cara kerja: tab + kartu bertumpuk ---------- */
function drawLapis() {
  const a = S.land.lapis ?? 1, n = LAPIS.length, order = [(a + n - 1) % n, a, (a + 1) % n];
  slot('lapisTabs', `<span class="lx-tline"></span>${LAPIS.map((l, i) => `<button role="tab" aria-selected="${i === a}" class="${i === a ? 'on' : ''}" data-act="lapis" data-i="${i}"><i>${ic(l.ic, 11)}</i>${l.tab}</button>`).join('')}<span class="lx-tline"></span>`);
  slot('lapisCards', order.map((i, pos) => { const l = LAPIS[i]; return `<button class="lx-sc ${pos === 1 ? 'on' : pos === 0 ? 'prev' : 'next'}" data-act="lapis" data-i="${i}" ${pos === 1 ? 'aria-current="true"' : ''}><div class="lx-sc-top"><span class="lx-dot ${pos === 1 ? 'light' : ''}">${ic(l.ic, 15)}</span><h3>${l.t}</h3><p>${l.d}</p></div><div class="lx-sc-foot"><span>${ic('kanban', 12)} <b>${l.m}</b> <small>${l.s}</small></span><span class="lx-more"><i>${ic('arrow', 11)}</i>Detail</span></div></button>`; }).join(''));
}
A.lapis = el => { const i = +el.dataset.i; if (S.land.lapis === i) return A.jump({ dataset: { to: i === 2 ? 'coba-kit' : i === 1 ? 'syariah-check' : 'alur' } }); S.land.lapis = i; drawLapis(); };

/* ---------- generator ---------- */
const kit = () => buildKit(S.land.kit);
function drawKit(onlyOut) {
  const k = S.land.kit;
  if (!onlyOut) slot('kVals', VALUES.map(v => chipBtn(v, 'kVal', `data-v="${v}"`, k.values.includes(v))).join(''));
  const kk = kit();
  slot('kHeadLogo', logoSVG(kk, kk.shape, 40)); slot('kHeadName', 'Brand Kit · ' + esc(kk.name));
  slot('kConcepts', SHAPES.map(s => `<button class="concept ${kk.shape === s ? 'on' : ''}" data-act="kShape" data-v="${s}" aria-pressed="${kk.shape === s}">${logoSVG(kk, s, 80)}<span>${s[0].toUpperCase() + s.slice(1)}</span></button>`).join(''));
  slot('kOut', kitHTML(kk, { draft: true, id: 'landKit', compact: !S.land.kitFull }));
}
const setName = v => { v = String(v || '').trim().slice(0, 28); if (v) { S.land.kit.name = v; const i = $('#kName'); if (i) i.value = v; drawKit(true); } return v; };
I.kName = el => { S.land.kit.name = el.value.trim() || 'Usahaku'; drawKit(true); };
I.kCity = el => { S.land.kit.city = el.value; drawKit(true); };
C.kBizSel = el => { S.land.kit.biz = el.value; S.land.kit.seed = 0; drawKit(true); };
A.kVal = el => { const v = el.dataset.v, a = S.land.kit.values, i = a.indexOf(v); if (i >= 0) { if (a.length === 1) return toast('Pilih minimal satu nilai', true); a.splice(i, 1); } else { if (a.length >= 3) a.shift(); a.push(v); } drawKit(); };
A.kShape = el => { S.land.kit.shape = el.dataset.v; drawKit(true); };
A.kHalal = el => { S.land.kit.halal = el.checked; drawKit(true); };
A.kFull = () => { S.land.kitFull = true; drawKit(true); };
A.kReroll = () => { S.land.kit.seed = (S.land.kit.seed || 0) + 1; drawKit(true); toast('Eksplorasi baru: palet & tipografi diganti'); };
F.heroStart = f => { const v = setName(f.querySelector('input').value); A.jump({ dataset: { to: 'coba-kit' } }); if (v) toast('Brand Kit untuk ' + v + ' siap dicoba'); };
F.ctaStart = f => { const v = setName(f.querySelector('input').value); if (v) A.kOrder(); else A.startOrder(); };

/* ---------- reveal / scrollspy ---------- */
let io, spy;
function observe() {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { $$('.rv').forEach(e => e.classList.add('in')); return; }
  io && io.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .06, rootMargin: '0px 0px -30px 0px' });
  $$('.rv').forEach((e, i) => { e.style.transitionDelay = (i % 3) * 60 + 'ms'; io.observe(e); });
  spy && spy.disconnect();
  spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$('.lx-links a').forEach(a => a.classList.toggle('on', a.dataset.to === e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  NAV.forEach(([h]) => { const s = document.getElementById(h); if (s) spy.observe(s); });
}

export function mountLanding() {
  slot('landing', landingHTML());
  drawLapis(); drawKit(); drawCheck(); observe();
}
export function onLandingShow() { }

A.jump = el => {
  const id = el.dataset.to, go = () => { const s = document.getElementById(id); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const m = $('#mnav'); if (m) m.hidden = true;
  if (S.screen !== 'landing') { A.toLanding(); setTimeout(go, 60); } else go();
  try { history.replaceState(null, '', '#' + id); } catch (e) { }
};
A.mnav = el => { const m = $('#mnav'); m.hidden = !m.hidden; el.setAttribute('aria-expanded', String(!m.hidden)); };
A.waOpen = el => { const t = el.dataset.text || "Assalamu'alaikum Maknai"; window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener'); };
