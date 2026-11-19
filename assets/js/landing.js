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
export const pkgCard = (p, act = 'startOrder') => `<div class="price-card ${p.hot ? 'hot' : ''} rv"><span class="lbl">Paket ${p.name}</span><div class="price">${rp(p.price)}</div><p class="note">${p.days} hari kerja · 2× revisi</p><p class="muted" style="font-size:14px">${p.note}</p><ul class="ticks dark">${p.feat.map(t => `<li>${ic('check', 16)}${t}</li>`).join('')}</ul><button class="btn ${p.hot ? 'btn-p' : 'btn-line'}" style="margin-top:auto" data-act="${act}" data-pkg="${p.id}">Pilih ${p.name}</button></div>`;

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
      <p class="lead">Maknai membantu unit usaha pesantren dan UMKM halal membangun identitas merek lengkap — logo, kemasan, konten, dan cerita — dengan kecepatan AI, sentuhan desainer, dan pemeriksaan nilai syariah.</p>
      <div class="hero-cta"><button class="btn btn-p btn-lg" data-act="startOrder">${ic('brief', 18)} Pesan sekarang</button><button class="btn btn-line btn-lg" data-act="jump" data-to="coba-kit">${ic('spark', 18)} Coba buat Brand Kit</button></div>
      <p class="note" style="margin-top:14px">Ingin melihat dulu? <button class="linkish" data-act="demoKlien">Portal klien (demo)</button> · <button class="linkish" data-act="demoTim">Ruang tim & keuangan (demo juri)</button></p>
      <div class="trust"><span>${ic('tag', 16)} Mulai Rp350.000</span><span>${ic('calc', 16)} 3–10 hari kerja</span><span>${ic('shield', 16)} 8 butir Syariah Check</span></div>
    </div>
    <div class="hero-vis"><div class="hero-arch arch"><div class="hd"><span class="dot">${ic('spark', 18)}</span><div><b>Studio Maknai</b><small id="heroWho">sedang meracik identitas</small></div></div><div id="heroStage" class="hero-stage"></div></div>
      <div class="float-card f1"><span class="fi">${ic('shield', 18)}</span><div><span class="note">Syariah Check</span><b>8 / 8 lolos</b></div></div>
      <div class="float-card f2"><span class="fi">${ic('calc', 18)}</span><div><span class="note">Sayembara mulai Rp2,5 jt</span><b>Maknai Rp350 rb</b></div></div></div>
  </div>
  <div class="wrap"><div class="stats rv">
    <div><b>Rp1.500 T</b><span>kontribusi ekonomi kreatif ke PDB (2024)</span></div>
    <div><b>⅓</b><span>dari 64 juta UMKM yang sudah memakai platform digital</span></div>
    <div><b data-count="396">396</b><span>pesantren di Kota & Kabupaten Malang</span></div>
    <div><b data-count="8">8</b><span>butir Syariah Check di setiap karya</span></div>
  </div></div></section>

  <div class="marquee" aria-hidden="true"><div class="track">${[...marq, ...marq].map(m => `<span>${m}</span>`).join('')}</div></div>

  <section class="sec" id="masalah"><div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Masalah & solusi</span><h2>Produknya bagus, tampilannya <em>belum bercerita</em>.</h2><p class="lead">Unit usaha pesantren dan UMKM halal sering berkualitas, tetapi tampil tanpa identitas visual yang konsisten.</p></div>
    <div class="ps-list">${PROBLEMS.map(([p, s, i]) => `<div class="ps rv"><div class="ps-p"><span class="ps-ic">${ic(i, 18)}</span><span>${p}</span></div><span class="ps-arrow">${ic('arrow', 18)}</span><div class="ps-s">${s}</div></div>`).join('')}</div>
  </div></section>

  <section class="sec" id="layanan"><div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Tiga lapis layanan</span><h2>AI untuk cepat. Manusia untuk <em>makna</em>.</h2><p class="lead">Kebaruan Maknai bukan pada AI semata, tetapi pada cara AI dipadukan dengan nilai, kurasi manusia, dan model layanan yang sesuai.</p></div>
    <div class="bento">
      <article class="feat dark w2 rv"><span class="num">Lapis 01</span><h3>Eksplorasi AI</h3><p>Puluhan arah visual dieksplorasi dalam hitungan jam, sehingga biaya dan waktu produksi turun.</p><div class="demo row start" style="gap:8px">${SHAPES.map(s => `<span class="mini-logo">${logoSVG(buildKit({ name: 'Maknai', biz: 'Produk santri', values: ['Amanah'], shape: s }), s, 46)}</span>`).join('')}</div></article>
      <article class="feat w2 rv"><span class="num">Lapis 02</span><h3>Kurasi desainer + Syariah Check</h3><p>Setiap hasil disempurnakan desainer dan diperiksa 8 butir kesesuaian visual, bahasa, klaim, dan etika AI.</p><div class="demo"><div class="mini-escrow"><div class="done">Mutu visual<b>✓</b></div><div class="done" style="background:var(--saffron-soft);color:var(--warn)">Syariah<b>8/8</b></div></div></div></article>
      <article class="feat w2 em rv"><span class="num">Lapis 03</span><h3>Maknai Kit</h3><p>Panduan merek dan berkas yang bisa disunting, agar klien mampu mengelola mereknya secara mandiri.</p><div class="demo chips"><span class="pill ink">Palet</span><span class="pill">Tipografi</span><span class="pill">Template</span><span class="pill">Gaya bahasa</span></div></article>
    </div>
    <div class="diff rv">${DIFF.map(([t, d, m], i) => `<div><span class="n">0${i + 1}</span><h3>${t}</h3><p>${d}</p><p class="note"><b>Manfaat:</b> ${m}</p></div>`).join('')}</div>
  </div></section>

  <section class="sec" id="coba-kit"><div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Prototipe · Brand Kit</span><h2>Coba racik <em>identitas</em> usahamu.</h2><p class="lead">Isi tiga hal, lalu lihat simulasi eksplorasi awal: logo, palet, tipografi, cerita merek, kemasan, dan konten. Di layanan asli, desainer menyempurnakan hasil ini.</p></div>
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
    <div class="sec-head rv"><span class="eyebrow">Prototipe · Maknai Syariah Check</span><h2>Delapan pertanyaan sebelum <em>karya</em> diserahkan.</h2><p class="lead">Coba periksa rancangan label di bawah. Karya baru diserahkan setelah seluruh butir berstatus "Lolos".</p></div>
    <div class="rv">${checkSectionHTML()}</div>
  </div></section>

  <section class="sec" id="alur"><div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Alur produksi · paket Brand & Premium</span><h2>Tujuh langkah, <em>tiga</em> gerbang mutu.</h2><p class="lead">AI dipakai di langkah 3 — sebelum dan sesudahnya selalu ada keputusan manusia. Gerbang mutu ada di langkah 2 (brief), 4 (visual), dan 5 (syariah & lisensi).</p></div>
    <div class="steps7 rv">${STEPS.map((s, i) => `<div class="s7 ${s.gold ? 'gold' : ''}"><span class="s7n">${i + 1}</span><span class="s7d">${s.d}</span><h3>${s.t}</h3><p>${s.desc}</p><span class="note">${s.who}</span>${[1, 3, 4].includes(i) ? `<span class="pill ${s.gold ? 'sf' : 'em'} gate">${ic('shield', 12)} Gerbang mutu</span>` : ''}</div>`).join('')}</div>
    <div class="cta-band rv"><div><h3>Pembayaran dengan akad ijarah</h3><p class="muted">Uang muka 50% saat kontrak, pelunasan 50% saat serah terima. Rincian biaya transparan, tanpa bunga.</p></div><button class="btn btn-ink btn-lg" data-act="startOrder">${ic('brief', 18)} Mulai pesan</button></div>
  </div></section>

  <section class="sec" id="paket"><div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Paket & harga</span><h2>Mulai dari <em>Rp350.000</em>.</h2><p class="lead">Harga berbasis nilai: Starter sengaja ringan sebagai pintu masuk. Semua paket melalui Maknai Syariah Check.</p></div>
    <div class="grid g3" style="align-items:stretch">${PKG.map(p => pkgCard(p)).join('')}</div>
    <div class="extras">${EXTRA.map(e => `<div class="card rv"><div class="row"><b style="font-size:17px">${e.name}</b><span class="mono" style="font-weight:700">${rp(e.price)} <span class="note" style="font-family:var(--font)">${e.unit}</span></span></div><ul class="ticks dark" style="margin-top:12px">${e.feat.map(t => `<li>${ic('check', 15)}${t}</li>`).join('')}</ul></div>`).join('')}</div>
    <div class="fees">
      <div class="rv"><b>50 : 50</b><span class="muted">uang muka saat kontrak, pelunasan saat serah terima Maknai Kit (akad ijarah).</span></div>
      <div class="rv"><b>${REF_DISC}%</b><span class="muted">diskon rujukan untuk klien yang direkomendasikan klien lain.</span></div>
      <div class="rv"><b>Siap Halal</b><span class="muted">label & kemasan yang siap disertifikasi, untuk UMK yang sedang mengurus sertifikat halal.</span></div>
    </div>
  </div></section>

  <section class="sec" id="banding"><div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Posisi di pasar</span><h2>Terjangkau, tapi <em>tidak generik</em>.</h2><p class="lead">Peta posisi berdasarkan harga dan kedalaman nilai syariah serta makna merek (penilaian tim).</p></div>
    <div class="grid split-53 rv"><div class="card">${posMap()}</div>
    <div class="stack" style="gap:10px">${COMPETITORS.map(c => `<div class="inner ${c.me ? 'me' : ''}"><div class="row"><b>${c.n}</b><span class="note">${c.ex}</span></div><p class="note" style="margin-top:6px"><span style="color:var(--ok)">+ ${c.plus}</span><br><span style="color:var(--clay)">− ${c.minus}</span></p><span class="mono" style="font-size:12.5px">${c.price}</span></div>`).join('')}<p class="note">Sumber harga: UKM Indonesia dan Canva. Harga pesaing dapat berubah.</p></div></div>
  </div></section>

  <section class="sec" id="faq"><div class="wrap faq-grid">
    <div class="sec-head rv"><span class="eyebrow">Tanya jawab</span><h2>Yang sering <em>ditanyakan</em>.</h2><p class="lead">Masih ragu? <button class="linkish" data-act="chatToggle">Tanya asisten Maknai</button>.</p></div>
    <div class="faq rv">${FAQ.map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  </div></section>

  <section class="sec" id="tim"><div class="wrap">
    <div class="sec-head center rv"><span class="eyebrow">Tim INVICTA</span><h2>Orang-orang di balik <em>Maknai</em>.</h2><p class="lead" style="margin:0 auto">Mahasiswa UIN Maulana Malik Ibrahim Malang — bersertifikat BNSP Digital Marketing AI dan Pendamping Produk Halal.</p></div>
    <div class="team">${TEAM.map(m => `<div class="member rv"><div class="arch mono-av ${avc(m.n)}"><span>${initials(m.n)}</span></div><b>${m.n}</b><span>${m.r}</span><p class="note" style="margin-top:6px">${m.d}</p></div>`).join('')}</div>
    <p class="note rv" style="text-align:center;margin-top:24px">Penasihat: Dosen Pembimbing Fery Dwi Riyanto dan Penasihat Syariah — mengawasi mutu dan menelaah kasus sulit Syariah Check.</p>
  </div></section>

  <div class="wrap"><section class="final rv">
    <span class="eyebrow" style="color:var(--saffron)">Bismillah, mulai hari ini</span>
    <h2 style="margin-top:14px">Brand yang <em>bermakna</em>: cepat, terjangkau, selaras syariah.</h2>
    <p>Isi brief 3 menit, lihat konsep awal, lalu tim Maknai menyelesaikannya untukmu.</p>
    <div class="row" style="justify-content:center"><button class="btn btn-s btn-lg" data-act="startOrder">Pesan sekarang</button><button class="btn btn-line btn-lg" data-act="waOpen" data-text="Assalamu'alaikum Maknai, saya ingin konsultasi branding untuk usaha saya.">${ic('send', 18)} Konsultasi via WhatsApp</button></div>
  </section></div>
  </main>

  <footer class="foot"><div class="wrap">
    <div class="foot-grid">
      <div><a class="brand" href="#beranda" data-act="toTop">${brand(30)}</a><p class="muted" style="margin-top:14px;max-width:340px">Jasa branding berbasis AI dengan kurasi syariah untuk pesantren dan UMKM halal. Malang, Jawa Timur.</p></div>
      <div><h4>Layanan</h4><ul>${[['layanan', 'Tiga lapis layanan'], ['coba-kit', 'Coba Brand Kit'], ['syariah-check', 'Syariah Check'], ['paket', 'Paket & harga']].map(([h, l]) => `<li><a href="#${h}" data-act="jump" data-to="${h}">${l}</a></li>`).join('')}</ul></div>
      <div><h4>Akun</h4><ul><li><button class="fl" data-act="startOrder">Pesan sekarang</button></li><li><button class="fl" data-act="start">Masuk portal</button></li><li><button class="fl" data-act="demoKlien">Portal klien (demo)</button></li><li><button class="fl" data-act="demoTim">Ruang tim (demo)</button></li></ul></div>
      <div><h4>Tentang</h4><ul><li><a href="#tim" data-act="jump" data-to="tim">Tim INVICTA</a></li><li><a href="#banding" data-act="jump" data-to="banding">Posisi pasar</a></li><li><a href="#faq" data-act="jump" data-to="faq">Tanya jawab</a></li></ul></div>
    </div>
    <div class="foot-bottom"><span>© 2026 Maknai · Tim INVICTA, UIN Maulana Malik Ibrahim Malang</span><span>Prototipe NBPC 2026 — data contoh, tanpa transaksi nyata.</span></div>
  </div></footer>`;
}

/* ---------- peta posisi ---------- */
function posMap() {
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
  slot('kOut', kitHTML(kk, { draft: true, id: 'landKit' }));
}
I.kName = el => { S.land.kit.name = el.value.trim() || 'Usahaku'; drawKit(true); };
I.kCity = el => { S.land.kit.city = el.value; drawKit(true); };
I.kStory = el => { S.land.kit.story = el.value; drawKit(true); };
A.kBiz = el => { S.land.kit.biz = el.dataset.v; S.land.kit.seed = 0; drawKit(); };
A.kVal = el => { const v = el.dataset.v, a = S.land.kit.values, i = a.indexOf(v); if (i >= 0) { if (a.length === 1) return toast('Pilih minimal satu nilai', true); a.splice(i, 1); } else { if (a.length >= 3) a.shift(); a.push(v); } drawKit(); };
A.kShape = el => { S.land.kit.shape = el.dataset.v; drawKit(true); };
A.kHalal = el => { S.land.kit.halal = el.checked; drawKit(true); };
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
