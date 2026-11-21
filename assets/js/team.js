/* Ruang Tim Maknai (demo juri): pipeline produksi, kapasitas, proyeksi keuangan + uji skenario, pasar. Angka dari proposal. */
import { S, A, I, C, V, $, esc, rp, rpk, num, kfmt, dec, slot, ic, seg, tile, toast, hooks, hbar, cssVar, downloadCSV } from './core.js';
import { PKG, EXTRA, STEPS, PIPE, SALES, FIN, KPI, MARKET, CAPACITY, SWOT, COMPETITORS } from './data.js';
import { posMap } from './landing.js';
import { teamOrders, mode } from './store.js';
import { reportHTML, summaryHTML, summary, runCheck, decide, SRC } from './check.js';

const render = () => hooks.render();
const HOURS = [8, 18, 40, 14, 10, .2];
export function pl(t, f = 1) {
  const omzet = SALES.reduce((s, x) => s + x.price * x.u[t] * f, 0), hpp = SALES.reduce((s, x) => s + x.hpp * x.u[t] * f, 0);
  const cad = omzet * FIN.cad, lsp = omzet - hpp - cad - FIN.fixed[t] - FIN.honor[t] - FIN.dep, pph = omzet * FIN.pph, laba = lsp - pph;
  const bagi = laba > 0 ? laba * FIN.bagi[t] : 0, ratio = (omzet - hpp - cad - pph) / omzet, fixedAll = FIN.fixed[t] + FIN.honor[t] + FIN.dep;
  return { omzet, hpp, kotor: omzet - hpp, cad, fixed: FIN.fixed[t], honor: FIN.honor[t], dep: FIN.dep, lsp, pph, laba, bagi, setelah: laba - bagi, margin: laba / omzet, bep: fixedAll / ratio, ratio };
}
const fac = () => 1 + S.team.scen / 100;
const pname = id => (PKG.find(p => p.id === id) || {}).name;

/* ---------- Pipeline ---------- */
V.tim.pipeline = () => {
  const P = teamOrders(), cols = STEPS.map((s, i) => ({ s, i, items: P.filter(p => p.s === i) }));
  return `<div class="grid g4 mb">${tile('Proyek aktif', P.length, 'Semua paket', null, 'kanban')}${tile('Di gerbang syariah', P.filter(p => p.s === 4).length, 'Langkah 5', null, 'shield', 'sf')}${tile('Menunggu klien', P.filter(p => p.s === 5).length, 'Presentasi & revisi', null, 'user', 'cl')}${tile('Nilai pipeline', rpk(P.reduce((s, p) => s + PKG.find(x => x.id === p.p).price, 0)), 'Total jasa', null, 'wallet')}</div>
  <div class="kanban k7">${cols.map(c => `<div class="kcol ${c.s.gold ? 'gold' : ''}"><h3><span>${c.i + 1}. ${c.s.t}</span><span>${c.items.length}</span></h3>${c.items.map(p => `<div class="kcard"><b>${esc(p.c)}</b><div class="chips"><span class="pill ${p.p === 'premium' ? 'cl' : p.p === 'brand' ? 'em' : 'sf'}">${pname(p.p)}</span><span class="note">${esc(p.by)}</span>${p.ref ? '<span class="pill ok">detail</span>' : ''}</div>${c.i < 6 ? `<button class="btn btn-line btn-sm" data-act="pipeNext" data-id="${esc(p.id)}">${c.i === 4 ? 'Buka gerbang syariah' : 'Maju'} ${ic('arrow', 13)}</button>` : '<span class="pill ok">Siap serah terima</span>'}</div>`).join('') || '<span class="note" style="padding:6px">Kosong</span>'}</div>`).join('')}</div>
  <p class="note" style="margin-top:10px">${mode() === 'live' ? 'Pesanan live dari klien muncul otomatis di papan ini.' : 'Mode demo: papan berisi proyek contoh. Kartu berlabel "detail" bisa dibuka di Gerbang syariah.'}</p>`;
};

/* ---------- Gerbang syariah (verifikasi tim) ---------- */
const gateProjects = () => (S.projects || []);
const gateSel = () => { const ps = gateProjects(); return ps.find(p => p.id === S.team.gate) || ps.find(p => p.project.step >= 3 && p.project.step < 7) || ps[0]; };
V.tim.gerbang = () => {
  const b = gateSel(); if (!b) return '<section class="card"><p class="muted">Belum ada proyek.</p></section>';
  const pr = b.project, ck = pr.checks, ak = ck.akhir, sm = summary(ak), log = pr.log;
  return `<div class="view-intro"><div><span class="note">Gerbang mutu langkah 5 · keputusan akhir di tangan tim & penasihat syariah</span><h1 style="font-size:26px">${esc(b.brief.name)} <span class="pill em" style="vertical-align:middle">${pname(pr.pkg)}</span></h1></div>
    <label class="proj-pick" style="min-width:240px"><select data-ch="gatePick" aria-label="Pilih proyek">${gateProjects().map(p => `<option value="${esc(p.id)}" ${p.id === b.id ? 'selected' : ''}>${esc(p.brief.name)} · langkah ${Math.min(p.project.step, 6) + 1}</option>`).join('')}</select></label></div>
  <div class="gate-grid mb">
    <section class="card"><div class="card-head"><div><span class="lbl">Langkah 1</span><h2 style="margin-top:4px">Audit awal kemasan lama</h2></div>${summaryHTML(ck.awal)}</div>${reportHTML(ck.awal, { team: true, empty: 'Klien belum mengunggah foto kemasan lama.' })}</section>
    <section class="card"><div class="card-head"><div><span class="lbl">Langkah 5</span><h2 style="margin-top:4px">Gerbang akhir</h2></div>${ak ? `<span class="pill ${sm.pass ? 'ok' : 'cl'}">${sm.pass ? 'Lolos' : `${sm.perbaikan + sm.verifikasi} butir terbuka`}</span>` : ''}</div>
      ${ak ? reportHTML(ak, { team: true }) : `<div class="inner"><p class="note" style="margin-bottom:10px">${pr.step < 3 ? 'Desain belum masuk tahap penyempurnaan.' : 'Jalankan pemeriksaan atas desain final: AI screening + aturan dari brief dan log produksi.'}</p>${pr.step >= 3 ? `<button class="btn btn-p" data-act="gateRun">${ic('shield', 16)} Jalankan pemeriksaan</button>` : ''}</div>`}
      ${ak && sm.pass && pr.step === 4 ? `<button class="btn btn-p" style="margin-top:12px" data-act="gatePass">${ic('check', 16)} Loloskan ke presentasi klien</button>` : ''}
      ${ak && ak.src === 'contoh' ? '<p class="note" style="margin-top:10px">Mode demo: bagian AI memakai hasil contoh tersimpan. Bagian aturan (label halal, lisensi aset, etika AI) dihitung dari data proyek ini.</p>' : ''}</section></div>
  <section class="card"><div class="card-head"><div><h2>Log produksi</h2><p class="note">Sumber bukti untuk butir 6 (lisensi aset) dan 7 (etika AI).</p></div></div>
    <div class="tbl-wrap"><table class="log-tbl"><thead><tr><th>Aset</th><th>Sumber</th><th>Referensi</th><th>Lisensi</th><th>Dicek</th></tr></thead><tbody>${log.assets.length ? log.assets.map(a => `<tr><td>${esc(a.name)}</td><td>${esc(a.source_type)}</td><td class="note">${esc(a.source_ref || '—')}</td><td>${a.license ? esc(a.license) : '<span class="pill cl">Tidak ada</span>'}</td><td>${a.verified ? '<span class="pill ok">Ya</span>' : '<span class="pill sf">Belum</span>'}</td></tr>`).join('') : '<tr><td colspan="5" class="note">Belum ada aset tercatat.</td></tr>'}</tbody></table></div>
    <div class="tbl-wrap" style="margin-top:12px"><table class="log-tbl"><thead><tr><th>Alat AI</th><th>Dipakai untuk</th><th>Diinformasikan ke klien</th></tr></thead><tbody>${log.ai.length ? log.ai.map(a => `<tr><td>${esc(a.tool)}</td><td>${esc(a.usage)}</td><td>${a.disclosed ? '<span class="pill ok">Ya</span>' : '<span class="pill cl">Belum</span>'}</td></tr>`).join('') : '<tr><td colspan="3" class="note">Belum ada penggunaan AI tercatat.</td></tr>'}</tbody></table></div></section>`;
};
C.gatePick = el => { S.team.gate = el.value; render(); };
A.gateRun = () => { const b = gateSel(); b.project.checks.akhir = runCheck(b, 'akhir'); const sm = summary(b.project.checks.akhir); toast(sm.pass ? 'Pemeriksaan selesai: semua butir sesuai' : `Pemeriksaan selesai: ${sm.perbaikan} perbaikan, ${sm.verifikasi} verifikasi`); render(); };
A.gateDecide = el => { const b = gateSel(), chk = b.project.checks[el.dataset.stage]; if (!chk) return; decide(chk, +el.dataset.i, el.dataset.v); toast(`Butir ${+el.dataset.i + 1}: ${el.dataset.v === 'sesuai' ? 'diverifikasi sesuai' : 'ditandai perlu perbaikan'}`); render(); };
A.gatePass = () => { const b = gateSel(); if (!summary(b.project.checks.akhir).pass) return toast('Masih ada butir terbuka', true); b.project.step = 5; toast(b.brief.name + ' lolos gerbang syariah → presentasi klien'); render(); };

/* ---------- Kapasitas ---------- */
V.tim.kapasitas = () => {
  const f = fac(), need = [0, 1, 2].map(t => SALES.reduce((s, x, i) => s + x.u[t] * HOURS[i] * f, 0));
  return `<section class="card mb"><div class="card-head"><div><h2>Kapasitas produksi tim inti</h2><p class="note">3 orang × 20 jam × 4 minggu × 12 bulan = ${num(CAPACITY.hours)} jam/tahun. Kekurangan jam dipenuhi freelancer & magang (sudah termasuk HPP).</p></div>${scenSeg()}</div>
  <div class="stack" style="gap:18px">${need.map((n, t) => { const u = n / CAPACITY.hours * 100; return `<div><div class="row"><b>Tahun ${t + 1}</b><span class="mono">${num(Math.round(n))} jam · utilisasi ${dec(u.toFixed(1))}%</span></div><div class="cap-bar"><i style="width:${Math.min(100, u / 2)}%" class="${u > 100 ? 'over' : ''}"></i><span class="cap-line" title="Kapasitas tim inti"></span></div><p class="note">${u > 100 ? `Kekurangan ${num(Math.round(n - CAPACITY.hours))} jam → freelancer & magang` : `Sisa ${num(Math.round(CAPACITY.hours - n))} jam untuk pemasaran & pengembangan Maknai Kit`}</p></div>`; }).join('')}</div></section>
  <section class="card"><h2>Estimasi jam kerja per produk</h2><div class="tbl-wrap"><table><thead><tr><th>Produk</th><th>Jam / unit</th><th>Unit T1</th><th>Jam T1</th></tr></thead><tbody>${SALES.map((x, i) => `<tr><td>${x.n}</td><td class="tnum">${dec(HOURS[i])}</td><td class="tnum">${num(x.u[0] * f)}</td><td class="tnum">${num(Math.round(x.u[0] * HOURS[i] * f))}</td></tr>`).join('')}</tbody></table></div></section>`;
};

/* ---------- Keuangan ---------- */
const scenSeg = () => seg([['-30', '−30%'], ['-15', '−15%'], ['0', 'Dasar'], ['20', '+20%']], 'scen', String(S.team.scen));
function barsSVG(rows) {
  const W = 620, H = 260, L = 60, B = 34, T = 14, mx = Math.max(...rows.flatMap(r => [r[1], Math.abs(r[2])])) * 1.12, mn = Math.min(0, ...rows.map(r => r[2])) * 1.2;
  const Y = v => T + (H - T - B) * (1 - (v - mn) / (mx - mn)), bw = 46;
  let g = ''; for (let k = 0; k <= 4; k++) { const v = mn + (mx - mn) * k / 4; g += `<line x1="${L}" x2="${W - 10}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" class="gl"/><text x="${L - 8}" y="${(Y(v) + 4).toFixed(1)}" text-anchor="end" class="ax">${kfmt(v)}</text>`; }
  const cx = i => L + 70 + i * ((W - L - 100) / 2);
  return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Omzet dan laba bersih per tahun">${g}<line x1="${L}" x2="${W - 10}" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--ink-3)"/>${rows.map((r, i) => `<rect x="${cx(i) - bw - 3}" y="${Y(r[1])}" width="${bw}" height="${Y(0) - Y(r[1])}" rx="6" fill="var(--emerald-2)"><title>Omzet ${rp(r[1])}</title></rect><rect x="${cx(i) + 3}" y="${Math.min(Y(r[2]), Y(0))}" width="${bw}" height="${Math.abs(Y(0) - Y(r[2]))}" rx="6" fill="${r[2] < 0 ? 'var(--clay)' : 'var(--saffron)'}"><title>Laba bersih ${rp(r[2])}</title></rect><text x="${cx(i)}" y="${H - 10}" text-anchor="middle" class="ax">${r[0]}</text><text x="${cx(i) + 3 + bw / 2}" y="${Math.min(Y(r[2]), Y(0)) - 6}" text-anchor="middle" class="ax" style="fill:var(--ink)">${kfmt(r[2])}</text>`).join('')}</svg>`;
}
V.tim.keuangan = () => {
  const f = fac(), Y = [0, 1, 2].map(t => pl(t, f)), y1 = Y[0], ms = (y1.omzet - y1.bep) / y1.omzet;
  const row = (l, k, neg, b) => `<tr${b ? ' style="font-weight:700"' : ''}><td>${l}</td>${Y.map(y => `<td class="tnum" style="text-align:right;${y[k] < 0 && !neg ? 'color:var(--clay)' : ''}">${neg ? '(' + rp(y[k]) + ')' : rp(y[k])}</td>`).join('')}</tr>`;
  return `<div class="view-intro"><div><p class="muted">Uji skenario volume penjualan (biaya tetap & honor tetap). Model mereplikasi Tabel 5.3 & 6.2 proposal.</p></div>${scenSeg()}</div>
  <div class="grid g4 mb">${tile('Omzet tahun 1', rpk(y1.omzet), `vs BEP ${rpk(y1.bep)}`, null, 'trend')}${tile('Laba bersih T1', rpk(y1.laba), 'Margin ' + dec((y1.margin * 100).toFixed(1)) + '%', null, 'wallet', y1.laba < 0 ? 'cl' : '')}${tile('Margin pengaman T1', dec((ms * 100).toFixed(1)) + '%', 'Omzet di atas titik impas', null, 'shield', 'sf')}${tile('Kebutuhan dana awal', rpk(FIN.capital), '25,7% modal tim · 74,3% mudharabah', null, 'calc')}</div>
  <div class="grid split-53 mb"><section class="card"><div class="card-head"><h2>Omzet & laba bersih</h2><div class="legend"><span><i style="background:var(--emerald-2)"></i>Omzet</span><span><i style="background:var(--saffron)"></i>Laba bersih</span></div></div>${barsSVG(Y.map((y, t) => ['Tahun ' + (t + 1), y.omzet, y.laba]))}</section>
  <section class="card"><h2>Indikator kelayakan (skenario dasar)</h2><div class="stack" style="gap:8px">${[['NPV (diskonto 12%)', rp(KPI.npv), 'NPV > 0'], ['IRR', dec(KPI.irr) + '%', '> 12%'], ['Profitability Index', dec(KPI.pi), '> 1'], ['Pengembalian modal', dec(KPI.payback) + ' bulan', '< 3 tahun'], ['BEP tahun 1', rp(KPI.bep1), '≈' + rp(KPI.bep1 / 12) + '/bln']].map(([l, v, c]) => `<div class="inner row" style="padding:10px 14px"><span>${l}</span><span class="row nowrap" style="gap:8px"><b class="mono">${v}</b><span class="pill ok">${c}</span></span></div>`).join('')}</div><p class="note" style="margin-top:10px">Pesimis −30%: NPV ${rp(25694487)}, IRR 37,0% — tetap layak.</p></section></div>
  <section class="card mb"><div class="card-head"><h2>Proyeksi laba rugi ${S.team.scen ? `(skenario ${S.team.scen > 0 ? '+' : ''}${S.team.scen}%)` : '(dasar)'}</h2><button class="btn btn-line btn-sm" data-act="csvPL">${ic('download', 14)} CSV</button></div><div class="tbl-wrap"><table><thead><tr><th>Uraian</th><th style="text-align:right">Tahun 1</th><th style="text-align:right">Tahun 2</th><th style="text-align:right">Tahun 3</th></tr></thead><tbody>
  ${row('Omzet', 'omzet')}${row('Harga pokok pelayanan', 'hpp', 1)}${row('Laba kotor', 'kotor', 0, 1)}${row('Cadangan tak terduga (3%)', 'cad', 1)}${row('Biaya operasional tetap', 'fixed', 1)}${row('Honor tim inti', 'honor', 1)}${row('Penyusutan & amortisasi', 'dep', 1)}${row('Laba sebelum pajak', 'lsp', 0, 1)}${row('PPh final UMKM (0,5%)', 'pph', 1)}${row('Laba bersih', 'laba', 0, 1)}${row('Bagi hasil pemodal (mudharabah 10%)', 'bagi', 1)}${row('Laba setelah bagi hasil', 'setelah', 0, 1)}</tbody></table></div></section>
  <section class="card"><h2>Rencana penjualan (unit)</h2><div class="tbl-wrap"><table><thead><tr><th>Produk</th><th style="text-align:right">Harga</th><th style="text-align:right">T1</th><th style="text-align:right">T2</th><th style="text-align:right">T3</th><th style="text-align:right">Margin kontribusi</th></tr></thead><tbody>${SALES.map(x => `<tr><td>${x.n}</td><td class="tnum" style="text-align:right">${rp(x.price)}</td>${x.u.map(u => `<td class="tnum" style="text-align:right">${num(Math.round(u * f))}</td>`).join('')}<td class="tnum" style="text-align:right">${dec(((x.price - x.hpp) / x.price * 100).toFixed(1))}%</td></tr>`).join('')}</tbody></table></div><p class="note" style="margin-top:10px">Pendanaan tanpa riba: modal tim Rp9.000.000 + pembiayaan mudharabah Rp26.000.000 (pokok Rp1.300.000/bulan selama 20 bulan sejak bulan ke-5).</p></section>`;
};

/* ---------- Pasar ---------- */
V.tim.pasar = () => {
  const M = MARKET, mx = Math.max(...M.demand);
  return `<div class="grid g4 mb">${tile('UMKM Kota Malang', num(M.umkm), '20% berorientasi halal = 9.600', null, 'store')}${tile('Pesantren Malang Raya', num(M.pesantren), '40% punya unit usaha = 158', null, 'home', 'sf')}${tile('Potensi pelanggan T1', num(M.potential[0]), 'Jatim daring mulai T2: ' + num(M.potential[1]), null, 'user')}${tile('Pangsa pasar T1', '8,6%', 'T2 9,6% · T3 12,0%', null, 'chart', 'cl')}</div>
  <div class="grid split-53 mb"><section class="card"><h2>Permintaan, penawaran, dan kesenjangan (klien/tahun)</h2><div class="stack" style="gap:16px">${[0, 1, 2].map(t => `<div><div class="row"><b>Tahun ${t + 1}</b><span class="note">kesenjangan ${num(M.gap[t])} · target Maknai ${num(M.clients[t])} klien proyek</span></div>${hbar([['Permintaan', M.demand[t], num(M.demand[t])], ['Penawaran sesuai', M.supply[t], num(M.supply[t])], ['Kesenjangan', M.gap[t], num(M.gap[t])]].map(r => [r[0], r[1] / mx * 100, r[2]]))}</div>`).join('')}</div><p class="note" style="margin-top:10px">Asumsi: 10% potensi pelanggan membeli jasa branding per tahun, tumbuh 8%; penawaran yang sesuai baru memenuhi 70%. Akan divalidasi lewat survei 10–20 responden.</p></section>
  <section class="card"><h2>Segmentasi</h2><div class="stack" style="gap:10px">${[['Geografis', 'Malang Raya (T1) → Jawa Timur daring (T2–T3) → nasional'], ['Demografis', 'Pengelola unit usaha & koperasi pesantren; pemilik UMKM mikro-kecil 18–50 tahun'], ['Psikografis', 'Menjunjung nilai syariah, ingin merek amanah dan santun, sensitif harga'], ['Perilaku', 'Aktif di WhatsApp & Instagram; butuh label untuk marketplace & sertifikasi halal; percaya rekomendasi komunitas']].map(([a, b]) => `<div class="inner"><span class="lbl">${a}</span><p style="margin-top:4px;font-size:14px">${b}</p></div>`).join('')}</div></section></div>
  <section class="card mb"><div class="card-head"><div><h2>Posisi terhadap pesaing</h2><p class="note">Harga vs kedalaman nilai syariah & makna merek (penilaian tim). Sumber harga: UKM Indonesia, Canva.</p></div></div><div class="grid split-53"><div>${posMap()}</div><div class="stack" style="gap:8px">${COMPETITORS.map(c => `<div class="inner ${c.me ? 'me' : ''}"><div class="row"><b>${c.n}</b><span class="mono" style="font-size:12px">${c.price}</span></div><p class="note" style="margin-top:4px"><span style="color:var(--ok)">+ ${c.plus}</span> · <span style="color:var(--clay)">− ${c.minus}</span></p></div>`).join('')}</div></div></section>
  <section class="card"><h2>Analisis SWOT</h2><div class="swot">${[['S', 'Kekuatan', 'em'], ['W', 'Kelemahan', 'cl'], ['O', 'Peluang', 'sf'], ['T', 'Ancaman', '']].map(([k, l, c]) => `<div class="sw-${c || 'n'}"><span class="pill ${c}">${l}</span><ul>${SWOT[k].map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>
  <div class="grid g2" style="margin-top:14px">${[['SO', 'Paket "Siap Halal": label, kemasan, dan Syariah Check bagi UMK yang menyiapkan sertifikasi halal.'], ['ST', 'Tonjolkan kurasi, cerita merek, dan pendampingan yang tidak dimiliki perangkat DIY — tanpa perang diskon.'], ['WO', 'Bangun portofolio lewat pilot 3 klien dan koperasi pesantren; tambah kapasitas dengan freelancer & magang.'], ['WT', 'Pakai lebih dari satu perangkat AI, simpan aset di Maknai Kit, tetapkan kebijakan lisensi & transparansi AI.']].map(([k, v]) => `<div class="inner"><b class="mono">${k}</b> <span style="font-size:14px">${v}</span></div>`).join('')}</div></section>`;
};

Object.assign(A, {
  scen: el => { S.team.scen = +el.dataset.v; render(); },
  pipeNext: el => {
    const p = teamOrders().find(x => x.id === el.dataset.id); if (!p) return;
    if (p.ref) { const b = (S.projects || []).find(x => x.id === p.ref), pr = b.project;
      if (pr.step === 4 && !summary(pr.checks.akhir).pass) { S.team.gate = b.id; S.tab.tim = 'gerbang'; toast('Selesaikan gerbang syariah dulu'); return render(); }
      if (pr.step < 6) { pr.step++; toast(`${b.brief.name} → ${STEPS[pr.step].t}`); } return render(); }
    if (p.s < 6) { p.s++; toast(`${p.c} → ${STEPS[p.s].t}`); render(); }
  },
  csvPL: () => { const Y = [0, 1, 2].map(t => pl(t, fac())); const k = [['Omzet', 'omzet'], ['HPP', 'hpp'], ['Laba kotor', 'kotor'], ['Cadangan 3%', 'cad'], ['Biaya tetap', 'fixed'], ['Honor', 'honor'], ['Penyusutan', 'dep'], ['Laba sebelum pajak', 'lsp'], ['PPh 0,5%', 'pph'], ['Laba bersih', 'laba'], ['Bagi hasil', 'bagi'], ['Laba setelah bagi hasil', 'setelah']]; downloadCSV('proyeksi-laba-rugi-maknai.csv', [['Uraian', 'Tahun 1', 'Tahun 2', 'Tahun 3'], ...k.map(([l, x]) => [l, ...Y.map(y => Math.round(y[x]))])]); }
});
