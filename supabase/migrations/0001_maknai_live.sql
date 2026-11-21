-- Maknai Live — skema awal, RLS, storage, realtime.
-- Prinsip:
--   * Role tim TIDAK pernah ditentukan dari frontend. Profil baru selalu 'klien';
--     menjadikan seseorang 'tim' hanya lewat SQL editor / service role (lihat bagian akhir).
--   * Semua tabel ber-RLS. Klien hanya melihat pesanannya sendiri; tim melihat semua.
--   * Klien tidak bisa mengubah step/pembayaran/hasil Syariah Check secara langsung;
--     perubahan dari sisi klien lewat fungsi RPC yang memvalidasi status.
--   * is_demo adalah penanda data, bukan mekanisme keamanan.

create extension if not exists pgcrypto;

-- =====================================================================
-- Profil
-- =====================================================================
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '',
  role        text not null default 'klien' check (role in ('klien', 'tim')),
  is_demo     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Dipanggil trigger saat user mendaftar. Role selalu 'klien', apa pun isi metadata.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(left(new.raw_user_meta_data ->> 'full_name', 120), ''), 'klien');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_tim() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'tim');
$$;

-- =====================================================================
-- Pesanan & brief
-- =====================================================================
create table public.orders (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  pkg         text not null check (pkg in ('starter', 'brand', 'premium')),
  step        smallint not null default 0 check (step between 0 and 7),
  total       integer not null default 0,
  dp_paid     boolean not null default false,
  paid        boolean not null default false,
  revisions   smallint not null default 0 check (revisions between 0 and 2),
  is_demo     boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index orders_client_idx on public.orders (client_id);

-- Harga & penanda demo ditetapkan server, bukan dikirim klien.
create or replace function public.orders_before_write() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    new.client_id := coalesce(auth.uid(), new.client_id);
    new.step := 0; new.dp_paid := false; new.paid := false; new.revisions := 0;
    new.is_demo := coalesce((select is_demo from public.profiles where id = new.client_id), false);
  end if;
  new.total := case new.pkg when 'starter' then 350000 when 'brand' then 900000 when 'premium' then 2000000 end;
  new.updated_at := now();
  return new;
end $$;
create trigger orders_before_write before insert or update on public.orders
  for each row execute function public.orders_before_write();

create table public.briefs (
  order_id       uuid primary key references public.orders (id) on delete cascade,
  name           text not null check (char_length(name) between 1 and 60),
  biz            text not null,
  brand_values   text[] not null default '{}',
  story          text not null default '',
  city           text not null default '',
  target         text not null default '',
  halal          boolean not null default false,
  halal_cert_no  text,
  shape          text not null default 'kotak',
  seed           integer not null default 0,
  updated_at     timestamptz not null default now()
);

-- =====================================================================
-- Syariah Check: dua titik (awal/akhir), 8 butir, 3 status
-- =====================================================================
create table public.checks (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders (id) on delete cascade,
  stage       text not null check (stage in ('awal', 'akhir')),
  photo_path  text,
  model       text,
  created_by  uuid default auth.uid() references public.profiles (id),
  created_at  timestamptz not null default now()
);
create index checks_order_idx on public.checks (order_id, stage);

create table public.check_items (
  check_id     uuid not null references public.checks (id) on delete cascade,
  butir        smallint not null check (butir between 0 and 7),
  status       text not null check (status in ('sesuai', 'perbaikan', 'verifikasi')),
  temuan       text not null default '',
  saran        text,
  sumber       text not null check (sumber in ('ai', 'aturan', 'tim', 'contoh')),
  verified_by  uuid references public.profiles (id),
  verified_at  timestamptz,
  primary key (check_id, butir)
);

-- =====================================================================
-- Log produksi (bukti butir 6 lisensi aset & 7 etika AI)
-- =====================================================================
create table public.production_logs (
  id                   uuid primary key default gen_random_uuid(),
  order_id             uuid not null references public.orders (id) on delete cascade,
  kind                 text not null check (kind in ('aset', 'ai')),
  name                 text not null,
  source_type          text,           -- Original / Stock / Open source
  source_reference     text,           -- ID aset, URL, atau nama desainer
  license_type         text,           -- Commercial / SIL OFL / ...
  ai_tool              text,
  ai_usage             text,
  disclosed            boolean not null default false,
  verification_status  text not null default 'belum' check (verification_status in ('belum', 'terverifikasi')),
  created_by           uuid default auth.uid() references public.profiles (id),
  created_at           timestamptz not null default now()
);
create index production_logs_order_idx on public.production_logs (order_id);

-- =====================================================================
-- Revisi & pembayaran (pembayaran masih simulasi; Midtrans menyusul)
-- =====================================================================
create table public.revisions (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders (id) on delete cascade,
  note        text not null check (char_length(note) between 5 and 1000),
  created_by  uuid default auth.uid() references public.profiles (id),
  created_at  timestamptz not null default now()
);

create table public.payments (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders (id) on delete cascade,
  kind          text not null check (kind in ('dp', 'pelunasan')),
  amount        integer not null check (amount > 0),
  status        text not null default 'simulasi' check (status in ('simulasi', 'pending', 'lunas', 'gagal')),
  provider      text not null default 'simulasi',
  provider_ref  text unique,                       -- idempotensi webhook (order_id Midtrans)
  created_at    timestamptz not null default now(),
  unique (order_id, kind)
);

-- Pencatat panggilan AI untuk pembatasan frekuensi di Edge Function.
create table public.ai_calls (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  fn          text not null,
  created_at  timestamptz not null default now()
);
create index ai_calls_user_time_idx on public.ai_calls (user_id, created_at desc);

-- =====================================================================
-- Hak akses dasar: cabut lalu beri seperlunya
-- =====================================================================
revoke all on all tables in schema public from anon, authenticated;
grant select on public.profiles, public.orders, public.briefs, public.checks, public.check_items,
  public.production_logs, public.revisions, public.payments to authenticated;
grant update (full_name) on public.profiles to authenticated;
grant insert (pkg) on public.orders to authenticated;
grant update (step) on public.orders to authenticated;            -- dibatasi RLS: hanya tim
grant insert, update on public.briefs to authenticated;            -- dibatasi RLS
grant insert on public.checks to authenticated;                    -- dibatasi RLS: hanya tim
grant insert, update on public.check_items to authenticated;       -- dibatasi RLS: hanya tim
grant insert, update on public.production_logs to authenticated;   -- dibatasi RLS: hanya tim

alter table public.profiles        enable row level security;
alter table public.orders          enable row level security;
alter table public.briefs          enable row level security;
alter table public.checks          enable row level security;
alter table public.check_items     enable row level security;
alter table public.production_logs enable row level security;
alter table public.revisions       enable row level security;
alter table public.payments        enable row level security;
alter table public.ai_calls        enable row level security;  -- tanpa policy: hanya service role

create or replace function public.can_see_order(o uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.orders where id = o and (client_id = auth.uid() or public.is_tim()));
$$;

-- profiles
create policy profiles_read on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_tim());
create policy profiles_update_self on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- orders
create policy orders_read on public.orders for select to authenticated
  using (client_id = auth.uid() or public.is_tim());
create policy orders_insert_self on public.orders for insert to authenticated
  with check (client_id = auth.uid());
create policy orders_update_tim on public.orders for update to authenticated
  using (public.is_tim()) with check (public.is_tim());

-- briefs: klien boleh mengisi/mengubah brief miliknya selama pesanan belum melewati langkah 1
create policy briefs_read on public.briefs for select to authenticated using (public.can_see_order(order_id));
create policy briefs_insert on public.briefs for insert to authenticated
  with check (public.is_tim() or exists (select 1 from public.orders o where o.id = order_id and o.client_id = auth.uid() and o.step <= 1));
create policy briefs_update on public.briefs for update to authenticated
  using (public.is_tim() or exists (select 1 from public.orders o where o.id = order_id and o.client_id = auth.uid() and o.step <= 1))
  with check (public.is_tim() or exists (select 1 from public.orders o where o.id = order_id and o.client_id = auth.uid() and o.step <= 1));

-- checks & items: dibaca pemilik pesanan dan tim; ditulis hanya tim (Edge Function memakai JWT pengguna)
create policy checks_read on public.checks for select to authenticated using (public.can_see_order(order_id));
create policy checks_insert_tim on public.checks for insert to authenticated with check (public.is_tim());
create policy check_items_read on public.check_items for select to authenticated
  using (exists (select 1 from public.checks c where c.id = check_id and public.can_see_order(c.order_id)));
create policy check_items_write_tim on public.check_items for insert to authenticated with check (public.is_tim());
create policy check_items_update_tim on public.check_items for update to authenticated using (public.is_tim()) with check (public.is_tim());

-- log produksi
create policy logs_read on public.production_logs for select to authenticated using (public.can_see_order(order_id));
create policy logs_insert_tim on public.production_logs for insert to authenticated with check (public.is_tim());
create policy logs_update_tim on public.production_logs for update to authenticated using (public.is_tim()) with check (public.is_tim());

-- revisi & pembayaran: baca saja; tulis lewat RPC
create policy revisions_read on public.revisions for select to authenticated using (public.can_see_order(order_id));
create policy payments_read on public.payments for select to authenticated using (public.can_see_order(order_id));

-- =====================================================================
-- RPC (security definer, memvalidasi pemilik & status)
-- =====================================================================
-- Simulasi pembayaran DP/pelunasan (sampai Midtrans terpasang).
create or replace function public.simulate_payment(p_order uuid, p_kind text) returns void
language plpgsql security definer set search_path = public as $$
declare o public.orders;
begin
  select * into o from public.orders where id = p_order for update;
  if o.id is null or o.client_id <> auth.uid() then raise exception 'Pesanan tidak ditemukan'; end if;
  if p_kind = 'dp' then
    if o.dp_paid then return; end if;
    insert into public.payments (order_id, kind, amount) values (o.id, 'dp', o.total / 2);
    update public.orders set dp_paid = true, step = greatest(step, 1) where id = o.id;
  elsif p_kind = 'pelunasan' then
    if o.paid then return; end if;
    if o.step <> 6 then raise exception 'Pelunasan dibuka setelah hasil disetujui'; end if;
    insert into public.payments (order_id, kind, amount) values (o.id, 'pelunasan', o.total - o.total / 2);
    update public.orders set paid = true, step = 7 where id = o.id;
  else raise exception 'Jenis pembayaran tidak dikenal'; end if;
end $$;

create or replace function public.request_revision(p_order uuid, p_note text) returns void
language plpgsql security definer set search_path = public as $$
declare o public.orders;
begin
  select * into o from public.orders where id = p_order for update;
  if o.id is null or o.client_id <> auth.uid() then raise exception 'Pesanan tidak ditemukan'; end if;
  if o.step <> 5 then raise exception 'Revisi hanya saat presentasi'; end if;
  if o.revisions >= 2 then raise exception 'Kuota revisi habis'; end if;
  insert into public.revisions (order_id, note) values (o.id, p_note);
  update public.orders set revisions = revisions + 1 where id = o.id;
end $$;

create or replace function public.approve_result(p_order uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.orders set step = 6 where id = p_order and client_id = auth.uid() and step = 5;
  if not found then raise exception 'Hasil belum siap disetujui'; end if;
end $$;

-- Keputusan tim atas satu butir.
create or replace function public.verify_check_item(p_check uuid, p_butir smallint, p_status text, p_note text default null) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_tim() then raise exception 'Hanya tim'; end if;
  update public.check_items
     set status = p_status, verified_by = auth.uid(), verified_at = now(),
         temuan = case when p_note is null then temuan else temuan || ' Catatan tim: ' || p_note end
   where check_id = p_check and butir = p_butir;
  if not found then raise exception 'Butir tidak ditemukan'; end if;
end $$;

-- Tim memajukan pesanan; gerbang langkah 5 hanya terbuka bila Syariah Check akhir lolos.
create or replace function public.gate_passed(p_order uuid) returns boolean
language sql stable security definer set search_path = public as $$
  with c as (select id from public.checks where order_id = p_order and stage = 'akhir' order by created_at desc limit 1)
  select exists (select 1 from c)
     and (select count(*) from public.check_items i join c on i.check_id = c.id) = 8
     and not exists (select 1 from public.check_items i join c on i.check_id = c.id where i.status <> 'sesuai');
$$;
create or replace function public.orders_gate() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.step >= 5 and old.step = 4 and not public.gate_passed(new.id) then
    raise exception 'Syariah Check akhir belum lolos';
  end if;
  return new;
end $$;
create trigger orders_gate before update of step on public.orders
  for each row execute function public.orders_gate();

revoke execute on function public.simulate_payment(uuid, text), public.request_revision(uuid, text),
  public.approve_result(uuid), public.verify_check_item(uuid, smallint, text, text) from public, anon;
grant execute on function public.simulate_payment(uuid, text), public.request_revision(uuid, text),
  public.approve_result(uuid), public.verify_check_item(uuid, smallint, text, text) to authenticated;

-- =====================================================================
-- Storage: bucket privat untuk foto label, akses via signed URL
-- Path: <order_id>/<nama-file>
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('labels', 'labels', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.label_folder_ok(p_name text) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare oid uuid;
begin
  begin oid := (storage.foldername(p_name))[1]::uuid; exception when others then return false; end;
  return public.can_see_order(oid);
end $$;

create policy labels_read on storage.objects for select to authenticated
  using (bucket_id = 'labels' and public.label_folder_ok(name));
create policy labels_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'labels' and public.label_folder_ok(name));

-- =====================================================================
-- Realtime
-- =====================================================================
alter publication supabase_realtime add table public.orders, public.checks, public.check_items, public.payments;

-- =====================================================================
-- Data demo: reset hanya baris is_demo (dipanggil tim sebelum tampil)
-- Mengembalikan path foto agar dihapus lewat Storage API.
-- =====================================================================
create or replace function public.reset_demo() returns setof text
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_tim() then raise exception 'Hanya tim'; end if;
  return query select c.photo_path from public.checks c join public.orders o on o.id = c.order_id
                where o.is_demo and c.photo_path is not null;
  delete from public.orders where is_demo;
end $$;
revoke execute on function public.reset_demo() from public, anon;
grant execute on function public.reset_demo() to authenticated;

-- =====================================================================
-- Menjadikan akun sebagai tim (jalankan manual di SQL editor, bukan dari aplikasi):
--   update public.profiles set role = 'tim' where id = (select id from auth.users where email = 'tim@maknai.id');
-- Menandai akun klien demo (tombol "Masuk sebagai juri"):
--   update public.profiles set is_demo = true where id = (select id from auth.users where email = 'juri@maknai.id');
-- =====================================================================
