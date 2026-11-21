/* Simulasi alur pemesanan (Lampiran D.4): paket → brief → konsep → kontrak ijarah & uang muka → portal klien. Plus masuk akun. */
import { S, A, I, C, F, $, esc, rp, slot, ic, brand, themeBtn, chipBtn, seg, fld, toast, hashPw, saveAccounts, snapshot, reseed, bindActive, hydrate, hooks, first, TODAY, SHORT, openModal, modalHead } from './core.js';
import { liveConfigured } from './store.js';
import { CONFIG } from './config.js';
import { liveSignIn, liveOrder, isLive, isNetErr } from './livesync.js';
import { PKG, EXTRA, BIZ, VALUES, SHAPES, STEPS, REF_DISC } from './data.js';
import { buildKit, logoSVG, labelSVG } from './kit.js';

const OSTEPS = ['Paket', 'Brief', 'Konsep', 'Kontrak & uang muka'];
export function newOrder(pkg, brief) {
  S.ord = { step: 0, pkg: pkg || 'brand', konten: false, ref: '', pay: 'bsi', agree: false, err: [],
    brief: Object.assign({ name: '', biz: 'Kuliner & camilan', values: ['Amanah'], city: 'Malang', story: '', target: '', halal: false, seed: 0, shape: 'kotak' }, brief || {}),
    contact: { owner: '', wa: '', email: '', pw: '', type: 'UMKM' } };
}
const P = () => PKG.find(p => p.id === S.ord.pkg);
export function calc(o = S.ord) {
  const p = PKG.find(x => x.id === o.pkg), disc = /^[A-Z0-9]{5,12}$/.test((o.ref || '').trim().toUpperCase()) ? Math.round(p.price * REF_DISC / 100) : 0, total = p.price - disc;
  return { p, disc, total, dp: Math.round(total / 2), konten: o.konten ? EXTRA[0].price : 0 };
}
const ujrah = c => `${rp(c.total)}${c.disc ? ' (setelah diskon rujukan)' : ''} — ${rp(c.dp)} di muka, ${rp(c.total - c.dp)} saat serah terima Maknai Kit.`;
const errHTML = e => e.length ? `<div class="alert" role="alert">${e.length === 1 ? esc(e[0]) : '<ul>' + e.map(x => `<li>${esc(x)}</li>`).join('') + '</ul>'}</div>` : '';

function sideSum() {
  const o = S.ord, c = calc(), k = o.brief.name ? buildKit(o.brief) : null;
  return `<div class="ord-sum card"><span class="lbl">Ringkasan pesanan</span>
    <div class="row" style="margin-top:10px"><b style="font-size:18px">Paket ${c.p.name}</b><span class="mono">${rp(c.p.price)}</span></div><p class="note">${c.p.days} hari kerja · 2× revisi · Syariah Check</p>
    ${o.konten ? `<div class="row" style="margin-top:8px"><span>Langganan Konten</span><span class="mono">${rp(EXTRA[0].price)}/bln</span></div><p class="note">Ditagih terpisah mulai bulan depan.</p>` : ''}
    ${c.disc ? `<div class="row" style="margin-top:8px;color:var(--ok)"><span>Diskon rujukan ${REF_DISC}%</span><span class="mono">−${rp(c.disc)}</span></div>` : ''}
    <div class="row" style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--line-2)"><b>Total jasa</b><b class="mono">${rp(c.total)}</b></div>
    <div class="row"><span class="note">Uang muka 50% (sekarang)</span><span class="mono">${rp(c.dp)}</span></div><div class="row"><span class="note">Pelunasan saat serah terima</span><span class="mono">${rp(c.total - c.dp)}</span></div>
    ${k ? `<div class="ord-preview" style="background:${k.pal.c[3]}">${logoSVG(k, k.shape, 64)}<div><b style="font-family:'${k.type.h}',serif;color:${k.pal.c[0]};font-size:18px">${esc(k.name)}</b><div class="hs-pal">${k.pal.c.map(x => `<i style="background:${x}"></i>`).join('')}</div></div></div>` : ''}
    <p class="note" style="margin-top:12px">${ic('shield', 13)} Akad ijarah · tanpa bunga · rincian transparan</p></div>`;
}
function step0() {
  const o = S.ord;
  return `<h1>Pilih paket</h1><p class="muted mb">Semua paket termasuk dua kali revisi dan Maknai Syariah Check.</p>
  <div class="stack" style="gap:10px">${PKG.map(p => `<button class="pick ${o.pkg === p.id ? 'on' : ''}" data-act="oPkg" data-v="${p.id}" aria-pressed="${o.pkg === p.id}"><div class="row"><b style="font-size:17px">${p.name}${p.hot ? ' <span class="pill em">Paling dipilih</span>' : ''}</b><span class="mono" style="font-weight:700">${rp(p.price)}</span></div><p class="note">${p.days} hari kerja · ${p.feat.slice(0, 3).join(' · ')}${p.feat.length > 3 ? ' · …' : ''}</p></button>`).join('')}</div>
  <label class="check inner" style="margin-top:14px"><input type="checkbox" data-act="oKonten" ${o.konten ? 'checked' : ''}><span><b>Tambah Langganan Konten</b> — ${rp(EXTRA[0].price)}/bulan: 12 desain, 4 caption terjadwal, 2 video pendek, laporan bulanan.</span></label>`;
}
function step1() {
  const b = S.ord.brief, c = S.ord.contact;
  return `<h1>Brief & brand discovery</h1><p class="muted mb">Ceritakan usahamu. Brief ini menjadi dasar konsep makna.</p>
  <div class="grid g2" style="gap:0 12px">${fld('o_name', 'Nama usaha / merek', `<input id="o_name" type="text" maxlength="28" data-in="oB" data-k="name" value="${esc(b.name)}" placeholder="Contoh: Al-Hikmah">`)}${fld('o_city', 'Kota', `<input id="o_city" type="text" maxlength="24" data-in="oB" data-k="city" value="${esc(b.city)}">`)}</div>
  <div class="field"><span class="lbl2">Jenis lembaga</span>${seg([['UMKM', 'UMKM halal'], ['Pesantren', 'Unit usaha pesantren'], ['Komunitas', 'Madrasah / komunitas']], 'oType', c.type)}</div>
  <div class="field"><span class="lbl2">Jenis usaha</span><div class="chips">${BIZ.map(x => chipBtn(x, 'oBiz', `data-v="${x}"`, b.biz === x)).join('')}</div></div>
  <div class="field"><span class="lbl2">Nilai merek <span class="note">1–3</span></span><div class="chips">${VALUES.map(x => chipBtn(x, 'oVal', `data-v="${x}"`, b.values.includes(x))).join('')}</div></div>
  ${fld('o_target', 'Target pelanggan', `<input id="o_target" type="text" maxlength="80" data-in="oB" data-k="target" value="${esc(b.target)}" placeholder="Contoh: wali santri, warung sekitar pondok">`)}
  ${fld('o_story', 'Asal-usul & cerita usaha', `<textarea id="o_story" maxlength="240" data-in="oB" data-k="story" placeholder="Sejak kapan, siapa yang mengelola, apa yang membuatnya istimewa?">${esc(b.story)}</textarea>`)}
  <label class="check" style="margin-bottom:18px"><input type="checkbox" data-act="oHalal" ${b.halal ? 'checked' : ''}><span>Produk sudah bersertifikat halal (logo halal resmi boleh dipasang di kemasan)</span></label>
  <div class="lbl" style="margin:6px 0 10px">Kontak</div>
  <div class="grid g2" style="gap:0 12px">${fld('o_owner', 'Nama penanggung jawab', `<input id="o_owner" type="text" autocomplete="name" data-in="oC" data-k="owner" value="${esc(c.owner)}">`)}${fld('o_wa', 'Nomor WhatsApp', `<input id="o_wa" type="tel" autocomplete="tel" data-in="oC" data-k="wa" value="${esc(c.wa)}" placeholder="08xxxxxxxxxx">`)}</div>
  ${fld('o_email', 'Email', `<input id="o_email" type="email" autocomplete="email" data-in="oC" data-k="email" value="${esc(c.email)}" placeholder="nama@email.com">`, 'Data kontak hanya dipakai untuk proyek ini, sesuai UU Pelindungan Data Pribadi.')}`;
}
function step2() {
  const b = S.ord.brief, k = buildKit(b);
  return `<h1>Konsep makna</h1><p class="muted mb">Simulasi eksplorasi awal dari brief-mu. Pilih arah bentuk; desainer akan menyempurnakannya di langkah 4.</p>
  <div class="concepts">${SHAPES.map(s => `<button class="concept ${k.shape === s ? 'on' : ''}" data-act="oShape" data-v="${s}" aria-pressed="${k.shape === s}">${logoSVG(k, s, 92)}<span>${s[0].toUpperCase() + s.slice(1)}</span></button>`).join('')}</div>
  <div class="grid g2" style="margin-top:16px"><div class="card stack" style="gap:10px"><span class="lbl">Palet "${k.pal.n}"</span><div class="hs-pal big">${k.pal.c.map(x => `<i style="background:${x}"></i>`).join('')}</div><span class="lbl" style="margin-top:6px">Tipografi "${k.type.n}"</span><div style="font-family:'${k.type.h}',serif;font-size:26px;color:${k.pal.c[0]}">${esc(k.name)}</div><button class="btn btn-line btn-sm" style="align-self:flex-start" data-act="oReroll">${ic('spark', 14)} Eksplorasi ulang</button></div>
  <div class="mock-wrap" style="background:linear-gradient(160deg, ${k.pal.c[3]}, #fff)">${labelSVG(k)}</div></div>`;
}
function step3() {
  const o = S.ord, c = calc();
  return `<h1>Kontrak & uang muka</h1><p class="muted mb">Akad ijarah (sewa jasa): kamu membayar jasa desain dengan ruang lingkup dan biaya yang jelas di awal.</p>
  <div class="inner stack" style="gap:6px;margin-bottom:16px"><b>Pokok akad</b>
  <ol class="note" style="padding-left:18px;margin:0;display:flex;flex-direction:column;gap:4px;color:var(--ink-2)"><li>Objek: Paket ${c.p.name} untuk merek <b>${esc(o.brief.name)}</b> (${c.p.feat.join(', ')}).</li><li>Waktu: ${c.p.days} hari kerja sejak uang muka diterima; maksimal 2 kali revisi.</li><li>Upah (ujrah): <span id="akadUjrah">${ujrah(c)}</span></li><li>Hak cipta karya final beralih ke klien setelah pelunasan; penggunaan AI diinformasikan secara transparan.</li><li>Karya diserahkan setelah lolos 8 butir Maknai Syariah Check.</li></ol></div>
  ${fld('o_ref', `Kode rujukan <span class="note">opsional · diskon ${REF_DISC}%</span>`, `<input id="o_ref" type="text" maxlength="12" data-in="oRef" value="${esc(o.ref)}" placeholder="Contoh: ALHIKMAH10" style="text-transform:uppercase">`)}
  <div class="field"><span class="lbl2">Metode uang muka (simulasi)</span>${seg([['bsi', 'Transfer BSI'], ['qris', 'QRIS'], ['bmt', 'BMT / koperasi']], 'oPay', o.pay)}</div>
  ${fld('o_pw', 'Buat kata sandi portal klien', `<input id="o_pw" type="password" autocomplete="new-password" data-in="oC" data-k="pw" value="${esc(o.contact.pw)}" placeholder="Minimal 6 karakter">`, 'Untuk memantau proyek, memberi revisi, dan mengunduh Maknai Kit.')}
  <label class="check" style="margin-bottom:12px"><input type="checkbox" data-act="oAgree" ${o.agree ? 'checked' : ''}><span>Saya menyetujui akad ijarah, ketentuan revisi, dan kebijakan privasi Maknai.</span></label>`;
}
export function orderHTML() {
  const o = S.ord, i = o.step, body = [step0, step1, step2, step3][i]();
  return `<div class="ord"><div class="mini-top"><a class="brand" href="#beranda" data-act="toLanding">${brand(30)}</a><div class="row nowrap">${themeBtn()}<button class="btn btn-ghost btn-sm" data-act="toLanding">${ic('x', 16)} Batal</button></div></div>
  <div class="ord-wrap"><div class="ord-main"><div class="stepper" aria-hidden="true">${OSTEPS.map((s, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div><div class="row" style="margin-bottom:18px"><span class="note">Langkah ${i + 1} dari ${OSTEPS.length}</span><b>${OSTEPS[i]}</b></div>
    <div id="ordErr">${errHTML(o.err)}</div><form data-form="ord" novalidate>${body}
    <div class="row" style="margin-top:12px">${i > 0 ? `<button type="button" class="btn btn-line" data-act="oBack">${ic('back', 16)} Kembali</button>` : '<span></span>'}<div class="row nowrap">${i === 3 ? `<button type="button" class="btn btn-ghost" data-act="oWa">${ic('send', 16)} Kirim via WhatsApp</button>` : ''}<button type="submit" class="btn btn-p">${i === 3 ? 'Bayar uang muka & mulai' : 'Lanjut'} ${ic('arrow', 16)}</button></div></div></form></div>
  <aside class="ord-side" id="ordSide">${sideSum()}</aside></div></div>`;
}
export const renderOrder = () => slot('order', orderHTML());
const redraw = () => { renderOrder(); };
const side = () => slot('ordSide', sideSum());

function validate() {
  const o = S.ord, e = [], b = o.brief, c = o.contact;
  if (o.step === 1) {
    if (!b.name.trim()) e.push('Nama usaha wajib diisi.');
    if (!c.owner.trim()) e.push('Nama penanggung jawab wajib diisi.');
    if (!/^0\d{8,13}$/.test(c.wa.replace(/[\s-]/g, ''))) e.push('Nomor WhatsApp harus diawali 0 dan berisi 9–14 digit.');
    if (!/^\S+@\S+\.\S+$/.test(c.email)) e.push('Format email belum benar.');
    else if (!liveConfigured() && S.accounts.some(a => a.email === c.email.trim().toLowerCase())) e.push('Email ini sudah punya portal. Silakan masuk, atau pakai email lain.');
  }
  if (o.step === 3) { if (!isLive() && (c.pw || '').length < 6) e.push('Kata sandi minimal 6 karakter.'); if (!o.agree) e.push('Setujui akad ijarah terlebih dahulu.'); }
  return e;
}
async function finish() {
  const o = S.ord, c = calc(), em = o.contact.email.trim().toLowerCase();
  if (liveConfigured()) {
    const btn = document.querySelector('form[data-form="ord"] button[type="submit"]'); if (btn) { btn.disabled = true; btn.textContent = 'Memproses…'; }
    let net = false;
    try { if (await liveOrder(o, c)) { S.ord = null; S.tab.klien = 'dash'; } }
    catch (e) { if (isNetErr(e) && !isLive()) net = true; else { const msg = /registered|already/i.test(e.message || '') ? 'Email ini sudah terdaftar. Silakan masuk dulu, lalu pesan dari portal.' : (e.message || 'Gagal menghubungi server'); S.ord.err = [msg]; slot('ordErr', errHTML(S.ord.err)); toast(msg, true); } }
    if (btn) { btn.disabled = false; btn.textContent = 'Bayar uang muka & mulai'; }
    if (!net) return;
    toast('Server Maknai tidak terjangkau — pesanan disimpan offline di perangkat ini', true);
    if (S.accounts.some(a => a.email === em)) { S.ord.err = ['Email ini sudah punya portal offline di perangkat ini. Silakan masuk.']; return slot('ordErr', errHTML(S.ord.err)); }
  }
  reseed();
  S.client = { name: o.contact.owner.trim(), biz: o.brief.name.trim(), email: em, wa: o.contact.wa, city: o.brief.city, type: o.contact.type };
  const pid = 'p-' + Date.now().toString(36);
  S.projects = [{ id: pid, brief: JSON.parse(JSON.stringify(o.brief)),
    project: { pkg: o.pkg, step: 2, revisions: 0, notes: [], dp: true, paid: false, approved: false, started: SHORT, total: c.total, checks: { awal: null, akhir: null }, log: { ai: [], assets: [] } },
    invoices: [{ id: 'INV-' + String(Date.now()).slice(-4), l: `Uang muka 50% — Paket ${c.p.name}`, a: c.dp, s: 'Lunas', d: SHORT }] }];
  S.activeId = pid; bindActive();
  S.subs = { konten: o.konten, month: 0, done: {} };
  S.refCode = (o.brief.name.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8) || 'MAKNAI') + '10';
  S.notifs = [{ t: 'Konsep "' + o.brief.shape + '" dipilih. Tim mulai produksi visual.', d: 'Baru saja' }, { t: `Uang muka ${rp(c.dp)} diterima. Akad ijarah aktif.`, d: 'Baru saja' }]; S.unread = 2;
  const acc = { email: em, hash: await hashPw(o.contact.pw, em), data: null };
  S.accounts.push(acc); S.session = { role: 'klien', demo: false, email: em }; acc.data = snapshot(); saveAccounts();
  S.ord = null; S.tab.klien = 'dash';
  hooks.enterApp('klien'); toast('Uang muka diterima. Proyekmu dimulai, ' + first(S.client.name) + '!');
}

Object.assign(A, {
  startOrder: el => { newOrder(el && el.dataset && el.dataset.pkg); hooks.goOrder(); },
  kOrder: () => { const k = S.land.kit; newOrder('brand', { name: k.name, biz: k.biz, values: k.values.slice(), city: k.city, story: k.story, halal: k.halal, seed: k.seed, shape: k.shape }); hooks.goOrder(); },
  oPkg: el => { S.ord.pkg = el.dataset.v; redraw(); },
  oKonten: el => { S.ord.konten = el.checked; side(); },
  oType: el => { S.ord.contact.type = el.dataset.v; redraw(); },
  oBiz: el => { S.ord.brief.biz = el.dataset.v; S.ord.brief.seed = 0; redraw(); },
  oVal: el => { const v = el.dataset.v, a = S.ord.brief.values, i = a.indexOf(v); if (i >= 0) { if (a.length === 1) return toast('Pilih minimal satu nilai', true); a.splice(i, 1); } else { if (a.length >= 3) a.shift(); a.push(v); } redraw(); },
  oHalal: el => { S.ord.brief.halal = el.checked; },
  oShape: el => { S.ord.brief.shape = el.dataset.v; redraw(); },
  oReroll: () => { S.ord.brief.seed++; redraw(); },
  oPay: el => { S.ord.pay = el.dataset.v; redraw(); },
  oAgree: el => { S.ord.agree = el.checked; },
  oBack: () => { S.ord.step--; S.ord.err = []; redraw(); scrollTo(0, 0); },
  oWa: () => {
    const o = S.ord, c = calc(), b = o.brief;
    const t = `Assalamu'alaikum Maknai, saya ingin memesan Paket ${c.p.name} (${rp(c.total)}).\n\nMerek: ${b.name}\nJenis usaha: ${b.biz}\nNilai: ${b.values.join(', ')}\nKota: ${b.city}\nTarget: ${b.target || '-'}\nCerita: ${b.story || '-'}\nKonsep pilihan: ${b.shape}\n\nPenanggung jawab: ${o.contact.owner}`;
    window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener'); toast('Brief disiapkan di WhatsApp — pilih kontak Maknai untuk mengirim');
  }
});
F.ord = () => {
  const e = validate(); S.ord.err = e;
  if (e.length) { slot('ordErr', errHTML(e)); $('#ordErr').scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
  if (S.ord.step < 3) { S.ord.step++; redraw(); scrollTo(0, 0); } else finish();
};
I.oB = el => { S.ord.brief[el.dataset.k] = el.value; if (el.dataset.k === 'name') side(); };
I.oC = el => { S.ord.contact[el.dataset.k] = el.value; };
I.oRef = el => { S.ord.ref = el.value.toUpperCase(); side(); slot('akadUjrah', ujrah(calc())); };

/* ---------- masuk ---------- */
export function loginHTML() {
  const a = S.auth;
  return `<div class="screen-center"><div class="mini-top"><a class="brand" href="#beranda" data-act="toLanding">${brand(30)}</a><div class="row nowrap">${themeBtn()}<button class="btn btn-ghost btn-sm" data-act="toLanding">${ic('back', 16)} Beranda</button></div></div>
  <div class="role-wrap"><div class="auth-form card" style="padding:32px"><h1>Masuk portal klien</h1><p class="muted mb">Pantau proyek, beri revisi, dan unduh Maknai Kit.</p><div id="authErr">${errHTML(a.err)}</div>
  <form data-form="login" novalidate><div class="field"><label for="l_email">Email</label><input id="l_email" type="email" autocomplete="email" data-in="login" data-k="email" value="${esc(a.email)}" placeholder="nama@email.com"></div>
  <div class="field"><label for="l_pw">Kata sandi</label><div class="pwrap"><input id="l_pw" type="${a.showPw ? 'text' : 'password'}" autocomplete="current-password" data-in="login" data-k="pw" value="${esc(a.pw)}"><button type="button" class="btn btn-line btn-icon" data-act="showPw" aria-label="Tampilkan kata sandi">${ic('eye', 18)}</button></div></div>
  <button class="btn btn-p btn-lg btn-block" type="submit">Masuk ${ic('arrow', 16)}</button></form>
  <p class="note" style="margin-top:18px;text-align:center">Belum punya proyek? <button class="linkish" data-act="startOrder">Pesan sekarang</button></p>
  ${liveConfigured() && CONFIG.juri && CONFIG.juri.password ? `<button class="btn btn-s btn-block" style="margin-top:18px" data-act="juriLogin">${ic('user', 16)} Masuk sebagai juri</button><p class="note" style="text-align:center;margin-top:6px">Akun klien demo (live). Data ditandai demo dan bisa direset tim.</p>` : ''}<div class="grid g2" style="margin-top:18px;gap:10px"><button class="btn btn-line" data-act="demoKlien">${ic('eye', 16)} Portal klien (demo)</button><button class="btn btn-line" data-act="demoTim">${ic('chart', 16)} Ruang tim (demo)</button></div></div></div></div>`;
}
I.login = el => { S.auth[el.dataset.k] = el.value; };
A.showPw = () => { S.auth.showPw = !S.auth.showPw; hooks.renderLogin(); const i = $('#l_pw'); if (i) i.focus(); };
F.login = async () => {
  const a = S.auth, em = a.email.trim().toLowerCase(), e = []; let acc;
  if (!/^\S+@\S+\.\S+$/.test(em)) e.push('Format email belum benar.');
  if ((a.pw || '').length < 6) e.push('Kata sandi minimal 6 karakter.');
  if (!e.length && liveConfigured()) {
    try { if (await liveSignIn(em, a.pw)) { S.auth = { mode: 'login', email: '', pw: '', err: [] }; return toast('Selamat datang, ' + first(S.live.name)); } }
    catch (err) { if (!isNetErr(err)) e.push(err.message || 'Gagal masuk'); else a.offline = true; }
  }
  if (!e.length) { acc = S.accounts.find(x => x.email === em); if (!acc) e.push(a.offline ? 'Server Maknai tidak terjangkau dan email ini tidak punya portal offline di perangkat ini.' : liveConfigured() ? 'Email atau kata sandi salah.' : 'Belum ada portal dengan email ini di perangkat ini. Pesan dulu atau coba demo.'); else if (acc.hash !== await hashPw(a.pw, em)) e.push('Email atau kata sandi salah.'); }
  a.err = e; slot('authErr', errHTML(e)); if (e.length) return;
  reseed(); hydrate(acc.data); S.session = { role: 'klien', demo: false, email: em }; S.auth = { mode: 'login', email: '', pw: '', err: [] };
  hooks.enterApp('klien'); toast('Selamat datang kembali, ' + first(S.client.name));
};
