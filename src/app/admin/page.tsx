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
  CheckCircle,
  Clock,
  XCircle,
  FileSpreadsheet,
  Trash2,
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
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin Header */}
      <header className="border-b border-border bg-warm-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-heading text-lg font-bold text-primary">
              ACC Moment
            </Link>
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-text-medium hover:text-text-dark"
            >
              Lihat Website Utama &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Nav */}
      <div className="border-b border-border bg-warm-white/60">
        <div className="mx-auto flex max-w-7xl space-x-8 px-5">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 border-b-2 py-3 text-sm font-medium transition-colors ${
              activeTab === "orders"
                ? "border-primary text-primary"
                : "border-transparent text-text-medium hover:text-text-dark"
            }`}
          >
            <ShoppingBag size={16} aria-hidden="true" />
            Kelola Pesanan ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`flex items-center gap-2 border-b-2 py-3 text-sm font-medium transition-colors ${
              activeTab === "team"
                ? "border-primary text-primary"
                : "border-transparent text-text-medium hover:text-text-dark"
            }`}
          >
            <Users size={16} aria-hidden="true" />
            Jadwal & Tim Kerja
          </button>
          <button
            onClick={() => setActiveTab("finance")}
            className={`flex items-center gap-2 border-b-2 py-3 text-sm font-medium transition-colors ${
              activeTab === "finance"
                ? "border-primary text-primary"
                : "border-transparent text-text-medium hover:text-text-dark"
            }`}
          >
            <DollarSign size={16} aria-hidden="true" />
            Rekap Keuangan
          </button>
        </div>
      </div>

      {/* Main Admin Area */}
      <main className="mx-auto max-w-7xl px-5 py-8">
        {/* TAB 1: KELOLA PESANAN & LINK DRIVE */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-2xl font-bold text-text-dark">
                  Daftar Pesanan Klien
                </h1>
                <p className="text-sm text-text-light">
                  Kelola status acara dan tautkan Google Drive untuk klien.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-warm-white shadow-sm">
              <div className="overflow-x-auto">
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
                            className="rounded border border-border bg-cream px-3 py-1.5 text-xs font-medium text-text-dark hover:bg-primary-pale hover:text-primary"
                          >
                            Edit Link Drive
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Edit Link Google Drive */}
            {selectedBooking && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-lg rounded-lg border border-border bg-warm-white p-6 shadow-xl">
                  <h3 className="font-heading text-lg font-bold text-text-dark">
                    Edit Link Google Drive: {selectedBooking.clientName}
                  </h3>
                  <p className="mt-1 text-xs text-text-light">
                    Tautan ini akan langsung muncul dan bisa diakses oleh klien di dashboard mereka.
                  </p>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-text-dark">
                        Link Folder Drive (File Mentahan)
                      </label>
                      <input
                        type="url"
                        defaultValue={selectedBooking.rawDriveLink}
                        id="rawLinkInput"
                        placeholder="https://drive.google.com/drive/folders/..."
                        className="mt-1 w-full rounded-md border border-border bg-cream p-2 text-xs text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-dark">
                        Link Folder Drive (Video Hasil Edit)
                      </label>
                      <input
                        type="url"
                        defaultValue={selectedBooking.editedDriveLink}
                        id="editedLinkInput"
                        placeholder="https://drive.google.com/drive/folders/..."
                        className="mt-1 w-full rounded-md border border-border bg-cream p-2 text-xs text-text-dark"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="rounded-md border border-border px-4 py-2 text-xs font-medium text-text-medium hover:bg-cream"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        const raw = (document.getElementById("rawLinkInput") as HTMLInputElement).value;
                        const edited = (document.getElementById("editedLinkInput") as HTMLInputElement).value;
                        handleUpdateDrive(selectedBooking.id, raw, edited);
                      }}
                      className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary/90"
                    >
                      Simpan Link
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: JADWAL & MANAJEMEN TIM */}
        {activeTab === "team" && (
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-2xl font-bold text-text-dark">
                Manajemen Jadwal & Kru Lapangan
              </h1>
              <p className="text-sm text-text-light">
                Atur penugasan shooter dan editor untuk menghindari jadwal bentrok.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-lg border border-border bg-warm-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">
                      {b.code}
                    </span>
                    <span className="rounded bg-secondary/15 px-2 py-0.5 text-xs font-medium text-secondary">
                      {b.package}
                    </span>
                  </div>

                  <h3 className="mt-2 font-heading text-lg font-bold text-text-dark">
                    {b.clientName}
                  </h3>
                  <p className="flex items-center gap-1.5 text-xs text-text-medium mt-1">
                    <Calendar size={13} /> {b.date}
                  </p>

                  <div className="mt-4 border-t border-border pt-3">
                    <p className="text-xs font-semibold text-text-dark">
                      Tim Bertugas:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {b.assignedTeam.length > 0 ? (
                        b.assignedTeam.map((member, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-cream px-2.5 py-1 text-xs text-text-dark border border-border"
                          >
                            {member}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs italic text-red-500">
                          Belum ada tim ditugaskan!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REKAP KEUANGAN OTOMATIS */}
        {activeTab === "finance" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-heading text-2xl font-bold text-text-dark">
                  Rekap Keuangan & Laba Bersih
                </h1>
                <p className="text-sm text-text-light">
                  Pencatatan otomatis pendapatan DP, pelunasan, dan operasional per acara.
                </p>
              </div>

              <button
                onClick={() => alert("Fitur download Excel/PDF berhasil diexport!")}
                className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/90"
              >
                <FileSpreadsheet size={16} />
                Unduh Rekap Excel / PDF
              </button>
            </div>

            {/* Stat Cards Ringkasan */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-warm-white p-5 shadow-sm">
                <p className="text-xs font-medium text-text-light">Total Pemasukan (DP & Pelunasan)</p>
                <p className="mt-2 font-heading text-2xl font-bold text-emerald-600">
                  Rp {totalRevenue.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-warm-white p-5 shadow-sm">
                <p className="text-xs font-medium text-text-light">Total Biaya Operasional (Pengeluaran)</p>
                <p className="mt-2 font-heading text-2xl font-bold text-red-500">
                  Rp {totalExpense.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-warm-white p-5 shadow-sm">
                <p className="text-xs font-medium text-text-light">Estimasi Laba Bersih</p>
                <p className="mt-2 font-heading text-2xl font-bold text-primary">
                  Rp {netProfit.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Form Catat Pengeluaran Baru & Tabel Pengeluaran */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Form Input Pengeluaran */}
              <div className="rounded-lg border border-border bg-warm-white p-5 shadow-sm md:col-span-1">
                <h2 className="font-heading text-base font-bold text-text-dark">
                  Catat Pengeluaran Acara
                </h2>
                <form onSubmit={handleAddExpense} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-text-dark">
                      Terkait Acara Klien
                    </label>
                    <select
                      value={newExpense.event}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, event: e.target.value })
                      }
                      className="mt-1 w-full rounded border border-border bg-cream p-2 text-xs text-text-dark"
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
                    <label className="block text-xs font-medium text-text-dark">
                      Kategori
                    </label>
                    <select
                      value={newExpense.category}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          category: e.target.value as Expense["category"],
                        })
                      }
                      className="mt-1 w-full rounded border border-border bg-cream p-2 text-xs text-text-dark"
                    >
                      <option value="Transport">Transport / Bensin</option>
                      <option value="Konsumsi">Konsumsi Kru</option>
                      <option value="Fee Tim">Fee Tim (Shooter/Editor)</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-dark">
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
                      className="mt-1 w-full rounded border border-border bg-cream p-2 text-xs text-text-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-dark">
                      Keterangan
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Makan siang 3 kru"
                      value={newExpense.description}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          description: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded border border-border bg-cream p-2 text-xs text-text-dark"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded bg-primary py-2 text-xs font-medium text-white hover:bg-primary/90"
                  >
                    <Plus size={14} /> Tambah Pengeluaran
                  </button>
                </form>
              </div>

              {/* Tabel Riwayat Pengeluaran */}
              <div className="overflow-hidden rounded-lg border border-border bg-warm-white shadow-sm md:col-span-2">
                <div className="border-b border-border bg-cream px-5 py-3">
                  <h2 className="font-heading text-sm font-bold text-text-dark">
                    Daftar Pengeluaran Operasional
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border text-text-light uppercase">
                      <tr>
                        <th className="px-4 py-2.5">Tanggal</th>
                        <th className="px-4 py-2.5">Kategori</th>
                        <th className="px-4 py-2.5">Acara</th>
                        <th className="px-4 py-2.5">Keterangan</th>
                        <th className="px-4 py-2.5">Jumlah</th>
                        <th className="px-4 py-2.5">Aksi</th>
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
          </div>
        )}
      </main>
    </div>
  );
}
