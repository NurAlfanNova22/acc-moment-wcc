"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  ShoppingBag,
  DollarSign,
  Plus,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
  Trash2,
  FolderArchive,
  Film,
  Edit3,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Receipt,
} from "lucide-react";

type Booking = {
  id: string;
  code: string;
  clientName: string;
  date: string;
  package: string;
  status: "pending" | "confirmed" | "completed";
  paymentStatus: "unpaid" | "dp" | "lunas";
  rawDriveLink: string;
  editedDriveLink: string;
  assignedTeam: string[];
};

type Expense = {
  id: string;
  date: string;
  event: string;
  category: "Transport" | "Konsumsi" | "Fee Tim" | "Lainnya";
  amount: number;
  description: string;
};

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "1",
    code: "ACC-DEMO",
    clientName: "Sarah & Dimas",
    date: "2026-12-25",
    package: "Paket Gold",
    status: "confirmed",
    paymentStatus: "dp",
    rawDriveLink: "https://drive.google.com/drive/folders/demo-raw",
    editedDriveLink: "https://drive.google.com/drive/folders/demo-edit",
    assignedTeam: ["Andi (Shooter)", "Rian (Editor)"],
  },
  {
    id: "2",
    code: "ACC-202611-002",
    clientName: "Nadia & Reza",
    date: "2026-11-20",
    package: "Paket Platinum",
    status: "confirmed",
    paymentStatus: "lunas",
    rawDriveLink: "https://drive.google.com/drive/folders/nadia-raw",
    editedDriveLink: "https://drive.google.com/drive/folders/nadia-edit",
    assignedTeam: ["Budi (Lead)", "Andi (Shooter)", "Rian (Editor)"],
  },
  {
    id: "3",
    code: "ACC-202611-003",
    clientName: "Fitri & Bayu",
    date: "2026-12-05",
    package: "Paket Silver",
    status: "pending",
    paymentStatus: "unpaid",
    rawDriveLink: "",
    editedDriveLink: "",
    assignedTeam: [],
  },
];

const INITIAL_EXPENSES: Expense[] = [
  {
    id: "1",
    date: "2026-11-15",
    event: "Nadia & Reza",
    category: "Transport",
    amount: 150000,
    description: "Bensin PP Tulungagung - Kediri",
  },
  {
    id: "2",
    date: "2026-11-15",
    event: "Nadia & Reza",
    category: "Konsumsi",
    amount: 100000,
    description: "Makan siang 2 kru lapangan",
  },
  {
    id: "3",
    date: "2026-11-16",
    event: "Nadia & Reza",
    category: "Fee Tim",
    amount: 1200000,
    description: "Honor 2 shooter & 1 editor",
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "team" | "finance">("orders");

  // State Pesanan
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // State Keuangan
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    event: "",
    category: "Transport" as Expense["category"],
    amount: "",
    description: "",
  });

  // Perhitungan Keuangan
  const totalRevenue = bookings.reduce((acc, b) => {
    if (b.paymentStatus === "lunas") return acc + 3500000;
    if (b.paymentStatus === "dp") return acc + 1750000;
    return acc;
  }, 0);

  const totalExpense = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const netProfit = totalRevenue - totalExpense;

  const handleUpdateDrive = (id: string, raw: string, edited: string) => {
    setBookings(
      bookings.map((b) =>
        b.id === id ? { ...b, rawDriveLink: raw, editedDriveLink: edited } : b
      )
    );
    setSelectedBooking(null);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.description) return;

    const expenseItem: Expense = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      event: newExpense.event || "Umum",
      category: newExpense.category,
      amount: parseInt(newExpense.amount, 10),
      description: newExpense.description,
    };

    setExpenses([expenseItem, ...expenses]);
    setNewExpense({
      event: "",
      category: "Transport",
      amount: "",
      description: "",
    });
    setShowExpenseForm(false);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-cream pb-12">
      {/* Top Bar Admin - Compact & Clean */}
      <header className="sticky top-0 z-40 border-b border-border bg-warm-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="flex min-h-[40px] items-center gap-1.5 text-xs font-semibold text-text-medium hover:text-primary sm:hidden"
              title="Ke Website Utama"
            >
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-heading text-base sm:text-lg font-bold text-primary">
                ACC Moment
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-primary">
                Admin
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border bg-cream px-3 py-1.5 text-xs font-medium text-text-dark hover:bg-primary-pale"
          >
            Lihat Website Utama &rarr;
          </Link>
        </div>

        {/* Mobile Horizontal Scrollable Tab Bar */}
        <div className="border-t border-border/80 bg-warm-white px-2 sm:px-6">
          <nav
            className="flex space-x-2 overflow-x-auto no-scrollbar py-2"
            aria-label="Admin Tabs"
          >
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex min-h-[42px] shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === "orders"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-cream text-text-medium hover:text-text-dark active:bg-primary-pale"
              }`}
            >
              <ShoppingBag size={15} aria-hidden="true" />
              <span>Pesanan ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("team")}
              className={`flex min-h-[42px] shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === "team"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-cream text-text-medium hover:text-text-dark active:bg-primary-pale"
              }`}
            >
              <Users size={15} aria-hidden="true" />
              <span>Jadwal & Tim</span>
            </button>

            <button
              onClick={() => setActiveTab("finance")}
              className={`flex min-h-[42px] shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === "finance"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-cream text-text-medium hover:text-text-dark active:bg-primary-pale"
              }`}
            >
              <DollarSign size={15} aria-hidden="true" />
              <span>Rekap Keuangan</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
        {/* ================= TAB 1: KELOLA PESANAN ================= */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-heading text-xl sm:text-2xl font-bold text-text-dark">
                  Daftar Pesanan Klien
                </h1>
                <p className="text-xs sm:text-sm text-text-light">
                  Kelola status acara dan tautkan folder Google Drive untuk klien.
                </p>
              </div>
            </div>

            {/* TAMPILAN MOBILE: CARD-BASED LIST (Sangat Nyaman di Layar HP!) */}
            <div className="space-y-3.5 md:hidden">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-xl border border-border bg-warm-white p-4 shadow-sm"
                >
                  {/* Header Card */}
                  <div className="flex items-start justify-between gap-2 border-b border-border/80 pb-3">
                    <div>
                      <h2 className="font-heading text-base font-bold text-text-dark">
                        {booking.clientName}
                      </h2>
                      <p className="font-mono text-xs text-text-light">
                        {booking.code}
                      </p>
                    </div>
                    <span className="rounded bg-secondary/15 px-2.5 py-1 text-[11px] font-semibold text-secondary shrink-0">
                      {booking.package}
                    </span>
                  </div>

                  {/* Info Status & Tanggal */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-text-light text-[11px]">Tanggal Acara:</span>
                      <p className="font-medium text-text-dark mt-0.5 flex items-center gap-1">
                        <Calendar size={13} className="text-primary" />
                        {booking.date}
                      </p>
                    </div>

                    <div>
                      <span className="text-text-light text-[11px]">Status Acara:</span>
                      <div className="mt-0.5">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            booking.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : booking.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {booking.status === "completed"
                            ? "Selesai"
                            : booking.status === "confirmed"
                            ? "Terkonfirmasi"
                            : "Pending"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-text-light text-[11px]">Status Bayar:</span>
                      <div className="mt-0.5">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            booking.paymentStatus === "lunas"
                              ? "bg-emerald-100 text-emerald-800"
                              : booking.paymentStatus === "dp"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.paymentStatus === "lunas"
                            ? "Lunas"
                            : booking.paymentStatus === "dp"
                            ? "DP 50%"
                            : "Belum Bayar"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-text-light text-[11px]">Tim Bertugas:</span>
                      <p className="font-medium text-text-dark mt-0.5 truncate">
                        {booking.assignedTeam.length > 0
                          ? booking.assignedTeam.join(", ")
                          : "Belum diatur"}
                      </p>
                    </div>
                  </div>

                  {/* Link Drive Status */}
                  <div className="mt-3.5 rounded-lg bg-cream p-2.5 text-xs space-y-1.5 border border-border/80">
                    <div className="flex items-center justify-between">
                      <span className="text-text-medium flex items-center gap-1">
                        <FolderArchive size={13} className="text-amber-700" />
                        File Mentah:
                      </span>
                      {booking.rawDriveLink ? (
                        <a
                          href={booking.rawDriveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary underline"
                        >
                          Tersedia &rarr;
                        </a>
                      ) : (
                        <span className="text-text-light">Belum diisi</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-text-medium flex items-center gap-1">
                        <Film size={13} className="text-emerald-700" />
                        Hasil Edit:
                      </span>
                      {booking.editedDriveLink ? (
                        <a
                          href={booking.editedDriveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-emerald-600 underline"
                        >
                          Tersedia &rarr;
                        </a>
                      ) : (
                        <span className="text-text-light">Belum diisi</span>
                      )}
                    </div>
                  </div>

                  {/* Tombol Action Edit Link Drive */}
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="mt-3.5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-border bg-warm-white px-4 py-2 text-xs font-semibold text-text-dark transition-colors active:bg-primary-pale hover:border-primary-light"
                  >
                    <Edit3 size={14} className="text-primary" />
                    Kelola Link Google Drive
                  </button>
                </div>
              ))}
            </div>

            {/* TAMPILAN DESKTOP: TABEL LEBAR (Aktif di Layar Lebar) */}
            <div className="hidden overflow-hidden rounded-xl border border-border bg-warm-white shadow-sm md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-cream text-xs font-semibold text-text-medium uppercase">
                  <tr>
                    <th className="px-5 py-3">Kode / Klien</th>
                    <th className="px-5 py-3">Tanggal Acara</th>
                    <th className="px-5 py-3">Paket</th>
                    <th className="px-5 py-3">Status Acara</th>
                    <th className="px-5 py-3">Pembayaran</th>
                    <th className="px-5 py-3">Link Drive Klien</th>
                    <th className="px-5 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-cream/40">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-text-dark">
                          {booking.clientName}
                        </p>
                        <p className="font-mono text-xs text-text-light">
                          {booking.code}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-text-medium">
                        {booking.date}
                      </td>
                      <td className="px-5 py-4 text-text-medium">
                        {booking.package}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            booking.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : booking.status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {booking.status === "completed"
                            ? "Selesai"
                            : booking.status === "confirmed"
                            ? "Terkonfirmasi"
                            : "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            booking.paymentStatus === "lunas"
                              ? "bg-emerald-100 text-emerald-800"
                              : booking.paymentStatus === "dp"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.paymentStatus === "lunas"
                            ? "Lunas"
                            : booking.paymentStatus === "dp"
                            ? "DP 50%"
                            : "Belum Bayar"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1 text-xs">
                          {booking.rawDriveLink ? (
                            <a
                              href={booking.rawDriveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <ExternalLink size={12} /> Drive Mentahan
                            </a>
                          ) : (
                            <span className="text-text-light">Drive Mentah: Belum ada</span>
                          )}
                          {booking.editedDriveLink ? (
                            <a
                              href={booking.editedDriveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-600 hover:underline"
                            >
                              <ExternalLink size={12} /> Drive Hasil Edit
                            </a>
                          ) : (
                            <span className="text-text-light">Drive Edit: Belum ada</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="rounded-lg border border-border bg-cream px-3 py-1.5 text-xs font-medium text-text-dark hover:bg-primary-pale hover:text-primary"
                        >
                          Edit Link Drive
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Edit Link Google Drive - Mobile Responsive Bottom Sheet / Dialog */}
            {selectedBooking && (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs">
                <div className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl border border-border bg-warm-white p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <h3 className="font-heading text-base sm:text-lg font-bold text-text-dark">
                        Kelola Google Drive
                      </h3>
                      <p className="text-xs text-text-light">
                        Klien: <strong className="text-text-dark">{selectedBooking.clientName}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="rounded-full p-2 text-text-light hover:bg-cream"
                      aria-label="Tutup modal"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-text-medium leading-relaxed">
                    Tempelkan tautan folder Google Drive di bawah. Klien dapat langsung membuka file ini melalui portal klien mereka.
                  </p>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-dark">
                        Link Folder Drive (File Mentah / Raw)
                      </label>
                      <input
                        type="url"
                        defaultValue={selectedBooking.rawDriveLink}
                        id="rawLinkInput"
                        placeholder="https://drive.google.com/drive/folders/..."
                        className="mt-1 min-h-[44px] w-full rounded-lg border border-border bg-cream p-3 text-xs text-text-dark focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-dark">
                        Link Folder Drive (Video Hasil Edit)
                      </label>
                      <input
                        type="url"
                        defaultValue={selectedBooking.editedDriveLink}
                        id="editedLinkInput"
                        placeholder="https://drive.google.com/drive/folders/..."
                        className="mt-1 min-h-[44px] w-full rounded-lg border border-border bg-cream p-3 text-xs text-text-dark focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="min-h-[44px] rounded-lg border border-border px-4 py-2.5 text-xs font-semibold text-text-medium hover:bg-cream"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        const raw = (document.getElementById("rawLinkInput") as HTMLInputElement).value;
                        const edited = (document.getElementById("editedLinkInput") as HTMLInputElement).value;
                        handleUpdateDrive(selectedBooking.id, raw, edited);
                      }}
                      className="min-h-[44px] rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: JADWAL & TIM ================= */}
        {activeTab === "team" && (
          <div className="space-y-4">
            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-text-dark">
                Jadwal & Penugasan Tim
              </h1>
              <p className="text-xs sm:text-sm text-text-light">
                Pantau penugasan shooter dan editor untuk memastikan jadwal tidak bertumpuk.
              </p>
            </div>

            <div className="grid gap-3.5 sm:gap-4 md:grid-cols-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-xl border border-border bg-warm-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">
                      {b.code}
                    </span>
                    <span className="rounded bg-secondary/15 px-2 py-0.5 text-[11px] font-semibold text-secondary">
                      {b.package}
                    </span>
                  </div>

                  <h3 className="mt-2 font-heading text-base sm:text-lg font-bold text-text-dark">
                    {b.clientName}
                  </h3>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-text-medium">
                    <Calendar size={13} className="text-primary" /> {b.date}
                  </p>

                  <div className="mt-3.5 border-t border-border pt-3">
                    <p className="text-xs font-semibold text-text-dark">
                      Kru yang Ditugaskan:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {b.assignedTeam.length > 0 ? (
                        b.assignedTeam.map((member, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-cream px-2.5 py-1 text-xs text-text-dark border border-border/80"
                          >
                            {member}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs italic text-red-500">
                          Belum ada kru ditugaskan!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: REKAP KEUANGAN ================= */}
        {activeTab === "finance" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-heading text-xl sm:text-2xl font-bold text-text-dark">
                  Rekap Keuangan & Laba Bersih
                </h1>
                <p className="text-xs sm:text-sm text-text-light">
                  Hitung otomatis pemasukan DP, pelunasan, dan biaya operasional.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowExpenseForm(!showExpenseForm)}
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm sm:flex-initial"
                >
                  <Plus size={16} />
                  <span>Catat Pengeluaran</span>
                </button>

                <button
                  onClick={() => alert("Laporan keuangan berhasil diexport ke file Excel/PDF!")}
                  className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-border bg-warm-white px-3.5 py-2 text-xs font-semibold text-text-dark transition-colors active:bg-primary-pale"
                  title="Unduh Rekap"
                >
                  <FileSpreadsheet size={16} className="text-secondary" />
                  <span className="hidden sm:inline">Unduh Rekap</span>
                </button>
              </div>
            </div>

            {/* Stat Cards Ringkasan Keuangan - Mobile Optimized */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-warm-white p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-text-light">
                  <span>Total Pemasukan</span>
                  <TrendingUp size={16} className="text-emerald-600" />
                </div>
                <p className="mt-1 font-heading text-xl sm:text-2xl font-bold text-emerald-600">
                  Rp {totalRevenue.toLocaleString("id-ID")}
                </p>
                <p className="mt-0.5 text-[10px] text-text-light">DP & Pelunasan klien</p>
              </div>

              <div className="rounded-xl border border-border bg-warm-white p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-text-light">
                  <span>Biaya Operasional</span>
                  <Receipt size={16} className="text-red-500" />
                </div>
                <p className="mt-1 font-heading text-xl sm:text-2xl font-bold text-red-500">
                  Rp {totalExpense.toLocaleString("id-ID")}
                </p>
                <p className="mt-0.5 text-[10px] text-text-light">Bensin, makan, fee tim</p>
              </div>

              <div className="rounded-xl border border-border bg-warm-white p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-text-light">
                  <span>Estimasi Laba Bersih</span>
                  <DollarSign size={16} className="text-primary" />
                </div>
                <p className="mt-1 font-heading text-xl sm:text-2xl font-bold text-primary">
                  Rp {netProfit.toLocaleString("id-ID")}
                </p>
                <p className="mt-0.5 text-[10px] text-text-light">Pemasukan dikurangi biaya</p>
              </div>
            </div>

            {/* Modal / Collapse Input Pengeluaran Baru */}
            {showExpenseForm && (
              <div className="rounded-xl border border-primary/40 bg-warm-white p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <h3 className="font-heading text-sm font-bold text-text-dark">
                    Form Catat Pengeluaran Acara
                  </h3>
                  <button
                    onClick={() => setShowExpenseForm(false)}
                    className="text-xs text-text-light hover:text-text-dark"
                  >
                    Tutup
                  </button>
                </div>

                <form onSubmit={handleAddExpense} className="mt-3.5 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-text-dark">
                        Terkait Acara Klien
                      </label>
                      <select
                        value={newExpense.event}
                        onChange={(e) =>
                          setNewExpense({ ...newExpense, event: e.target.value })
                        }
                        className="mt-1 min-h-[44px] w-full rounded-lg border border-border bg-cream p-2.5 text-xs text-text-dark"
                      >
                        <option value="">Pengeluaran Umum / Operasional</option>
                        {bookings.map((b) => (
                          <option key={b.id} value={b.clientName}>
                            {b.clientName} ({b.date})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-dark">
                        Kategori Pengeluaran
                      </label>
                      <select
                        value={newExpense.category}
                        onChange={(e) =>
                          setNewExpense({
                            ...newExpense,
                            category: e.target.value as Expense["category"],
                          })
                        }
                        className="mt-1 min-h-[44px] w-full rounded-lg border border-border bg-cream p-2.5 text-xs text-text-dark"
                      >
                        <option value="Transport">Transport / Bensin</option>
                        <option value="Konsumsi">Konsumsi Kru</option>
                        <option value="Fee Tim">Fee Tim (Shooter/Editor)</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-text-dark">
                        Nominal (Rp)
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="Contoh: 150000"
                        value={newExpense.amount}
                        onChange={(e) =>
                          setNewExpense({ ...newExpense, amount: e.target.value })
                        }
                        className="mt-1 min-h-[44px] w-full rounded-lg border border-border bg-cream p-2.5 text-xs text-text-dark"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-dark">
                        Keterangan Rinci
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Bensin 2 motor PP gedung"
                        value={newExpense.description}
                        onChange={(e) =>
                          setNewExpense({
                            ...newExpense,
                            description: e.target.value,
                          })
                        }
                        className="mt-1 min-h-[44px] w-full rounded-lg border border-border bg-cream p-2.5 text-xs text-text-dark"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowExpenseForm(false)}
                      className="min-h-[44px] rounded-lg border border-border px-4 py-2 text-xs font-medium text-text-medium"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="min-h-[44px] rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
                    >
                      Simpan Pengeluaran
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* DAFTAR PENGELUARAN */}
            <div className="space-y-3">
              <h2 className="font-heading text-base font-bold text-text-dark">
                Riwayat Pengeluaran Operasional
              </h2>

              {/* Tampilan Mobile: List Card Pengeluaran */}
              <div className="space-y-2.5 md:hidden">
                {expenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-warm-white p-3.5 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-cream px-2 py-0.5 text-[10px] font-semibold text-text-dark border border-border">
                          {exp.category}
                        </span>
                        <span className="text-[10px] text-text-light">{exp.date}</span>
                      </div>
                      <p className="text-xs font-semibold text-text-dark">
                        {exp.description}
                      </p>
                      <p className="text-[11px] text-text-light">
                        Acara: {exp.event}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0 ml-3">
                      <span className="text-xs font-bold text-red-600">
                        - Rp {exp.amount.toLocaleString("id-ID")}
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-md p-1.5 text-text-light hover:text-red-500 active:bg-red-50"
                        title="Hapus Pengeluaran"
                        aria-label="Hapus pengeluaran"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tampilan Desktop: Tabel Pengeluaran */}
              <div className="hidden overflow-hidden rounded-xl border border-border bg-warm-white shadow-sm md:block">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-cream text-text-medium uppercase">
                    <tr>
                      <th className="px-4 py-3">Tanggal</th>
                      <th className="px-4 py-3">Kategori</th>
                      <th className="px-4 py-3">Acara</th>
                      <th className="px-4 py-3">Keterangan</th>
                      <th className="px-4 py-3">Jumlah</th>
                      <th className="px-4 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-cream/40">
                        <td className="px-4 py-3 text-text-medium">{exp.date}</td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-cream px-2 py-0.5 border border-border text-text-dark">
                            {exp.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-text-dark font-medium">
                          {exp.event}
                        </td>
                        <td className="px-4 py-3 text-text-medium">
                          {exp.description}
                        </td>
                        <td className="px-4 py-3 font-semibold text-red-600">
                          Rp {exp.amount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="text-text-light hover:text-red-500"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
