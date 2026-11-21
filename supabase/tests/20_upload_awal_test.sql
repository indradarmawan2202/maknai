insert into auth.users (id, email) values ('11111111-1111-1111-1111-111111111111','a@a.id'),('22222222-2222-2222-2222-222222222222','b@b.id');
set role authenticated; set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
insert into public.orders (pkg) values ('starter');
insert into public.checks (order_id, stage, photo_path) select id, 'awal', id::text || '/1.jpg' from public.orders;
select 'U1 klien catat foto audit awal' t, count(*) = 1 ok from public.checks;
\echo U2 klien catat check akhir (harus GAGAL):
insert into public.checks (order_id, stage, photo_path) select id, 'akhir', id::text || '/2.jpg' from public.orders;
\echo U3 path di luar folder pesanan (harus GAGAL):
insert into public.checks (order_id, stage, photo_path) select id, 'awal', 'lain/3.jpg' from public.orders;
\echo U4 klien isi hasil butir sendiri (harus GAGAL):
insert into public.check_items (check_id, butir, status, sumber) select id, 0, 'sesuai', 'tim' from public.checks;
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
\echo U5 klien B catat foto di pesanan A (harus GAGAL):
insert into public.checks (order_id, stage, photo_path) select id, 'awal', id::text || '/x.jpg' from public.orders;
reset role; select 'U5b pesanan A tak terlihat B → insert 0' t, count(*) = 1 ok from public.checks;
