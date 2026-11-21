# Maknai Live — backend Supabase

Status: skema + RLS siap dan sudah diuji di Postgres 16 lokal (`tests/`). Frontend tetap berjalan dalam mode **Demo/Offline** sampai `assets/js/config.js` diisi.

## Mode data

| Mode | Kapan | Data |
|---|---|---|
| Demo | Tombol "Portal klien (demo)" / "Ruang tim (demo)" | Data contoh, tidak dikirim ke server |
| Offline | Pesan tanpa konfigurasi Live | `localStorage` perangkat ini |
| Live | `config.js` terisi + login Supabase | Postgres Supabase, realtime |

## Setup (sekali)

1. Buat project di supabase.com (region Singapore).
2. **SQL Editor** → jalankan `migrations/0001_maknai_live.sql`.
3. **Authentication → Users** → buat dua akun:
   - `tim@maknai.id` (dipakai di laptop tim saja — jangan dipasang di tombol publik)
   - `juri@maknai.id` (akun klien demo untuk tombol "Masuk sebagai juri")
4. Jalankan di SQL Editor:
   ```sql
   update public.profiles set role = 'tim' where id = (select id from auth.users where email = 'tim@maknai.id');
   update public.profiles set is_demo = true where id = (select id from auth.users where email = 'juri@maknai.id');
   ```
5. **Project Settings → API** → salin **Project URL** dan **anon/publishable key** ke `assets/js/config.js`.
6. API key Gemini **tidak** ditaruh di repo atau chat. Simpan sebagai secret:
   `supabase secrets set GEMINI_API_KEY=...` (atau Dashboard → Edge Functions → Secrets).

## Yang dijamin server (bukan frontend)

- Profil baru selalu `klien`; role tim hanya lewat SQL.
- Harga pesanan dihitung trigger dari paket.
- Klien tidak bisa mengubah `step`, `dp_paid`, `paid`, atau hasil Syariah Check; perubahan klien lewat RPC `simulate_payment`, `request_revision`, `approve_result`.
- Langkah 4 → 5 ditolak bila Syariah Check akhir belum 8/8 `sesuai`.
- Foto label di bucket privat `labels` (maks. 5 MB, JPG/PNG/WebP), path `<order_id>/…`, akses lewat signed URL.
- `reset_demo()` hanya menghapus pesanan `is_demo` dan hanya bisa dipanggil tim.

## Menguji ulang secara lokal

```bash
psql -d t -f tests/00_supabase_stub.sql        # stub skema auth/storage — JANGAN di Supabase
psql -d t -f migrations/0001_maknai_live.sql
psql -d t -f tests/10_rls_test.sql             # T1–T22, baris "ok" harus t; baris "harus GAGAL" memang error
```
