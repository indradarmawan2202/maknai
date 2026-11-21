/* Maknai Syariah Check — demo interaktif (Lampiran B & D.3) dan laporan untuk portal klien. */
import { S, A, esc, ic, slot, toast } from './core.js';
import { CHECK, DEMO_ISSUES } from './data.js';
import { buildKit, labelSVG } from './kit.js';

const demoKit = () => buildKit({ name: 'Madu Hutan Barokah', biz: 'Madu & herbal', values: ['Amanah', 'Hangat'], shape: 'lengkung', seed: 0, halal: false, city: 'Malang Selatan' });
function demoLabel() {
  const f = S.land.fixed;
  return labelSVG(demoKit(), { claim: f[1] ? 'Madu hutan murni dari lereng Malang Selatan' : 'Menyembuhkan segala penyakit!', claimBad: !f[1], halalBadge: f[4] ? undefined : 'fake', font: f[5] ? undefined : 'Impact', ill: !f[6] });
}
const status = i => S.land.check[i]; // undefined | 'lolos' | 'perbaiki'
function itemHTML(i) {
  const [t, q] = CHECK[i], st = status(i), iss = DEMO_ISSUES[i];
  return `<div class="chk ${st || ''}"><div class="chk-head"><span class="chk-no">${i + 1}</span><div style="min-width:0;flex:1"><b>${t}</b><p class="note">${q}</p></div>
    ${st === 'lolos' ? `<span class="pill ok">${ic('check', 13)} Lolos</span>` : st === 'perbaiki' ? '<span class="pill cl">Perbaiki</span>' : `<button class="btn btn-line btn-sm" data-act="chkOne" data-i="${i}">Periksa</button>`}</div>
    ${st === 'perbaiki' ? `<div class="chk-body"><p><b>Temuan:</b> ${iss.find}</p><button class="btn btn-s btn-sm" data-act="chkFix" data-i="${i}">${ic('spark', 14)} Terapkan perbaikan</button></div>` : ''}
    ${st === 'lolos' && S.land.fixed[i] ? `<div class="chk-body ok"><p><b>Diperbaiki:</b> ${iss.fix}</p></div>` : ''}</div>`;
}
export function drawCheck() {
  const n = CHECK.length, ok = CHECK.filter((_, i) => status(i) === 'lolos').length, bad = CHECK.filter((_, i) => status(i) === 'perbaiki').length;
  drawOrbit(); if (!document.getElementById('chkList')) return;
  slot('chkList', CHECK.map((_, i) => itemHTML(i)).join(''));
  slot('chkMock', demoLabel());
  slot('chkSum', `<div class="row"><div><span class="lbl">Hasil pemeriksaan</span><div class="big" style="font-size:30px;margin-top:4px">${ok}<span class="note" style="font-family:var(--font)"> / ${n} lolos</span></div></div>${ok === n ? `<span class="pill ok" style="font-size:13px;padding:6px 12px">${ic('check', 14)} Siap diserahkan ke klien</span>` : bad ? `<span class="pill cl" style="font-size:13px;padding:6px 12px">${bad} butir perlu diperbaiki</span>` : '<span class="pill">Belum diperiksa</span>'}</div><div class="bar ${bad ? 'cl' : ''}" style="margin-top:12px"><i style="width:${ok / n * 100}%"></i></div>
  <div class="row" style="margin-top:14px">${ok + bad < n ? `<button class="btn btn-p" data-act="chkAll">${ic('shield', 16)} Periksa semua butir</button>` : ''}${ok + bad ? '<button class="btn btn-ghost btn-sm" data-act="chkReset">Ulangi demo</button>' : ''}</div>`);
}
const SHORT = ['Halal & thayyib', 'Kejujuran klaim', 'Kesantunan visual', 'Kesantunan bahasa', 'Label halal', 'Lisensi aset', 'Etika AI', 'Data pribadi'];
const ORB_IC = ['star', 'check', 'eye', 'doc', 'tag', 'layers', 'spark', 'shield'];
function orbHTML(i) {
  const st = status(i), sel = S.land.chkSel === i;
  return `<button class="orb ${st || ''} ${sel ? 'sel' : ''}" data-act="chkPick" data-i="${i}" aria-pressed="${sel}"><span class="orb-ic">${st === 'lolos' ? ic('check', 15) : ic(ORB_IC[i], 15)}</span><span class="orb-t">${SHORT[i]}</span><span class="orb-st">${st === 'lolos' ? 'Lolos' : st === 'perbaiki' ? 'Perbaiki' : 'Periksa'}</span></button>`;
}
function detailHTML() {
  const i = S.land.chkSel;
  if (i == null) return `<p class="note">Klik salah satu butir, atau periksa semuanya sekaligus.</p>`;
  const st = status(i), iss = DEMO_ISSUES[i];
  if (st === 'perbaiki') return `<p><b>${i + 1}. ${CHECK[i][0]}</b> — ${iss.find}</p><button class="lx-btn gold sm" data-act="chkFix" data-i="${i}">${ic('spark', 14)} Terapkan perbaikan</button>`;
  if (st === 'lolos' && S.land.fixed[i]) return `<p><b>${i + 1}. ${CHECK[i][0]}</b> — diperbaiki: ${iss.fix}</p>`;
  return `<p><b>${i + 1}. ${CHECK[i][0]}</b> — ${CHECK[i][1]}</p>`;
}
function drawOrbit() {
  if (!document.getElementById('chkOrbL')) return;
  if (S.land.chkSel == null) { const j = CHECK.findIndex((_, k) => status(k) === 'perbaiki'); if (j >= 0) S.land.chkSel = j; }
  const n = CHECK.length, ok = CHECK.filter((_, i) => status(i) === 'lolos').length, bad = CHECK.filter((_, i) => status(i) === 'perbaiki').length;
  slot('chkOrbL', [0, 1, 2, 3].map(orbHTML).join(''));
  slot('chkOrbR', [4, 5, 6, 7].map(orbHTML).join(''));
  slot('chkMock2', demoLabel());
  slot('chkScore', `<div><span class="lx-k">Hasil pemeriksaan</span><b class="lx-num">${ok}<small> / ${n} lolos</small></b></div><span class="lx-chip ${ok === n ? 'ok' : bad ? 'bad' : ''}">${ok === n ? 'Siap diserahkan' : bad ? bad + ' perlu diperbaiki' : 'Belum diperiksa'}</span>`);
  slot('chkDetail', detailHTML());
  slot('chkAct', `${ok + bad < n ? `<button class="lx-btn dark sm" data-act="chkAll">${ic('shield', 14)} Periksa semua</button>` : ''}${ok + bad ? '<button class="lx-btn ghost sm" data-act="chkReset">Ulangi</button>' : ''}`);
}
A.chkPick = el => { const i = +el.dataset.i; S.land.chkSel = i; if (!status(i)) S.land.check[i] = DEMO_ISSUES[i] && !S.land.fixed[i] ? 'perbaiki' : 'lolos'; drawCheck(); };
export function checkSectionHTML() {
  return `<div class="chk-grid"><div class="chk-left"><div class="mock-wrap chk-mock" id="chkMock"></div><p class="note" style="text-align:center;margin-top:8px">Contoh karya: label "Madu Hutan Barokah" (rancangan awal)</p><div class="card" id="chkSum" style="margin-top:14px"></div></div><div class="chk-list" id="chkList"></div></div>`;
}
A.chkOne = el => { const i = +el.dataset.i; S.land.check[i] = DEMO_ISSUES[i] && !S.land.fixed[i] ? 'perbaiki' : 'lolos'; drawCheck(); };
A.chkFix = el => { const i = +el.dataset.i; S.land.chkSel = null; S.land.fixed[i] = true; S.land.check[i] = 'lolos'; drawCheck(); toast('Butir ' + (i + 1) + ' diperbaiki dan lolos'); };
A.chkAll = () => { let d = 0; CHECK.forEach((_, i) => { if (!status(i)) { d += 160; setTimeout(() => { S.land.check[i] = DEMO_ISSUES[i] && !S.land.fixed[i] ? 'perbaiki' : 'lolos'; drawCheck(); }, d); } }); };
A.chkReset = () => { S.land.check = {}; S.land.fixed = {}; S.land.chkSel = null; drawCheck(); };

/* Laporan Syariah Check untuk proyek klien. */
export function reportHTML(done, kit) {
  const notes = ['Produk air minum dalam kemasan; tidak ada unsur terlarang.', 'Klaim "dari mata air pegunungan" sesuai dokumen sumber air.', 'Visual hanya ikon dan pola geometris; tanpa model manusia.', 'Slogan santun; tidak memakai ayat atau simbol agama untuk klaim.', 'Sertifikat halal belum terbit — ruang logo halal dikosongkan.', 'Font berlisensi SIL OFL; ikon dari pustaka berlisensi komersial.', 'AI dipakai untuk 12 eksplorasi konsep; desainer menggambar ulang logo final. Dicatat di lembar serah terima.', 'Data kontak klien disimpan dengan persetujuan; tidak dibagikan ke pihak ketiga.'];
  return `<div class="stack" style="gap:8px">${CHECK.map(([t, q], i) => `<div class="chk ${done ? 'lolos' : ''}"><div class="chk-head"><span class="chk-no">${i + 1}</span><div style="min-width:0;flex:1"><b>${t}</b><p class="note">${done ? esc(notes[i]) : q}</p></div>${done ? `<span class="pill ok">${ic('check', 13)} Lolos</span>` : '<span class="pill">Menunggu</span>'}</div></div>`).join('')}</div>`;
}
