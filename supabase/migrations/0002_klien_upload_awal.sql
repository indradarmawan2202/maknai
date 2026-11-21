-- Klien boleh mencatat foto kemasan lama (audit awal) untuk pesanannya sendiri.
-- Hasil pemeriksaan (check_items) tetap hanya ditulis tim.
create policy checks_insert_owner_awal on public.checks for insert to authenticated
  with check (
    stage = 'awal' and photo_path is not null
    and exists (select 1 from public.orders o where o.id = order_id and o.client_id = auth.uid() and o.step <= 4)
    and split_part(photo_path, '/', 1) = order_id::text
  );
