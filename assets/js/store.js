/* Sumber data Maknai.
   - demo    : data contoh (seed), untuk juri mencoba tanpa akun. Tidak pernah dikirim ke server.
   - offline : akun dibuat di perangkat ini, tersimpan di localStorage (perilaku prototipe lama).
   - live    : akun & pesanan di Supabase (aktif bila config.js terisi).
   UI membaca S.project / S.brief / S.invoices (facade proyek aktif, lihat core.js). */
import { S, C, hooks, bindActive, esc } from './core.js';
import { PIPE, PKG } from './data.js';
import { CONFIG } from './config.js';

export const liveConfigured = () => !!(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey);
export function mode() { if (!S.session) return null; if (S.session.demo) return 'demo'; return S.session.live ? 'live' : 'offline'; }
export const MODE_INFO = {
  demo: { l: 'Demo', d: 'Data contoh — tidak dikirim ke server.' },
  offline: { l: 'Offline', d: 'Tersimpan di perangkat ini saja.' },
  live: { l: 'Live', d: 'Tersinkron ke server Maknai.' }
};

/* ---------- proyek aktif ---------- */
export function selectProject(id) {
  if (!(S.projects || []).some(p => p.id === id)) return;
  S.activeId = id; bindActive(); hooks.render(); hooks.persist && hooks.persist();
}
C.pickProject = el => selectProject(el.value);
export function projectPicker() {
  const ps = S.projects || []; if (ps.length < 2) return '';
  return `<label class="proj-pick"><span class="sr-only">Proyek aktif</span><select data-ch="pickProject" aria-label="Pilih proyek">${ps.map(p => `<option value="${esc(p.id)}" ${p.id === S.activeId ? 'selected' : ''}>${esc(p.brief.name)} · ${(PKG.find(x => x.id === p.project.pkg) || {}).name || ''}</option>`).join('')}</select></label>`;
}

/* ---------- daftar pesanan untuk Ruang Tim ---------- */
/* Bentuk seragam: { id, c (nama klien/merek), p (paket), s (langkah 0–6), by, demo, ref } */
export function teamOrders() {
  if (mode() === 'live' && S.live && S.live.orders) return S.live.orders;
  const own = (S.projects || []).filter(p => p.project.step < 7).map(p => ({ id: p.id, c: p.brief.name, p: p.project.pkg, s: Math.min(p.project.step, 6), by: 'Iman', demo: true, ref: p.id }));
  const ownNames = new Set(own.map(o => o.c.toLowerCase()));
  return [...own, ...PIPE.filter(x => !ownNames.has(x.c.toLowerCase()) && !x.c.includes('Al-Hikmah')).map((x, i) => ({ id: 'pipe-' + i, ...x, demo: true }))];
}

/* ---------- adapter live (dimuat hanya bila dikonfigurasi) ---------- */
let liveMod = null;
export async function live() {
  if (!liveConfigured()) throw new Error('Mode Live belum dikonfigurasi.');
  if (!liveMod) liveMod = await import('./live.js');
  return liveMod;
}
