/* Landing Maknai: hero beranimasi, generator Brand Kit, demo Syariah Check, alur, paket, pesaing. */
import { S, A, I, C, F, $, $$, esc, rp, num, slot, ic, brand, themeBtn, chipBtn, seg, openModal, modalHead, toast, initials, avc } from './core.js';
import { PKG, EXTRA, STEPS, PROBLEMS, DIFF, COMPETITORS, TEAM, FAQ, BIZ, VALUES, SHAPES, REF_DISC } from './data.js';
import { buildKit, logoSVG, labelSVG, kitHTML } from './kit.js';
import { checkSectionHTML, drawCheck } from './check.js';

const NAV = [['layanan', 'Layanan'], ['coba-kit', 'Coba Brand Kit'], ['syariah-check', 'Syariah Check'], ['alur', 'Alur'], ['paket', 'Paket'], ['tim', 'Tim']];
const HERO = [
  { name: 'Al-Hikmah', biz: 'Air minum & minuman', values: ['Segar', 'Amanah'], shape: 'lengkung', who: 'Unit usaha pesantren · Batu' },
  { name: 'Sambal Bu Rini', biz: 'Kuliner & camilan', values: ['Hangat', 'Tradisional'], shape: 'kotak', who: 'UMKM kuliner · Malang' },
  { name: 'Nabila Hijab', biz: 'Fesyen muslim', values: ['Elegan', 'Modern'], shape: 'lingkar', who: 'Fesyen muslim · Lowokwaru' },
  { name: 'Madu Barokah', biz: 'Madu & herbal', values: ['Amanah', 'Hangat'], shape: 'bintang', who: 'Koperasi pondok · Dampit' }
];
export const pkgCard = (p, act = 'startOrder') => `<div class="price-card ${p.hot ? 'hot' : ''} rv"><span class="lbl">Paket ${p.name}</span><div class="price">${rp(p.price)}</div><p class="note">${p.days} hari kerja</p><ul class="ticks dark">${(p.short || p.feat.slice(0, 3)).map(t => `<li>${ic('check', 16)}${t}</li>`).join('')}</ul><button class="btn ${p.hot ? 'btn-p' : 'btn-line'}" style="margin-top:auto" data-act="${act}" data-pkg="${p.id}">Pilih ${p.name}</button></div>`;

export function landingHTML() {
  const marq = ['Brief & discovery', 'Konsep makna', 'Eksplorasi AI', 'Kurasi desainer', 'Syariah Check', 'Presentasi', 'Maknai Kit', 'Workshop santri'];
  return `
  <header class="topbar" id="topbar"><div class="wrap">
    <a class="brand" href="#beranda" data-act="toTop" aria-label="Maknai beranda">${brand(32)}</a>
    <nav class="navlinks" aria-label="Navigasi utama">${NAV.map(([h, l]) => `<a href="#${h}" data-act="jump" data-to="${h}">${l}</a>`).join('')}</nav>
    <div class="nav-cta">${themeBtn()}
      <span id="navAuth" class="row nowrap" style="gap:8px"><button class="btn btn-line btn-sm" data-act="start">Masuk</button><button class="btn btn-p btn-sm hide-m" data-act="startOrder">Pesan sekarang</button></span>
      <span id="navApp" hidden><button class="btn btn-p btn-sm" data-act="openDash">${ic('home', 16)} Portal saya</button></span>
      <button class="btn btn-ghost btn-icon burger" data-act="mnav" aria-label="Buka menu" aria-expanded="false">${ic('menu', 20)}</button></div>
  </div></header>
  <nav class="mnav" id="mnav" hidden aria-label="Menu seluler">${NAV.map(([h, l]) => `<a href="#${h}" data-act="jump" data-to="${h}">${l}</a>`).join('')}<div class="row" style="padding-top:12px"><button class="btn btn-line" data-act="start">Masuk</button><button class="btn btn-p" data-act="startOrder">Pesan sekarang</button></div></nav>

  <main id="main">
  <section class="hero" id="beranda"><div class="wrap hero-grid">
    <div>
      <span class="eyebrow">Studio branding AI · Kurasi syariah</span>
      <h1>Beri <em>makna</em><br>pada setiap <span class="u">brand.</span></h1>
      <p class="lead">Logo, kemasan, dan konten untuk pesantren & UMKM halal — cepat dengan AI, dirapikan desainer, diperiksa nilai syariahnya.</p>
      <div class="hero-cta"><button class="btn btn-p btn-lg" data-act="startOrder">${ic('brief', 18)} Pesan sekarang</button><button class="btn btn-line btn-lg" data-act="jump" data-to="coba-kit">${ic('spark', 18)} Coba buat Brand Kit</button></div>
      <p class="note" style="margin-top:14px">Lihat dulu: <button class="linkish" data-act="demoKlien">portal klien</button> · <button class="linkish" data-act="demoTim">ruang tim (juri)</button></p>
    </div>
    <div class="hero-vis"><div class="hero-arch arch"><div class="hd"><span class="dot">${ic('spark', 18)}</span><div><b>Studio Maknai</b><small id="heroWho">sedang meracik identitas</small></div></div><div id="heroStage" class="hero-stage"></div></div>
      <div class="float-card f1"><span class="fi">${ic('shield', 18)}</span><div><span class="note">Syariah Check</span><b>8 / 8 lolos</b></div></div>
      <div class="float-card f2"><span class="fi">${ic('calc', 18)}</span><div><span class="note">Sayembara mulai Rp2,5 jt</span><b>Maknai Rp350 rb</b></div></div></div>
  </div>
  <div class="wrap"><div class="stats rv">
    <div><b>Rp350 rb</b><span>harga mulai — sayembara desain mulai Rp2,5 jt</span></div>
    <div><b>3–10</b><span>hari kerja, sudah termasuk 2× revisi</span></div>
    <div><b data-count="8">8</b><span>butir Syariah Check di setiap karya</span></div>
    <div><b>50:50</b><span>bayar di muka & saat serah terima</span></div>
  </div></div></section>

  <div class="marquee" aria-hidden="true"><div class="track">${[...marq, ...marq].map(m => `<span>${m}</span>`).join('')}</div></div>

  <section class="sec" id="layanan"><div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Cara kerja</span><h2>AI untuk cepat. Manusia untuk <em>makna</em>.</h2></div>
    <div class="bento">
      <article class="feat dark w2 rv"><span class="num">Lapis 01</span><h3>Eksplorasi AI</h3><p>Puluhan arah visual dalam hitungan jam — biaya dan waktu turun.</p><div class="demo row start" style="gap:8px">${SHAPES.map(s => `<span class="mini-logo">${logoSVG(buildKit({ name: 'Maknai', biz: 'Produk santri', values: ['Amanah'], shape: s }), s, 46)}</span>`).join('')}</div></article>
      <article class="feat w2 rv"><span class="num">Lapis 02</span><h3>Kurasi desainer + Syariah Check</h3><p>Desainer menyempurnakan, lalu 8 butir syariah & etika AI diperiksa.</p><div class="demo"><div class="mini-escrow"><div class="done">Mutu visual<b>✓</b></div><div class="done" style="background:var(--saffron-soft);color:var(--warn)">Syariah<b>8/8</b></div></div></div></article>
      <article class="feat w2 em rv"><span class="num">Lapis 03</span><h3>Maknai Kit</h3><p>Panduan merek & berkas siap sunting — kamu bisa kelola sendiri.</p><div class="demo chips"><span class="pill ink">Palet</span><span class="pill">Tipografi</span><span class="pill">Template</span><span class="pill">Gaya bahasa</span></div></article>
    </div>
  </div></section>

  <section class="sec" id="coba-kit"><div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Prototipe · Brand Kit</span><h2>Coba racik <em>identitas</em> usahamu.</h2><p class="lead">Isi nama, jenis usaha, dan nilai merek — lihat konsep awalnya.</p></div>
    <div class="gen rv">
      <form class="gen-in card" data-form="kitGen" onsubmit="return false">
        <div class="field"><label for="kName">Nama usaha</label><input id="kName" type="text" maxlength="28" value="${esc(S.land.kit.name)}" data-in="kName" placeholder="Contoh: Al-Hikmah"></div>
        <div class="field"><span class="lbl2">Jenis usaha</span><div class="chips" id="kBiz"></div></div>
        <div class="field"><span class="lbl2">Nilai merek <span class="note">pilih 1–3</span></span><div class="chips" id="kVals"></div></div>
        <div class="grid g2" style="gap:0 12px"><div class="field"><label for="kCity">Kota</label><input id="kCity" type="text" maxlength="24" value="${esc(S.land.kit.city)}" data-in="kCity"></div><div class="field"><label class="lbl2">Sertifikat halal</label><label class="check" style="min-height:44px;align-items:center"><input type="checkbox" data-act="kHalal" ${S.land.kit.halal ? 'checked' : ''}><span>Sudah terbit</span></label></div></div>
        <div class="field"><label for="kStory">Cerita singkat <span class="note">opsional</span></label><textarea id="kStory" maxlength="200" data-in="kStory" placeholder="Contoh: resep sambal warisan ibu sejak 1998.">${esc(S.land.kit.story)}</textarea></div>
        <div class="row"><button type="button" class="btn btn-line" data-act="kReroll">${ic('spark', 16)} Eksplorasi ulang</button><button type="button" class="btn btn-p" data-act="kOrder">Pesan dengan brief ini ${ic('arrow', 16)}</button></div>
      </form>
      <div class="gen-out"><div class="card"><div class="card-head"><div><h2>Pilih konsep logo</h2><p class="note">Empat arah bentuk dari eksplorasi awal.</p></div><span class="pill sf">${ic('spark', 13)} simulasi AI</span></div><div class="concepts" id="kConcepts"></div></div><div id="kOut"></div></div>
    </div>
  </div></section>

  <section class="sec" id="syariah-check"><div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Prototipe · Maknai Syariah Check</span><h2>Delapan pertanyaan sebelum <em>karya</em> diserahkan.</h2><p class="lead">Periksa label contoh ini sampai 8/8 lolos.</p></div>
    <div class="rv">${checkSectionHTML()}</div>
  </div></section>

  <section class="sec" id="alur"><div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Alur produksi · paket Brand & Premium</span><h2>Tujuh langkah, <em>tiga</em> gerbang mutu.</h2><p class="lead">AI hanya di langkah 3. Sisanya keputusan manusia.</p></div>
    <div class="steps7 rv">${STEPS.map((s, i) => `<div class="s7 ${s.gold ? 'gold' : ''}"><span class="s7n">${i + 1}</span><span class="s7d">${s.d}</span><h3>${s.t}</h3>${[1, 3, 4].includes(i) ? `<span class="pill ${s.gold ? 'sf' : 'em'} gate">${ic('shield', 12)} Gerbang mutu</span>` : ''}</div>`).join('')}</div>
    <div class="cta-band rv"><div><h3>Akad ijarah, tanpa bunga</h3><p class="muted">Bayar 50% di awal, 50% saat serah terima.</p></div><button class="btn btn-ink btn-lg" data-act="startOrder">${ic('brief', 18)} Mulai pesan</button></div>
  </div></section>

  <section class="sec" id="paket"><div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Paket & harga</span><h2>Mulai dari <em>Rp350.000</em>.</h2><p class="lead">Semua paket termasuk 2× revisi dan Syariah Check.</p></div>
    <div class="grid g3" style="align-items:stretch">${PKG.map(p => pkgCard(p)).join('')}</div>
    <div class="extras-line rv">${EXTRA.map(e => `<div><b>${e.name}</b><span class="mono">${rp(e.price)}<small> ${e.unit}</small></span></div>`).join('')}<div><b>Diskon rujukan</b><span class="mono">${REF_DISC}%</span></div></div>
  </div></section>

  <section class="sec" id="faq"><div class="wrap faq-grid">
    <div class="sec-head rv"><span class="eyebrow">Tanya jawab</span><h2>Yang sering <em>ditanyakan</em>.</h2><p class="lead"><button class="linkish" data-act="chatToggle">Tanya asisten Maknai</button></p></div>
    <div class="faq rv">${[0, 2, 3, 4].map(i => FAQ[i]).map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  </div></section>

  <section class="sec" id="tim"><div class="wrap">
    <div class="sec-head center rv"><span class="eyebrow">Tim INVICTA</span><h2>Orang-orang di balik <em>Maknai</em>.</h2><p class="lead" style="margin:0 auto">UIN Maulana Malik Ibrahim Malang</p></div>
    <div class="team">${TEAM.map(m => `<div class="member rv"><div class="arch mono-av ${avc(m.n)}"><span>${initials(m.n)}</span></div><b>${m.n}</b><span>${m.r}</span></div>`).join('')}</div>
    <p class="note rv" style="text-align:center;margin-top:20px">Penasihat: Fery Dwi Riyanto & penasihat syariah</p>
  </div></section>

  <div class="wrap"><section class="final rv">
    <span class="eyebrow" style="color:var(--saffron)">Bismillah, mulai hari ini</span>
    <h2 style="margin-top:14px">Siap memberi <em>makna</em>?</h2>
    <p>Isi brief 3 menit, sisanya kami kerjakan.</p>
    <div class="row" style="justify-content:center"><button class="btn btn-s btn-lg" data-act="startOrder">Pesan sekarang</button><button class="btn btn-line btn-lg" data-act="waOpen" data-text="Assalamu'alaikum Maknai, saya ingin konsultasi branding untuk usaha saya.">${ic('send', 18)} Konsultasi via WhatsApp</button></div>
  </section></div>
  </main>

  <footer class="foot"><div class="wrap">
    <div class="foot-grid">
      <div><a class="brand" href="#beranda" data-act="toTop">${brand(30)}</a><p class="muted" style="margin-top:14px;max-width:340px">Jasa branding berbasis AI dengan kurasi syariah untuk pesantren dan UMKM halal. Malang, Jawa Timur.</p></div>
      <div><h4>Layanan</h4><ul>${[['layanan', 'Tiga lapis layanan'], ['coba-kit', 'Coba Brand Kit'], ['syariah-check', 'Syariah Check'], ['paket', 'Paket & harga']].map(([h, l]) => `<li><a href="#${h}" data-act="jump" data-to="${h}">${l}</a></li>`).join('')}</ul></div>
      <div><h4>Akun</h4><ul><li><button class="fl" data-act="startOrder">Pesan sekarang</button></li><li><button class="fl" data-act="start">Masuk portal</button></li><li><button class="fl" data-act="demoKlien">Portal klien (demo)</button></li><li><button class="fl" data-act="demoTim">Ruang tim (demo)</button></li></ul></div>
      <div><h4>Tentang</h4><ul><li><a href="#tim" data-act="jump" data-to="tim">Tim INVICTA</a></li><li><a href="#faq" data-act="jump" data-to="faq">Tanya jawab</a></li></ul></div>
    </div>
    <div class="foot-bottom"><span>© 2026 Maknai · Tim INVICTA, UIN Maulana Malik Ibrahim Malang</span><span>Prototipe NBPC 2026 — data contoh, tanpa transaksi nyata.</span></div>
  </div></footer>`;
}

/* ---------- peta posisi ---------- */
export function posMap() {
  const W = 520, H = 360, P = 44, X = v => P + (W - 2 * P) * v / 100, Y = v => H - P - (H - 2 * P) * v / 100;
  return `<svg viewBox="0 0 ${W} ${H}" class="chart posmap" role="img" aria-label="Peta posisi Maknai terhadap pesaing"><rect x="${P}" y="${P}" width="${W - 2 * P}" height="${H - 2 * P}" fill="var(--surface-2)" rx="12"/><line x1="${W / 2}" y1="${P}" x2="${W / 2}" y2="${H - P}" class="gl"/><line x1="${P}" y1="${H / 2}" x2="${W - P}" y2="${H / 2}" class="gl"/>
  <text x="${W / 2}" y="${H - 12}" text-anchor="middle" class="ax">Harga →</text><text x="14" y="${H / 2}" class="ax" transform="rotate(-90 14 ${H / 2})" text-anchor="middle">Nilai syariah & makna merek →</text>
  ${COMPETITORS.map(c => `<g><circle cx="${X(c.x)}" cy="${Y(c.y)}" r="${c.me ? 16 : 10}" fill="${c.me ? 'var(--emerald)' : 'var(--ink-3)'}" opacity="${c.me ? 1 : .55}"/>${c.me ? `<text x="${X(c.x)}" y="${Y(c.y) + 5}" text-anchor="middle" font-family="Fraunces" font-weight="700" font-size="14" fill="var(--saffron)">M</text>` : ''}<text x="${c.x > 70 ? X(c.x) - 14 : X(c.x) + (c.me ? 22 : 14)}" y="${Y(c.y) + 4}" text-anchor="${c.x > 70 ? 'end' : 'start'}" font-size="12.5" font-weight="${c.me ? 700 : 500}" fill="var(--ink)">${c.n}</text></g>`).join('')}</svg>`;
}

/* ---------- generator ---------- */
const kit = () => buildKit(S.land.kit);
function drawKit(onlyOut) {
  const k = S.land.kit;
  if (!onlyOut) {
    slot('kBiz', BIZ.map(b => chipBtn(b, 'kBiz', `data-v="${b}"`, k.biz === b)).join(''));
    slot('kVals', VALUES.map(v => chipBtn(v, 'kVal', `data-v="${v}"`, k.values.includes(v))).join(''));
  }
  const kk = kit();
  slot('kConcepts', SHAPES.map(s => `<button class="concept ${kk.shape === s ? 'on' : ''}" data-act="kShape" data-v="${s}" aria-pressed="${kk.shape === s}">${logoSVG(kk, s, 92)}<span>${s[0].toUpperCase() + s.slice(1)}</span></button>`).join(''));
  slot('kOut', kitHTML(kk, { draft: true, id: 'landKit', compact: !S.land.kitFull }));
}
I.kName = el => { S.land.kit.name = el.value.trim() || 'Usahaku'; drawKit(true); };
I.kCity = el => { S.land.kit.city = el.value; drawKit(true); };
I.kStory = el => { S.land.kit.story = el.value; drawKit(true); };
A.kBiz = el => { S.land.kit.biz = el.dataset.v; S.land.kit.seed = 0; drawKit(); };
A.kVal = el => { const v = el.dataset.v, a = S.land.kit.values, i = a.indexOf(v); if (i >= 0) { if (a.length === 1) return toast('Pilih minimal satu nilai', true); a.splice(i, 1); } else { if (a.length >= 3) a.shift(); a.push(v); } drawKit(); };
A.kShape = el => { S.land.kit.shape = el.dataset.v; drawKit(true); };
A.kHalal = el => { S.land.kit.halal = el.checked; drawKit(true); };
A.kFull = () => { S.land.kitFull = true; drawKit(true); };
A.kReroll = () => { S.land.kit.seed = (S.land.kit.seed || 0) + 1; drawKit(true); toast('Eksplorasi baru: palet & tipografi diganti'); };

/* ---------- hero ---------- */
let heroI = 0, heroT = 0;
function drawHero() {
  const h = HERO[heroI % HERO.length], k = buildKit({ ...h, seed: 0 }), st = $('#heroStage'); if (!st) return;
  slot('heroWho', esc(h.who));
  st.classList.remove('in'); void st.offsetWidth;
  st.innerHTML = `<div class="hs-top"><div class="hs-logo" style="background:${k.pal.c[3]}">${logoSVG(k, k.shape, 70)}</div><div style="min-width:0"><b style="font-family:'${k.type.h}',serif;font-size:22px">${esc(k.name)}</b><div class="hs-pal">${k.pal.c.map(c => `<i style="background:${c}"></i>`).join('')}</div><small>${k.pal.n} · ${k.type.n}</small></div></div>
  <div class="hs-mock">${labelSVG(k)}</div>
  <div class="hs-steps"><span class="on">${ic('spark', 13)} AI</span><span class="on">${ic('user', 13)} Desainer</span><span class="on gold">${ic('shield', 13)} Syariah 8/8</span><span>${ic('layers', 13)} Kit</span></div>`;
  st.classList.add('in');
}
function playHero() { clearInterval(heroT); drawHero(); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) heroT = setInterval(() => { if (S.screen === 'landing' && !document.hidden) { heroI++; drawHero(); } }, 4200); }

/* ---------- reveal / scrollspy ---------- */
let io, spy;
function observe() {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { $$('.rv').forEach(e => e.classList.add('in')); return; }
  io && io.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); e.target.querySelectorAll('[data-count]').forEach(countUp); } }), { threshold: .08, rootMargin: '0px 0px -30px 0px' });
  $$('.rv').forEach((e, i) => { e.style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(e); });
  spy && spy.disconnect();
  spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$('.navlinks a').forEach(a => a.classList.toggle('on', a.dataset.to === e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  NAV.forEach(([h]) => { const s = document.getElementById(h); if (s) spy.observe(s); });
}
function countUp(el) { const to = +el.dataset.count, t0 = performance.now(); const step = t => { const k = Math.min(1, (t - t0) / 900); el.textContent = num(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }

export function mountLanding() {
  slot('landing', landingHTML());
  drawKit(); drawCheck(); observe(); playHero();
  const tb = $('#topbar'); const onS = () => tb && tb.classList.toggle('scrolled', scrollY > 8); addEventListener('scroll', onS, { passive: true }); onS();
}
export function onLandingShow() { playHero(); }

A.jump = el => {
  const id = el.dataset.to, go = () => { const s = document.getElementById(id); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const m = $('#mnav'); if (m) m.hidden = true;
  if (S.screen !== 'landing') { A.toLanding(); setTimeout(go, 60); } else go();
  try { history.replaceState(null, '', '#' + id); } catch (e) { }
};
A.mnav = el => { const m = $('#mnav'); m.hidden = !m.hidden; el.setAttribute('aria-expanded', String(!m.hidden)); };
A.waOpen = el => { const t = el.dataset.text || "Assalamu'alaikum Maknai"; window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener'); };
