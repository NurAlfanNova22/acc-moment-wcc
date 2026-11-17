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
} from "lucide-react";

type Revision = {
  id: string;
  date: string;
  message: string;
  status: "pending" | "in_progress" | "done";
  reply?: string;
};

export default function ClientDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "files" | "revisi">("info");

  // State untuk form upload bukti bayar
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // State untuk form revisi
  const [revisionText, setRevisionText] = useState("");
  const [revisions, setRevisions] = useState<Revision[]>([
    {
      id: "1",
      date: "15 Nov 2026",
      message: "Tolong ganti lagu di video Reels 1 dengan lagu yang lebih mellow pas bagian akad.",
      status: "done",
      reply: "Sudah diganti ya kak, silakan cek di folder hasil edit v2.",
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

  const handleAddRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionText.trim()) return;

    const newRev: Revision = {
      id: Date.now().toString(),
      date: "Hari ini",
      message: revisionText,
      status: "pending",
    };

    setRevisions([newRev, ...revisions]);
    setRevisionText("");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Top Bar Dashboard */}
      <header className="border-b border-border bg-warm-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <Link href="/" className="font-heading text-lg font-bold text-primary">
              ACC Moment
            </Link>
            <p className="text-xs text-text-light">Portal Klien</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium text-text-dark sm:inline">
              Hai, Sarah & Dimas 👋
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text-medium transition-colors hover:bg-primary-pale hover:text-primary"
            >
              <LogOut size={14} aria-hidden="true" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="mx-auto max-w-6xl px-5 py-8">
        {/* Banner Status Acara */}
        <div className="rounded-lg border border-border bg-warm-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-block rounded bg-secondary/15 px-2.5 py-1 text-xs font-medium text-secondary">
                Paket Gold • Pernikahan
              </span>
              <h1 className="mt-2 font-heading text-2xl font-bold text-text-dark sm:text-3xl">
                Sarah & Dimas
              </h1>
              <p className="mt-1 text-sm text-text-light">
                Kode Booking: <span className="font-mono font-bold text-text-dark">ACC-DEMO</span> | Tanggal Acara: 25 Desember 2026
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                <Clock size={13} aria-hidden="true" />
                Status DP: Terverifikasi
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                <CheckCircle2 size={13} aria-hidden="true" />
                Jadwal Terkunci
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 border-b border-border">
          <nav className="flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("info")}
              className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                activeTab === "info"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-medium hover:text-text-dark"
              }`}
            >
              Info Paket & Tagihan
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                activeTab === "files"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-medium hover:text-text-dark"
              }`}
            >
              Akses File & Konten
            </button>
            <button
              onClick={() => setActiveTab("revisi")}
              className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                activeTab === "revisi"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-medium hover:text-text-dark"
              }`}
            >
              Catatan Revisi ({revisions.length})
            </button>
          </nav>
        </div>

        {/* Tab 1: Info Paket & Tagihan */}
        {activeTab === "info" && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-warm-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-bold text-text-dark">
                Rincian Tagihan
              </h2>
              <div className="mt-4 space-y-3 divide-y divide-border/60">
                <div className="flex justify-between pt-2 text-sm">
                  <span className="text-text-medium">Total Biaya Paket Gold</span>
                  <span className="font-semibold text-text-dark">Rp 3.500.000</span>
                </div>
                <div className="flex justify-between pt-2 text-sm">
                  <span className="text-text-medium">Down Payment (DP) 50%</span>
                  <span className="font-semibold text-emerald-600">- Rp 1.750.000 (Lunas)</span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-bold">
                  <span className="text-text-dark">Sisa Pelunasan</span>
                  <span className="text-primary">Rp 1.750.000</span>
                </div>
              </div>

              <div className="mt-6 rounded-md bg-cream p-4 text-xs text-text-medium">
                <p className="font-semibold text-text-dark">Info Rekening Pembayaran:</p>
                <p className="mt-1">Bank BCA: <span className="font-mono font-bold text-text-dark">1234-5678-90</span> a.n. ACC Moment</p>
                <p className="mt-0.5 text-text-light">Pelunasan dilakukan paling lambat H-1 sebelum acara atau hari H.</p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-warm-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-bold text-text-dark">
                Upload Bukti Transfer
              </h2>
              <p className="mt-1 text-sm text-text-medium">
                Kirim foto/tangkapan layar bukti transfer pelunasan atau DP Anda di sini.
              </p>

              {uploadSuccess ? (
                <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  <div className="flex items-center gap-2 font-semibold">
                    <FileCheck size={18} aria-hidden="true" />
                    Bukti berhasil diunggah!
                  </div>
                  <p className="mt-1 text-xs">
                    Admin akan memverifikasi pembayaran Anda dalam 1x24 jam.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleUploadPayment} className="mt-4 space-y-4">
                  <div className="flex justify-center rounded-lg border-2 border-dashed border-border px-6 py-8 hover:bg-cream/50">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-text-light" aria-hidden="true" />
                      <div className="mt-2 flex text-sm text-text-medium">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer font-semibold text-primary hover:underline"
                        >
                          <span>Pilih file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                          />
                        </label>
                        <p className="pl-1">atau tarik ke sini</p>
                      </div>
                      <p className="text-xs text-text-light mt-1">PNG, JPG, PDF maksimal 5MB</p>
                      {uploadFile && (
                        <p className="mt-2 text-xs font-semibold text-primary">
                          Terpilih: {uploadFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!uploadFile}
                    className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    Kirim Bukti Pembayaran
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Akses Konten (Drive Links) */}
        {activeTab === "files" && (
          <div className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Box File Mentah */}
              <div className="rounded-lg border border-border bg-warm-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-amber-50 p-3 text-amber-700">
                    <FolderArchive size={28} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-text-dark">
                      File Mentahan (Raw Footage)
                    </h2>
                    <p className="mt-1 text-sm text-text-medium">
                      Semua video dan foto original tanpa editan langsung dari kamera tim kami di hari acara.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-md bg-cream p-4">
                  <div className="flex items-center justify-between text-xs text-text-light">
                    <span>Status File:</span>
                    <span className="font-semibold text-emerald-600">Sudah Siap Diunduh</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-text-light">
                    <span>Estimasi Masa Aktif Link:</span>
                    <span>30 Hari</span>
                  </div>
                </div>

                <a
                  href="https://drive.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  Buka Folder Google Drive Mentahan
                </a>
              </div>

              {/* Box Video Hasil Edit */}
              <div className="rounded-lg border border-border bg-warm-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700">
                    <Film size={28} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-text-dark">
                      Video Hasil Edit (Reels & TikTok)
                    </h2>
                    <p className="mt-1 text-sm text-text-medium">
                      Video yang sudah siap tayang, sudah di-grading warna, audio sinkron, dan siap upload ke medsos.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-md bg-cream p-4">
                  <div className="flex items-center justify-between text-xs text-text-light">
                    <span>Status Pengerjaan:</span>
                    <span className="font-semibold text-primary">Revisi v2 Tersedia</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-text-light">
                    <span>Jumlah Video:</span>
                    <span>5 Video Siap Tayang</span>
                  </div>
                </div>

                <a
                  href="https://drive.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  Buka Folder Google Drive Hasil Edit
                </a>
              </div>
            </div>

            {/* Embedded Google Drive Preview Tips */}
            <div className="rounded-lg border border-border bg-primary-pale/40 p-4 text-sm text-text-medium">
              <p className="font-semibold text-text-dark">💡 Tips Mengunduh:</p>
              <p className="mt-1">
                Gunakan koneksi Wi-Fi yang stabil saat mendownload seluruh file mentah karena ukurannya bisa mencapai puluhan gigabyte.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Catatan Revisi */}
        {activeTab === "revisi" && (
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {/* Form Buat Revisi Baru */}
            <div className="md:col-span-1">
              <div className="rounded-lg border border-border bg-warm-white p-6 shadow-sm">
                <h2 className="font-heading text-lg font-bold text-text-dark">
                  Tambah Catatan Revisi
                </h2>
                <p className="mt-1 text-xs text-text-medium">
                  Ada bagian yang ingin disesuaikan? Tulis menit ke berapa dan instruksi jelasnya di sini.
                </p>

                <form onSubmit={handleAddRevision} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="revText" className="sr-only">
                      Instruksi Revisi
                    </label>
                    <textarea
                      id="revText"
                      rows={4}
                      value={revisionText}
                      onChange={(e) => setRevisionText(e.target.value)}
                      placeholder="Contoh: Di video Reels menit 00:15, tolong potong bagian pas orang lewat di belakang..."
                      className="w-full rounded-md border border-border bg-cream p-3 text-sm text-text-dark placeholder:text-xs placeholder:text-text-light/60 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!revisionText.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Send size={15} aria-hidden="true" />
                    Kirim Catatan Revisi
                  </button>
                </form>
              </div>
            </div>

            {/* Daftar Riwayat Revisi */}
            <div className="md:col-span-2">
              <div className="rounded-lg border border-border bg-warm-white p-6 shadow-sm">
                <h2 className="font-heading text-lg font-bold text-text-dark">
                  Riwayat Revisi
                </h2>

                <div className="mt-4 space-y-4">
                  {revisions.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-lg border border-border bg-cream p-4"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-text-dark">{rev.date}</span>
                        <span
                          className={`rounded px-2 py-0.5 font-medium ${
                            rev.status === "done"
                              ? "bg-emerald-100 text-emerald-800"
                              : rev.status === "in_progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {rev.status === "done"
                            ? "Selesai Dikerjakan"
                            : rev.status === "in_progress"
                            ? "Sedang Dikerjakan"
                            : "Menunggu Antrean"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-text-medium">
                        &ldquo;{rev.message}&rdquo;
                      </p>

                      {rev.reply && (
                        <div className="mt-3 rounded-md bg-warm-white p-3 text-xs border border-border/80">
                          <p className="font-semibold text-primary">Tanggapan Editor:</p>
                          <p className="mt-0.5 text-text-medium">{rev.reply}</p>
                        </div>
                      )}
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
