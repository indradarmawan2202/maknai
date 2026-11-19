/* Maknai — inti: utilitas, ikon, state, registri aksi, persistensi, primitif UI. */
import { seed } from './data.js';

/* ---------- util ---------- */
export const $ = s => document.querySelector(s);
export const $$ = s => [...document.querySelectorAll(s)];
export const num = n => String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const rp = n => (n < 0 ? '-' : '') + 'Rp' + num(n);
export const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const slot = (id, html) => { const e = document.getElementById(id); if (e) e.innerHTML = html; };
export const NOW = new Date();
export const TODAY = NOW.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
export const SHORT = NOW.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
export const kfmt = v => v >= 1e6 ? (v / 1e6).toFixed(v % 1e6 ? 1 : 0).replace('.', ',') + ' jt' : v >= 1e3 ? (v / 1e3).toFixed(v % 1e3 && v < 1e4 ? 1 : 0).replace('.', ',') + ' rb' : String(Math.round(v));
export const rpk = v => 'Rp' + kfmt(v);
export const pc = (a, b) => b ? ((a - b) / b * 100) : 0;
export const pcs = x => (x >= 0 ? '+' : '') + x.toFixed(1).replace('.', ',') + '%';
export const dec = x => String(x).replace('.', ',');
export const initials = n => String(n).replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'Z';
export const first = n => String(n).split(' ')[0];
export const avc = s => ['', 'c2', 'c3', 'c4'][[...String(s)].reduce((a, c) => a + c.charCodeAt(0), 0) % 4];
export const sum = a => a.reduce((s, v) => s + v, 0);

/* ---------- ikon (garis 1.8) ---------- */
const P = {
  home: 'M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4',
  wallet: 'M3 7a2 2 0 012-2h13v4 M3 7v10a2 2 0 002 2h15a1 1 0 001-1v-9a1 1 0 00-1-1H5a2 2 0 01-2-2 M16 14h2',
  bot: 'M12 3v3 M7 8h10a3 3 0 013 3v5a3 3 0 01-3 3H7a3 3 0 01-3-3v-5a3 3 0 013-3z M9 13v1 M15 13v1',
  doc: 'M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6',
  chart: 'M4 20V10 M10 20V4 M16 20v-7 M22 20H2',
  layers: 'M12 3l9 5-9 5-9-5z M3 13l9 5 9-5',
  store: 'M4 9l1-5h14l1 5 M4 9a3 3 0 006 0 3 3 0 006 0 3 3 0 004 0 M5 12v8h14v-8',
  book: 'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z M4 19V5',
  tag: 'M3 12V4h8l10 10-8 8z M7.5 8.5h.01',
  check: 'M5 12l5 5 9-10',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  back: 'M19 12H5 M11 6l-6 6 6 6',
  play: 'M8 5v14l11-7z',
  copy: 'M9 9h11v11H9z M5 15V4h11',
  plus: 'M12 5v14 M5 12h14',
  trend: 'M3 17l6-6 4 4 8-8 M15 7h6v6',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2z M9 8h6 M9 12h6',
  brief: 'M4 8h16v11H4z M9 8V5h6v3',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8z M4 21c0-4 4-6 8-6s8 2 8 6',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 100-6 3 3 0 000 6z',
  sun: 'M12 16a4 4 0 100-8 4 4 0 000 8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4',
  moon: 'M21 13A9 9 0 1111 3a7 7 0 0010 10z',
  bell: 'M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8 M10 20a2 2 0 004 0',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14z M21 21l-5-5',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
  x: 'M6 6l12 12 M18 6L6 18',
  logout: 'M15 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4 M10 16l-4-4 4-4 M6 12h10',
  side: 'M4 4h16v16H4z M9 4v16',
  send: 'M4 12l16-8-6 16-3-7z',
  star: 'M12 3l2.6 5.6L20 9.5l-4 4 1 5.5-5-2.8L7 19l1-5.5-4-4 5.4-.9z',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z',
  download: 'M12 4v12 M6 11l6 6 6-6 M4 20h16',
  print: 'M7 8V3h10v5 M7 17H4v-7h16v7h-3 M7 14h10v7H7z',
  spark: 'M12 3v4 M12 17v4 M3 12h4 M17 12h4 M6 6l2.5 2.5 M15.5 15.5L18 18 M6 18l2.5-2.5 M15.5 8.5L18 6',
  calc: 'M6 3h12v18H6z M9 7h6 M9 11h.01 M12 11h.01 M15 11h.01 M9 15h.01 M12 15h.01 M15 15h.01',
  pin: 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z M12 12a2 2 0 100-4 2 2 0 000 4z',
  kanban: 'M4 4h4v16H4z M10 4h4v10h-4z M16 4h4v13h-4z',
  grad: 'M2 9l10-5 10 5-10 5z M6 11v5c3 2 9 2 12 0v-5'
};
export const ic = (n, s = 18) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n] || P.spark}"/></svg>`;

/* Monogram Maknai: huruf M serif di kotak emas (sesuai identitas proposal). */
export const LOGO = h => `<svg class="ic logo-mark" width="${h}" height="${h}" viewBox="0 0 40 40" role="img" aria-label="Logo Maknai"><rect width="40" height="40" rx="9" fill="var(--logo-b)"/><text x="20" y="29.5" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="700" font-size="27" fill="var(--logo-a)">M</text></svg>`;
export const brand = (h = 28) => `${LOGO(h)}<span class="wordmark">Maknai</span>`;

/* ---------- state ---------- */
export const S = {
  screen: 'landing', role: null, session: null,
  chat: { open: false, msgs: [], ctx: {} },
  tab: { klien: 'dash', tim: 'pipeline' },
  auth: { mode: 'login', email: '', pw: '', err: [], showPw: false },
  accounts: [],
  land: { kit: { name: 'Barokah', biz: 'Madu & herbal', values: ['Amanah', 'Hangat'], seed: 0, shape: 'kotak', story: '', city: 'Malang', halal: false }, check: {}, fixed: {}, extra: 'konten' },
  ord: null, team: { scen: 0, year: 0 },
  ui: { collapsed: false, drawer: false },
  ...seed()
};
export const SEED_KEYS = Object.keys(seed());
export const reseed = () => Object.assign(S, seed());
export const snapshot = () => { const o = {}; SEED_KEYS.forEach(k => o[k] = S[k]); return JSON.parse(JSON.stringify(o)); };

/* ---------- registri (diisi oleh modul) ---------- */
export const A = {};  // aksi klik: data-act
export const I = {};  // input: data-in
export const C = {};  // change: data-ch
export const F = {};  // submit form: data-form
export const V = { klien: {}, tim: {} }; // view dashboard
export const hooks = { render: () => {}, go: () => {} };

/* ---------- persistensi ---------- */
const LSK = 'maknai.accounts.v1', LSS = 'maknai.session.v1', LST = 'maknai.theme';
export function saveAccounts() { try { localStorage.setItem(LSK, JSON.stringify(S.accounts)); } catch (e) { } }
export function loadAccounts() { try { const v = JSON.parse(localStorage.getItem(LSK) || '[]'); if (Array.isArray(v)) S.accounts = v; } catch (e) { } }
/* Autosave: data akun asli tersimpan setiap ada perubahan; sesi demo tersimpan agar bisa dilanjutkan setelah reload. */
let saveT = 0;
export function persist() {
  clearTimeout(saveT);
  saveT = setTimeout(() => {
    try {
      if (!S.session) { localStorage.removeItem(LSS); return; }
      if (!S.session.demo) { const acc = S.accounts.find(x => x.email === S.session.email); if (acc) { acc.data = snapshot(); saveAccounts(); } }
      localStorage.setItem(LSS, JSON.stringify({ session: S.session, role: S.role, tab: S.tab, data: S.session.demo ? snapshot() : null }));
    } catch (e) { }
  }, 250);
}
export function restoreSession() {
  try {
    const v = JSON.parse(localStorage.getItem(LSS) || 'null'); if (!v || !v.session) return false;
    if (v.session.demo) { if (v.data) Object.assign(S, v.data); }
    else { const acc = S.accounts.find(x => x.email === v.session.email); if (!acc || !acc.data) return false; Object.assign(S, JSON.parse(JSON.stringify(acc.data))); }
    S.session = v.session; S.role = v.role || v.session.role; if (v.tab) S.tab = v.tab;
    return true;
  } catch (e) { return false; }
}
export function clearSession() { try { localStorage.removeItem(LSS); } catch (e) { } }
export async function hashPw(pw, salt) {
  try { const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + '|' + pw)); return Array.from(new Uint8Array(d)).map(x => x.toString(16).padStart(2, '0')).join(''); }
  catch (e) { let h = 5381; const t = salt + '|' + pw; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) >>> 0; return 'f' + h.toString(16); }
}

/* ---------- tema ---------- */
export function getTheme() { try { return localStorage.getItem(LST) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch (e) { return 'light'; } }
export function setTheme(t) { document.documentElement.dataset.theme = t; try { localStorage.setItem(LST, t); } catch (e) { } $$('[data-theme-ic]').forEach(el => el.innerHTML = ic(t === 'dark' ? 'sun' : 'moon', 18)); }
A.theme = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
export const themeBtn = () => `<button class="btn btn-ghost btn-icon" data-act="theme" aria-label="Ganti tema terang/gelap" title="Ganti tema" data-theme-ic>${ic(document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon', 18)}</button>`;

/* ---------- primitif UI ---------- */
export const chipBtn = (label, act, attrs, on) => `<button type="button" class="chip${on ? ' on' : ''}" data-act="${act}" ${attrs || ''} aria-pressed="${on ? 'true' : 'false'}">${label}</button>`;
export const seg = (opts, act, cur) => `<div class="seg" role="tablist">${opts.map(([v, l]) => `<button type="button" role="tab" class="${v === cur ? 'on' : ''}" aria-selected="${v === cur}" data-act="${act}" data-v="${esc(v)}">${l}</button>`).join('')}</div>`;
export const switchBtn = (act, on, label, extra) => `<button type="button" class="sw" role="switch" aria-checked="${!!on}" aria-label="${esc(label)}" data-act="${act}" ${extra || ''}></button>`;
export const pillTier = t => `<span class="pill ${t === 'Nano' ? 'sf' : t === 'Micro' ? 'em' : 'cl'}">${t}</span>`;
export const akadPill = a => `<span class="pill em">${a === 'Barter' ? 'Muqayadhah' : a}</span>`;
export const fld = (id, label, inner, hint) => `<div class="field"><label for="${id}">${label}</label>${inner}${hint ? `<p class="note">${hint}</p>` : ''}</div>`;
export const tile = (l, v, sub, d, icon, tone) => `<div class="card tile ${tone || ''}">${icon ? `<span class="tic">${ic(icon, 18)}</span>` : ''}<span class="lbl">${l}</span><span class="v">${v}</span>${d != null ? `<span class="delta" style="color:${d >= 0 ? 'var(--ok)' : 'var(--bad)'}">${d >= 0 ? '▲' : '▼'} ${pcs(d)} <span class="note">vs periode lalu</span></span>` : ''}${sub ? `<span class="note">${sub}</span>` : ''}</div>`;

export function toast(msg, bad) {
  const box = $('#toasts'); if (!box) return;
  const t = document.createElement('div'); t.className = 'toast' + (bad ? ' bad' : ''); t.setAttribute('role', 'status');
  t.innerHTML = ic(bad ? 'x' : 'check', 16) + '<span>' + esc(msg) + '</span>';
  box.appendChild(t); setTimeout(() => t.remove(), 3800);
  if (!bad && S.screen === 'app' && S.role) { S.notifs.unshift({ t: msg, d: 'Baru saja' }); S.notifs = S.notifs.slice(0, 30); S.unread++; updateBell(); }
}
export function updateBell() { const b = $('#bellDot'); if (b) b.hidden = !S.unread; }
let lastFocus = null;
export function openModal(html, wide) {
  lastFocus = document.activeElement;
  slot('modal', html); const m = $('#modal'); m.className = 'modal' + (wide ? ' wide' : '');
  $('#ovl').hidden = false;
  setTimeout(() => { const f = m.querySelector('input,select,textarea,button:not([data-close])'); if (f) f.focus(); }, 40);
}
export function closeModal() { $('#ovl').hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
export const modalHead = t => `<div class="card-head"><h2>${t}</h2><button class="btn btn-ghost btn-icon" data-act="closeModal" data-close="1" aria-label="Tutup">${ic('x', 18)}</button></div>`;
A.closeModal = (el, e) => { if (e.target.id === 'ovl' || el.dataset.close) closeModal(); };
A.copy = el => { const v = el.dataset.v; (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(() => toast('Disalin ke papan klip'), () => toast('Salin manual: ' + v)); };

/* ---------- grafik SVG ---------- */
export function niceMax(v) { v = Math.max(v, 1); const p = Math.pow(10, Math.floor(Math.log10(v))), m = v / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; }
let gid = 0;
export function lineChart(labels, vals, o) {
  const W = 640, H = 240, L = 54, R = 14, T = 14, B = 30, max = niceMax(Math.max(...vals) * 1.08), n = vals.length, f = o.fmt || kfmt, id = 'g' + (++gid);
  const X = i => L + (W - L - R) * (n === 1 ? .5 : i / (n - 1)), Y = v => T + (H - T - B) * (1 - v / max);
  let g = '';
  for (let k = 0; k <= 4; k++) { const v = max * k / 4, y = Y(v).toFixed(1); g += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" class="gl"/><text x="${L - 8}" y="${(+y + 4).toFixed(1)}" text-anchor="end" class="ax">${f(v)}</text>`; }
  const pts = vals.map((v, i) => [X(i), Y(v)]);
  // kurva halus (catmull-rom → bezier)
  let line = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2; const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]; line += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`; }
  const area = line + ` L${X(n - 1).toFixed(1)} ${Y(0).toFixed(1)} L${X(0).toFixed(1)} ${Y(0).toFixed(1)} Z`;
  const step = n > 8 ? 2 : 1;
  const xl = labels.map((s, i) => (n - 1 - i) % step === 0 ? `<text x="${X(i).toFixed(1)}" y="${H - 8}" text-anchor="middle" class="ax">${s}</text>` : '').join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="${esc(o.label)}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.color}" stop-opacity=".28"/><stop offset="1" stop-color="${o.color}" stop-opacity="0"/></linearGradient></defs>${g}<path d="${area}" fill="url(#${id})"/><path d="${line}" fill="none" stroke="${o.color}" stroke-width="2.6" stroke-linecap="round"/>${pts.map((p, i) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i === n - 1 ? 5.5 : 3.2}" class="pt" stroke="${o.color}" stroke-width="2" ${i === n - 1 ? `fill="${o.color}"` : ''}><title>${labels[i]}: ${f(vals[i])}</title></circle>`).join('')}${xl}</svg>`;
}
export function donut(parts, size = 150, center = '') {
  const tot = sum(parts.map(p => p[1])) || 1, r = 52, c = 2 * Math.PI * r; let off = 0;
  const segs = parts.map(p => { const len = c * p[1] / tot, s = `<circle cx="70" cy="70" r="${r}" fill="none" stroke="${p[2]}" stroke-width="18" stroke-dasharray="${len.toFixed(2)} ${(c - len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 70 70)"><title>${p[0]}: ${p[3] || p[1]}</title></circle>`; off += len; return s; }).join('');
  return `<div class="donut-wrap"><svg width="${size}" height="${size}" viewBox="0 0 140 140" role="img" aria-label="Diagram donat"><circle cx="70" cy="70" r="${r}" fill="none" stroke="var(--paper-2)" stroke-width="18"/>${segs}<text x="70" y="76" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="17" fill="var(--ink)">${center}</text></svg>
  <div class="stack" style="gap:8px;flex:1;min-width:160px">${parts.map(p => `<div class="row nowrap" style="font-size:14px"><span><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${p[2]};margin-right:8px"></i>${p[0]}</span><b class="tnum">${p[3] || p[1]}</b></div>`).join('')}</div></div>`;
}
export function ring(sc, size = 104, color = 'var(--emerald-2)') {
  const r = 44, c = 2 * Math.PI * r;
  return `<svg width="${size}" height="${size}" viewBox="0 0 104 104" role="img" aria-label="Skor ${sc}"><circle cx="52" cy="52" r="${r}" fill="none" stroke="var(--paper-2)" stroke-width="9"/><circle cx="52" cy="52" r="${r}" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${(c * sc / 100).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 52 52)"/><text x="52" y="60" text-anchor="middle" font-size="26" font-weight="700" fill="var(--ink)" font-family="JetBrains Mono, monospace">${sc}</text></svg>`;
}
export const hbar = (rows, tone) => { const mx = Math.max(...rows.map(r => r[1]), 1); return `<div class="stack" style="gap:12px">${rows.map(r => `<div class="metric" style="grid-template-columns:130px minmax(0,1fr) auto"><span class="muted">${r[0]}</span><div class="bar ${tone || ''}"><i style="width:${Math.round(r[1] / mx * 100)}%"></i></div><b class="tnum">${r[2]}</b></div>`).join('')}</div>`; };
export const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

/* ---------- unduh CSV ---------- */
export function downloadCSV(name, rows) {
  const csv = rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
