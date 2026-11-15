
import { INFO, ORDER } from './components'

// Materi pembelajaran A sampai F. Blok: p = paragraf, ul = daftar, dl = glosarium.
export const LEARNING = [
  { id: 'A', judul: 'Pengenalan Energi Terbarukan', blok: [
    { t: 'p', v: 'Energi terbarukan adalah energi dari sumber alam yang tidak habis atau pulih dengan cepat, misalnya cahaya matahari, angin, air, dan panas bumi.' },
    { t: 'ul', v: ['Manfaat: sumbernya tidak habis, emisi saat beroperasi rendah, dan mengurangi ketergantungan pada bahan bakar fosil.', 'Contoh: PLTS (matahari), PLTB (angin), PLTA (air), PLTP (panas bumi), dan biomassa.'] }] },
  { id: 'B', judul: 'Mengenal PLTS', blok: [
    { t: 'p', v: 'PLTS (Pembangkit Listrik Tenaga Surya) mengubah cahaya matahari menjadi listrik memakai panel surya. Prinsipnya efek fotovoltaik: cahaya mengenai bahan silikon dan melepaskan elektron sehingga timbul arus listrik.' }] },
  { id: 'C', judul: 'Komponen PLTS', blok: [{ t: 'ul', v: ORDER.map((/** @type {string} */ k) => `${INFO[k].nama}: ${INFO[k].fungsi}`) }] },
  { id: 'D', judul: 'Cara Kerja PLTS', blok: [
    { t: 'ul', v: ['Matahari memancarkan cahaya ke panel.', 'Sel fotovoltaik mengubah cahaya menjadi listrik DC.', 'Listrik DC mengalir lewat kabel ke solar charge controller.', 'Controller mengatur pengisian baterai.', 'Baterai menyimpan energi.', 'Inverter mengubah DC menjadi AC.', 'Listrik AC dipakai lampu, kipas, dan peralatan lain.'] },
    { t: 'p', v: 'Arus DC (searah) mengalir ke satu arah, seperti air di pipa lurus. Arus AC (bolak-balik) arahnya berganti-ganti, 50 kali per detik pada listrik rumah di Indonesia.' },
    { t: 'p', v: 'Controller dan inverter berbeda: controller mengatur pengisian baterai (sisi DC), inverter mengubah DC menjadi AC.' },
    { t: 'p', v: 'Catatan: partikel bercahaya pada animasi melambangkan aliran energi. Elektron sebenarnya bergerak lambat, sedangkan energi listrik merambat jauh lebih cepat lewat medan listrik di sepanjang kabel.' },
    { t: 'p', v: 'Keselamatan: bagian ini hanya diagram belajar. Pemasangan instalasi listrik nyata harus dikerjakan teknisi berpengalaman.' }] },
  { id: 'E', judul: 'Kelebihan dan Kekurangan', blok: [
    { t: 'ul', v: ['Kelebihan: memakai energi terbarukan, tanpa emisi langsung saat beroperasi, dan tahan lama.', 'Kekurangan: bergantung pada cahaya, biaya awal cukup besar, perlu tempat pemasangan yang sesuai, dan perlu baterai untuk malam hari.'] }] },
  { id: 'F', judul: 'Glosarium', blok: [{ t: 'dl', v: [
    ['Fotovoltaik', 'Proses perubahan cahaya menjadi listrik pada bahan semikonduktor.'], ['Energi listrik', 'Energi yang dibawa muatan listrik dan dapat diubah menjadi cahaya, gerak, atau panas.'],
    ['Arus AC', 'Arus bolak-balik: arah aliran berganti-ganti.'], ['Arus DC', 'Arus searah: arah aliran tetap.'], ['Tegangan', 'Dorongan yang membuat listrik mengalir (volt).'],
    ['Arus', 'Banyaknya muatan yang mengalir tiap detik (ampere).'], ['Daya', 'Energi listrik per detik. Daya = tegangan × arus.'], ['Watt (W)', 'Satuan daya listrik.'], ['Volt (V)', 'Satuan tegangan listrik.'],
    ['Ampere (A)', 'Satuan arus listrik.'], ['Inverter', 'Alat pengubah listrik DC menjadi AC.'], ['Efisiensi', 'Perbandingan energi yang berguna dengan energi yang masuk.'], ['Kapasitas baterai', 'Jumlah energi yang dapat disimpan, misalnya dalam watt-jam (Wh).'] ] }] },
]
