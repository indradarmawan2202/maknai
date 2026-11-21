/* Maknai — entry: layar, shell portal, routing hash, delegasi event, command palette, notifikasi. */
import { S, A, I, C, F, V, $, esc, slot, ic, brand, themeBtn, toast, closeModal, initials, hooks, persist, restoreSession, clearSession, reseed, loadAccounts, getTheme, setTheme, updateBell, avc } from './core.js';
import { PKG } from './data.js';
import { mountLanding, onLandingShow } from './landing.js';
import { renderOrder, loginHTML, newOrder } from './order.js';
import { chatWidgetHTML } from './bot.js';
import './portal.js';
import { mode, MODE_INFO, projectPicker, liveConfigured } from './store.js';
import { isLive, enterLive, liveSignOut, liveSignIn } from './livesync.js';
import { CONFIG } from './config.js';
import './team.js';

const TABS = {
  klien: [['Proyek', [['dash', 'Ringkasan', 'home'], ['proyek', 'Alur proyek', 'kanban'], ['kit', 'Brand Kit', 'layers'], ['check', 'Syariah Check', 'shield']]], ['Layanan', [['konten', 'Konten bulanan', 'play'], ['toko', 'Template & workshop', 'store']]], ['Akun', [['tagihan', 'Tagihan & akad', 'receipt'], ['rujukan', 'Rujukan', 'heart']]]],
  tim: [['Operasional', [['pipeline', 'Pipeline produksi', 'kanban'], ['gerbang', 'Gerbang syariah', 'shield'], ['kapasitas', 'Kapasitas tim', 'user']]], ['Bisnis', [['keuangan', 'Keuangan & skenario', 'chart'], ['pasar', 'Pasar & SWOT', 'trend']]]]
};
const flat = r => TABS[r].flatMap(g => g[1]);
const SCREENS = ['landing', 'login', 'order', 'appscr'];

function go(name) {
  S.screen = name;
  SCREENS.forEach(id => { $('#' + id).hidden = id !== (name === 'app' ? 'appscr' : name); });
  if (name === 'landing') onLandingShow();
  if (S.chat.open) A.chatToggle();
  $('#chatWidget').hidden = !(name === 'landing' || (name === 'app' && S.role === 'klien'));
  updateLanding(); scrollTo(0, 0); setHash();
  document.title = { landing: 'Maknai — Beri makna pada setiap brand', login: 'Masuk · Maknai', order: 'Pesan · Maknai', app: S.role === 'tim' ? 'Ruang Tim · Maknai' : 'Portal Klien · Maknai' }[name];
}
function updateLanding() { const on = !!(S.session && S.session.role === 'klien'), a = $('#navAuth'), b = $('#navApp'); if (a) a.hidden = on; if (b) b.hidden = !on; }
function endSession() { persist(); S.session = null; reseed(); S.chat.msgs = []; clearSession(); }
function enterApp(role) { S.role = role; go('app'); shell(); render(); persist(); }
function demo(role) { closeModal(); if (S.session) endSession(); reseed(); S.session = { role, demo: true }; S.tab = { klien: 'dash', tim: 'pipeline' }; enterApp(role); toast(role === 'tim' ? 'Ruang tim (demo) — angka dari proposal NBPC 2026' : 'Portal klien (demo) — proyek contoh Air Minum Santri Al-Hikmah'); }

function shell() {
  const r = S.role, demoS = S.session && S.session.demo;
  slot('appscr', `<div class="app ${S.ui.collapsed ? 'collapsed' : ''}" id="appRoot">
  <aside class="side" aria-label="Navigasi portal"><a class="brand" href="#beranda" data-act="toLanding">${brand(30)}</a><div class="side-role" id="who"></div><nav id="nav"></nav>
    <div class="foot-side"><button class="btn btn-ghost" style="justify-content:flex-start" data-act="cmdk">${ic('search', 18)}<span class="txt">Cari menu</span></button><button class="btn btn-ghost desk-only" style="justify-content:flex-start" data-act="collapse">${ic('side', 18)}<span class="txt">Ciutkan</span></button><button class="btn btn-ghost" style="justify-content:flex-start" data-act="${demoS ? 'toLanding' : 'logout'}">${ic('logout', 18)}<span class="txt">${demoS ? 'Ke beranda' : 'Keluar'}</span></button></div></aside>
  <div class="scrim" id="scrim" hidden data-act="drawer"></div>
  <div class="main"><div id="demoBar"></div>
    <header class="apptop"><div class="in"><button class="btn btn-ghost btn-icon mob-only" data-act="drawer" aria-label="Buka menu">${ic('menu', 20)}</button><div style="min-width:0"><div class="crumb" id="crumb"></div><div class="vtitle" id="vtitle"></div></div>
      <div class="right"><button class="cmdk-btn" data-act="cmdk" aria-label="Cari menu dan aksi">${ic('search', 16)}<span class="txt">Cari menu & aksi…</span><kbd>Ctrl K</kbd></button>${themeBtn()}${r === 'klien' ? `<button class="btn btn-ghost btn-icon bell" data-act="notif" aria-label="Notifikasi">${ic('bell', 18)}<span class="dot" id="bellDot" ${S.unread ? '' : 'hidden'}></span></button>` : ''}<span class="avatar" id="avatar" style="width:36px;height:36px;border-radius:12px;font-size:13px"></span></div></div></header>
    <main class="view" id="view" tabindex="-1"></main></div></div><div class="notif-panel" id="notifPanel" hidden></div>`);
}
function render() {
  if (S.screen !== 'app') return;
  const r = S.role, all = flat(r), t = all.find(x => x[0] === S.tab[r]) || all[0];
  if (!$('#appRoot')) shell();
  const who = r === 'klien' ? [S.client.name, `${S.client.type} · ${S.projects.length > 1 ? S.projects.length + ' proyek' : 'Paket ' + (PKG.find(p => p.id === S.project.pkg) || {}).name}`] : ['Tim INVICTA', 'Ruang tim · demo juri'];
  slot('who', `<span class="avatar ${avc(who[0])}">${initials(who[0])}</span><div class="meta"><b>${esc(who[0])}</b><small>${esc(who[1])}</small>${r === 'klien' ? projectPicker() : ''}</div>`);
  const badge = { proyek: r === 'klien' && [5, 6].includes(S.project.step) ? '!' : '' };
  slot('nav', TABS[r].map(([g, items]) => `<div class="grp">${g}</div>` + items.map(x => `<button type="button" class="${x[0] === t[0] ? 'on' : ''}" data-act="tab" data-t="${x[0]}" ${x[0] === t[0] ? 'aria-current="page"' : ''} title="${x[1]}">${ic(x[2], 18)}<span class="txt">${x[1]}</span>${badge[x[0]] ? `<span class="badge">${badge[x[0]]}</span>` : ''}</button>`).join('')).join(''));
  slot('crumb', `<span>${r === 'klien' ? 'Portal klien' : 'Ruang tim'}</span><span>/</span><span>${t[1]}</span>`);
  $('#vtitle').textContent = t[1];
  const av = r === 'klien' ? S.client.name : 'Tim Invicta'; $('#avatar').textContent = initials(av); $('#avatar').className = 'avatar ' + avc(av);
  const md = mode(), mi = MODE_INFO[md];
  slot('demoBar', S.session && S.session.demo ? `<div class="demo-bar"><span class="mode-tag demo" title="${mi.d}">${mi.l}</span> <b>${r === 'klien' ? 'Portal klien demo' : 'Ruang tim demo'}</b><span class="dtxt"> — data contoh, tersimpan sementara di perangkat ini.</span> <button class="btn btn-line btn-sm" data-act="${r === 'klien' ? 'demoTim' : 'demoKlien'}">Pindah ke ${r === 'klien' ? 'ruang tim' : 'portal klien'}</button>${r === 'klien' ? '<button class="btn btn-p btn-sm" data-act="startOrder">Pesan sungguhan</button>' : ''}<button class="btn btn-ghost btn-sm" data-act="resetDemo">Reset</button></div>` : md ? `<div class="mode-bar"><span class="mode-tag ${md}">${mi.l}</span><span>${mi.d}</span></div>` : '');
  if (isLive() && r === 'klien' && !(S.projects || []).length) slot('view', `<section class="card" style="max-width:640px"><h2>Belum ada proyek</h2><p class="muted" style="margin:8px 0 16px">Akunmu sudah aktif. Pesan paket untuk memulai proyek pertama.</p><button class="btn btn-p" data-act="startOrder">${ic('brief', 16)} Pesan sekarang</button></section>`);
  else slot('view', V[r][t[0]]());
  const v = $('#view'); v.style.animation = 'none'; v.offsetHeight; v.style.animation = '';
  updateBell(); setHash();
}
Object.assign(hooks, { render, go, enterApp, setHash, persist, goOrder: () => { go('order'); renderOrder(); setHash(); }, renderLogin: () => slot('login', loginHTML()) });

/* notifikasi & command palette */
function drawNotif() { slot('notifPanel', `<div class="row" style="margin-bottom:8px"><b>Notifikasi</b><button class="btn btn-ghost btn-sm" data-act="notifClear">Tandai dibaca</button></div>${S.notifs.length ? S.notifs.map(n => `<div class="notif">${ic('bell', 16)}<div>${esc(n.t)}<small>${n.d}</small></div></div>`).join('') : '<p class="note">Belum ada notifikasi.</p>'}`); }
let cmdItems = [], cmdSel = 0;
function cmdList() {
  const it = [];
  if (S.screen === 'app') flat(S.role).forEach(t => it.push({ l: t[1], g: 'Buka', ic: t[2], run: () => { S.tab[S.role] = t[0]; render(); } }));
  it.push({ l: 'Pesan paket baru', g: 'Aksi', ic: 'brief', run: () => A.startOrder() }, { l: 'Coba Brand Kit', g: 'Beranda', ic: 'spark', run: () => A.jump({ dataset: { to: 'coba-kit' } }) }, { l: 'Demo Syariah Check', g: 'Beranda', ic: 'shield', run: () => A.jump({ dataset: { to: 'syariah-check' } }) }, { l: 'Paket & harga', g: 'Beranda', ic: 'tag', run: () => A.jump({ dataset: { to: 'paket' } }) });
  it.push({ l: 'Portal klien (demo)', g: 'Demo', ic: 'user', run: () => demo('klien') }, { l: 'Ruang tim (demo)', g: 'Demo', ic: 'chart', run: () => demo('tim') }, { l: 'Ganti tema terang/gelap', g: 'Tampilan', ic: 'moon', run: () => A.theme() });
  if (S.session && !S.session.demo) it.push({ l: 'Keluar', g: 'Akun', ic: 'logout', run: () => A.logout() });
  return it;
}
function drawCmd(q) { const qq = (q || '').toLowerCase().trim(); cmdItems = cmdList().filter(x => !qq || (x.l + x.g).toLowerCase().includes(qq)); cmdSel = Math.min(cmdSel, Math.max(0, cmdItems.length - 1)); slot('cmdList', cmdItems.length ? cmdItems.map((x, i) => `<li><button class="${i === cmdSel ? 'on' : ''}" data-act="cmdRun" data-i="${i}">${ic(x.ic, 18)}<span>${esc(x.l)}</span><span class="grp">${x.g}</span></button></li>`).join('') : '<li class="note" style="padding:12px">Tidak ditemukan.</li>'); }
const openCmd = () => { $('#cmdk').hidden = false; const i = $('#cmdIn'); i.value = ''; cmdSel = 0; drawCmd(''); setTimeout(() => i.focus(), 20); };
const closeCmd = () => { $('#cmdk').hidden = true; };

/* routing */
function currentHash() {
  if (S.screen === 'landing') return null;
  if (S.screen === 'login') return 'masuk';
  if (S.screen === 'order') return 'pesan';
  return (S.role === 'tim' ? 'tim-' : 'portal-') + S.tab[S.role];
}
function setHash() {
  const h = currentHash();
  if (h === null) { if (/^#(masuk|pesan|portal-|tim-|demo-)/.test(location.hash)) try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { } return; }
  if (location.hash.slice(1) !== h) try { history.pushState(null, '', '#' + h); } catch (e) { location.hash = h; }
}
function route() {
  const h = decodeURIComponent(location.hash.slice(1)); let m;
  if (!h || h === 'beranda') { if (S.screen !== 'landing') go('landing'); return; }
  if (h === currentHash()) return;
  if (h === 'masuk') return A.start();
  if (h === 'pesan' || h.startsWith('pesan-')) { const p = h.split('-')[1]; newOrder(PKG.some(x => x.id === p) ? p : 'brand'); return hooks.goOrder(); }
  if (h === 'demo-klien') return demo('klien');
  if (h === 'demo-tim') return demo('tim');
  if ((m = h.match(/^(portal|tim)-([a-z]+)$/))) {
    const role = m[1] === 'tim' ? 'tim' : 'klien';
    if (!S.session || S.session.role !== role) { if (role !== 'tim') { A.start(); return toast('Masuk dulu, atau coba portal demo', true); } demo('tim'); }
    S.role = role; if (flat(role).some(t => t[0] === m[2])) S.tab[role] = m[2];
    if (S.screen !== 'app') { go('app'); shell(); }
    return render();
  }
  if (document.getElementById(h) && S.screen !== 'landing') { go('landing'); setTimeout(() => { const s = document.getElementById(h); s && s.scrollIntoView(); }, 30); }
}

Object.assign(A, {
  start: () => { S.auth.err = []; go('login'); slot('login', loginHTML()); setHash(); },
  toLanding: () => go('landing'),
  toTop: () => { if (S.screen !== 'landing') go('landing'); scrollTo({ top: 0, behavior: 'smooth' }); },
  openDash: () => { if (S.session) enterApp(S.session.role); },
  demoKlien: () => demo('klien'),
  demoTim: () => demo('tim'),
  resetDemo: () => demo(S.role),
  logout: async () => { const wasLive = isLive(); endSession(); S.role = null; go('landing'); if (wasLive) await liveSignOut(); toast('Kamu sudah keluar'); },
  juriLogin: async el => { el.disabled = true; el.textContent = 'Menghubungkan…'; try { if (!(await liveSignIn(CONFIG.juri.email, CONFIG.juri.password))) toast('Akun juri belum disiapkan', true); } catch (e) { toast('Server tidak terjangkau: ' + e.message, true); } el.disabled = false; el.textContent = 'Masuk sebagai juri'; },
  tab: el => { if (S.screen !== 'app') return; closeModal(); S.tab[S.role] = el.dataset.t; S.ui.drawer = false; const ar = $('#appRoot'); ar && ar.classList.remove('drawer'); const sc = $('#scrim'); if (sc) sc.hidden = true; render(); scrollTo(0, 0); },
  collapse: () => { S.ui.collapsed = !S.ui.collapsed; $('#appRoot').classList.toggle('collapsed', S.ui.collapsed); },
  drawer: () => { S.ui.drawer = !S.ui.drawer; $('#appRoot').classList.toggle('drawer', S.ui.drawer); $('#scrim').hidden = !S.ui.drawer; },
  notif: () => { const p = $('#notifPanel'); p.hidden = !p.hidden; if (!p.hidden) { drawNotif(); S.unread = 0; updateBell(); } },
  notifClear: () => { S.unread = 0; updateBell(); $('#notifPanel').hidden = true; },
  cmdk: () => openCmd(),
  cmdRun: el => { const x = cmdItems[+el.dataset.i]; closeCmd(); x && x.run(); },
  cmdClose: (el, e) => { if (e.target.id === 'cmdk') closeCmd(); }
});
I.cmd = el => { cmdSel = 0; drawCmd(el.value); };

/* delegasi event */
document.addEventListener('click', e => {
  const np = $('#notifPanel'); if (np && !np.hidden && !e.target.closest('#notifPanel') && !e.target.closest('[data-act="notif"]')) np.hidden = true;
  const el = e.target.closest('[data-act]'); if (!el) return; const fn = A[el.dataset.act]; if (!fn) return;
  if (el.tagName === 'A' || (el.tagName === 'BUTTON' && el.type !== 'submit')) e.preventDefault();
  fn(el, e); if (S.screen === 'app') persist();
});
document.addEventListener('input', e => { const el = e.target.closest('[data-in]'); if (el && I[el.dataset.in]) { I[el.dataset.in](el, e); if (S.screen === 'app') persist(); } });
document.addEventListener('change', e => { const el = e.target.closest('[data-ch]'); if (el && C[el.dataset.ch]) { C[el.dataset.ch](el, e); if (S.screen === 'app') persist(); } });
document.addEventListener('submit', e => { const f = e.target.closest('[data-form]'); if (!f) return; e.preventDefault(); const fn = F[f.dataset.form]; if (fn) fn(f, e); if (S.screen === 'app') persist(); });
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#cmdk').hidden ? openCmd() : closeCmd(); return; }
  if (!$('#cmdk').hidden) {
    if (e.key === 'Escape') return closeCmd();
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); cmdSel = (cmdSel + (e.key === 'ArrowDown' ? 1 : -1) + cmdItems.length) % Math.max(1, cmdItems.length); drawCmd($('#cmdIn').value); }
    if (e.key === 'Enter') { e.preventDefault(); const x = cmdItems[cmdSel]; closeCmd(); x && x.run(); }
    return;
  }
  if (e.key === 'Escape') { if (!$('#ovl').hidden) closeModal(); else if (S.chat.open) A.chatToggle(); else { const np = $('#notifPanel'); if (np) np.hidden = true; } }
  if (e.key === '/' && S.screen === 'app' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openCmd(); }
});
addEventListener('hashchange', route);

/* boot */
setTheme(getTheme());
loadAccounts();
mountLanding();
slot('chatWidget', chatWidgetHTML());
const restored = restoreSession();
if (restored === 'live') { S.session = null; if (liveConfigured()) enterLive().then(() => { const h = location.hash.slice(1); if (/^(portal|tim)-/.test(h)) route(); }).catch(() => { clearSession(); toast('Sesi live berakhir, silakan masuk lagi', true); }); else clearSession(); }
const h0 = restored === 'live' ? '' : location.hash.slice(1);
if (h0 && h0 !== 'beranda' && !document.getElementById(h0)) { S.screen = 'landing'; route(); if (S.screen === 'landing') go('landing'); }
else { go('landing'); if (h0) setTimeout(() => { const s = document.getElementById(h0); s && s.scrollIntoView(); }, 80); }
