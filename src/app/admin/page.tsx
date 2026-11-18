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
  MessageCircle,
  X,
  Trash2,
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
  const [newExpense, setNewExpense] = useState({ event: "", category: "Transport" as Expense["category"], amount: "", description: "" });

  // Calculations
  const totalRevenue = bookings.reduce((acc, b) => b.paymentStatus === "lunas" ? acc + 3500000 : b.paymentStatus === "dp" ? acc + 1750000 : acc, 0);
  const totalExpense = expenses.reduce((acc, exp) => acc + exp.amount, 0);

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
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const exp: Expense = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      event: newExpense.event,
      category: newExpense.category,
      amount: parseInt(newExpense.amount, 10),
      description: newExpense.description,
    };
    setExpenses([exp, ...expenses]);
    setIsExpenseModalOpen(false);
    setNewExpense({ event: "", category: "Transport", amount: "", description: "" });
  };

  return (
    <div className="min-h-screen bg-cream pb-20 sm:pb-0">
      <header className="sticky top-0 z-40 border-b border-border bg-warm-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex flex-col leading-none">
            <span className="font-cursive text-xl text-text-dark">Acc</span>
            <span className="font-heading text-[10px] font-bold tracking-widest text-primary uppercase -mt-1">Admin</span>
          </div>
          <Link href="/" className="rounded-full border border-border bg-cream px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-dark hover:bg-primary-pale">
            Web &rarr;
          </Link>
        </div>

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
              <button onClick={() => setIsAddModalOpen(true)} className="flex h-11 items-center gap-2 rounded-xl bg-secondary px-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-lg active:scale-95">
                <Plus size={16} /> Tambah
              </button>
            </div>
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
                   <button onClick={() => setSelectedBooking(b)} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-warm-white text-[10px] font-bold uppercase tracking-widest text-text-dark active:bg-primary-pale">
                     <Edit3 size={14} /> Update Link Drive
                   </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-warm-white p-3 shadow-sm">
              <div className="mb-2 grid grid-cols-7 gap-0.5 text-center text-[9px] font-bold uppercase text-text-light">
                {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                  <div key={day} className={`flex h-8 items-center justify-center rounded text-[9px] font-bold ${day === 15 || day === 25 ? 'bg-primary/20 text-primary' : 'bg-cream/30 text-text-medium'}`}>
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "finance" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h1 className="font-heading text-xl font-bold text-text-dark">Keuangan</h1>
              <button onClick={() => setIsExpenseModalOpen(true)} className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-[10px] font-bold uppercase text-white">
                <Plus size={14} /> Pengeluaran
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-warm-white p-3 border border-border text-center"><p className="text-[9px] text-text-light uppercase">Masuk</p><p className="font-bold text-emerald-600">Rp{totalRevenue.toLocaleString()}</p></div>
              <div className="rounded-xl bg-warm-white p-3 border border-border text-center"><p className="text-[9px] text-text-light uppercase">Keluar</p><p className="font-bold text-red-500">Rp{totalExpense.toLocaleString()}</p></div>
              <div className="rounded-xl bg-primary/5 p-3 border border-primary/20 text-center"><p className="text-[9px] text-text-light uppercase">Laba</p><p className="font-bold text-primary">Rp{(totalRevenue - totalExpense).toLocaleString()}</p></div>
            </div>
          </div>
        )}
      </main>
      
      {/* Modals here... */}
    </div>
  );
}
