# Maknai — Beri makna pada setiap brand

Prototipe interaktif **Maknai**, jasa branding berbasis kecerdasan buatan dengan kurasi syariah untuk pesantren dan UMKM halal.
Dibuat untuk **National Business Plan Competition 2026** (subtema Ekonomi Kreatif Berbasis AI) oleh **Tim INVICTA — UIN Maulana Malik Ibrahim Malang**.

**Demo:** https://indradarmawan2202.github.io/maknai/

## Yang bisa dicoba

Prototipe ini mengikuti *Lampiran D — Rencana Prototype untuk Babak Final* di proposal.

| Lampiran D | Di situs |
|---|---|
| 1. Contoh Maknai Brand Kit | **Coba Brand Kit**: isi nama usaha, jenis, dan nilai merek. Hasilnya 4 konsep logo, palet, tipografi, gaya bahasa, brand story "Makna" (asal–nilai–tujuan), dan template media sosial |
| 2. Mock-up kemasan | Kemasan menyesuaikan jenis usaha: botol, toples, pouch, hang tag, atau box. Ruang logo halal hanya terisi jika sertifikat sudah terbit |
| 3. Demonstrasi Syariah Check | **Syariah Check**: periksa 8 butir pada label contoh, temukan 4 masalah, terapkan perbaikan sampai 8/8 lolos |
| 4. Simulasi alur pemesanan | **Pesan sekarang**: paket → brief → konsep → akad ijarah & uang muka 50% → portal klien → 7 langkah produksi → revisi (maks. 2) → pelunasan → serah terima Maknai Kit |

### Portal klien
Bagian-bagiannya:
- **Ringkasan**: progres 7 langkah dan aksi berikutnya.
- **Alur proyek**: timeline lengkap beserta hasil kerja di tiap langkah.
- **Brand Kit**: bisa dicetak sebagai panduan merek, plus unduh logo `.svg` dan palet `.csv`.
- **Syariah Check**: laporan 8 butir.
- **Konten bulanan**: kalender 12 desain, 4 caption, dan 2 video.
- **Template & workshop**: pembelian template dan pemesanan workshop.
- **Tagihan & akad**: dokumen akad ijarah yang bisa dicetak.
- **Rujukan**: kode diskon 10%.

### Ruang tim (demo juri)
- **Pipeline produksi**: papan 7 langkah dengan gerbang Syariah Check.
- **Kapasitas tim**: kebutuhan jam per tahun dan utilisasi, mengikuti Bab 4.3.
- **Keuangan & skenario**: laba rugi tahun 1–3, BEP, NPV, IRR, PI, dan uji skenario −30% / −15% / dasar / +20%. Model ini menghasilkan ulang angka Tabel 5.3 dan 6.2 secara persis. Contoh: laba bersih tahun 1 dasar Rp14.959.600, pesimis −Rp7.417.280.
- **Pasar & SWOT**: segmentasi, permintaan vs penawaran, SWOT, dan strategi SO/ST/WO/WT.

### Lainnya
- Asisten chat yang merekomendasikan paket dari anggaran dan bisa diteruskan ke WhatsApp.
- Peta posisi pesaing.
- Mode gelap.
- Command palette (`Ctrl/⌘ + K`).
- Tampilan responsif di HP.

## Teknis

HTML, CSS, dan JavaScript (ES modules), tanpa framework dan tanpa build step. Logo, kemasan, dan template dibuat sebagai SVG prosedural, jadi tidak ada aset gambar eksternal. Akun dan progres tersimpan di `localStorage` perangkat, dan kata sandi di-hash SHA-256.

```
assets/js/
  app.js       shell, routing hash, command palette
  core.js      util, ikon, state, persistensi, grafik
  data.js      angka bisnis dari proposal + data contoh
  landing.js   halaman utama
  kit.js       generator Brand Kit (logo, palet, tipografi, kemasan, konten, brand story)
  check.js     Maknai Syariah Check
  order.js     alur pemesanan & masuk
  portal.js    portal klien
  team.js      ruang tim: pipeline, kapasitas, keuangan, pasar
  bot.js       asisten chat
```

Untuk menjalankan secara lokal: `python3 -m http.server 8000`, lalu buka http://localhost:8000.

## Catatan

Ini prototipe: pembayaran, pengiriman, dan eksplorasi "AI" disimulasikan di perangkat. Angka pasar dan keuangan diambil dari proposal bisnis Maknai (NBPC 2026) dan masih berupa proyeksi. Penjelasan akad bersifat umum, bukan fatwa.

© 2026 Maknai — Tim INVICTA: Arkan Zaki, Muhammad Iman Darmawan, Yurindhar Sherly Reszha Fallevi.
