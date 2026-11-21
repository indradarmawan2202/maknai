/* Adapter Supabase untuk mode Live. Dimuat dinamis oleh store.js hanya bila config.js terisi.
   Semua akses data dibatasi RLS di server (lihat supabase/migrations). Kode ini tidak memberi hak apa pun. */
import { CONFIG } from './config.js';

let sb = null;
export async function client() {
  if (sb) return sb;
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  sb = createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, { auth: { persistSession: true, storageKey: 'maknai.live.auth' } });
  return sb;
}
const must = ({ data, error }) => { if (error) throw error; return data; };

/* ---------- auth ---------- */
export async function signIn(email, password) { const c = await client(); return must(await c.auth.signInWithPassword({ email, password })); }
export async function signUp(email, password, fullName) { const c = await client(); return must(await c.auth.signUp({ email, password, options: { data: { full_name: fullName } } })); }
export async function signOut() { const c = await client(); await c.auth.signOut(); }
export async function me() {
  const c = await client(); const { data: { user } } = await c.auth.getUser(); if (!user) return null;
  const prof = must(await c.from('profiles').select('id, full_name, role, is_demo').eq('id', user.id).single());
  return { user, profile: prof };
}

/* ---------- pesanan ---------- */
const ORDER_SEL = 'id, pkg, step, total, dp_paid, paid, revisions, is_demo, created_at, updated_at, client_id, profiles(full_name), briefs(*), checks(id, stage, photo_path, created_at, check_items(*)), payments(id, kind, amount, status, created_at), revision_notes:revisions(note, created_at), production_logs(*)';
export async function listOrders() { const c = await client(); return must(await c.from('orders').select(ORDER_SEL).order('created_at', { ascending: false })); }

/* Baris DB → bundle proyek yang dipakai UI (bentuk sama dengan seed()). */
const dShort = t => new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
export function toBundle(row) {
  const b = row.briefs || {}, latest = st => (row.checks || []).filter(x => x.stage === st).sort((a, z) => z.created_at.localeCompare(a.created_at))[0];
  const chk = st => {
    const x = latest(st); if (!x) return null;
    const its = x.check_items || [];
    return { stage: st, id: x.id, at: dShort(x.created_at), src: 'live', photoPath: x.photo_path, pending: !its.length,
      items: its.length ? Array.from({ length: 8 }, (_, i) => { const it = its.find(y => y.butir === i); return it ? { status: it.status, temuan: it.temuan, saran: it.saran, sumber: it.sumber, verified: !!it.verified_at, by: it.verified_at ? 'Tim Maknai' : '' } : { status: 'verifikasi', temuan: 'Butir belum diperiksa.', sumber: 'aturan' }; }) : [] };
  };
  const logs = row.production_logs || [];
  const pays = (row.payments || []).slice().sort((a, z) => a.created_at.localeCompare(z.created_at));
  const pkgName = { starter: 'Starter', brand: 'Brand', premium: 'Premium' }[row.pkg];
  return {
    id: row.id, live: true,
    brief: { name: b.name || '—', biz: b.biz || 'Produk santri', values: b.brand_values && b.brand_values.length ? b.brand_values : ['Amanah'], story: b.story || '', city: b.city || '', target: b.target || '', halal: !!b.halal, halalNo: b.halal_cert_no || '', seed: b.seed || 0, shape: b.shape || 'kotak' },
    project: { pkg: row.pkg, step: row.step, revisions: row.revisions, notes: (row.revision_notes || []).map(r => r.note), dp: row.dp_paid, paid: row.paid, approved: row.step >= 6, started: dShort(row.created_at), doneAt: row.paid ? dShort(row.updated_at) : '', total: row.total,
      checks: { awal: chk('awal'), akhir: chk('akhir') },
      log: { ai: logs.filter(l => l.kind === 'ai').map(l => ({ id: l.id, tool: l.ai_tool || l.name, usage: l.ai_usage || '', disclosed: l.disclosed })),
        assets: logs.filter(l => l.kind === 'aset').map(l => ({ id: l.id, name: l.name, source_type: l.source_type || '', source_ref: l.source_reference || '', license: l.license_type || '', verified: l.verification_status === 'terverifikasi' })) } },
    invoices: pays.map(p => ({ id: 'PAY-' + p.id.slice(0, 4).toUpperCase(), l: `${p.kind === 'dp' ? 'Uang muka 50%' : 'Pelunasan 50%'} — Paket ${pkgName}`, a: p.amount, s: p.status === 'simulasi' || p.status === 'lunas' ? 'Lunas' : 'Menunggu', d: dShort(p.created_at) })),
    clientName: row.profiles && row.profiles.full_name, isDemo: row.is_demo
  };
}
/* Pesanan untuk papan Ruang Tim. */
export const toTeamItem = row => ({ id: row.id, c: (row.briefs && row.briefs.name) || '—', p: row.pkg, s: Math.min(row.step, 6), by: (row.profiles && row.profiles.full_name) || '—', demo: row.is_demo, ref: row.id });

export async function createOrder(pkg, brief) {
  const c = await client();
  const order = must(await c.from('orders').insert({ pkg }).select('id').single());
  must(await c.from('briefs').insert({ order_id: order.id, name: brief.name, biz: brief.biz, brand_values: brief.values, story: brief.story, city: brief.city, target: brief.target, halal: !!brief.halal, halal_cert_no: brief.halalNo || null, shape: brief.shape, seed: brief.seed || 0 }));
  return order.id;
}
export async function advance(orderId, step) { const c = await client(); return must(await c.from('orders').update({ step }).eq('id', orderId)); }

/* ---------- foto label (bucket privat + signed URL) ---------- */
export async function uploadLabel(orderId, file) {
  const c = await client(), ext = (file.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
  const path = `${orderId}/${Date.now()}.${ext}`;
  must(await c.storage.from('labels').upload(path, file, { contentType: file.type, upsert: false }));
  return path;
}
export async function signedUrl(path, seconds = 600) { const c = await client(); return must(await c.storage.from('labels').createSignedUrl(path, seconds)).signedUrl; }

/* ---------- Syariah Check (Edge Function menyimpan API key Gemini) ---------- */
export async function analyze(orderId, stage, photoPath) {
  const c = await client();
  return must(await c.functions.invoke('analyze-label', { body: { order_id: orderId, stage, photo_path: photoPath } }));
}
export async function verifyItem(checkId, butir, status, note) { const c = await client(); return must(await c.rpc('verify_check_item', { p_check: checkId, p_butir: butir, p_status: status, p_note: note || null })); }

/* ---------- realtime ---------- */
export async function subscribe(onChange) {
  const c = await client();
  const ch = c.channel('maknai-orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'check_items' }, onChange)
    .subscribe();
  return () => c.removeChannel(ch);
}

/* ---------- RPC sisi klien (validasi di server) ---------- */
export async function rpc(fn, args) { const c = await client(); return must(await c.rpc(fn, args)); }
export const payDP = id => rpc('simulate_payment', { p_order: id, p_kind: 'dp' });
export const payOff = id => rpc('simulate_payment', { p_order: id, p_kind: 'pelunasan' });
export const requestRevision = (id, note) => rpc('request_revision', { p_order: id, p_note: note });
export const approve = id => rpc('approve_result', { p_order: id });

/* ---------- Syariah Check: tulis hasil (tim) ---------- */
export async function createCheck(orderId, stage, photoPath) { const c = await client(); return must(await c.from('checks').insert({ order_id: orderId, stage, photo_path: photoPath || null }).select('id').single()).id; }
export async function writeItems(checkId, items) {
  const c = await client();
  return must(await c.from('check_items').upsert(items.map((x, i) => ({ check_id: checkId, butir: i, status: x.status, temuan: x.temuan, saran: x.saran || null, sumber: x.sumber })), { onConflict: 'check_id,butir' }));
}
export async function addLog(orderId, entry) { const c = await client(); return must(await c.from('production_logs').insert({ order_id: orderId, ...entry })); }
