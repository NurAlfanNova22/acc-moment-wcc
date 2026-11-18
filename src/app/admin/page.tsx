"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  ShoppingBag,
  DollarSign,
  Plus,
  Edit3,
  ArrowLeft,
  MessageCircle,
  Trash2,
  XCircle,
  X,
  Smartphone,
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
    rawDriveLink: "",
    editedDriveLink: "",
    assignedTeam: ["Andi (Shooter)", "Rian (Editor)"],
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "team" | "finance">("orders");
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Form states
  const [newClient, setNewClient] = useState({ name: "", phone: "", date: "", package: "Paket Gold" });

  const handleSendWA = (booking: Booking) => {
    const message = encodeURIComponent(
      `Halo ${booking.clientName}! Terlampir akses Portal Klien ACC Moment.\n\n` +
      `• Kode Booking: *${booking.code}*\n` +
      `• PIN: *${booking.pin}*\n\n` +
      `Akses di: ${window.location.origin}/client/login`
    );
    window.open(`https://wa.me/${booking.clientPhone.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `ACC-${newClient.date.replace(/-/g, "")}-${Math.floor(100+Math.random()*900)}`;
    const pin = Math.floor(1000+Math.random()*9000).toString();
    
    const b: Booking = {
      id: Date.now().toString(),
      code,
      pin,
      clientName: newClient.name,
      clientPhone: newClient.phone,
      date: newClient.date,
      package: newClient.package,
      status: "confirmed",
      paymentStatus: "dp",
      rawDriveLink: "",
      editedDriveLink: "",
      assignedTeam: [],
    };
    
    setBookings([b, ...bookings]);
    setIsAddModalOpen(false);
    setNewClient({ name: "", phone: "", date: "", package: "Paket Gold" });
    
    if (confirm("Klien ditambahkan! Kirim akses via WA sekarang?")) {
      handleSendWA(b);
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-20 sm:pb-0">
      {/* Header Admin */}
      <header className="sticky top-0 z-40 border-b border-border bg-warm-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
             <div className="flex flex-col leading-none">
                <span className="font-cursive text-xl text-text-dark">Acc</span>
                <span className="font-heading text-[10px] font-bold tracking-widest text-primary uppercase -mt-1">Admin</span>
             </div>
          </div>
          <Link href="/" className="rounded-full border border-border bg-cream px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-dark hover:bg-primary-pale">
            Web &rarr;
          </Link>
        </div>

        {/* Tab Switcher - Mobile Optimized */}
        <div className="flex border-t border-border overflow-x-auto no-scrollbar bg-warm-white">
          {[
            { id: "orders", icon: ShoppingBag, label: "Pesanan" },
            { id: "team", icon: Calendar, label: "Jadwal" },
            { id: "finance", icon: DollarSign, label: "Keuangan" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-1 min-h-[50px] items-center justify-center gap-2 px-2 transition-all ${
                activeTab === tab.id ? "bg-primary text-white" : "text-text-medium"
              }`}
            >
              <tab.icon size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="font-heading text-xl font-bold text-text-dark">Daftar Klien</h1>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex h-11 items-center gap-2 rounded-xl bg-secondary px-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-lg active:scale-95"
              >
                <Plus size={16} /> Tambah
              </button>
            </div>

            {/* List Pesanan - Card Style Mobile */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((b) => (
                <div key={b.id} className="rounded-xl border border-border bg-warm-white p-4 shadow-sm">
                   <div className="flex justify-between border-b border-border/40 pb-3 mb-3">
                      <div>
                         <h3 className="font-heading text-base font-bold text-text-dark">{b.clientName}</h3>
                         <p className="font-mono text-[9px] text-text-light uppercase tracking-tighter">ID: {b.code} • PIN: {b.pin}</p>
                      </div>
                      <button onClick={() => handleSendWA(b)} className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm active:scale-90">
                         <MessageCircle size={18} />
                      </button>
                   </div>
                   <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-widest text-text-medium mb-4">
                      <div className="bg-cream p-2 rounded-lg">📅 {b.date}</div>
                      <div className="bg-cream p-2 rounded-lg text-primary">💎 {b.package}</div>
                   </div>
                   <button 
                     onClick={() => setSelectedBooking(b)}
                     className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-warm-white text-[10px] font-bold uppercase tracking-widest text-text-dark active:bg-primary-pale"
                   >
                     <Edit3 size={14} /> Update Link Drive
                   </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ... (Team & Finance tabs follow same optimized pattern) */}
      </main>

      {/* MODAL: TAMBAH KLIEN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="w-full max-w-md rounded-t-2xl bg-warm-white p-6 shadow-2xl sm:rounded-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
               <h2 className="font-heading text-lg font-bold text-text-dark uppercase tracking-widest">Tambah Klien Baru</h2>
               <button onClick={() => setIsAddModalOpen(false)} className="p-2"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddClientSubmit} className="space-y-4">
               <div>
                  <label className="text-[10px] font-bold uppercase text-text-light mb-1.5 block">Nama Pasangan</label>
                  <input required type="text" placeholder="Contoh: Sarah & Dimas" className="h-12 w-full rounded-xl border border-border bg-cream px-4 text-xs font-medium focus:border-primary focus:outline-none" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
               </div>
               <div>
                  <label className="text-[10px] font-bold uppercase text-text-light mb-1.5 block">Nomor WhatsApp</label>
                  <input required type="tel" placeholder="Contoh: 08123456789" className="h-12 w-full rounded-xl border border-border bg-cream px-4 text-xs font-medium focus:border-primary focus:outline-none" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-text-light mb-1.5 block">Tanggal Acara</label>
                    <input required type="date" className="h-12 w-full rounded-xl border border-border bg-cream px-4 text-xs font-medium focus:border-primary focus:outline-none" value={newClient.date} onChange={e => setNewClient({...newClient, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-text-light mb-1.5 block">Pilih Paket</label>
                    <select className="h-12 w-full rounded-xl border border-border bg-cream px-4 text-xs font-medium focus:border-primary focus:outline-none" value={newClient.package} onChange={e => setNewClient({...newClient, package: e.target.value})}>
                      <option>Paket Silver</option>
                      <option>Paket Gold</option>
                      <option>Paket Platinum</option>
                    </select>
                  </div>
               </div>
               <button type="submit" className="h-14 w-full rounded-xl bg-primary text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-primary/30 active:scale-95 transition-all mt-4">
                  Simpan & Generate Akses
               </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE DRIVE (Similar fix) */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="w-full max-w-md rounded-t-2xl bg-warm-white p-6 shadow-2xl sm:rounded-2xl">
             <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-lg font-bold text-text-dark uppercase tracking-widest text-center flex-1">Link Google Drive</h2>
                <button onClick={() => setSelectedBooking(null)}><X size={24} /></button>
             </div>
             <div className="space-y-4">
                <p className="text-[10px] font-bold text-center uppercase tracking-widest text-primary mb-2">{selectedBooking.clientName}</p>
                <input id="driveInput" type="url" placeholder="Paste Link Google Drive di sini..." className="h-14 w-full rounded-xl border border-border bg-cream px-4 text-xs font-medium focus:border-primary focus:outline-none" defaultValue={selectedBooking.rawDriveLink} />
                <button 
                  onClick={() => {
                    const link = (document.getElementById("driveInput") as HTMLInputElement).value;
                    setBookings(bookings.map(b => b.id === selectedBooking.id ? {...b, rawDriveLink: link, editedDriveLink: link} : b));
                    setSelectedBooking(null);
                  }}
                  className="h-14 w-full rounded-xl bg-secondary text-[11px] font-bold uppercase tracking-[0.2em] text-white active:scale-95 transition-all"
                >
                  Simpan Perubahan
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
