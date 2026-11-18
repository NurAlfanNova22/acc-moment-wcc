"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FolderArchive,
  Film,
  Upload,
  CheckCircle2,
  Clock,
  MessageSquare,
  LogOut,
  ExternalLink,
  Send,
  AlertCircle,
  FileCheck,
  Star,
  Quote,
} from "lucide-react";

type Testimonial = {
  id: string;
  date: string;
  rating: number;
  message: string;
  status: "pending" | "published";
};

export default function ClientDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "files" | "testimoni">("info");

  // State untuk form upload bukti bayar
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // State untuk form testimoni
  const [rating, setRating] = useState(5);
  const [testimonialText, setTestimonialText] = useState("");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: "1",
      date: "15 Nov 2026",
      rating: 5,
      message: "Hasil videonya keren banget! Timnya ramah dan kerjanya sat-set. Makasih ACC Moment!",
      status: "published",
    },
  ]);

  useEffect(() => {
    setMounted(true);
    const session = localStorage.getItem("client_session");
    if (!session) {
      router.push("/client/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("client_session");
    router.push("/client/login");
  };

  const handleUploadPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadFile(null);
    }, 4000);
  };

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialText.trim()) return;

    const newTesti: Testimonial = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }),
      rating: rating,
      message: testimonialText,
      status: "pending",
    };

    setTestimonials([newTesti, ...testimonials]);
    setTestimonialText("");
    alert("Terima kasih atas testimoninya! Admin akan meninjau sebelum ditampilkan.");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Top Bar Dashboard */}
      <header className="border-b border-border bg-warm-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex flex-col leading-none">
            <Link href="/" className="font-cursive text-xl text-text-dark">
              Acc
            </Link>
            <span className="font-heading text-sm font-bold tracking-widest text-primary uppercase -mt-0.5">Moment</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-[11px] font-bold uppercase tracking-wider text-text-dark sm:inline">
              Sarah & Dimas
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-medium transition-colors hover:bg-primary-pale hover:text-primary"
            >
              <LogOut size={12} aria-hidden="true" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="mx-auto max-w-6xl px-5 py-8">
        {/* Banner Status Acara */}
        <div className="rounded-xl border border-border bg-warm-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-block rounded-full bg-secondary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-secondary">
                Paket Gold • Pernikahan
              </span>
              <h1 className="mt-2 font-heading text-2xl font-bold text-text-dark sm:text-3xl">
                Sarah & Dimas
              </h1>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-text-light">
                Booking: <span className="text-text-dark">ACC-DEMO</span> | 25 Des 2026
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700 ring-1 ring-amber-200">
                <Clock size={12} aria-hidden="true" />
                DP Terverifikasi
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700 ring-1 ring-emerald-200">
                <CheckCircle2 size={12} aria-hidden="true" />
                Jadwal Terkunci
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 border-b border-border overflow-x-auto no-scrollbar">
          <nav className="flex space-x-8 min-w-max" aria-label="Tabs">
            {[
              { id: "info", label: "Tagihan & Pembayaran" },
              { id: "files", label: "Akses File Konten" },
              { id: "testimoni", label: "Berikan Testimoni" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`border-b-2 pb-3 text-[11px] font-bold uppercase tracking-[0.15em] transition-all ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-text-light hover:text-text-dark"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab 1: Info Paket & Tagihan */}
        {activeTab === "info" && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-warm-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-bold text-text-dark uppercase tracking-widest">
                Rincian Tagihan
              </h2>
              <div className="mt-6 space-y-4 divide-y divide-border/40">
                <div className="flex justify-between pt-2 text-xs font-semibold uppercase tracking-wider">
                  <span className="text-text-medium">Total Paket Gold</span>
                  <span className="text-text-dark">Rp 3.500.000</span>
                </div>
                <div className="flex justify-between pt-4 text-xs font-semibold uppercase tracking-wider">
                  <span className="text-text-medium">Down Payment (DP)</span>
                  <span className="text-emerald-600">- Rp 1.750.000 (Lunas)</span>
                </div>
                <div className="flex justify-between pt-4 text-sm font-bold uppercase tracking-widest border-t-2 border-primary/20">
                  <span className="text-text-dark">Sisa Pelunasan</span>
                  <span className="text-primary">Rp 1.750.000</span>
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-primary/5 border border-primary/10 p-5 text-[11px] text-text-medium">
                <p className="font-bold uppercase tracking-widest text-text-dark mb-2">Info Pembayaran:</p>
                <p className="flex justify-between border-b border-primary/10 pb-1.5 mb-1.5">
                  <span>Bank BCA</span>
                  <span className="font-mono font-bold text-text-dark">1234-5678-90</span>
                </p>
                <p className="flex justify-between">
                  <span>Atas Nama</span>
                  <span className="font-bold text-text-dark">ACC MOMENT</span>
                </p>
                <p className="mt-4 italic opacity-75">Pelunasan dilakukan paling lambat H-1 sebelum acara.</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-warm-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-bold text-text-dark uppercase tracking-widest">
                Konfirmasi Bayar
              </h2>
              <p className="mt-2 text-[11px] font-semibold text-text-medium uppercase tracking-wider">
                Upload bukti transfer pelunasan atau DP Anda di sini.
              </p>

              {uploadSuccess ? (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                    <FileCheck size={20} />
                    Berhasil Diunggah
                  </div>
                  <p className="mt-2 text-[10px] leading-relaxed font-medium uppercase tracking-wider">
                    Admin akan memverifikasi pembayaran Anda dalam 24 jam.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleUploadPayment} className="mt-6 space-y-5">
                  <div className="flex justify-center rounded-xl border-2 border-dashed border-border/60 bg-cream/30 px-6 py-10 transition-colors hover:border-primary/40 hover:bg-primary-pale/30">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-primary/40" />
                      <div className="mt-4 flex text-[11px] font-bold uppercase tracking-widest text-text-medium">
                        <label htmlFor="file-upload" className="relative cursor-pointer text-primary hover:text-secondary">
                          <span>Pilih File</span>
                          <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
                        </label>
                        <p className="pl-1.5">atau drop di sini</p>
                      </div>
                      {uploadFile ? (
                        <p className="mt-3 text-[10px] font-bold text-primary truncate max-w-[200px]">✓ {uploadFile.name}</p>
                      ) : (
                        <p className="text-[9px] text-text-light mt-2 uppercase tracking-tighter">Maksimal 5MB (JPG/PNG)</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!uploadFile}
                    className="w-full rounded-xl bg-primary py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/20 transition-all hover:bg-secondary disabled:opacity-50 active:scale-95"
                  >
                    Kirim Bukti Pembayaran
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Akses Konten (Merged Drive Links) */}
        {activeTab === "files" && (
          <div className="mt-6">
            <div className="rounded-xl border border-border bg-warm-white p-8 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="flex gap-4 mb-6">
                  <div className="rounded-full bg-amber-50 p-4 text-amber-700 shadow-sm ring-1 ring-amber-100">
                    <FolderArchive size={32} />
                  </div>
                  <div className="rounded-full bg-emerald-50 p-4 text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                    <Film size={32} />
                  </div>
                </div>
                
                <h2 className="font-heading text-2xl font-bold text-text-dark uppercase tracking-widest">
                  Akses Folder Google Drive
                </h2>
                <p className="mt-3 max-w-lg text-[11px] font-semibold leading-relaxed text-text-medium uppercase tracking-wider">
                  Seluruh file dokumentasi Anda (Raw Footage & Video Hasil Edit) telah kami satukan dalam satu folder utama untuk kemudahan akses.
                </p>

                <div className="mt-8 grid w-full gap-4 sm:grid-cols-2">
                   <div className="rounded-xl bg-cream border border-border/60 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-text-light mb-1">Status Konten:</p>
                      <p className="text-sm font-bold text-emerald-600">SIAP DIUNDUH</p>
                   </div>
                   <div className="rounded-xl bg-cream border border-border/60 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-text-light mb-1">Masa Aktif Link:</p>
                      <p className="text-sm font-bold text-text-dark">30 HARI</p>
                   </div>
                </div>

                <a
                  href="https://drive.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 flex w-full max-w-md items-center justify-center gap-3 rounded-xl bg-primary py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-primary/20 transition-all hover:bg-secondary active:scale-95"
                >
                  <ExternalLink size={18} />
                  Buka Folder Dokumentasi
                </a>
                
                <p className="mt-6 text-[10px] font-medium text-text-light uppercase tracking-widest italic">
                  *Gunakan koneksi stabil untuk mendownload file berukuran besar.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Testimoni */}
        {activeTab === "testimoni" && (
          <div className="mt-6 grid gap-6 md:grid-cols-5">
            {/* Form Buat Testimoni Baru */}
            <div className="md:col-span-2">
              <div className="rounded-xl border border-border bg-warm-white p-6 shadow-sm">
                <h2 className="font-heading text-lg font-bold text-text-dark uppercase tracking-widest">
                  Berikan Testimoni
                </h2>
                <p className="mt-2 text-[11px] font-semibold text-text-medium uppercase tracking-wider">
                  Pengalaman Anda sangat berharga bagi kami. Bagikan kesan Anda di sini!
                </p>

                <form onSubmit={handleAddTestimonial} className="mt-6 space-y-5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-light mb-2 block">Rating Pelayanan:</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="transition-transform active:scale-125"
                        >
                          <Star
                            size={24}
                            className={star <= rating ? "fill-primary text-primary" : "text-border fill-transparent"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="testiText" className="text-[10px] font-bold uppercase tracking-widest text-text-light mb-2 block">
                      Komentar / Pesan:
                    </label>
                    <textarea
                      id="testiText"
                      rows={5}
                      value={testimonialText}
                      onChange={(e) => setTestimonialText(e.target.value)}
                      placeholder="Tuliskan pengalaman Anda bekerja bersama tim ACC Moment..."
                      className="w-full rounded-xl border border-border bg-cream p-4 text-xs font-medium text-text-dark placeholder:text-text-light/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!testimonialText.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/20 transition-all hover:bg-secondary disabled:opacity-50 active:scale-95"
                  >
                    <Send size={14} />
                    Kirim Testimoni
                  </button>
                </form>
              </div>
            </div>

            {/* Riwayat Testimoni */}
            <div className="md:col-span-3">
              <div className="rounded-xl border border-border bg-warm-white p-6 shadow-sm">
                <h2 className="font-heading text-lg font-bold text-text-dark uppercase tracking-widest">
                  Testimoni Anda
                </h2>

                <div className="mt-6 space-y-4">
                  {testimonials.map((testi) => (
                    <div key={testi.id} className="relative rounded-xl border border-border/60 bg-cream p-5">
                      <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10" />
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < testi.rating ? "fill-primary text-primary" : "text-border"} />
                          ))}
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                          testi.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {testi.status === 'published' ? 'Ditampilkan' : 'Menunggu Moderasi'}
                        </span>
                      </div>

                      <p className="text-xs font-medium italic text-text-dark leading-relaxed">
                        &ldquo;{testi.message}&rdquo;
                      </p>
                      
                      <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-text-light">
                        {testi.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
