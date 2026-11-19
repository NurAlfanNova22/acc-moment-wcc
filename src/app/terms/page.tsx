import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ACC Moment | Wedding Content Creator Tulungagung, Blitar, Kediri & Trenggalek",
  description: "Your personal content creator. Melayani Wedding Content Creator & All Event di Tulungagung, Blitar, Kediri, Trenggalek dan sekitarnya.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDFBF0] py-12 px-4 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl prose prose-brown lg:prose-lg">
        <header className="text-center mb-12">
          <span className="text-[#C5A059] text-sm tracking-[0.3em] uppercase font-bold">🤍 Terms & Conditions</span>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#2A1E17] mt-4">ACC MOMENT — WEDDING CONTENT CREATOR & ALL EVENT</h1>
        </header>

        <section className="space-y-8 text-[#2A1E17]">
          <p className="italic text-center">Untuk kenyamanan bersama, mohon membaca dan memahami ketentuan berikut:</p>

          <div className="space-y-6">
            <h3 className="font-bold border-b border-[#D4C3A3] pb-2">1. Booking & Pembayaran</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Booking dilakukan dengan mengisi data pemesanan yang telah disediakan.</li>
              <li>Tanggal acara hanya dapat diamankan setelah pembayaran DP diterima yaitu 50% dari harga paket.</li>
              <li>DP yang telah dibayarkan tidak dapat dikembalikan apabila terjadi pembatalan dari pihak client.</li>
              <li>Pelunasan dilakukan maksimal pada hari pelaksanaan acara.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold border-b border-[#D4C3A3] pb-2">2. Jadwal & Waktu</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Client wajib memberikan informasi tanggal, lokasi, dan jam acara secara jelas.</li>
              <li>Jam standby WCC ditentukan berdasarkan kesepakatan bersama, idealnya 30–60 menit sebelum acara dimulai.</li>
              <li>WCC akan hadir sesuai jam standby yang telah disepakati untuk mempersiapkan dokumentasi.</li>
              <li>Durasi kerja dihitung sejak jam standby yang telah disepakati, <em>bukan sejak acara dimulai.</em></li>
              <li>Keterlambatan atau perubahan rundown acara wajib diinformasikan kepada WCC.</li>
              <li>Penambahan waktu dokumentasi akan dikenakan biaya tambahan sesuai tarif yang berlaku per jamnya.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold border-b border-[#D4C3A3] pb-2">3. Request Konten</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Client diperbolehkan memberikan referensi video, lagu, tren TikTok, dan konsep konten sebelum hari H dengan cara mengisi form yang akan dikirim H-7 acara.</li>
              <li>Client wajib menginformasikan momen-momen penting yang ingin diabadikan.</li>
              <li>Request tambahan saat acara berlangsung akan disesuaikan dengan kondisi dan waktu yang tersedia.</li>
              <li>Tidak semua request dapat dijamin terpenuhi apabila terkendala situasi di lapangan.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold border-b border-[#D4C3A3] pb-2">4. Pelaksanaan Acara</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Client diharapkan memberikan akses dan informasi yang diperlukan selama proses dokumentasi.</li>
              <li>WCC berhak menyesuaikan pengambilan konten dengan kondisi acara.</li>
              <li>WCC akan berusaha mengabadikan momen terbaik tanpa mengganggu jalannya acara.</li>
              <li>Dokumentasi dilakukan sesuai durasi paket yang dipilih.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold border-b border-[#D4C3A3] pb-2">5. Pengiriman Hasil Dokumentasi</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Hasil dokumentasi akan dikirimkan melalui Google Drive.</li>
              <li>Waktu pengiriman akan dilakukan sesegera mungkin, maksimal di H+3.</li>
              <li>File hasil dokumentasi tidak memiliki batas waktu penyimpanan selama masih tersedia di Google Drive ACC Moment.</li>
              <li>Client sangat disarankan untuk segera mengunduh dan menyimpan seluruh file dokumentasi ke perangkat pribadi sebagai salinan cadangan (backup).</li>
              <li>ACC Moment tidak bertanggung jawab apabila terjadi kehilangan, kerusakan, atau kendala akses file akibat gangguan sistem maupun hal lain di luar kendali ACC Moment.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold border-b border-[#D4C3A3] pb-2">6. Dokumentasi & Portofolio</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>ACC Moment berhak menggunakan sebagian hasil dokumentasi sebagai portofolio dan media promosi.</li>
              <li>Apabila client tidak berkenan hasil dokumentasinya dipublikasikan, silakan informasikan sebelum acara berlangsung.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold border-b border-[#D4C3A3] pb-2">7. Pembatalan & Perubahan Jadwal</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Perubahan tanggal acara wajib dikonfirmasikan kepada ACC Moment.</li>
              <li>Perubahan jadwal bergantung pada ketersediaan WCC.</li>
              <li>Apabila terjadi pembatalan dari pihak client, DP tidak dapat dikembalikan.</li>
            </ul>
          </div>

          <footer className="text-center pt-10 mt-10 border-t border-[#D4C3A3]">
            <p className="font-cursive text-2xl text-[#2A1E17] mb-2">Terima kasih telah mempercayakan momen spesialmu kepada ACC Moment!</p>
            <p className="text-sm text-[#5D4F45]">We capture your precious moments, so you can relive them forever. 💍</p>
          </footer>
        </section>
      </article>
    </div>
  );
}
