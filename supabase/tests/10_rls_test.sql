-- Tes perilaku keamanan & alur. Setiap blok mensimulasikan JWT pengguna berbeda.
\set ON_ERROR_STOP 0
insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-1111-1111-111111111111', 'klien@a.id', '{"full_name":"Klien A","role":"tim"}'),
  ('22222222-2222-2222-2222-222222222222', 'klien@b.id', '{"full_name":"Klien B"}'),
  ('33333333-3333-3333-3333-333333333333', 'tim@maknai.id', '{"full_name":"Tim"}');
update public.profiles set role = 'tim' where id = '33333333-3333-3333-3333-333333333333';
select 'T1 role dari metadata diabaikan' t, role = 'klien' ok from public.profiles where id = '11111111-1111-1111-1111-111111111111';

-- Klien A membuat pesanan
set role authenticated; set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
insert into public.orders (pkg) values ('brand');
select 'T2 total ditetapkan server' t, total = 900000 and step = 0 and not dp_paid ok from public.orders;
insert into public.briefs (order_id, name, biz) select id, 'Al-Hikmah', 'Air minum & minuman' from public.orders;
\echo T3 klien coba ubah role sendiri (harus GAGAL):
update public.profiles set role = 'tim' where id = auth.uid();
\echo T4 klien coba majukan step langsung (harus 0 baris):
update public.orders set step = 5;
select 'T4b step tetap 0' t, step = 0 ok from public.orders;
\echo T5 klien coba set dp_paid (harus GAGAL, tidak ada izin kolom):
update public.orders set dp_paid = true;
select public.simulate_payment((select id from public.orders), 'dp');
select 'T6 DP simulasi via RPC' t, dp_paid and step = 1 ok from public.orders;
select public.simulate_payment((select id from public.orders), 'dp');
select 'T7 DP idempoten' t, count(*) = 1 ok from public.payments;
\echo T8 klien coba buat check (harus GAGAL RLS):
insert into public.checks (order_id, stage) select id, 'akhir' from public.orders;
insert into storage.objects (bucket_id, name) select 'labels', id::text || '/foto.jpg' from public.orders;
select 'T9 klien upload ke folder pesanannya' t, count(*) = 1 ok from storage.objects;
\echo T10 klien upload ke folder sembarang (harus GAGAL RLS):
insert into storage.objects (bucket_id, name) values ('labels', '99999999-9999-9999-9999-999999999999/x.jpg');

-- Klien B tidak melihat pesanan A
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
select 'T11 klien B tidak melihat pesanan A' t, count(*) = 0 ok from public.orders;
select 'T12 klien B tidak melihat foto A' t, count(*) = 0 ok from storage.objects;
select 'T13 klien B tidak melihat profil A' t, count(*) = 1 ok from public.profiles;

-- Tim
set request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';
select 'T14 tim melihat semua pesanan' t, count(*) = 1 ok from public.orders;
update public.orders set step = 4;
\echo T15 tim loloskan gerbang tanpa Syariah Check (harus GAGAL):
update public.orders set step = 5;
insert into public.checks (order_id, stage) select id, 'akhir' from public.orders;
insert into public.check_items (check_id, butir, status, temuan, sumber)
  select c.id, g, case when g = 4 then 'verifikasi' else 'sesuai' end, 'x', 'ai' from public.checks c, generate_series(0, 7) g;
\echo T16 masih ada butir verifikasi (harus GAGAL):
update public.orders set step = 5;
select public.verify_check_item((select id from public.checks), 4::smallint, 'sesuai', 'Nomor sertifikat dicek di BPJPH');
update public.orders set step = 5;
select 'T17 gerbang lolos setelah verifikasi' t, step = 5 ok from public.orders;

-- Klien A menyetujui & melunasi
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select public.request_revision((select id from public.orders), 'Warna dibuat lebih hangat');
select public.approve_result((select id from public.orders));
select public.simulate_payment((select id from public.orders), 'pelunasan');
select 'T18 alur selesai' t, step = 7 and paid and revisions = 1 ok from public.orders;
select 'T19 klien melihat hasil check' t, count(*) = 8 ok from public.check_items;

-- Reset demo hanya menghapus is_demo
reset role;
update public.profiles set is_demo = true where id = '22222222-2222-2222-2222-222222222222';
set role authenticated; set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
insert into public.orders (pkg) values ('starter');
select 'T20 pesanan akun demo ditandai is_demo' t, is_demo ok from public.orders;
set request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';
select count(*) as foto_dihapus from public.reset_demo();
select 'T21 reset hanya data demo' t, count(*) = 1 and bool_and(not is_demo) ok from public.orders;
\echo T22 klien coba reset demo (harus GAGAL):
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select public.reset_demo();
