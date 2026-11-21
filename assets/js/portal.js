/* Portal klien Maknai: progres 7 langkah, revisi, pelunasan, Brand Kit, Syariah Check, konten bulanan, tagihan, toko, rujukan. */
import { S, A, I, F, V, $, esc, rp, num, slot, ic, seg, tile, toast, openModal, closeModal, modalHead, first, SHORT, TODAY, hooks, downloadCSV, ring } from './core.js';
import { PKG, EXTRA, STEPS, TEMPLATES, REF_DISC } from './data.js';
import { buildKit, logoSVG, lockupSVG, labelSVG, postsSVG, kitHTML, tagline } from './kit.js';
import { reportHTML, summaryHTML, summary, runCheck, decide } from './check.js';
import { activeBundle, C } from './core.js';
import { demoLog } from './data.js';
import { mode } from './store.js';

const render = () => hooks.render();
const pkg = () => PKG.find(p => p.id === S.project.pkg);
const kit = () => buildKit(S.brief);
const done = () => S.project.step >= 7;
const total = () => S.project.total || pkg().price;

export function stepperHTML(cur, compact) {
  return `<div class="pstep ${compact ? 'compact' : ''}">${STEPS.map((s, i) => `<div class="ps-i ${i < cur ? 'done' : i === cur ? 'cur' : ''} ${s.gold ? 'gold' : ''}"><span class="dot">${i < cur ? ic('check', 13) : i + 1}</span><b>${s.t}</b>${compact ? '' : `<small>${s.d}</small>`}</div>`).join('')}</div>`;
}
function nextAction() {
  const st = S.project.step;
  if (st >= 7) return { t: 'Proyek selesai. Maknai Kit siap diunduh.', b: `<button class="btn btn-p" data-act="tab" data-t="kit">${ic('download', 16)} Buka Maknai Kit</button>` };
  if (st === 5) return { t: 'Hasil siap ditinjau. Setujui atau minta revisi (sisa ' + (2 - S.project.revisions) + ' kali).', b: `<button class="btn btn-line" data-act="revise">Minta revisi</button><button class="btn btn-p" data-act="approve">${ic('check', 16)} Setujui hasil</button>` };
  if (st === 6) return { t: `Lakukan pelunasan ${rp(total() - Math.round(total() / 2))} untuk menerima Maknai Kit.`, b: `<button class="btn btn-p" data-act="payOff">${ic('wallet', 16)} Bayar pelunasan</button>` };
  return { t: `Tim sedang mengerjakan: <b>${STEPS[st].t}</b> (${STEPS[st].who}).`, b: `<button class="btn btn-line" data-act="simNext" title="Prototipe: majukan progres tim">${ic('play', 16)} Simulasikan progres tim</button>` };
}

/* ---------- Ringkasan ---------- */
V.klien.dash = () => {
  const k = kit(), st = S.project.step, n = nextAction(), pct = Math.round(Math.min(st, 7) / 7 * 100);
  return `<div class="view-intro"><div><span class="note">${SHORT} · ${esc(S.client.type)} · ${esc(S.client.city)}</span><h1>Assalamu'alaikum, ${esc(first(S.client.name))}.</h1></div><button class="btn btn-line" data-act="waOpen" data-text="Assalamu'alaikum tim Maknai, saya ingin bertanya tentang proyek ${esc(S.brief.name)}.">${ic('send', 16)} Hubungi tim</button></div>
  <section class="card mb"><div class="card-head"><div><span class="lbl">Proyek aktif · Paket ${pkg().name}</span><h2 style="margin-top:6px;font-size:22px">${esc(S.brief.name)}</h2></div>${ring(pct, 64)}</div>${stepperHTML(st)}
    <div class="next-act"><p>${n.t}</p><div class="row nowrap" style="gap:8px">${n.b}</div></div></section>
  <div class="grid g4 mb">${tile('Paket', pkg().name, `${pkg().days} hari kerja`, null, 'brief')}${tile('Revisi terpakai', S.project.revisions + ' / 2', 'Dalam lingkup brief', null, 'spark', 'sf')}${tile('Sudah dibayar', rp(S.invoices.filter(i => i.s === 'Lunas').reduce((s, i) => s + i.a, 0)), 'Akad ijarah', null, 'wallet')}${(() => { const a = S.project.checks.akhir, sm = summary(a); return tile('Syariah Check', a ? sm.sesuai + ' / 8' : '—', a ? (sm.pass ? 'Lolos gerbang akhir' : 'Ada butir terbuka') : 'Gerbang di langkah 5', null, 'shield', 'cl'); })()}</div>
  <div class="grid split-53"><section class="card"><div class="card-head"><h2>Pratinjau identitas</h2><button class="btn btn-line btn-sm" data-act="tab" data-t="kit">Lihat Brand Kit ${ic('arrow', 14)}</button></div><div class="row start" style="gap:18px;align-items:center"><div class="mock-wrap" style="width:160px;background:${k.pal.c[3]}">${labelSVG(k)}</div><div class="stack" style="gap:8px;flex:1;min-width:200px">${lockupSVG(k, 260)}<div class="hs-pal big">${k.pal.c.map(c => `<i style="background:${c}"></i>`).join('')}</div><span class="note">${k.pal.n} · ${k.type.n} · bentuk ${k.shape}${done() ? '' : ' · <b>draf</b>'}</span></div></div></section>
  <section class="card"><h2>Kabar terbaru</h2><div class="stack" style="gap:0">${S.notifs.slice(0, 5).map(x => `<div class="notif">${ic('bell', 15)}<div>${esc(x.t)}<small>${x.d}</small></div></div>`).join('')}</div></section></div>`;
};

/* ---------- Proyek (timeline detail) ---------- */
V.klien.proyek = () => {
  const st = S.project.step, k = kit();
  const art = i => i === 0 ? `<div class="inner note">Brief: ${esc(S.brief.biz)} · nilai ${S.brief.values.map(esc).join(', ')} · target ${esc(S.brief.target || '—')}</div>`
    : i === 1 ? `<div class="row start" style="gap:10px">${logoSVG(k, k.shape, 56)}<span class="note">Konsep "${k.shape}" — ${esc(tagline(k)[0])}</span></div>`
      : i === 2 ? `<div class="row start" style="gap:6px">${['kotak', 'lengkung', 'bintang', 'lingkar'].map(s => logoSVG(k, s, 40)).join('')}<span class="note">12 eksplorasi AI, 4 diteruskan ke desainer</span></div>`
        : i === 3 ? `<div class="note">Desainer menggambar ulang logo, menyesuaikan kerning, dan menyiapkan kemasan ${esc(S.brief.biz.toLowerCase())}.</div>`
          : i === 4 ? `<button class="btn btn-line btn-sm" data-act="tab" data-t="check">${ic('shield', 14)} Lihat laporan 8 butir</button>`
            : i === 5 ? `<div class="note">${S.project.notes.length ? S.project.notes.map((n, j) => `Revisi ${j + 1}: "${esc(n)}"`).join('<br>') : 'Belum ada catatan revisi.'}</div>`
              : `<div class="note">${done() ? 'Maknai Kit diserahkan ' + esc(S.project.doneAt || SHORT) + '.' : 'Menunggu pelunasan.'}</div>`;
  return `<section class="card mb"><div class="card-head"><div><h2>Alur proyek ${esc(S.brief.name)}</h2><p class="note">Dimulai ${esc(S.project.started)} · target ${pkg().days} hari kerja</p></div><div class="row nowrap" style="gap:8px">${nextAction().b}</div></div>
  <div class="tl">${STEPS.map((s, i) => `<div class="tl-i ${i < st ? 'done' : i === st ? 'cur' : ''} ${s.gold ? 'gold' : ''}"><span class="dot">${i < st ? ic('check', 14) : i + 1}</span><div class="tl-b"><div class="row"><b>${s.t}</b><span class="note">${s.d} · ${s.who}</span></div><p class="note">${s.desc}</p>${i <= st ? art(i) : ''}</div></div>`).join('')}</div></section>
  <p class="note">Prototipe: tombol "Simulasikan progres tim" memajukan pekerjaan tim agar alur lengkap bisa dicoba.</p>`;
};

/* ---------- Brand Kit ---------- */
V.klien.kit = () => {
  const k = kit();
  if (S.project.step < 2) return `<section class="card"><p class="muted">Brand Kit muncul setelah konsep makna disepakati.</p></section>`;
  return `<div class="view-intro"><p class="muted">${done() ? 'Maknai Kit final — milikmu sepenuhnya.' : 'Pratinjau draf. Versi final terbuka setelah serah terima.'}</p><div class="row nowrap" style="gap:8px">${done() ? `<button class="btn btn-line" data-act="dlLogo">${ic('download', 16)} Logo .svg</button><button class="btn btn-line" data-act="dlPal">${ic('download', 16)} Palet .csv</button>` : ''}<button class="btn btn-p" data-act="printKit" ${done() ? '' : 'disabled title="Tersedia setelah serah terima"'}>${ic('print', 16)} Cetak panduan</button></div></div>${kitHTML(k, { draft: !done() })}`;
};

/* ---------- Syariah Check ---------- */
V.klien.check = () => {
  const ck = S.project.checks, aw = ck.awal, ak = ck.akhir, sa = summary(ak), live = mode() === 'live';
  return `<div class="view-intro"><p class="muted" style="max-width:760px">Syariah Check dijalankan dua kali: <b>audit awal</b> atas kemasan lama (langkah 1) dan <b>gerbang akhir</b> atas desain Maknai sebelum diserahkan (langkah 5). AI membantu screening, aturan membaca data sertifikat dan log produksi, lalu tim memutuskan butir yang butuh bukti.</p></div>
  <div class="gate-grid">
  <section class="card"><div class="card-head"><div><span class="lbl">Langkah 1</span><h2 style="margin-top:4px">Audit awal kemasan lama</h2></div>${summaryHTML(aw)}</div>
    ${aw && aw.photo ? `<img src="${aw.photo}" alt="Foto kemasan lama" style="max-width:180px;border-radius:12px;margin-bottom:12px;border:1px solid var(--line)">` : ''}
    ${aw ? reportHTML(aw) : `<div class="inner"><p class="note" style="margin-bottom:10px">Unggah foto kemasan atau label yang kamu pakai sekarang (JPG/PNG/WebP, maks. 5 MB).</p><label class="btn btn-p" style="cursor:pointer">${ic('plus', 16)} Unggah foto kemasan<input type="file" accept="image/jpeg,image/png,image/webp" data-ch="awalPhoto" hidden></label></div>`}
    ${aw && aw.src === 'contoh' ? `<p class="note" style="margin-top:10px">${live ? '' : 'Mode ' + (mode() === 'demo' ? 'demo' : 'offline') + ': hasil di atas adalah <b>contoh tersimpan</b>. Analisis AI atas foto asli aktif di mode Live.'}</p>` : ''}</section>
  <section class="card"><div class="card-head"><div><span class="lbl">Langkah 5</span><h2 style="margin-top:4px">Gerbang akhir desain Maknai</h2></div>${ak ? `<span class="pill ${sa.pass ? 'ok' : 'cl'}">${sa.pass ? 'Lolos gerbang' : 'Belum lolos'}</span>` : '<span class="pill">Menunggu</span>'}</div>
    ${reportHTML(ak, { empty: 'Desain diperiksa setelah penyempurnaan oleh desainer (langkah 4).' })}
    ${ak ? '<p class="note" style="margin-top:12px">Penjelasan umum, bukan fatwa. Keabsahan sertifikat halal mengacu pada BPJPH.</p>' : ''}</section></div>`;
};
/* ---------- Konten bulanan ---------- */
V.klien.konten = () => {
  if (!S.subs.konten) return `<section class="card" style="max-width:760px"><span class="pill sf">Langganan Konten</span><h2 style="font-size:24px;margin:12px 0 8px">Konten rutin tanpa repot.</h2><p class="muted">${rp(EXTRA[0].price)}/bulan untuk ${EXTRA[0].feat.join(', ').toLowerCase()}. Semua melalui Syariah Check.</p><div class="posts" style="margin:18px 0">${postsSVG(kit()).join('')}</div><button class="btn btn-p" data-act="subKonten">${ic('plus', 16)} Mulai berlangganan</button></section>`;
  const k = kit(), P = postsSVG(k), days = [2, 4, 6, 9, 11, 13, 16, 18, 20, 23, 25, 27], cap = [3, 10, 17, 24], vid = [12, 26];
  const it = (d) => days.includes(d) ? { t: 'Desain', i: days.indexOf(d) } : cap.includes(d) ? { t: 'Caption', i: cap.indexOf(d) } : vid.includes(d) ? { t: 'Video', i: vid.indexOf(d) } : null;
  const all = days.length + cap.length + vid.length, ok = Object.keys(S.subs.done).length;
  return `<section class="card mb"><div class="card-head"><div><h2>Kalender konten · Desember 2026</h2><p class="note">12 desain · 4 caption · 2 video pendek. Klik item untuk menyetujui.</p></div><div class="row nowrap" style="gap:8px"><span class="pill em">${ok} / ${all} disetujui</span><button class="btn btn-line btn-sm" data-act="kontenAll">Setujui semua</button></div></div>
  <div class="cal">${['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(d => `<div class="cal-h">${d}</div>`).join('')}${Array.from({ length: 31 }, (_, j) => { const d = j + 1, x = it(d), key = x ? x.t + x.i : ''; return `<div class="cal-d" ${j === 0 ? 'style="grid-column-start:2"' : ''}><span>${d}</span>${x ? `<button class="cal-it ${x.t.toLowerCase()} ${S.subs.done[key] ? 'ok' : ''}" data-act="kontenOk" data-k="${key}">${x.t === 'Desain' ? `<span class="th">${P[x.i % 3]}</span>` : ic(x.t === 'Video' ? 'play' : 'doc', 14)}<small>${x.t}${S.subs.done[key] ? ' ✓' : ''}</small></button>` : ''}</div>`; }).join('')}</div></section>
  <section class="card"><h2>Laporan bulanan sederhana (November)</h2><div class="grid g4">${[['Postingan tayang', '16'], ['Jangkauan', '8,4 rb'], ['Interaksi', '612'], ['Pesan WhatsApp masuk', '37']].map(([l, v]) => `<div class="inner"><span class="lbl">${l}</span><div class="big" style="font-size:22px;margin-top:4px">${v}</div></div>`).join('')}</div></section>`;
};

/* ---------- Tagihan ---------- */
V.klien.tagihan = () => {
  const paid = S.invoices.filter(i => i.s === 'Lunas').reduce((s, i) => s + i.a, 0), due = S.project.paid ? 0 : total() - Math.round(total() / 2);
  return `<div class="grid g3 mb">${tile('Total jasa proyek', rp(total()), `Paket ${pkg().name}`, null, 'brief')}${tile('Sudah dibayar', rp(paid), 'Semua tagihan', null, 'check')}${tile('Sisa pelunasan', rp(due), due ? 'Dibayar saat serah terima' : 'Lunas', null, 'wallet', 'sf')}</div>
  <section class="card mb"><div class="card-head"><h2>Riwayat tagihan</h2><button class="btn btn-line btn-sm" data-act="csvInv">${ic('download', 14)} CSV</button></div><div class="tbl-wrap"><table><thead><tr><th>No.</th><th>Tanggal</th><th>Keterangan</th><th>Status</th><th style="text-align:right">Jumlah</th></tr></thead><tbody>${S.invoices.slice().reverse().map(i => `<tr><td class="mono">${i.id}</td><td class="note">${i.d}</td><td>${esc(i.l)}</td><td><span class="pill ${i.s === 'Lunas' ? 'ok' : 'sf'}">${i.s}</span></td><td class="tnum" style="text-align:right;font-weight:700">${rp(i.a)}</td></tr>`).join('')}</tbody></table></div></section>
  <section class="card"><div class="card-head"><h2>Akad ijarah</h2><button class="btn btn-line btn-sm" data-act="akadDoc">${ic('doc', 14)} Lihat & cetak</button></div><p class="note">Sewa jasa dengan ruang lingkup, waktu, dan upah yang jelas di awal. Tanpa bunga, tanpa denda.</p></section>`;
};
function akadDocHTML() {
  const p = pkg(), t = total();
  return `<div class="doc" id="akadDoc"><div class="doc-head"><div class="bism" lang="ar">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div><h2>Akad Ijarah Jasa Branding</h2><div class="no">No. MKN/${new Date().getFullYear()}/${esc(S.refCode.slice(0, 6))} · ${TODAY}</div></div>
  <h3>Para pihak</h3><div class="parties"><div class="inner"><span class="lbl">Musta'jir (penyewa jasa)</span><b style="display:block;margin-top:4px">${esc(S.client.name)} — ${esc(S.client.biz)}</b></div><div class="inner"><span class="lbl">Ajir (pemberi jasa)</span><b style="display:block;margin-top:4px">Maknai · Tim INVICTA, Malang</b></div></div>
  <h3>Objek & waktu</h3><ol><li>Paket ${p.name}: ${p.feat.join(', ')}.</li><li>Waktu pengerjaan ${p.days} hari kerja sejak uang muka; maksimal 2 kali revisi dalam lingkup brief.</li></ol>
  <h3>Ujrah (upah)</h3><ol><li>Total ${rp(t)}: uang muka ${rp(Math.round(t / 2))} saat kontrak dan pelunasan ${rp(t - Math.round(t / 2))} saat serah terima.</li><li>Tidak ada bunga atau denda keterlambatan.</li></ol>
  <h3>Hak cipta, AI, dan data</h3><ol><li>Hak cipta karya final beralih ke klien setelah pelunasan.</li><li>AI hanya dipakai untuk eksplorasi; karya final disempurnakan desainer dan penggunaan AI dicatat di lembar serah terima.</li><li>Data klien dikelola sesuai persetujuan dan UU Pelindungan Data Pribadi.</li></ol>
  <h3>Penyelesaian</h3><p>Perselisihan diselesaikan secara musyawarah.</p>
  <div class="sign"><div><span class="seal">✓ Disetujui digital</span><div class="sl">${esc(S.client.name)}</div></div><div><span class="seal">✓ Disetujui digital</span><div class="sl">Arkan Zaki, Direktur Utama</div></div></div></div>`;
}

/* ---------- Toko: template & workshop ---------- */
V.klien.toko = () => {
  const own = S.orders.filter(o => o.t === 'template').map(o => o.id);
  return `<section class="card mb"><div class="card-head"><div><h2>Template Digital</h2><p class="note">${rp(EXTRA[2].price)} sekali beli · bisa disunting · sudah lolos Syariah Check</p></div></div>
  <div class="grid g4">${TEMPLATES.map(t => `<div class="inner stack" style="gap:10px"><div class="tpl-th" style="background:${t.c}"><span>${ic('layers', 22)}</span></div><b>${t.n}</b><p class="note">${t.d}</p>${own.includes(t.id) ? `<button class="btn btn-line btn-sm" data-act="tplDl" data-id="${t.id}">${ic('download', 14)} Unduh</button>` : `<button class="btn btn-p btn-sm" data-act="buyTpl" data-id="${t.id}">Beli ${rp(EXTRA[2].price)}</button>`}</div>`).join('')}</div></section>
  <section class="card"><div class="card-head"><div><h2>Pesan workshop</h2><p class="note">${EXTRA[1].feat.join(' · ')} · ${rp(EXTRA[1].price)}/sesi</p></div></div>
  <form data-form="workshop" class="grid g3" style="gap:0 12px;align-items:end" novalidate><div class="field"><label for="w_org">Lembaga</label><input id="w_org" type="text" value="${esc(S.client.biz)}"></div><div class="field"><label for="w_date">Tanggal</label><input id="w_date" type="date" min="2026-11-20"></div><div class="field"><label for="w_n">Peserta (maks. 25)</label><input id="w_n" type="number" min="5" max="25" value="20"></div><button class="btn btn-p" type="submit" style="margin-bottom:16px">Ajukan jadwal</button></form>
  ${S.orders.filter(o => o.t === 'workshop').map(o => `<div class="inner row" style="margin-top:8px"><span>${ic('grad', 16)} Workshop ${esc(o.org)} · ${esc(o.date)} · ${o.n} peserta</span><span class="pill sf">Menunggu konfirmasi</span></div>`).join('')}</section>`;
};

/* ---------- Rujukan ---------- */
V.klien.rujukan = () => `<section class="card" style="max-width:760px"><span class="pill em">Sahabat Maknai</span><h2 style="font-size:24px;margin:12px 0 6px">Ajak usaha lain, mereka hemat ${REF_DISC}%.</h2><p class="muted">Bagikan kode rujukanmu ke pengurus koperasi pondok, teman UMKM, atau komunitas. Mereka mendapat diskon ${REF_DISC}% untuk paket identitas pertama.</p>
  <div class="ref-code"><span class="mono">${esc(S.refCode)}</span><button class="btn btn-line btn-sm" data-act="copy" data-v="${esc(S.refCode)}">${ic('copy', 14)} Salin</button></div>
  <div class="row start" style="gap:8px"><button class="btn btn-p" data-act="waOpen" data-text="Assalamu'alaikum! Saya pakai Maknai untuk branding ${esc(S.brief.name)}. Pakai kode ${esc(S.refCode)} untuk diskon ${REF_DISC}% paket pertamamu.">${ic('send', 16)} Bagikan via WhatsApp</button></div></section>`;

/* ---------- aksi ---------- */
function advance() {
  const p = S.project; if (p.step >= 5) return;
  p.step++;
  const L = demoLog();
  if (p.step === 3 && !p.log.ai.length) p.log.ai = L.ai;
  if (p.step === 4 && !p.log.assets.length) p.log.assets = L.assets;
  if (p.step === 5) { const b = activeBundle(), chk = runCheck(b, 'akhir'); chk.items.forEach((x, i) => { if (x.status === 'verifikasi') decide(chk, i, 'sesuai', 'Tim Maknai (simulasi)'); }); p.checks.akhir = chk; }
  const msg = ['', 'Konsep makna disepakati.', 'Eksplorasi AI selesai — 12 konsep, 4 diteruskan ke desainer. Penggunaan AI dicatat di log produksi.', 'Desainer selesai menyempurnakan logo dan kemasan. Sumber aset dicatat.', 'Desain masuk gerbang Maknai Syariah Check.', 'Gerbang Syariah Check lolos. Hasil siap ditinjau.'][p.step];
  S.notifs.unshift({ t: msg, d: 'Baru saja' }); S.unread++;
  toast(msg); render();
}
Object.assign(A, {
  simNext: advance,
  approve: () => { S.project.step = 6; S.project.approved = true; toast('Hasil disetujui. Lanjut serah terima.'); render(); },
  revise: () => {
    if (S.project.revisions >= 2) return toast('Kuota 2 revisi sudah terpakai. Revisi tambahan bisa dibicarakan dengan tim.', true);
    openModal(`${modalHead('Minta revisi')}<p class="muted" style="margin-bottom:14px">Sisa ${2 - S.project.revisions} revisi dalam lingkup brief. Tulis masukanmu sejelas mungkin.</p><form data-form="revise" novalidate><div class="field"><label for="rv">Catatan revisi</label><textarea id="rv" maxlength="300" placeholder="Contoh: warna hijaunya ingin lebih segar, nama di kemasan diperbesar."></textarea></div><div class="row"><button type="button" class="btn btn-line" data-act="closeModal" data-close="1">Batal</button><button class="btn btn-p" type="submit">Kirim revisi</button></div></form>`);
  },
  payOff: () => {
    const left = total() - Math.round(total() / 2);
    openModal(`${modalHead('Pelunasan (simulasi)')}<div class="inner stack" style="gap:8px"><div class="row"><span class="note">Paket ${pkg().name}</span><b class="mono">${rp(total())}</b></div><div class="row"><span class="note">Uang muka</span><span class="mono">−${rp(Math.round(total() / 2))}</span></div><div class="row"><b>Pelunasan</b><b class="mono" style="font-size:20px">${rp(left)}</b></div><div class="row"><span class="note">Rekening</span><span class="mono">BSI 7123 4567 89 a.n. Maknai</span></div></div><p class="note" style="margin:14px 0">Prototipe — tidak ada transaksi nyata.</p><div class="row"><button class="btn btn-line" data-act="closeModal" data-close="1">Nanti</button><button class="btn btn-p" data-act="paidOff">${ic('check', 16)} Saya sudah transfer</button></div>`);
  },
  paidOff: () => { const left = total() - Math.round(total() / 2); closeModal(); S.project.paid = true; S.project.step = 7; S.project.doneAt = SHORT; S.invoices.push({ id: 'INV-' + String(Date.now()).slice(-4), l: `Pelunasan 50% — Paket ${pkg().name}`, a: left, s: 'Lunas', d: SHORT }); S.notifs.unshift({ t: 'Pelunasan diterima. Maknai Kit diserahkan — alhamdulillah!', d: 'Baru saja' }); toast('Alhamdulillah! Maknai Kit sudah jadi milikmu.'); S.tab.klien = 'kit'; render(); },
  printKit: () => { const p = $('#printArea'), d = $('#kitDoc'); if (!p || !d) return; p.innerHTML = d.outerHTML; window.print(); setTimeout(() => p.innerHTML = '', 800); },
  dlLogo: () => { const k = kit(), svg = logoSVG(k, k.shape, 512).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '); blobDl(svg, 'image/svg+xml', 'logo-' + slug(k.name) + '.svg'); },
  dlPal: () => { const k = kit(); downloadCSV('palet-' + slug(k.name) + '.csv', [['Peran', 'Hex'], ...['Utama', 'Pendukung', 'Aksen', 'Latar', 'Teks'].map((r, i) => [r, k.pal.c[i]])]); },
  akadDoc: () => openModal(`${modalHead('Akad ijarah')}${akadDocHTML()}<div class="row" style="margin-top:20px;justify-content:flex-end"><button class="btn btn-p" data-act="printAkad">${ic('print', 16)} Cetak / simpan PDF</button></div>`, true),
  printAkad: () => { const p = $('#printArea'), d = $('#akadDoc'); if (!p || !d) return; p.innerHTML = d.outerHTML; window.print(); setTimeout(() => p.innerHTML = '', 800); },
  csvInv: () => downloadCSV('tagihan-maknai.csv', [['No', 'Tanggal', 'Keterangan', 'Status', 'Jumlah'], ...S.invoices.map(i => [i.id, i.d, i.l, i.s, i.a])]),
  subKonten: () => { S.subs.konten = true; S.invoices.push({ id: 'INV-' + String(Date.now()).slice(-4), l: 'Langganan Konten — Desember 2026', a: EXTRA[0].price, s: 'Lunas', d: SHORT }); toast('Langganan konten aktif. Kalender Desember disiapkan.'); render(); },
  kontenOk: el => { const k = el.dataset.k; S.subs.done[k] = !S.subs.done[k]; render(); },
  kontenAll: () => { document.querySelectorAll('.cal-it').forEach(b => S.subs.done[b.dataset.k] = true); toast('Semua konten Desember disetujui'); render(); },
  buyTpl: el => { const t = TEMPLATES.find(x => x.id === el.dataset.id); S.orders.push({ t: 'template', id: t.id }); S.invoices.push({ id: 'INV-' + String(Date.now()).slice(-4), l: 'Template Digital — ' + t.n, a: EXTRA[2].price, s: 'Lunas', d: SHORT }); toast(t.n + ' dibeli'); render(); },
  tplDl: el => { const t = TEMPLATES.find(x => x.id === el.dataset.id); blobDl(`${t.n}\n\n${t.d}\n\nPrototipe Maknai — tautan berkas Canva akan dikirim lewat email di layanan asli.`, 'text/plain', slug(t.n) + '.txt'); }
});
F.revise = () => { const v = ($('#rv').value || '').trim(); if (v.length < 5) return toast('Tulis catatan revisi minimal 5 karakter', true); S.project.revisions++; S.project.notes.push(v); S.brief.seed = (S.brief.seed || 0) + 1; closeModal(); S.notifs.unshift({ t: 'Revisi ' + S.project.revisions + ' dikerjakan dan siap ditinjau ulang.', d: 'Baru saja' }); toast('Revisi dikirim. Tim sudah memperbarui hasil.'); render(); };
F.workshop = () => { const org = $('#w_org').value.trim(), date = $('#w_date').value, n = +$('#w_n').value; if (!org || !date) return toast('Isi lembaga dan tanggal', true); if (n < 5 || n > 25) return toast('Peserta 5–25 orang', true); S.orders.push({ t: 'workshop', org, date, n }); toast('Jadwal workshop diajukan. Tim akan mengonfirmasi via WhatsApp.'); render(); };
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function blobDl(text, type, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }

/* Unggah foto kemasan lama untuk audit awal. Demo/offline: foto diperkecil & disimpan lokal, hasilnya contoh tersimpan. */
C.awalPhoto = el => {
  const f = el.files && el.files[0]; if (!f) return;
  if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return toast('Format harus JPG, PNG, atau WebP', true);
  if (f.size > 5 * 1024 * 1024) return toast('Ukuran foto maksimal 5 MB', true);
  const img = new Image(), url = URL.createObjectURL(f);
  img.onload = () => {
    const k = Math.min(1, 480 / Math.max(img.width, img.height)), cv = document.createElement('canvas');
    cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k); cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url);
    const chk = runCheck(activeBundle(), 'awal'); chk.photo = cv.toDataURL('image/jpeg', .72); S.project.checks.awal = chk;
    toast('Foto diunggah. Audit awal selesai (hasil contoh).'); render(); hooks.persist();
  };
  img.onerror = () => { URL.revokeObjectURL(url); toast('Foto tidak terbaca, coba file lain', true); };
  img.src = url;
};
