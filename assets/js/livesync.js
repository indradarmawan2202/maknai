/* Sinkronisasi mode Live: login Supabase, muat pesanan, realtime, dan aksi yang ditulis ke server.
   Hanya aktif bila config.js terisi. Semua keputusan hak akses ada di RLS/RPC server. */
import { S, hooks, toast, bindActive, esc } from './core.js';
import { live, liveConfigured } from './store.js';
import { runLiveRules } from './check.js';

let unsub = null, reloadT = 0;
/* Galat jaringan (server/CDN tak terjangkau) → aplikasi jatuh ke mode offline. */
export const isNetErr = e => e instanceof TypeError || /fetch|network|import|load failed|timeout/i.test((e && e.message) || '');
const L = () => live();
export const isLive = () => !!(S.session && S.session.live);

/* Masuk dengan akun Supabase. Mengembalikan false bila kredensial tidak dikenal (biar bisa jatuh ke akun offline). */
export async function liveSignIn(email, pw) {
  if (!liveConfigured()) return false;
  const m = await L();
  try { await m.signIn(email, pw); }
  catch (e) { if (/invalid|credentials/i.test(e.message || '')) return false; throw e; }
  await enterLive();
  return true;
}
export async function enterLive() {
  const m = await L(), who = await m.me(); if (!who) throw new Error('Sesi live tidak ditemukan.');
  const role = who.profile.role === 'tim' ? 'tim' : 'klien';
  S.session = { role, live: true, email: who.user.email, uid: who.user.id, demoAcc: who.profile.is_demo };
  S.live = { ready: false, orders: [], name: who.profile.full_name || who.user.email };
  await reload();
  if (unsub) unsub();
  unsub = await m.subscribe(() => { clearTimeout(reloadT); reloadT = setTimeout(() => reload().then(() => hooks.render()), 350); });
  hooks.enterApp(role);
}
/* Muat ulang semua pesanan yang boleh dilihat pengguna (RLS memfilter di server). */
export async function reload() {
  const m = await L(), rows = await m.listOrders(), keepId = S.activeId;
  const bundles = rows.map(m.toBundle);
  for (const b of bundles) for (const st of ['awal', 'akhir']) { const c = b.project.checks[st]; if (c && c.photoPath) { try { c.photo = await m.signedUrl(c.photoPath, 900); } catch (e) { } } }
  S.live.orders = rows.map(m.toTeamItem);
  S.client = { name: S.live.name, biz: bundles[0] ? bundles[0].brief.name : 'Belum ada proyek', email: S.session.email, wa: '', city: bundles[0] ? bundles[0].brief.city : '', type: 'Klien Maknai' };
  S.projects = bundles; S.activeId = bundles.some(b => b.id === keepId) ? keepId : (bundles[0] && bundles[0].id);
  if (bundles.length) bindActive();
  S.live.ready = true;
}
export async function liveSignOut() { if (unsub) { unsub(); unsub = null; } try { const m = await L(); await m.signOut(); } catch (e) { } }

/* Jalankan aksi live: tampilkan galat server apa adanya (mis. "Syariah Check akhir belum lolos"), lalu muat ulang. */
export async function act(fn, okMsg) {
  try { await fn(await L()); await reload(); if (okMsg) toast(okMsg); }
  catch (e) { toast(e.message || 'Gagal menghubungi server', true); }
  hooks.render();
}

/* ---------- pesanan baru ---------- */
export async function liveOrder(o, calc) {
  const m = await L();
  if (!isLive()) {
    const r = await m.signUp(o.contact.email.trim().toLowerCase(), o.contact.pw, o.contact.owner.trim());
    if (!r.session) { toast('Akun dibuat. Cek email untuk konfirmasi, lalu masuk.'); return false; }
  }
  const id = await m.createOrder(o.pkg, o.brief);
  await m.payDP(id);
  S.activeId = id;
  if (!isLive()) await enterLive(); else { await reload(); S.activeId = id; bindActive(); hooks.render(); }
  toast(`Uang muka ${esc(String(calc.dp))} tercatat (simulasi). Pesanan masuk ke tim.`);
  return true;
}

/* ---------- Syariah Check (tim) ---------- */
export async function liveRunCheck(bundle, stage) {
  await act(async m => {
    let ck = bundle.project.checks[stage], id = ck && ck.id;
    if (!id) id = await m.createCheck(bundle.id, stage, null);
    await m.writeItems(id, runLiveRules(bundle, stage));
  }, 'Pemeriksaan tersimpan. Putuskan butir yang masih terbuka.');
}
