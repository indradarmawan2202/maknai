/* Konfigurasi Maknai Live. Kosong = mode Live nonaktif; situs berjalan dalam mode Demo/Offline.
   Hanya Project URL dan anon/publishable key yang boleh ada di sini (aman di frontend karena dibatasi RLS).
   JANGAN pernah menaruh service_role key atau API key Gemini di file ini. */
export const CONFIG = {
  supabaseUrl: 'https://xvhkijfnxpuujavozixq.supabase.co',
  supabaseAnonKey: 'sb_publishable_QMUaxGaAIx1qKV-wR8ut6Q_H5nYFTd_',
  /* Akun klien demo untuk tombol "Masuk sebagai juri". Kata sandi ini memang publik:
     akunnya ber-role klien, is_demo = true, dan RLS membatasinya ke pesanannya sendiri.
     Akun TIM tidak pernah ditaruh di sini. */
  juri: { email: 'juri@maknai.id', password: '' }
};
