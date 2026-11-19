"use client";

import { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
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
  ChevronDown,
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

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
};

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "1",
    code: "ACC-20261225-888",
    pin: "1234",
    clientName: "Sarah & Dimas",
    clientPhone: "081234567890",
    date: "2026-12-25",
    package: "Paket Gold",
    status: "confirmed",
    paymentStatus: "dp",
    rawDriveLink: "",
    editedDriveLink: "",
    assignedTeam: ["Andi"],
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "team" | "finance">("orders");
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", type: "income", amount: 1750000, description: "DP Sarah & Dimas", date: "2026-11-20" }
  ]);
  
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({ name: "", phone: "", date: "", package: "Paket Gold" });
  const [newTrans, setNewTrans] = useState({ type: "income" as "income" | "expense", amount: "", description: "" });

  const handleSendWA = (booking: Booking) => {
    const message = encodeURIComponent(
      `Halo ${booking.clientName}! Terlampir akses Portal Klien ACC Moment.\n\n` +
      `• Kode Booking: *${booking.code}*\n` +
      `• PIN: *${booking.pin}*\n\n` +
      `Akses di: ${window.location.origin}/client/login`
    );
    window.open(`https://wa.me/${booking.clientPhone.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const b: Booking = {
      id: Date.now().toString(),
      code: `ACC-${newBooking.date.replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      clientName: newBooking.name,
      clientPhone: newBooking.phone,
      date: newBooking.date,
      package: newBooking.package,
      status: "confirmed",
      paymentStatus: "dp",
      rawDriveLink: "",
      editedDriveLink: "",
      assignedTeam: [],
    };
    setBookings([b, ...bookings]);
    setIsAddBookingModalOpen(false);
    setNewBooking({ name: "", phone: "", date: "", package: "Paket Gold" });
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setTransactions([{
      id: Date.now().toString(),
      type: newTrans.type,
      amount: parseInt(newTrans.amount),
      description: newTrans.description,
      date: new Date().toISOString().split("T")[0],
    }, ...transactions]);
    setIsAddTransactionModalOpen(false);
    setNewTrans({ type: "income", amount: "", description: "" });
  };

  const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="min-h-screen bg-[#FDFBF0] text-[#2A1E17]">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#D4C3A3] px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="relative w-28 h-10">
            <NextImage src="/logo.png" alt="Logo" fill className="object-contain" />
          </Link>
          <div className="flex bg-[#FDFBF0] p-1 rounded-lg border border-[#D4C3A3]">
            {["orders", "team", "finance"].map(t => (
              <button key={t} onClick={() => setActiveTab(t as any)} className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === t ? "bg-[#C5A059] text-white shadow-sm" : "text-[#8E7F75]"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {activeTab === "orders" && (
          <div className="space-y-4">
             <button onClick={() => setIsAddBookingModalOpen(true)} className="bg-[#2A1E17] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Plus size={14}/> Tambah Pesanan</button>
             {bookings.map(b => (
               <div key={b.id} className="bg-white p-5 rounded-2xl border border-[#D4C3A3]/30 shadow-sm flex justify-between items-center">
                 <div>
                   <p className="font-heading font-bold text-lg">{b.clientName}</p>
                   <p className="text-[10px] text-[#8E7F75] uppercase tracking-widest">{b.code} • {b.date}</p>
                 </div>
                 <button onClick={() => handleSendWA(b)} className="p-2.5 rounded-full bg-[#E5D5B0] text-[#2A1E17]"><MessageCircle size={16}/></button>
               </div>
             ))}
          </div>
        )}
        {activeTab === "team" && (
          <div className="grid md:grid-cols-2 gap-4">
            {bookings.map(b => (
              <div key={b.id} className="bg-white p-6 rounded-2xl border border-[#D4C3A3]/30 space-y-4">
                <div className="flex justify-between">
                   <h3 className="font-heading font-bold">{b.clientName}</h3>
                   <input type="date" defaultValue={b.date} className="text-[10px] bg-[#FDFBF0] border border-[#D4C3A3] p-1 rounded" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {b.assignedTeam.map(t => <span key={t} className="px-3 py-1 bg-[#E5D5B0]/30 rounded-full text-[10px] font-bold uppercase">{t} <X size={10} className="inline ml-1 cursor-pointer" onClick={() => setBookings(bookings.map(item => item.id === b.id ? {...item, assignedTeam: item.assignedTeam.filter(name => name !== t)} : item))}/></span>)}
                </div>
                <select onChange={(e) => setBookings(bookings.map(item => item.id === b.id ? {...item, assignedTeam: [...item.assignedTeam, e.target.value]} : item))} className="w-full text-xs p-2.5 border rounded-lg bg-[#FDFBF0]">
                  <option>+ Plot Tim</option>
                  <option value="Andi">Andi</option><option value="Rian">Rian</option>
                </select>
              </div>
            ))}
          </div>
        )}
        {activeTab === "finance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 p-4 rounded-xl text-center"><p className="text-[9px] uppercase font-bold text-emerald-800">Masuk</p><p className="font-bold text-sm">Rp{totalIncome.toLocaleString()}</p></div>
              <div className="bg-red-50 p-4 rounded-xl text-center"><p className="text-[9px] uppercase font-bold text-red-800">Keluar</p><p className="font-bold text-sm">Rp{totalExpense.toLocaleString()}</p></div>
              <div className="bg-[#C5A059]/10 p-4 rounded-xl text-center"><p className="text-[9px] uppercase font-bold text-[#C5A059]">Laba</p><p className="font-bold text-sm">Rp{(totalIncome - totalExpense).toLocaleString()}</p></div>
            </div>
            <button onClick={() => setIsAddTransactionModalOpen(true)} className="bg-[#2A1E17] text-white w-full py-3 rounded-xl text-xs font-bold uppercase">Tambah Transaksi</button>
            {transactions.map(t => (
               <div key={t.id} className="flex justify-between items-center p-4 bg-white border rounded-xl">
                 <p className="text-xs font-bold">{t.description}</p>
                 <span className={`text-xs font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>{t.type === 'income' ? '+' : '-'}Rp{t.amount.toLocaleString()}</span>
               </div>
            ))}
          </div>
        )}
      </main>
      
      {isAddBookingModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
           <form onSubmit={handleAddBooking} className="bg-white p-6 rounded-2xl w-full max-w-sm space-y-3">
              <h2 className="font-bold mb-4">Tambah Klien</h2>
              <input required placeholder="Nama" className="w-full border p-2 rounded" onChange={e => setNewBooking({...newBooking, name: e.target.value})}/>
              <input required placeholder="WA" className="w-full border p-2 rounded" onChange={e => setNewBooking({...newBooking, phone: e.target.value})}/>
              <input required type="date" className="w-full border p-2 rounded" onChange={e => setNewBooking({...newBooking, date: e.target.value})}/>
              <button className="w-full bg-primary text-white py-2 rounded">Simpan</button>
           </form>
        </div>
      )}
    </div>
  );
}