/* Maknai — data bisnis (bersumber dari proposal NBPC 2026 Tim INVICTA) dan data contoh prototipe. */

export const PKG = [
  { id: 'starter', name: 'Starter', short: ['Logo + 1 varian', 'Palet warna & tipografi', 'Panduan merek 1 halaman'], price: 350000, days: 3, hpp: 75000, hours: 8, note: 'Pintu masuk untuk usaha yang baru mulai menata identitas.', feat: ['Logo utama + 1 varian', 'Palet warna & tipografi', 'Panduan merek 1 halaman', '3 mock-up', 'Syariah Check ringkas', '2 kali revisi'] },
  { id: 'brand', name: 'Brand', short: ['Semua isi Starter', 'Desain kemasan 1 SKU', '12 template sosmed + Maknai Kit'], price: 900000, days: 7, hpp: 280000, hours: 18, hot: true, note: 'Identitas lengkap sampai kemasan dan konten.', feat: ['Semua isi Starter', 'Desain kemasan 1 SKU (label/stiker/box)', '12 template media sosial yang bisa disunting', 'Brand story "Makna"', 'Maknai Kit'] },
  { id: 'premium', name: 'Premium', short: ['Semua isi Brand', '15 foto produk + 2 video', 'Konten 1 bulan + konsultasi'], price: 2000000, days: 10, hpp: 800000, hours: 40, note: 'Identitas penuh plus foto, video, dan konten sebulan.', feat: ['Semua isi Brand', '15 foto produk + 2 video pendek', 'Konten 1 bulan (12 desain + caption)', 'Konsultasi strategi 2 jam'] }
];
export const EXTRA = [
  { id: 'konten', name: 'Langganan Konten', price: 750000, unit: '/bulan', hpp: 300000, hours: 14, feat: ['12 desain feed/story', '4 caption + penjadwalan', '2 video pendek', 'Laporan bulanan sederhana'] },
  { id: 'workshop', name: 'Workshop', price: 1500000, unit: '/sesi', hpp: 450000, hours: 10, feat: ['Branding & konten dengan AI yang etis', '3 jam, maks. 25 peserta', 'Untuk pesantren, madrasah, komunitas UMKM'] },
  { id: 'template', name: 'Template Digital', price: 49000, unit: 'sekali beli', hpp: 2000, hours: .2, feat: ['Paket template siap pakai', 'Bisa disunting di Canva'] }
];
export const REF_DISC = 10; // % diskon rujukan

export const STEPS = [
  { t: 'Brief & Brand Discovery', d: 'Hari 1', who: 'Klien + tim', desc: 'Menggali nilai, cerita, dan target pasar lewat formulir brief dan obrolan singkat.' },
  { t: 'Konsep makna & arah visual', d: 'Hari 1–2', who: 'Creative Director', desc: 'Merumuskan makna merek dan memilih arah visual bersama klien.' },
  { t: 'Produksi visual dengan AI', d: 'Hari 2–3', who: 'AI + desainer', desc: 'AI dipakai untuk eksplorasi konsep cepat: logo, palet, kemasan, template.' },
  { t: 'Penyempurnaan oleh desainer', d: 'Hari 3–5', who: 'Desainer', desc: 'Hasil AI dikurasi dan disempurnakan manusia — gerbang mutu visual.' },
  { t: 'Maknai Syariah Check', d: 'Hari 5–6', who: 'Penasihat syariah', desc: '8 butir pemeriksaan kesesuaian visual, bahasa, klaim, label halal, lisensi, AI, dan data.', gold: true },
  { t: 'Presentasi & revisi (2 kali)', d: 'Hari 6–8', who: 'Klien + tim', desc: 'Klien meninjau, memberi masukan, dan menyetujui hasil akhir.' },
  { t: 'Serah terima Maknai Kit', d: 'Hari 8–10', who: 'Tim', desc: 'Berkas siap sunting, panduan merek, dan pelatihan singkat agar klien mandiri.' }
];

export const CHECK = [
  ['Halal dan thayyib', 'Apakah produk atau jasa yang dipromosikan halal dan tidak mengandung unsur yang dilarang?'],
  ['Kejujuran klaim', 'Apakah klaim (bahan, khasiat, asal) benar, dapat dibuktikan, serta tidak berlebihan atau menyesatkan?'],
  ['Kesantunan visual', 'Apakah gambar, model, ilustrasi, dan simbol sopan serta tidak bertentangan dengan nilai Islam?'],
  ['Kesantunan bahasa', 'Apakah bahasa dan slogan santun, bebas SARA, serta tidak mengeksploitasi agama untuk klaim berlebihan?'],
  ['Kesesuaian label halal', 'Apakah logo atau label halal hanya dipakai jika produk telah bersertifikat sesuai ketentuan?'],
  ['Lisensi aset', 'Apakah font, ikon, foto, dan aset lain memiliki lisensi komersial?'],
  ['Transparansi dan etika AI', 'Apakah hasil AI tidak meniru karya orang lain, sudah disempurnakan manusia, dan penggunaan AI diinformasikan kepada klien?'],
  ['Pelindungan data', 'Apakah data klien dan pelanggan dikelola sesuai persetujuan dan UU Pelindungan Data Pribadi?']
];
/* Karya contoh untuk demo: beberapa butir sengaja bermasalah. */
export const DEMO_ISSUES = {
  1: { find: 'Label menulis "Menyembuhkan segala penyakit" — klaim khasiat berlebihan dan tidak dapat dibuktikan.', fix: 'Diganti menjadi "Madu hutan murni dari lereng Malang Selatan".' },
  4: { find: 'Logo halal dipasang padahal sertifikat halal produk belum terbit.', fix: 'Logo halal dilepas; ruang label disiapkan untuk logo resmi setelah sertifikat terbit.' },
  5: { find: 'Font judul diunduh dari situs tidak resmi, tanpa lisensi komersial.', fix: 'Diganti font berlisensi terbuka (SIL Open Font License).' },
  6: { find: 'Ilustrasi lebah dibuat AI meniru gaya ilustrator tertentu dan belum diinformasikan ke klien.', fix: 'Ilustrasi digambar ulang desainer; penggunaan AI dicatat di lembar serah terima.' }
};

export const COMPETITORS = [
  { n: 'Freelancer daring', ex: 'Fiverr, Projects.co.id', plus: 'Murah, banyak pilihan', minus: 'Kualitas tidak konsisten; tanpa kurasi syariah dan pendampingan merek', price: 'Mulai ±Rp75.000–Rp100.000', x: 18, y: 18 },
  { n: 'Platform sayembara', ex: 'Sribu, 99designs', plus: 'Banyak alternatif desain', minus: 'Mahal untuk usaha mikro; tidak spesifik segmen', price: 'Mulai Rp2.500.000–Rp4.500.000', x: 86, y: 34 },
  { n: 'Perangkat DIY', ex: 'Canva Pro, Looka', plus: 'Murah dan cepat', minus: 'Butuh waktu dan keterampilan; hasil cenderung generik', price: 'Canva Pro Rp95.000/bln; Looka mulai Rp300.000', x: 28, y: 12 },
  { n: 'Maknai', ex: 'AI + kurasi syariah + Maknai Kit', plus: 'Cepat, terjangkau, selaras nilai syariah', minus: 'Merek baru, portofolio awal terbatas', price: 'Rp350.000–Rp2.000.000', x: 40, y: 86, me: true }
];
export const DIFF = [
  ['Maknai Syariah Check', 'Daftar periksa 8 butir: kehalalan dan kejujuran klaim, kesantunan visual dan bahasa, label halal, lisensi aset, transparansi AI, pelindungan data.', 'Karya aman dari klaim menyesatkan; kepercayaan konsumen muslim naik.'],
  ['Brand Story "Makna"', 'Narasi asal, nilai, dan tujuan usaha sebagai dasar logo, kemasan, dan konten.', 'Pembeda emosional dan bahan konten.'],
  ['AI dengan kurasi manusia', 'AI untuk eksplorasi cepat; desainer menyempurnakan sehingga ada kontribusi kreatif manusia.', 'Mutu konsisten, risiko hukum lebih rendah.'],
  ['Maknai Kit', 'Panduan palet, tipografi, template yang dapat disunting, dan gaya bahasa.', 'Klien mandiri dan merek konsisten.'],
  ['Jaringan pesantren & harga terjangkau', 'Distribusi lewat koperasi pesantren, komunitas UMKM, dan rujukan; paket mulai Rp350.000.', 'Biaya akuisisi rendah, pasar mudah dijangkau.']
];
export const PROBLEMS = [
  ['Identitas visual belum konsisten (logo, kemasan, konten)', 'Paket identitas lengkap dan Maknai Kit sebagai pedoman penggunaan merek', 'layers'],
  ['Jasa desain profesional dirasa mahal (sayembara mulai Rp2.500.000)', 'Paket mulai Rp350.000 dengan proses berbasis AI yang efisien', 'tag'],
  ['Perangkat desain mandiri butuh waktu dan keterampilan', 'Dikerjakan tim, ditambah pelatihan singkat agar klien mandiri', 'grad'],
  ['Belum ada layanan yang menjaga nilai syariah dan etika AI', 'Maknai Syariah Check serta transparansi penggunaan AI dan lisensi aset', 'shield'],
  ['Baru sekitar sepertiga UMKM memakai platform digital', 'Template dan konten siap pakai, langganan konten bulanan, workshop', 'trend']
];
export const TEAM = [
  { n: 'Arkan Zaki', r: 'Ketua Tim / Direktur Utama', d: 'Strategi, hubungan klien dan mitra, penjualan, penetapan harga, evaluasi bulanan.' },
  { n: 'Muhammad Iman Darmawan', r: 'Creative Director', d: 'Konsep visual, kurasi hasil AI, mutu desain, dan Maknai Kit.' },
  { n: 'Yurindhar Sherly Reszha Fallevi', r: 'Manajer Konten, Pemasaran & Keuangan', d: 'Kalender konten, media sosial, pembukuan, koordinasi freelancer.' }
];
export const FAQ = [
  ['Apakah logo saya dibuat oleh AI?', 'AI hanya dipakai untuk eksplorasi konsep di langkah 3. Setelah itu desainer menyempurnakan secara manual, sehingga ada kontribusi kreatif manusia — pencipta menurut UU Hak Cipta adalah manusia. Penggunaan AI selalu diinformasikan kepada klien.'],
  ['Berapa lama pengerjaannya?', 'Starter 3 hari kerja, Brand 7 hari kerja, Premium 10 hari kerja, termasuk dua kali revisi.'],
  ['Bagaimana sistem pembayarannya?', 'Akad ijarah (sewa jasa) dengan rincian biaya transparan: uang muka 50% saat kontrak dan pelunasan 50% saat serah terima Maknai Kit. Tanpa bunga, tanpa biaya tersembunyi.'],
  ['Produk saya belum bersertifikat halal, bisa dibantu?', 'Bisa. Maknai tidak menerbitkan sertifikat, tetapi menyiapkan label dan kemasan yang siap disertifikasi. Logo halal hanya dipasang setelah sertifikat terbit (butir 5 Syariah Check).'],
  ['Apa itu Maknai Kit?', 'Berkas yang bisa disunting beserta panduan merek: palet warna, tipografi, template, dan gaya bahasa. Tujuannya agar kamu bisa mengelola merekmu sendiri setelah proyek selesai.'],
  ['Apakah ada diskon?', `Program rujukan: diskon ${REF_DISC}% bagi klien yang direkomendasikan klien lain. Kami juga mengadakan workshop gratis perdana bagi pesantren mitra.`]
];

/* ---------- angka bisnis (proposal) ---------- */
export const SALES = [ // unit per tahun: [T1,T2,T3], harga
  { n: 'Paket Starter', price: 350000, hpp: 75000, u: [48, 72, 96] },
  { n: 'Paket Brand', price: 900000, hpp: 280000, u: [30, 48, 66] },
  { n: 'Paket Premium', price: 2000000, hpp: 800000, u: [6, 10, 14] },
  { n: 'Langganan Konten', price: 750000, hpp: 300000, u: [36, 84, 144] },
  { n: 'Workshop', price: 1500000, hpp: 450000, u: [6, 12, 18] },
  { n: 'Template Digital', price: 49000, hpp: 2000, u: [360, 720, 1200] }
];
export const FIN = { fixed: [26280000, 32400000, 37800000], honor: [27000000, 43200000, 64800000], dep: 6350000, cad: .03, pph: .005, bagi: [.1, .1, 0], capital: 35000000 };
export const KPI = { npv: 124355715, irr: 118.8, pi: 4.55, payback: 15.7, bep1: 87490846 };
export const MARKET = { umkm: 48000, halalPct: .2, pesantren: 396, pesUsahaPct: .4, demand: [976, 1354, 1463], supply: [683, 948, 1024], gap: [293, 406, 439], clients: [84, 130, 176], potential: [9758, 12539, 12539] };
export const CAPACITY = { hours: 2880, need: [1800, 3280, 4952] };
export const SWOT = {
  S: ['AI membuat produksi cepat dan hemat biaya', 'Kurasi syariah yang belum ditawarkan pesaing', 'Harga terjangkau dan modal ringan (asset-light)', 'Tim memahami budaya pesantren dan kampus'],
  W: ['Tim masih mahasiswa dengan waktu terbatas', 'Merek baru dan portofolio awal terbatas', 'Bergantung pada langganan tools AI', 'Belum ada tim penjualan khusus'],
  O: ['Ekonomi kreatif Rp1.500 triliun PDB dan 26,48 juta pekerja', '64 juta UMKM, baru sepertiga yang digital', '396 pesantren di Malang Raya dan 7.347 di Jawa Timur', 'Kewajiban halal UMK dan kuota sertifikasi gratis'],
  T: ['Perangkat DIY murah dan kompetitor desain daring', 'Perubahan harga atau kebijakan tools AI', 'Isu hak cipta karya AI', 'Penundaan kewajiban halal dapat menurunkan urgensi']
};

/* ---------- generator brand kit ---------- */
export const BIZ = ['Kuliner & camilan', 'Air minum & minuman', 'Fesyen muslim', 'Kerajinan & suvenir', 'Produk santri', 'Madu & herbal'];
export const VALUES = ['Amanah', 'Sederhana', 'Segar', 'Hangat', 'Modern', 'Tradisional', 'Elegan', 'Ceria'];
export const PALETTES = [
  { n: 'Hijau Pesantren', c: ['#14513B', '#2E7D5B', '#D9B45A', '#F4EEDF', '#1E1E1A'], tags: ['Amanah', 'Tradisional', 'Produk santri'] },
  { n: 'Kurma Senja', c: ['#5B2E1F', '#A55A32', '#E8A55B', '#F7EBDD', '#2A1A14'], tags: ['Hangat', 'Kuliner & camilan', 'Tradisional'] },
  { n: 'Telaga Segar', c: ['#0F5E73', '#2BA3B5', '#9AD9D1', '#F2FAF8', '#0D2B33'], tags: ['Segar', 'Air minum & minuman', 'Modern'] },
  { n: 'Batik Sogan', c: ['#4A3222', '#8C5A2B', '#C99A5B', '#F3E7D3', '#1F150E'], tags: ['Tradisional', 'Kerajinan & suvenir', 'Elegan'] },
  { n: 'Langit Subuh', c: ['#24345E', '#5B6FA8', '#E7B7A3', '#F6F2EE', '#151B2E'], tags: ['Elegan', 'Fesyen muslim', 'Modern'] },
  { n: 'Madu Hutan', c: ['#6B3D0A', '#C6851C', '#F2C14E', '#FFF6E0', '#2B1A05'], tags: ['Hangat', 'Madu & herbal', 'Amanah'] },
  { n: 'Melati Pagi', c: ['#2F5D50', '#8DB8A2', '#F1C6C0', '#FBF7F2', '#1F2B27'], tags: ['Sederhana', 'Fesyen muslim', 'Ceria'] },
  { n: 'Zaitun Daun', c: ['#3F4A1F', '#7A8A3A', '#D7C68A', '#F5F2E4', '#1E2210'], tags: ['Sederhana', 'Madu & herbal', 'Amanah'] },
  { n: 'Kantin Ceria', c: ['#C2410C', '#F59E0B', '#16A34A', '#FFF7ED', '#1C1917'], tags: ['Ceria', 'Kuliner & camilan', 'Segar'] }
];
export const TYPE = [
  { n: 'Klasik Pesantren', h: 'Amiri', b: 'Plus Jakarta Sans', tags: ['Tradisional', 'Amanah', 'Produk santri'] },
  { n: 'Hangat Rumahan', h: 'Fraunces', b: 'Plus Jakarta Sans', tags: ['Hangat', 'Sederhana', 'Kuliner & camilan'] },
  { n: 'Modern Bersih', h: 'Bricolage Grotesque', b: 'Plus Jakarta Sans', tags: ['Modern', 'Segar', 'Ceria', 'Air minum & minuman'] },
  { n: 'Elegan Anggun', h: 'DM Serif Display', b: 'Plus Jakarta Sans', tags: ['Elegan', 'Fesyen muslim'] }
];
export const SHAPES = ['kotak', 'lengkung', 'bintang', 'lingkar'];
export const SHAPE_MEANING = { kotak: 'Kokoh dan amanah — bentuk persegi yang stabil.', lengkung: 'Lengkung mihrab — teduh, menaungi, dekat dengan nilai.', bintang: 'Bintang delapan titik — warisan geometri Islam, simbol keteraturan.', lingkar: 'Lingkar utuh — kebersamaan dan keberlanjutan.' };

export const TEMPLATES = [
  { id: 't1', n: 'Kit Ramadan & Lebaran', d: '24 desain feed/story bertema Ramadan, Idulfitri, dan zakat.', c: '#14513B' },
  { id: 't2', n: 'Promo Kantin Santri', d: '16 desain menu harian, promo, dan pengumuman kantin.', c: '#C2410C' },
  { id: 't3', n: 'Label Kemasan Siap Halal', d: '10 tata letak label stiker & box dengan ruang logo halal resmi.', c: '#6B3D0A' },
  { id: 't4', n: 'Konten Edukasi Produk', d: '20 carousel edukasi bahan, cara pakai, dan cerita usaha.', c: '#24345E' }
];

/* ---------- state awal ---------- */
/* Satu akun bisa punya banyak proyek (S.projects). S.brief / S.project / S.invoices di core.js
   adalah facade: referensi ke objek milik proyek aktif, jadi kode portal lama tetap jalan. */
export const demoLog = () => ({
  ai: [{ tool: 'Gemini', usage: 'Eksplorasi 12 arah konsep logo dan palet', disclosed: true }],
  assets: [
    { name: 'Font judul — Amiri', source_type: 'Open source', source_ref: 'Google Fonts', license: 'SIL OFL 1.1', verified: true },
    { name: 'Font teks — Plus Jakarta Sans', source_type: 'Open source', source_ref: 'Google Fonts', license: 'SIL OFL 1.1', verified: true },
    { name: 'Ikon tetes air & lengkung', source_type: 'Original', source_ref: 'Digambar desainer Maknai', license: 'Hak klien setelah serah terima', verified: true }
  ]
});
/* Audit awal (langkah 1) atas label lama proyek contoh. sumber 'contoh' = hasil tersimpan, bukan analisis baru. */
const auditAwal = () => ({ stage: 'awal', at: '12 Nov', src: 'contoh', items: [
  { status: 'sesuai', temuan: 'Air minum dalam kemasan; tidak ada unsur terlarang.', sumber: 'contoh' },
  { status: 'perbaikan', temuan: 'Label lama menulis "air penyembuh" — klaim khasiat tanpa bukti.', saran: 'Ganti dengan klaim yang bisa dibuktikan, mis. asal sumber air.', sumber: 'contoh' },
  { status: 'sesuai', temuan: 'Visual berupa foto pegunungan; sopan.', sumber: 'contoh' },
  { status: 'sesuai', temuan: 'Bahasa dan slogan santun.', sumber: 'contoh' },
  { status: 'perbaikan', temuan: 'Logo halal tercetak, sementara brief menyatakan sertifikat halal belum terbit.', saran: 'Lepas logo halal sampai sertifikat terbit.', sumber: 'aturan' },
  { status: 'verifikasi', temuan: 'Sumber foto pegunungan di label lama tidak diketahui.', saran: 'Ganti dengan aset berlisensi atau buatan sendiri.', sumber: 'aturan' },
  { status: 'verifikasi', temuan: 'Label lama dibuat di luar Maknai; tidak ada catatan proses.', saran: 'Tidak dipakai lagi di desain baru.', sumber: 'aturan' },
  { status: 'sesuai', temuan: 'Tidak ada data pribadi tercetak.', sumber: 'contoh' }
] });
export const seed = () => ({
  client: { name: 'Fatimah Zahra', biz: 'Air Minum Santri Al-Hikmah', email: 'demo@maknai.id', wa: '081234567890', city: 'Malang', type: 'Pesantren' },
  projects: [
    { id: 'demo-1',
      brief: { name: 'Al-Hikmah', biz: 'Air minum & minuman', values: ['Amanah', 'Segar'], story: 'Unit usaha santri yang mengolah air pegunungan Batu sejak 2019 untuk warga pondok dan sekitar.', city: 'Batu, Malang', target: 'Warga pondok, wali santri, dan warung sekitar', halal: false, seed: 0, shape: 'lengkung' },
      project: { pkg: 'brand', step: 3, revisions: 0, notes: [], dp: true, paid: false, approved: false, started: '12 Nov 2026', checks: { awal: auditAwal(), akhir: null }, log: demoLog() },
      invoices: [{ id: 'INV-0112', l: 'Uang muka 50% — Paket Brand', a: 450000, s: 'Lunas', d: '12 Nov' }] },
    { id: 'demo-2',
      brief: { name: 'Kantin Al-Hikmah', biz: 'Kuliner & camilan', values: ['Hangat', 'Sederhana'], story: 'Kantin santri yang menyajikan camilan rumahan untuk santri dan tamu pondok.', city: 'Batu, Malang', target: 'Santri dan wali santri', halal: true, halalNo: 'ID35110000123450924', seed: 0, shape: 'kotak' },
      project: { pkg: 'starter', step: 7, revisions: 1, notes: ['Warna oranye dibuat lebih hangat'], dp: true, paid: true, approved: true, started: '2 Okt 2026', doneAt: '7 Okt', checks: { awal: null, akhir: null }, log: demoLog() },
      invoices: [{ id: 'INV-0087', l: 'Uang muka 50% — Paket Starter', a: 175000, s: 'Lunas', d: '2 Okt' }, { id: 'INV-0093', l: 'Pelunasan 50% — Paket Starter', a: 175000, s: 'Lunas', d: '7 Okt' }] }
  ],
  activeId: 'demo-1',
  subs: { konten: false, month: 0, done: {} },
  orders: [],
  refCode: 'ALHIKMAH10',
  notifs: [{ t: 'Konsep "Lengkung mihrab" dipilih. Tim mulai produksi visual.', d: 'Kemarin' }, { t: 'Uang muka Rp450.000 diterima. Akad ijarah aktif.', d: '12 Nov' }],
  unread: 1
});

export const PIPE = [ // proyek contoh untuk ruang tim
  { c: 'Air Minum Santri Al-Hikmah', p: 'brand', s: 3, by: 'Iman' },
  { c: 'Keripik Tempe Bu Sri', p: 'starter', s: 1, by: 'Iman' },
  { c: 'Kantin Santri Darul Ulum', p: 'brand', s: 4, by: 'Magang' },
  { c: 'Hijab Lokal Nabila', p: 'premium', s: 5, by: 'Iman' },
  { c: 'Madu Hutan Barokah', p: 'starter', s: 4, by: 'Freelancer' },
  { c: 'Koperasi Pondok An-Nur', p: 'premium', s: 2, by: 'Iman' },
  { c: 'Batik Santri Tulungrejo', p: 'brand', s: 6, by: 'Magang' },
  { c: 'Sambal Bu Rini', p: 'starter', s: 6, by: 'Freelancer' },
  { c: 'TPQ Nurul Ilmi', p: 'starter', s: 0, by: '—' }
];
