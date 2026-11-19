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
  slot('chkList', CHECK.map((_, i) => itemHTML(i)).join(''));
  slot('chkMock', demoLabel());
  slot('chkSum', `<div class="row"><div><span class="lbl">Hasil pemeriksaan</span><div class="big" style="font-size:30px;margin-top:4px">${ok}<span class="note" style="font-family:var(--font)"> / ${n} lolos</span></div></div>${ok === n ? `<span class="pill ok" style="font-size:13px;padding:6px 12px">${ic('check', 14)} Siap diserahkan ke klien</span>` : bad ? `<span class="pill cl" style="font-size:13px;padding:6px 12px">${bad} butir perlu diperbaiki</span>` : '<span class="pill">Belum diperiksa</span>'}</div><div class="bar ${bad ? 'cl' : ''}" style="margin-top:12px"><i style="width:${ok / n * 100}%"></i></div>
  <div class="row" style="margin-top:14px">${ok + bad < n ? `<button class="btn btn-p" data-act="chkAll">${ic('shield', 16)} Periksa semua butir</button>` : ''}${ok + bad ? '<button class="btn btn-ghost btn-sm" data-act="chkReset">Ulangi demo</button>' : ''}</div>`);
}
export function checkSectionHTML() {
  return `<div class="chk-grid"><div class="chk-left"><div class="mock-wrap chk-mock" id="chkMock"></div><p class="note" style="text-align:center;margin-top:8px">Contoh karya: label "Madu Hutan Barokah" (rancangan awal)</p><div class="card" id="chkSum" style="margin-top:14px"></div></div><div class="chk-list" id="chkList"></div></div>`;
}
A.chkOne = el => { const i = +el.dataset.i; S.land.check[i] = DEMO_ISSUES[i] && !S.land.fixed[i] ? 'perbaiki' : 'lolos'; drawCheck(); };
A.chkFix = el => { const i = +el.dataset.i; S.land.fixed[i] = true; S.land.check[i] = 'lolos'; drawCheck(); toast('Butir ' + (i + 1) + ' diperbaiki dan lolos'); };
A.chkAll = () => { let d = 0; CHECK.forEach((_, i) => { if (!status(i)) { d += 160; setTimeout(() => { S.land.check[i] = DEMO_ISSUES[i] && !S.land.fixed[i] ? 'perbaiki' : 'lolos'; drawCheck(); }, d); } }); };
A.chkReset = () => { S.land.check = {}; S.land.fixed = {}; drawCheck(); };

/* Laporan Syariah Check untuk proyek klien. */
export function reportHTML(done, kit) {
  const notes = ['Produk air minum dalam kemasan; tidak ada unsur terlarang.', 'Klaim "dari mata air pegunungan" sesuai dokumen sumber air.', 'Visual hanya ikon dan pola geometris; tanpa model manusia.', 'Slogan santun; tidak memakai ayat atau simbol agama untuk klaim.', 'Sertifikat halal belum terbit — ruang logo halal dikosongkan.', 'Font berlisensi SIL OFL; ikon dari pustaka berlisensi komersial.', 'AI dipakai untuk 12 eksplorasi konsep; desainer menggambar ulang logo final. Dicatat di lembar serah terima.', 'Data kontak klien disimpan dengan persetujuan; tidak dibagikan ke pihak ketiga.'];
  return `<div class="stack" style="gap:8px">${CHECK.map(([t, q], i) => `<div class="chk ${done ? 'lolos' : ''}"><div class="chk-head"><span class="chk-no">${i + 1}</span><div style="min-width:0;flex:1"><b>${t}</b><p class="note">${done ? esc(notes[i]) : q}</p></div>${done ? `<span class="pill ok">${ic('check', 13)} Lolos</span>` : '<span class="pill">Menunggu</span>'}</div></div>`).join('')}</div>`;
}
