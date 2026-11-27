import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "ACC Moment | Terms & Conditions",
  description: "Syarat dan ketentuan layanan ACC Moment Wedding Content Creator.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF0] py-12 px-4 sm:px-6 lg:px-8">
      {/* Header with Logo & Back Button */}
      <div className="max-w-3xl mx-auto flex flex-col items-center mb-10 space-y-6">
        <Link href="/" className="relative w-48 h-16 transform hover:scale-105 transition-transform">
          <Image src="/logo.png" alt="ACC Moment Logo" fill className="object-contain" priority />
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 text-[#C5A059] font-bold uppercase tracking-widest text-[10px] hover:text-[#2A1E17] transition-colors group">
          <div className="p-2 rounded-full border border-[#C5A059] group-hover:border-[#2A1E17] transition-all">
            <ArrowLeft size={14} />
          </div>
          Kembali ke Beranda
        </Link>
      </div>

      <article className="mx-auto max-w-3xl bg-white p-8 sm:p-14 rounded-[3rem] shadow-2xl border border-[#D4C3A3]/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="text-center mb-12">
          <span className="text-[#C5A059] text-[10px] tracking-[0.4em] uppercase font-bold bg-[#FDFBF0] px-4 py-2 rounded-full border border-[#D4C3A3]/30">🤍 TERMS & CONDITIONS</span>
          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-[#2A1E17] mt-6 uppercase tracking-tight">ACC MOMENT — WEDDING CONTENT CREATOR & ALL EVENT</h1>
        </header>

        <section className="space-y-10 text-[#2A1E17] text-sm sm:text-base leading-relaxed">
          <p className="italic text-center text-[#8E7F75] font-medium border-b border-[#FDFBF0] pb-6">Untuk kenyamanan bersama, mohon membaca dan memahami ketentuan berikut :</p>

          <div className="space-y-6">
            <h3 className="font-bold border-l-4 border-[#C5A059] pl-4 text-lg uppercase tracking-wider text-[#2A1E17]">1. Booking & Pembayaran</h3>
            <ul className="list-disc pl-10 space-y-3 text-[#5D4F45]">
              <li>Booking dilakukan dengan mengisi data pemesanan yang telah disediakan.</li>
              <li>Tanggal acara hanya dapat diamankan setelah pembayaran DP diterima yaitu 50% dari harga paket.</li>
              <li>DP yang telah dibayarkan tidak dapat dikembalikan apabila terjadi pembatalan dari pihak client.</li>
              <li>Pelunasan dilakukan maksimal pada hari pelaksanaan acara.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold border-l-4 border-[#C5A059] pl-4 text-lg uppercase tracking-wider text-[#2A1E17]">2. Jadwal & Waktu</h3>
            <ul className="list-disc pl-10 space-y-3 text-[#5D4F45]">
              <li>Client wajib memberikan informasi tanggal, lokasi, dan jam acara secara jelas.</li>
              <li>Jam standby WCC ditentukan berdasarkan kesepakatan bersama, idealnya 30–60 menit sebelum acara dimulai.</li>
              <li>WCC akan hadir sesuai jam standby yang telah disepakati untuk mempersiapkan dokumentasi.</li>
              <li>Durasi kerja dihitung sejak jam standby yang telah disepakati, <em>bukan sejak acara dimulai.</em></li>
              <li>Keterlambatan atau perubahan rundown acara wajib diinformasikan kepada WCC.</li>
              <li>Penambahan waktu dokumentasi akan dikenakan biaya tambahan sesuai tarif yang berlaku per jamnya.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold border-l-4 border-[#C5A059] pl-4 text-lg uppercase tracking-wider text-[#2A1E17]">3. Request Konten</h3>
            <ul className="list-disc pl-10 space-y-3 text-[#5D4F45]">
              <li>Client diperbolehkan memberikan referensi video, lagu, tren TikTok, dan konsep konten sebelum hari H dengan cara mengisi form yang akan dikirim h-7 acara.</li>
              <li>Client wajib menginformasikan momen-momen penting yang ingin diabadikan.</li>
              <li>Request tambahan saat acara berlangsung akan disesuaikan dengan kondisi dan waktu yang tersedia.</li>
              <li>Tidak semua request dapat dijamin terpenuhi apabila terkendala situasi di lapangan.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold border-l-4 border-[#C5A059] pl-4 text-lg uppercase tracking-wider text-[#2A1E17]">4. Pelaksanaan Acara</h3>
            <ul className="list-disc pl-10 space-y-3 text-[#5D4F45]">
              <li>Client diharapkan memberikan akses dan informasi yang diperlukan selama proses dokumentasi.</li>
              <li>WCC berhak menyesuaikan pengambilan konten dengan kondisi acara.</li>
              <li>WCC akan berusaha mengabadikan momen terbaik tanpa mengganggu jalannya acara.</li>
              <li>Dokumentasi dilakukan sesuai durasi paket yang dipilih.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold border-l-4 border-[#C5A059] pl-4 text-lg uppercase tracking-wider text-[#2A1E17]">5. Pengiriman Hasil Dokumentasi</h3>
            <ul className="list-disc pl-10 space-y-3 text-[#5D4F45]">
              <li>Hasil dokumentasi akan dikirimkan melalui Google Drive.</li>
              <li>Waktu pengiriman akan dilakukan sesegera mungkin, maksimal di h+3.</li>
              <li>File hasil dokumentasi tidak memiliki batas waktu penyimpanan selama masih tersedia di Google Drive ACC Moment.</li>
              <li>Client sangat disarankan untuk segera mengunduh dan menyimpan seluruh file dokumentasi ke perangkat pribadi sebagai salinan cadangan (backup).</li>
              <li>ACC Moment tidak bertanggung jawab apabila terjadi kehilangan, kerusakan, atau kendala akses file akibat gangguan sistem maupun hal lain di luar kendali ACC Moment</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold border-l-4 border-[#C5A059] pl-4 text-lg uppercase tracking-wider text-[#2A1E17]">6. Dokumentasi & Portofolio</h3>
            <ul className="list-disc pl-10 space-y-3 text-[#5D4F45]">
              <li>ACC Moment berhak menggunakan sebagian hasil dokumentasi sebagai portofolio dan media promosi.</li>
              <li>Apabila client tidak berkenan hasil dokumentasinya dipublikasikan, silakan informasikan sebelum acara berlangsung.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold border-l-4 border-[#C5A059] pl-4 text-lg uppercase tracking-wider text-[#2A1E17]">7. Pembatalan & Perubahan Jadwal</h3>
            <ul className="list-disc pl-10 space-y-3 text-[#5D4F45]">
              <li>Perubahan tanggal acara wajib dikonfirmasikan kepada ACC Moment.</li>
              <li>Perubahan jadwal bergantung pada ketersediaan WCC.</li>
              <li>Apabila terjadi pembatalan dari pihak client, DP tidak dapat dikembalikan.</li>
            </ul>
          </div>

          <footer className="text-center pt-10 mt-10 border-t border-[#D4C3A3] space-y-3">
            <p className="font-cursive text-3xl text-[#C5A059]">Terima kasih telah mempercayakan momen spesialmu kepada ACC Moment!</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8E7F75] font-bold">We capture your precious moments, so you can relive them forever. 💍</p>
          </footer>
        </section>
      </article>
    </div>
  );
}
