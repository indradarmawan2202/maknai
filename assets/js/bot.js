/* Asisten Maknai — jawaban berbasis aturan di perangkat, dengan jalan pintas ke WhatsApp. */
import { S, A, F, $, esc, rp, slot, ic } from './core.js';
import { PKG, EXTRA, REF_DISC } from './data.js';
import { scanNums } from './util-nums.js';

const say = (l, v) => ({ l, v: v || l });
const act = (l, a, extra = {}) => ({ l, act: a, ...extra });
function reply(raw) {
  const t = raw.toLowerCase(), money = scanNums(t).find(x => x.v >= 10000);
  if (/^(halo|hai|hi|assalam|salam|permisi|p$)/.test(t) && t.length < 30) return { t: "Wa'alaikumussalam! Aku asisten Maknai. Mau tahu paket yang cocok, cara kerja Syariah Check, atau langsung pesan?", c: [say('Paket mana yang cocok?'), say('Apa itu Syariah Check?'), act('Pesan sekarang', 'startOrder')] };
  if (money || /anggaran|budget|modal|cocok|paket mana|rekomendasi/.test(t)) {
    if (!money) return { t: 'Berapa kira-kira anggaran branding-mu? Ketik bebas, misalnya "500 ribu" atau "1,5 juta".', c: [say('Anggaran 400 ribu'), say('Anggaran 1 juta'), say('Anggaran 2 juta')] };
    const v = money.v, p = v >= 2000000 ? PKG[2] : v >= 900000 ? PKG[1] : v >= 350000 ? PKG[0] : null;
    if (!p) return { t: `Dengan ${rp(v)}, mulai dari <b>Template Digital</b> (${rp(EXTRA[2].price)}) dulu, atau kumpulkan sampai ${rp(PKG[0].price)} untuk Paket Starter: logo, palet, panduan 1 halaman.`, c: [act('Lihat paket', 'jump', { to: 'paket' }), act('Coba Brand Kit gratis', 'jump', { to: 'coba-kit' })] };
    return { t: `Dengan ${rp(v)}, paling pas <b>Paket ${p.name}</b> (${rp(p.price)}, ${p.days} hari kerja): ${p.feat.slice(0, 4).join(', ')}. Bayar 50% di muka, 50% saat serah terima.`, c: [act('Pesan Paket ' + p.name, 'startOrder', { pkg: p.id }), say('Bagaimana pembayarannya?')] };
  }
  if (/syariah check|syariah|halal|label|butir|periksa/.test(t)) return { t: 'Maknai Syariah Check memeriksa 8 butir: halal & thayyib, kejujuran klaim, kesantunan visual, kesantunan bahasa, label halal, lisensi aset, transparansi AI, dan pelindungan data. Logo halal hanya dipasang jika produk sudah bersertifikat.', c: [act('Coba demo Syariah Check', 'jump', { to: 'syariah-check' })] };
  if (/\bai\b|kecerdasan|robot|hak cipta|tiru/.test(t)) return { t: 'AI hanya dipakai untuk eksplorasi konsep di langkah 3. Desainer lalu menyempurnakan secara manual, dan penggunaan AI selalu diinformasikan kepadamu. Jadi ada kontribusi kreatif manusia dan risiko hak cipta lebih rendah.', c: [act('Lihat alur 7 langkah', 'jump', { to: 'alur' })] };
  if (/bayar|pembayaran|dp|uang muka|cicil|lunas|akad|ijarah|riba/.test(t)) return { t: 'Akad ijarah (sewa jasa): uang muka 50% saat kontrak, pelunasan 50% saat serah terima Maknai Kit. Tanpa bunga, tanpa denda, rincian biaya jelas di awal.', c: [act('Mulai pesan', 'startOrder')] };
  if (/lama|berapa hari|waktu|kapan selesai|deadline/.test(t)) return { t: 'Starter 3 hari kerja, Brand 7 hari kerja, Premium 10 hari kerja — sudah termasuk 2 kali revisi.', c: [act('Lihat paket', 'jump', { to: 'paket' })] };
  if (/kit|panduan|mandiri|sunting|canva/.test(t)) return { t: 'Maknai Kit berisi panduan palet, tipografi, template yang bisa disunting, dan gaya bahasa — supaya kamu bisa mengelola merekmu sendiri setelah proyek selesai.', c: [act('Coba buat Brand Kit', 'jump', { to: 'coba-kit' })] };
  if (/konten|langganan|bulanan|instagram|tiktok|posting/.test(t)) return { t: `Langganan Konten ${rp(EXTRA[0].price)}/bulan: 12 desain feed/story, 4 caption terjadwal, 2 video pendek, dan laporan bulanan sederhana.`, c: [act('Pesan dengan langganan', 'startOrder')] };
  if (/workshop|pelatihan|santri|pesantren|madrasah/.test(t)) return { t: `Workshop branding & konten dengan AI yang etis: 3 jam, maksimal 25 peserta, ${rp(EXTRA[1].price)}/sesi. Pesantren mitra bisa mendapat workshop gratis perdana.`, c: [act('Tanya lewat WhatsApp', 'waOpen', { text: "Assalamu'alaikum Maknai, saya ingin menjadwalkan workshop untuk lembaga kami." })] };
  if (/diskon|promo|murah|rujukan|referral/.test(t)) return { t: `Ada diskon rujukan ${REF_DISC}% untuk klien yang direkomendasikan klien lain. Paket Starter sendiri mulai ${rp(PKG[0].price)} — jauh di bawah platform sayembara yang mulai Rp2.500.000.`, c: [act('Lihat paket', 'jump', { to: 'paket' })] };
  if (/terima kasih|makasih|syukron|jazak/.test(t)) return { t: 'Sama-sama, semoga usahanya berkah. 🙏', c: [act('Pesan sekarang', 'startOrder')] };
  return { t: 'Aku belum menangkap maksudnya. Coba tanya soal paket & anggaran, Syariah Check, pemakaian AI, pembayaran, atau langsung hubungi tim lewat WhatsApp.', c: [say('Paket mana yang cocok?'), say('Apa itu Syariah Check?'), act('Chat tim via WhatsApp', 'waOpen', { text: "Assalamu'alaikum Maknai, saya ingin bertanya." })] };
}
function html() {
  const m = S.chat.msgs, last = m[m.length - 1];
  return m.map(x => `<div class="msg ${x.b ? 'b' : 'u'}">${x.t}</div>`).join('') + (last && last.b && last.c ? `<div class="chips">${last.c.map(x => x.act ? `<button class="chip" data-act="${x.act}"${x.pkg ? ` data-pkg="${x.pkg}"` : ''}${x.to ? ` data-to="${x.to}"` : ''}${x.text ? ` data-text="${esc(x.text)}"` : ''}>${esc(x.l)}</button>` : `<button class="chip" data-act="chatSay" data-v="${esc(x.v)}">${esc(x.l)}</button>`).join('')}</div>` : '');
}
const draw = () => { slot('chatBody', html()); const b = $('#chatBody'); if (b) b.scrollTop = b.scrollHeight; };
function reset() { S.chat.msgs = [{ b: 1, t: "Assalamu'alaikum! Aku asisten Maknai. Ceritakan usahamu atau anggaranmu, nanti kubantu pilih paket yang pas.", c: [say('Paket mana yang cocok?'), say('Apa itu Syariah Check?'), say('Apakah logonya dibuat AI?')] }]; draw(); }
function send(text) {
  text = String(text).trim().slice(0, 300); if (!text) return;
  S.chat.msgs.push({ b: 0, t: esc(text) }, { b: 1, t: '<span class="typing"><i></i><i></i><i></i></span>' }); draw();
  const r = reply(text); setTimeout(() => { S.chat.msgs.pop(); S.chat.msgs.push({ b: 1, t: r.t, c: r.c }); draw(); }, 480);
}
export const chatWidgetHTML = () => `<button class="chat-fab" data-act="chatToggle" aria-controls="chatPanel" aria-expanded="false"><span class="dot">${ic('send', 17)}</span><span class="txt">Tanya Maknai</span></button>
  <section class="chat-panel" id="chatPanel" hidden aria-label="Obrolan asisten Maknai"><div class="chat-head"><span class="dot">M</span><div style="flex:1;min-width:0"><b>Asisten Maknai</b><small>Biasanya dibalas tim dalam 1 jam kerja</small></div><button class="btn btn-sm" data-act="waOpen" data-text="Assalamu'alaikum Maknai, saya ingin bertanya." title="Lanjut di WhatsApp">WhatsApp</button><button class="btn btn-sm btn-icon" data-act="chatToggle" aria-label="Tutup">${ic('x', 16)}</button></div>
  <div class="chat-body" id="chatBody" aria-live="polite"></div><form class="chat-form" data-form="chat"><input id="chatIn" type="text" placeholder="Tulis pertanyaanmu…" autocomplete="off" maxlength="300" aria-label="Pesan"><button class="btn btn-p btn-icon" type="submit" aria-label="Kirim">${ic('send', 18)}</button></form></section>`;
A.chatToggle = () => { S.chat.open = !S.chat.open; const p = $('#chatPanel'); if (!p) return; p.hidden = !S.chat.open; const f = document.querySelector('.chat-fab'); if (f) f.setAttribute('aria-expanded', S.chat.open); if (S.chat.open) { S.chat.msgs.length ? draw() : reset(); setTimeout(() => { const i = $('#chatIn'); if (i) i.focus(); }, 60); } };
A.chatSay = el => send(el.dataset.v);
F.chat = f => { const i = f.querySelector('input'); send(i.value); i.value = ''; };
