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
  MessageCircle,
  Send,
} from "lucide-react";

type Booking = {
  id: string;
  code: string;
  pin: string;
  clientName: string;
  clientPhone: string;
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
    pin: "1234",
    clientName: "Sarah & Dimas",
    clientPhone: "081234567890",
    date: "2026-12-25",
    package: "Paket Gold",
    status: "confirmed",
    paymentStatus: "dp",
    rawDriveLink: "https://drive.google.com/drive/folders/demo-raw",
    editedDriveLink: "https://drive.google.com/drive/folders/demo-edit",
    assignedTeam: ["Andi (Shooter)", "Rian (Editor)"],
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

  const handleSendWA = (booking: Booking) => {
    const message = encodeURIComponent(
      `Halo ${booking.clientName}! Terima kasih sudah memesan paket ${booking.package} di ACC Moment.\n\n` +
      `Jadwal Anda sudah kami kunci untuk tanggal: ${booking.date}.\n\n` +
      `Berikut adalah akses Portal Klien Anda:\n` +
      `• Kode Booking: *${booking.code}*\n` +
      `• PIN: *${booking.pin}*\n\n` +
      `Silakan akses di: http://localhost:3000/client/login\n\n` +
      `Simpan Kode & PIN ini ya, untuk mengakses file video & progres revisi Anda.`
    );
    window.open(`https://wa.me/${booking.clientPhone.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  const handleAddClient = () => {
    const name = prompt("Nama Pasangan / Klien?");
    if (!name) return;
    const phone = prompt("Nomor WhatsApp (Contoh: 0812...)?");
    if (!phone) return;
    const date = prompt("Tanggal Acara (YYYY-MM-DD)?", new Date().toISOString().split("T")[0]);
    const pkg = prompt("Paket (Silver/Gold/Platinum)?", "Paket Gold");
    
    const code = `ACC-${date?.replace(/-/g, "") || "000"}-${Math.floor(100+Math.random()*900)}`;
    const pin = Math.floor(1000+Math.random()*9000).toString();
    
    const newBooking: Booking = {
      id: Date.now().toString(),
      code,
      pin,
      clientName: name,
      clientPhone: phone,
      date: date || "",
      package: pkg || "",
      status: "confirmed",
      paymentStatus: "dp",
      rawDriveLink: "",
      editedDriveLink: "",
      assignedTeam: [],
    };
    
    setBookings([newBooking, ...bookings]);
    
    if (confirm("Klien berhasil ditambahkan! Kirim Kode & PIN sekarang via WhatsApp?")) {
      handleSendWA(newBooking);
    }
  };

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
      {/* Top Bar Admin */}
      <header className="sticky top-0 z-40 border-b border-border bg-warm-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="flex min-h-[40px] items-center gap-1.5 text-xs font-semibold text-text-medium hover:text-primary lg:hidden"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex flex-col leading-none">
              <span className="font-cursive text-lg text-text-dark">Acc</span>
              <span className="font-heading text-sm font-bold tracking-widest text-primary uppercase -mt-0.5">Moment</span>
            </div>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary ml-1">ADMIN</span>
          </div>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border bg-cream px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-text-dark hover:bg-primary-pale"
          >
            Website Utama &rarr;
          </Link>
        </div>

        {/* Tab Bar */}
        <div className="border-t border-border/80 bg-warm-white px-2 sm:px-6">
          <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-1.5">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === "orders" ? "bg-primary text-white shadow-sm" : "bg-transparent text-text-medium"
              }`}
            >
              <ShoppingBag size={14} /> Pesanan
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === "team" ? "bg-primary text-white shadow-sm" : "bg-transparent text-text-medium"
              }`}
            >
              <Users size={14} /> Jadwal & Tim
            </button>
            <button
              onClick={() => setActiveTab("finance")}
              className={`flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === "finance" ? "bg-primary text-white shadow-sm" : "bg-transparent text-text-medium"
              }`}
            >
              <DollarSign size={14} /> Keuangan
            </button>
          </nav>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-xl font-bold text-text-dark">Kelola Pesanan</h1>
                <p className="text-[11px] text-text-light uppercase tracking-wider font-semibold">Update progress & link drive klien</p>
              </div>
              <button
                onClick={handleAddClient}
                className="flex min-h-[44px] items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-md active:scale-95 transition-transform"
              >
                <Plus size={16} /> <span className="hidden sm:inline">Tambah Klien Deal</span>
              </button>
            </div>

            {/* Mobile View Card */}
            <div className="space-y-3 md:hidden">
              {bookings.map((booking) => (
                <div key={booking.id} className="rounded-xl border border-border bg-warm-white p-4 shadow-sm">
                  <div className="flex items-start justify-between border-b border-border/60 pb-3">
                    <div>
                      <h2 className="font-heading text-base font-bold text-text-dark">{booking.clientName}</h2>
                      <p className="font-mono text-[10px] text-text-light uppercase tracking-tighter">ID: {booking.code} • PIN: {booking.pin}</p>
                    </div>
                    <button 
                      onClick={() => handleSendWA(booking)}
                      className="rounded-full bg-emerald-500 p-2 text-white shadow-sm active:scale-90 transition-transform"
                      title="Kirim ulang WA"
                    >
                      <MessageCircle size={16} />
                    </button>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-y-3 text-[11px] font-semibold uppercase tracking-wider">
                    <div>
                      <span className="text-text-light block text-[9px]">Tanggal:</span>
                      <span className="text-text-dark">{booking.date}</span>
                    </div>
                    <div>
                      <span className="text-text-light block text-[9px]">Paket:</span>
                      <span className="text-primary">{booking.package}</span>
                    </div>
                    <div>
                      <span className="text-text-light block text-[9px]">Status:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                        booking.status === 'confirmed' ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                      }`}>{booking.status}</span>
                    </div>
                    <div>
                      <span className="text-text-light block text-[9px]">Bayar:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                        booking.paymentStatus === 'dp' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                      }`}>{booking.paymentStatus}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="mt-4 flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg border border-border bg-cream px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-text-dark active:bg-primary-pale"
                  >
                    <Edit3 size={14} /> Update Link Drive
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden overflow-hidden rounded-xl border border-border bg-warm-white shadow-sm md:block">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-cream font-bold uppercase tracking-widest text-text-medium">
                  <tr>
                    <th className="px-5 py-4">Klien / Kode</th>
                    <th className="px-5 py-4">Tanggal</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Link Drive</th>
                    <th className="px-5 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-cream/40">
                      <td className="px-5 py-4">
                        <p className="font-bold text-text-dark">{booking.clientName}</p>
                        <p className="font-mono text-[10px] text-text-light">Code: {booking.code} • PIN: {booking.pin}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-text-medium">{booking.date}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-bold text-emerald-800 uppercase text-[9px] tracking-wide">{booking.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          {booking.rawDriveLink ? <span className="text-emerald-600 font-bold">✓ Raw Ready</span> : <span className="text-text-light italic">Raw: Empty</span>}
                          {booking.editedDriveLink ? <span className="text-emerald-600 font-bold">✓ Edit Ready</span> : <span className="text-text-light italic">Edit: Empty</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setSelectedBooking(booking)} className="rounded border border-border bg-warm-white p-2 text-text-dark hover:border-primary active:bg-primary-pale" title="Edit Link">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => handleSendWA(booking)} className="rounded border border-border bg-emerald-50 p-2 text-emerald-600 hover:border-emerald-500 active:bg-emerald-100" title="Send WA">
                            <MessageCircle size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Jadwal & Tim */}
        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="font-heading text-xl font-bold text-text-dark">Jadwal & Tim Kerja</h1>
              <div className="flex items-center gap-2 rounded-lg bg-cream border border-border px-3 py-1.5 text-[10px] font-bold uppercase text-text-medium">
                <Calendar size={12} /> {new Date().toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}
              </div>
            </div>

            {/* Simple Grid Calendar View */}
            <div className="rounded-xl border border-border bg-warm-white p-4 shadow-sm">
              <div className="mb-4 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-widest text-text-light">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => <div key={day}>{day}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* Dummy calendar dates for current month (Nov 2026) */}
                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                  const hasEvent = day === 15 || day === 25;
                  return (
                    <div 
                      key={day} 
                      className={`relative flex h-14 flex-col items-center justify-center rounded-lg border border-border/40 text-xs font-bold transition-colors ${
                        hasEvent ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-cream/30 text-text-medium'
                      }`}
                    >
                      <span>{day}</span>
                      {hasEvent && <div className="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary" />}
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-[9px] font-medium text-text-light uppercase tracking-widest italic text-center">
                *Tanda titik menunjukkan adanya jadwal acara di tanggal tersebut.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bookings.map((b) => (
                <div key={b.id} className="rounded-xl border border-border bg-warm-white p-4 shadow-sm">
                  <div className="flex justify-between border-b border-border/40 pb-2 mb-3">
                    <span className="font-bold text-[10px] text-primary uppercase tracking-widest">{b.package}</span>
                    <span className="font-mono text-[10px] text-text-light">{b.date}</span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-text-dark">{b.clientName}</h3>
                  <div className="mt-4 pt-3 border-t border-border/40">
                    <p className="text-[10px] font-bold text-text-light uppercase tracking-widest mb-2 text-center bg-cream py-1 rounded">Tim Bertugas</p>
                    <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                      {b.assignedTeam.length > 0 ? b.assignedTeam.map((m, i) => (
                        <span key={i} className="rounded-full bg-warm-white border border-border px-2.5 py-0.5 text-[9px] font-bold uppercase text-text-dark">{m}</span>
                      )) : <p className="text-[10px] italic text-red-400">Belum ada tim...</p>}
                    </div>
                    <button className="mt-4 w-full rounded-lg border border-dashed border-primary/40 py-2 text-[9px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 transition-colors">
                      + Plot Tim Baru
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Keuangan */}
        {activeTab === "finance" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <h1 className="font-heading text-xl font-bold text-text-dark">Rekap Keuangan</h1>
              <button onClick={() => setShowExpenseForm(!showExpenseForm)} className="flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-bold uppercase tracking-widest text-white shadow-md">
                <Plus size={16} /> Catat Pengeluaran
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-warm-white p-4 shadow-sm">
                <p className="text-[9px] font-bold uppercase tracking-widest text-text-light">Pemasukan</p>
                <p className="mt-1 text-xl font-bold text-emerald-600">Rp {totalRevenue.toLocaleString("id-ID")}</p>
              </div>
              <div className="rounded-xl border border-border bg-warm-white p-4 shadow-sm">
                <p className="text-[9px] font-bold uppercase tracking-widest text-text-light">Pengeluaran</p>
                <p className="mt-1 text-xl font-bold text-red-500">Rp {totalExpense.toLocaleString("id-ID")}</p>
              </div>
              <div className="rounded-xl border border-border bg-warm-white p-4 shadow-sm border-primary/30 bg-primary/5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-text-light">Laba Bersih</p>
                <p className="mt-1 text-xl font-bold text-primary">Rp {netProfit.toLocaleString("id-ID")}</p>
              </div>
            </div>

            {showExpenseForm && (
              <div className="rounded-xl border border-primary/40 bg-warm-white p-5 shadow-lg">
                <h3 className="font-heading text-sm font-bold text-text-dark uppercase tracking-widest mb-4">Input Pengeluaran Baru</h3>
                <form onSubmit={handleAddExpense} className="grid gap-4 sm:grid-cols-2">
                   <select value={newExpense.event} onChange={(e) => setNewExpense({ ...newExpense, event: e.target.value })} className="h-11 rounded-lg border border-border bg-cream px-3 text-xs">
                     <option value="">Umum / Operasional</option>
                     {bookings.map(b => <option key={b.id} value={b.clientName}>{b.clientName}</option>)}
                   </select>
                   <select value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as Expense["category"] })} className="h-11 rounded-lg border border-border bg-cream px-3 text-xs">
                     <option value="Transport">Transport</option>
                     <option value="Konsumsi">Konsumsi</option>
                     <option value="Fee Tim">Fee Tim</option>
                   </select>
                   <input type="number" required placeholder="Nominal Rp" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} className="h-11 rounded-lg border border-border bg-cream px-3 text-xs" />
                   <input type="text" required placeholder="Keterangan" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} className="h-11 rounded-lg border border-border bg-cream px-3 text-xs" />
                   <div className="sm:col-span-2 flex justify-end gap-2">
                     <button type="button" onClick={() => setShowExpenseForm(false)} className="px-4 py-2 text-xs font-bold text-text-light uppercase tracking-widest">Batal</button>
                     <button type="submit" className="h-11 rounded-lg bg-primary px-6 text-xs font-bold uppercase tracking-widest text-white">Simpan</button>
                   </div>
                </form>
              </div>
            )}

            <div className="space-y-2">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-light">Riwayat Pengeluaran</h2>
              <div className="space-y-2">
                {expenses.map(exp => (
                  <div key={exp.id} className="flex items-center justify-between rounded-xl border border-border bg-warm-white p-3 shadow-xs">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-medium">{exp.category} • <span className="text-text-light font-normal">{exp.date}</span></p>
                      <p className="text-xs font-bold text-text-dark">{exp.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-red-600">-Rp {exp.amount.toLocaleString("id-ID")}</span>
                      <button onClick={() => handleDeleteExpense(exp.id)} className="p-2 text-text-light hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Edit Drive */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl border border-border bg-warm-white p-6 shadow-2xl">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-bold text-text-dark uppercase tracking-widest">Update Google Drive</h3>
                <button onClick={() => setSelectedBooking(null)}><XCircle size={24} className="text-text-light" /></button>
             </div>
             <div className="space-y-4">
                <input id="rawLink" type="url" defaultValue={selectedBooking.rawDriveLink} placeholder="Link Folder RAW Footage" className="h-12 w-full rounded-lg border border-border bg-cream px-4 text-xs" />
                <input id="editLink" type="url" defaultValue={selectedBooking.editedDriveLink} placeholder="Link Folder Video Hasil Edit" className="h-12 w-full rounded-lg border border-border bg-cream px-4 text-xs" />
                <button onClick={() => {
                  const raw = (document.getElementById("rawLink") as HTMLInputElement).value;
                  const edit = (document.getElementById("editLink") as HTMLInputElement).value;
                  handleUpdateDrive(selectedBooking.id, raw, edit);
                }} className="h-12 w-full rounded-xl bg-primary text-xs font-bold uppercase tracking-widest text-white shadow-lg active:scale-95 transition-transform">Simpan Tautan</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
