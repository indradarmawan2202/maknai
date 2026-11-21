/* Maknai Syariah Check — hibrida: AI vision (screening) + aturan (data terstruktur) + verifikasi tim.
   Dua titik pemeriksaan: audit awal (langkah 1, kemasan lama klien) dan gerbang akhir (langkah 5, desain Maknai).
   Tiga status: sesuai · perbaikan (indikasi tidak sesuai) · verifikasi (bukti belum cukup). */
import { S, A, esc, ic, slot, toast, SHORT as TODAY_SHORT } from './core.js';
import { CHECK, DEMO_ISSUES } from './data.js';
import { buildKit, labelSVG } from './kit.js';

/* ---------- kosakata ---------- */
export const ST = {
  sesuai: { l: 'Sesuai', pill: 'ok', orb: 'Sesuai' },
  perbaikan: { l: 'Perlu perbaikan', pill: 'cl', orb: 'Perbaiki' },
  verifikasi: { l: 'Perlu verifikasi', pill: 'sf', orb: 'Verifikasi' }
};
export const SRC = { ai: 'AI', aturan: 'Aturan', tim: 'Tim', contoh: 'Contoh tersimpan', live: 'Live' };
/* Butir yang bisa dinilai dari foto oleh AI, dan butir yang dinilai dari data (aturan). */
export const VISION = [0, 1, 2, 3, 4, 7], RULES = [4, 5, 6];
const RANK = { sesuai: 0, verifikasi: 1, perbaikan: 2 };

/* ---------- aturan (deterministik, dari brief + log produksi) ---------- */
export function ruleItems(brief, log, design) {
  const out = {}, assets = (log && log.assets) || [], ai = (log && log.ai) || [], badge = design && design.halalBadge;
  // 4. Label halal
  if (badge && !brief.halal) out[4] = { status: 'perbaikan', temuan: 'Ada logo halal, sementara brief menyatakan sertifikat halal belum terbit.', saran: 'Lepas logo halal sampai sertifikat terbit.' };
  else if (brief.halal && !brief.halalNo) out[4] = { status: 'verifikasi', temuan: 'Klien menyatakan sudah bersertifikat halal, tetapi nomor sertifikat belum dicatat.', saran: 'Minta nomor sertifikat, lalu cek di sistem BPJPH.' };
  else if (brief.halal) out[4] = { status: 'verifikasi', temuan: `Nomor sertifikat ${brief.halalNo} tercatat. Keabsahannya dicek tim di sistem BPJPH.`, saran: 'Tandai sesuai setelah nomor dicek.' };
  else out[4] = { status: 'sesuai', temuan: 'Sertifikat belum terbit dan tidak ada logo halal; ruang logo disiapkan untuk nanti.' };
  // 5. Lisensi aset
  if (!assets.length) out[5] = { status: 'verifikasi', temuan: 'Log aset produksi masih kosong.', saran: 'Catat sumber dan lisensi setiap font, ikon, dan foto.' };
  else if (assets.some(a => !a.license)) out[5] = { status: 'perbaikan', temuan: 'Aset tanpa lisensi: ' + assets.filter(a => !a.license).map(a => a.name).join(', ') + '.', saran: 'Ganti dengan aset berlisensi komersial atau buatan sendiri.' };
  else if (assets.some(a => !a.verified)) out[5] = { status: 'verifikasi', temuan: 'Lisensi belum dicek: ' + assets.filter(a => !a.verified).map(a => a.name).join(', ') + '.', saran: 'Cocokkan dokumen lisensi.' };
  else out[5] = { status: 'sesuai', temuan: `${assets.length} aset tercatat berlisensi: ` + assets.map(a => `${a.name} (${a.license})`).join('; ') + '.' };
  // 6. Etika AI
  if (!ai.length) out[6] = { status: 'verifikasi', temuan: 'Tidak ada catatan penggunaan AI.', saran: 'Konfirmasi bahwa AI memang tidak dipakai, atau catat penggunaannya.' };
  else if (ai.some(a => !a.disclosed)) out[6] = { status: 'perbaikan', temuan: 'Penggunaan AI belum diinformasikan ke klien: ' + ai.filter(a => !a.disclosed).map(a => a.usage).join(', ') + '.', saran: 'Cantumkan di lembar serah terima.' };
  else out[6] = { status: 'sesuai', temuan: 'AI dipakai untuk ' + ai.map(a => `${a.usage.toLowerCase()} (${a.tool})`).join('; ') + '; desainer menyempurnakan hasilnya dan klien sudah diberi tahu.' };
  Object.values(out).forEach(x => x.sumber = 'aturan');
  return out;
}
/* Gabung hasil AI dan aturan: status terburuk menang, temuan digabung. */
export function merge(aiItems, rules) {
  return CHECK.map((_, i) => {
    const a = aiItems[i], r = rules[i];
    if (a && r) { const w = RANK[r.status] >= RANK[a.status] ? r : a, o = w === r ? a : r; return { ...w, temuan: w.temuan + (o.status !== 'sesuai' && o.temuan !== w.temuan ? ' ' + o.temuan : '') }; }
    return a || r || { status: 'verifikasi', temuan: 'Belum ada data untuk butir ini.', sumber: 'aturan' };
  });
}

/* ---------- screening AI ---------- */
/* Mode demo/offline: hasil contoh tersimpan (diberi label "Contoh tersimpan", bukan analisis baru).
   Mode live: Edge Function analyze-label → Gemini (lihat live.js). */
function sampleVision(stage, brief) {
  const biz = (brief.biz || '').toLowerCase();
  if (stage === 'akhir') return {
    0: { status: 'sesuai', temuan: `Produk ${biz || 'klien'}; tidak tampak unsur terlarang pada desain.` },
    1: { status: 'sesuai', temuan: 'Klaim di label bersifat deskriptif (asal, bahan); tidak ada klaim khasiat.' },
    2: { status: 'sesuai', temuan: 'Visual berupa logo, pola geometris, dan ikon; tanpa model manusia.' },
    3: { status: 'sesuai', temuan: 'Slogan santun; tidak memakai ayat atau simbol agama untuk klaim.' },
    4: { status: 'sesuai', temuan: brief.halal ? 'Logo halal ditempatkan di ruang label resmi.' : 'Tidak ada logo halal pada desain.' },
    7: { status: 'sesuai', temuan: 'Tidak ada data pribadi tercetak selain kontak usaha.' }
  };
  return {
    0: { status: 'sesuai', temuan: 'Tidak tampak unsur terlarang pada kemasan.' },
    1: { status: 'perbaikan', temuan: 'Ada klaim khasiat berlebihan pada label lama.', saran: 'Ganti dengan klaim yang dapat dibuktikan.' },
    2: { status: 'sesuai', temuan: 'Visual sopan.' },
    3: { status: 'sesuai', temuan: 'Bahasa santun.' },
    4: { status: brief.halal ? 'sesuai' : 'perbaikan', temuan: brief.halal ? 'Logo halal terlihat.' : 'Logo halal terlihat pada label lama.' },
    7: { status: 'sesuai', temuan: 'Tidak ada data pribadi tercetak.' }
  };
}
export function runCheck(bundle, stage) {
  const brief = bundle.brief, log = stage === 'akhir' ? bundle.project.log : { ai: [], assets: [] };
  const vis = sampleVision(stage, brief); Object.values(vis).forEach(x => x.sumber = 'contoh');
  const design = { halalBadge: stage === 'akhir' ? !!brief.halal : vis[4].status !== 'sesuai' || !!brief.halal };
  const rules = ruleItems(brief, log, design);
  if (stage === 'awal') { rules[5] = { status: 'verifikasi', temuan: 'Sumber aset pada kemasan lama tidak diketahui.', saran: 'Desain baru memakai aset yang tercatat di log produksi.', sumber: 'aturan' }; rules[6] = { status: 'verifikasi', temuan: 'Kemasan lama dibuat di luar Maknai; tidak ada catatan proses.', sumber: 'aturan' }; }
  const items = merge(vis, rules);
  return { stage, at: TODAY_SHORT, src: 'contoh', items };
}
/* Mode live sebelum Edge Function Gemini aktif: butir visual menunggu pemeriksaan manual tim,
   butir berbasis data dihitung aturan dari brief + log produksi di database. */
export function runLiveRules(bundle, stage) {
  const brief = bundle.brief, log = stage === 'akhir' ? bundle.project.log : { ai: [], assets: [] };
  const manual = {}; VISION.filter(i => i !== 4).forEach(i => manual[i] = { status: 'verifikasi', temuan: 'Screening AI belum dijalankan; periksa ' + (stage === 'awal' ? 'foto kemasan' : 'desain') + ' secara manual.', sumber: 'aturan' });
  const rules = ruleItems(brief, log, { halalBadge: stage === 'akhir' ? !!brief.halal : false });
  if (stage === 'awal') {
    rules[4] = brief.halal ? rules[4] : { status: 'verifikasi', temuan: 'Sertifikat halal belum terbit; periksa apakah kemasan lama memakai logo halal.', sumber: 'aturan' };
    rules[5] = { status: 'verifikasi', temuan: 'Sumber aset pada kemasan lama tidak diketahui.', saran: 'Desain baru memakai aset yang tercatat di log produksi.', sumber: 'aturan' };
    rules[6] = { status: 'verifikasi', temuan: 'Kemasan lama dibuat di luar Maknai; tidak ada catatan proses.', sumber: 'aturan' };
  }
  return merge(manual, rules);
}
/* Gerbang lolos bila tidak ada "perlu perbaikan" dan setiap "perlu verifikasi" sudah diputuskan tim. */
export const summary = chk => {
  const it = (chk && chk.items) || [], c = s => it.filter(x => x.status === s).length;
  return { n: CHECK.length, sesuai: c('sesuai'), perbaikan: c('perbaikan'), verifikasi: c('verifikasi'), pass: !!it.length && !c('perbaikan') && !c('verifikasi') };
};
/* Keputusan tim atas satu butir. */
export function decide(chk, i, status, by = 'Tim Maknai') {
  const x = chk.items[i]; x.status = status; x.verified = true; x.by = by; x.at = TODAY_SHORT;
}

/* ---------- laporan ---------- */
const pillHTML = st => `<span class="pill ${ST[st].pill}">${st === 'sesuai' ? ic('check', 13) + ' ' : ''}${ST[st].l}</span>`;
export function reportHTML(chk, opts = {}) {
  if (!chk) return `<div class="inner note">${opts.empty || 'Belum diperiksa.'}</div>`;
  return `<div class="stack" style="gap:8px">${chk.items.map((x, i) => `<div class="chk ${x.status}"><div class="chk-head"><span class="chk-no">${i + 1}</span><div style="min-width:0;flex:1"><b>${CHECK[i][0]}</b><p class="note">${esc(x.temuan)}${x.saran && x.status !== 'sesuai' ? ` <b>Saran:</b> ${esc(x.saran)}` : ''}</p><span class="src-tag">${SRC[x.sumber] || x.sumber}${x.verified ? ` · diputuskan ${esc(x.by || 'tim')}` : ''}</span></div>${pillHTML(x.status)}</div>
    ${opts.team && x.status !== 'sesuai' ? `<div class="chk-body chk-acts"><button class="btn btn-s btn-sm" data-act="gateDecide" data-stage="${chk.stage}" data-i="${i}" data-v="sesuai">${ic('check', 13)} ${x.status === 'perbaikan' ? 'Sudah diperbaiki — sesuai' : 'Bukti cukup — sesuai'}</button>${x.status === 'verifikasi' ? `<button class="btn btn-line btn-sm" data-act="gateDecide" data-stage="${chk.stage}" data-i="${i}" data-v="perbaikan">Perlu perbaikan</button>` : ''}</div>` : ''}</div>`).join('')}</div>`;
}
export function summaryHTML(chk) {
  if (!chk) return '<span class="pill">Belum diperiksa</span>';
  const s = summary(chk);
  return `<div class="row start" style="gap:6px"><span class="pill ok">${s.sesuai} sesuai</span>${s.perbaikan ? `<span class="pill cl">${s.perbaikan} perlu perbaikan</span>` : ''}${s.verifikasi ? `<span class="pill sf">${s.verifikasi} perlu verifikasi</span>` : ''}${chk.src === 'contoh' ? '<span class="pill">Hasil contoh</span>' : ''}</div>`;
}

/* =========================================================
   Demo interaktif di beranda (label "Madu Hutan Barokah")
   ========================================================= */
const demoKit = () => buildKit({ name: 'Madu Hutan Barokah', biz: 'Madu & herbal', values: ['Amanah', 'Hangat'], shape: 'lengkung', seed: 0, halal: false, city: 'Malang Selatan' });
function demoLabel() {
  const f = S.land.fixed;
  return labelSVG(demoKit(), { claim: f[1] ? 'Madu hutan murni dari lereng Malang Selatan' : 'Menyembuhkan segala penyakit!', claimBad: !f[1], halalBadge: f[4] ? undefined : 'fake', font: f[5] ? undefined : 'Impact', ill: !f[6] });
}
/* Hasil demo per butir: DEMO_ISSUES → perbaikan; butir 0 → verifikasi (asal madu perlu dokumen). */
const DEMO_VERIFY = { 0: { find: 'Asal madu dan bahan tambahan belum didukung dokumen dari pemilik usaha.', fix: 'Dokumen asal madu dilampirkan dan dicek tim.' } };
const demoStatus = i => S.land.fixed[i] ? 'sesuai' : DEMO_ISSUES[i] ? 'perbaikan' : DEMO_VERIFY[i] ? 'verifikasi' : 'sesuai';
const status = i => S.land.check[i]; // undefined | sesuai | perbaikan | verifikasi
const issue = i => DEMO_ISSUES[i] || DEMO_VERIFY[i];

export function drawCheck() {
  drawOrbit(); if (!document.getElementById('chkList')) return;
  const n = CHECK.length, ok = CHECK.filter((_, i) => status(i) === 'sesuai').length, open = CHECK.filter((_, i) => status(i) && status(i) !== 'sesuai').length;
  slot('chkList', CHECK.map((_, i) => itemHTML(i)).join(''));
  slot('chkMock', demoLabel());
  slot('chkSum', `<div class="row"><div><span class="lbl">Hasil pemeriksaan</span><div class="big" style="font-size:30px;margin-top:4px">${ok}<span class="note" style="font-family:var(--font)"> / ${n} sesuai</span></div></div>${ok === n ? `<span class="pill ok">${ic('check', 14)} Siap diserahkan</span>` : open ? `<span class="pill cl">${open} butir terbuka</span>` : '<span class="pill">Belum diperiksa</span>'}</div><div class="row" style="margin-top:14px">${ok + open < n ? `<button class="btn btn-p" data-act="chkAll">${ic('shield', 16)} Periksa semua butir</button>` : ''}${ok + open ? '<button class="btn btn-ghost btn-sm" data-act="chkReset">Ulangi demo</button>' : ''}</div>`);
}
function itemHTML(i) {
  const [t, q] = CHECK[i], st = status(i), iss = issue(i);
  return `<div class="chk ${st || ''}"><div class="chk-head"><span class="chk-no">${i + 1}</span><div style="min-width:0;flex:1"><b>${t}</b><p class="note">${q}</p></div>${st ? pillHTML(st) : `<button class="btn btn-line btn-sm" data-act="chkOne" data-i="${i}">Periksa</button>`}</div>
    ${st && st !== 'sesuai' ? `<div class="chk-body"><p><b>Temuan:</b> ${iss.find}</p><button class="btn btn-s btn-sm" data-act="chkFix" data-i="${i}">${ic('spark', 14)} ${st === 'verifikasi' ? 'Tandai terverifikasi' : 'Terapkan perbaikan'}</button></div>` : ''}
    ${st === 'sesuai' && S.land.fixed[i] ? `<div class="chk-body ok"><p><b>${DEMO_VERIFY[i] ? 'Diverifikasi' : 'Diperbaiki'}:</b> ${iss.fix}</p></div>` : ''}</div>`;
}
const SHORT_T = ['Halal & thayyib', 'Kejujuran klaim', 'Kesantunan visual', 'Kesantunan bahasa', 'Label halal', 'Lisensi aset', 'Etika AI', 'Data pribadi'];
const ORB_IC = ['star', 'check', 'eye', 'doc', 'tag', 'layers', 'spark', 'shield'];
function orbHTML(i) {
  const st = status(i), sel = S.land.chkSel === i;
  return `<button class="orb ${st || ''} ${sel ? 'sel' : ''}" data-act="chkPick" data-i="${i}" aria-pressed="${sel}"><span class="orb-ic">${st === 'sesuai' ? ic('check', 15) : ic(ORB_IC[i], 15)}</span><span class="orb-t">${SHORT_T[i]}</span><span class="orb-st">${st ? ST[st].orb : 'Periksa'}</span></button>`;
}
function detailHTML() {
  const i = S.land.chkSel;
  if (i == null) return `<p class="note">Klik salah satu butir, atau periksa semuanya sekaligus.</p>`;
  const st = status(i), iss = issue(i);
  if (st === 'perbaikan') return `<p><b>${i + 1}. ${CHECK[i][0]}</b> — ${iss.find}</p><button class="lx-btn gold sm" data-act="chkFix" data-i="${i}">${ic('spark', 14)} Terapkan perbaikan</button>`;
  if (st === 'verifikasi') return `<p><b>${i + 1}. ${CHECK[i][0]}</b> — ${iss.find}</p><button class="lx-btn gold sm" data-act="chkFix" data-i="${i}">${ic('check', 14)} Tandai terverifikasi</button>`;
  if (st === 'sesuai' && S.land.fixed[i]) return `<p><b>${i + 1}. ${CHECK[i][0]}</b> — ${DEMO_VERIFY[i] ? 'diverifikasi' : 'diperbaiki'}: ${iss.fix}</p>`;
  return `<p><b>${i + 1}. ${CHECK[i][0]}</b> — ${CHECK[i][1]}</p>`;
}
function drawOrbit() {
  if (!document.getElementById('chkOrbL')) return;
  if (S.land.chkSel == null) { const j = CHECK.findIndex((_, k) => status(k) && status(k) !== 'sesuai'); if (j >= 0) S.land.chkSel = j; }
  const n = CHECK.length, ok = CHECK.filter((_, i) => status(i) === 'sesuai').length, bad = CHECK.filter((_, i) => status(i) === 'perbaikan').length, ver = CHECK.filter((_, i) => status(i) === 'verifikasi').length;
  slot('chkOrbL', [0, 1, 2, 3].map(orbHTML).join(''));
  slot('chkOrbR', [4, 5, 6, 7].map(orbHTML).join(''));
  slot('chkMock2', demoLabel());
  slot('chkScore', `<div><span class="lx-k">Hasil pemeriksaan</span><b class="lx-num">${ok}<small> / ${n} sesuai</small></b></div><div class="lx-chips">${ok === n ? '<span class="lx-chip ok">Siap diserahkan</span>' : bad || ver ? `${bad ? `<span class="lx-chip bad">${bad} perbaikan</span>` : ''}${ver ? `<span class="lx-chip warn">${ver} verifikasi</span>` : ''}` : '<span class="lx-chip">Belum diperiksa</span>'}</div>`);
  slot('chkDetail', detailHTML());
  slot('chkAct', `${ok + bad + ver < n ? `<button class="lx-btn dark sm" data-act="chkAll">${ic('shield', 14)} Periksa semua</button>` : ''}${ok + bad + ver ? '<button class="lx-btn ghost sm" data-act="chkReset">Ulangi</button>' : ''}`);
}
A.chkPick = el => { const i = +el.dataset.i; S.land.chkSel = i; if (!status(i)) S.land.check[i] = demoStatus(i); drawCheck(); };
A.chkOne = el => { const i = +el.dataset.i; S.land.check[i] = demoStatus(i); drawCheck(); };
A.chkFix = el => { const i = +el.dataset.i, was = status(i); S.land.chkSel = null; S.land.fixed[i] = true; S.land.check[i] = 'sesuai'; drawCheck(); toast(`Butir ${i + 1} ${was === 'verifikasi' ? 'diverifikasi' : 'diperbaiki'} — sesuai`); };
A.chkAll = () => { let d = 0; CHECK.forEach((_, i) => { if (!status(i)) { d += 160; setTimeout(() => { S.land.check[i] = demoStatus(i); drawCheck(); }, d); } }); };
A.chkReset = () => { S.land.check = {}; S.land.fixed = {}; S.land.chkSel = null; drawCheck(); };
export function checkSectionHTML() {
  return `<div class="chk-grid"><div class="chk-left"><div class="mock-wrap chk-mock" id="chkMock"></div><p class="note" style="text-align:center;margin-top:8px">Contoh karya: label "Madu Hutan Barokah" (rancangan awal)</p><div class="card" id="chkSum" style="margin-top:14px"></div></div><div class="chk-list" id="chkList"></div></div>`;
}
