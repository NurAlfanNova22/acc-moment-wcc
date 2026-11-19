"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Plus, 
  Trash2, 
  X, 
  MessageCircle, 
  Calendar, 
  ShoppingBag, 
  DollarSign, 
  Star, 
  ClipboardList,
  Eye,
  Phone
} from "lucide-react";

type Booking = {
  id: string;
  code: string;
  pin: string;
  clientName: string;
  clientPhone: string;
  date: string;
  package: string;
  status: "confirmed" | "completed";
  assignedTeam: string[];
  requestStatus: "Belum Isi" | "Sudah Isi";
  rating?: number;
  remainingBill: string;
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "team" | "finance">("orders");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({ name: "", phone: "", date: "", package: "Paket Gold", bill: "1500000" });

  useEffect(() => {
    const saved = localStorage.getItem("acc_bookings");
    if (saved) {
      setBookings(JSON.parse(saved));
    } else {
      const defaultData: Booking[] = [{ 
        id: "1", 
        code: "ACC-20261225-888", 
        pin: "1234",
        clientName: "Sarah & Dimas", 
        clientPhone: "081234567890", 
        date: "2026-12-25", 
        package: "Paket Gold", 
        status: "confirmed",
        assignedTeam: ["Andi"],
        requestStatus: "Belum Isi",
        rating: 5,
        remainingBill: "Rp 1.250.000"
      }];
      setBookings(defaultData);
      localStorage.setItem("acc_bookings", JSON.stringify(defaultData));
    }
  }, []);

  const saveToLocal = (data: Booking[]) => {
    setBookings(data);
    localStorage.setItem("acc_bookings", JSON.stringify(data));
  };

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `ACC-${newBooking.date.replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`;
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    
    const b: Booking = {
      id: Date.now().toString(),
      code,
      pin,
      clientName: newBooking.name,
      clientPhone: newBooking.phone,
      date: newBooking.date,
      package: newBooking.package,
      status: "confirmed",
      assignedTeam: [],
      requestStatus: "Belum Isi",
      remainingBill: `Rp ${parseInt(newBooking.bill).toLocaleString('id-ID')}`
    };

    saveToLocal([b, ...bookings]);
    setIsAddBookingModalOpen(false);
    setNewBooking({ name: "", phone: "", date: "", package: "Paket Gold", bill: "1500000" });
  };

  const handleDelete = (id: string) => {
    if(confirm("Hapus data ini?")) {
      saveToLocal(bookings.filter(b => b.id !== id));
    }
  };

  const handleSendWA = (b: Booking) => {
    const message = encodeURIComponent(`Halo ${b.clientName}! Terlampir akses Portal Klien ACC Moment.\n\n• Kode Booking: *${b.code}*\n• PIN Akses: *${b.pin}*\n\nAkses di: ${window.location.origin}/client/login`);
    window.open(`https://wa.me/${b.clientPhone.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF0] text-[#2A1E17] font-body pb-20">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#D4C3A3] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="relative w-40 h-14 transform hover:scale-105 transition-transform">
            <Image src="/logo-v2.png" alt="Logo" fill className="object-contain" priority />
          </Link>
          <div className="flex bg-[#FDFBF0] p-1.5 rounded-xl border border-[#D4C3A3]/50">
            {[
              { id: "orders", label: "Orders", icon: ShoppingBag },
              { id: "team", label: "Team", icon: Calendar },
              { id: "finance", label: "Finance", icon: DollarSign }
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === t.id ? "bg-[#2A1E17] text-white shadow-xl" : "text-[#8E7F75] hover:text-[#2A1E17]"}`}>
                <t.icon size={14} /> <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 sm:p-10 space-y-10">
        {activeTab === "orders" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="font-heading text-3xl font-bold uppercase tracking-tight">Daftar Pesanan Klien</h2>
                <button onClick={() => setIsAddBookingModalOpen(true)} className="w-full sm:w-auto bg-[#C5A059] text-white px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl shadow-[#C5A059]/20 active:scale-[0.98] transition-all">
                  <Plus size={18}/> Tambah Pesanan Baru
                </button>
             </div>

             <div className="grid gap-6 md:grid-cols-2">
                {bookings.map(b => (
                  <div key={b.id} className="bg-white p-8 rounded-[2.5rem] border border-[#D4C3A3]/30 shadow-sm flex flex-col gap-6 hover:border-[#C5A059] hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start">
                       <div>
                         <h3 className="font-heading font-bold text-2xl text-[#2A1E17]">{b.clientName}</h3>
                         <p className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.2em] mt-1.5">{b.package}</p>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => handleSendWA(b)} className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm group-hover:scale-110">
                            <MessageCircle size={20}/>
                          </button>
                          <button onClick={() => handleDelete(b.id)} className="p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm group-hover:scale-110">
                            <Trash2 size={20}/>
                          </button>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-[#FDFBF0] p-5 rounded-[1.5rem] border border-[#D4C3A3]/20">
                       <div className="space-y-1.5">
                          <p className="text-[9px] text-[#8E7F75] font-bold uppercase tracking-widest">ID / PIN</p>
                          <p className="text-xs font-mono font-bold text-[#2A1E17]">{b.code} / <span className="text-[#C5A059]">{b.pin}</span></p>
                       </div>
                       <div className="space-y-1.5 text-right">
                          <p className="text-[9px] text-[#8E7F75] font-bold uppercase tracking-widest">TANGGAL ACARA</p>
                          <p className="text-xs font-bold text-[#2A1E17] uppercase">{b.date}</p>
                       </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#FDFBF0] pt-6">
                       <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-wider ${b.requestStatus === 'Sudah Isi' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                            <ClipboardList size={12} /> {b.requestStatus}
                          </span>
                          {b.requestStatus === "Sudah Isi" && (
                            <button className="p-2 text-[#C5A059] hover:bg-[#C5A059]/10 rounded-lg transition-colors"><Eye size={16}/></button>
                          )}
                       </div>
                       {b.rating && (
                         <div className="flex items-center gap-1 bg-amber-50 px-4 py-2 rounded-full text-amber-600 border border-amber-100">
                           <Star size={12} className="fill-amber-600" />
                           <span className="text-[11px] font-bold">{b.rating}</span>
                         </div>
                       )}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>

      {/* Modal logic preserved... */}
      {isAddBookingModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
           <form onSubmit={handleAddBooking} className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-[#D4C3A3] space-y-6">
              <h2 className="font-heading text-2xl font-bold text-[#2A1E17] text-center uppercase tracking-tight">TAMBAH KLIEN</h2>
              <div className="space-y-4">
                 <input required placeholder="Nama Pasangan (Sarah & Dimas)" className="w-full h-14 bg-[#FDFBF0] border border-[#D4C3A3] rounded-2xl px-6 text-sm font-medium outline-none" value={newBooking.name} onChange={e => setNewBooking({...newBooking, name: e.target.value})}/>
                 <input required placeholder="No WhatsApp (0812...)" className="w-full h-14 bg-[#FDFBF0] border border-[#D4C3A3] rounded-2xl px-6 text-sm font-medium outline-none" value={newBooking.phone} onChange={e => setNewBooking({...newBooking, phone: e.target.value})}/>
                 <div className="grid grid-cols-2 gap-4">
                    <input required type="date" className="w-full h-14 bg-[#FDFBF0] border border-[#D4C3A3] rounded-2xl px-6 text-sm font-medium outline-none" value={newBooking.date} onChange={e => setNewBooking({...newBooking, date: e.target.value})}/>
                    <input required type="number" placeholder="Sisa Bayar" className="w-full h-14 bg-[#FDFBF0] border border-[#D4C3A3] rounded-2xl px-6 text-sm font-medium outline-none" value={newBooking.bill} onChange={e => setNewBooking({...newBooking, bill: e.target.value})}/>
                 </div>
                 <select className="w-full h-14 bg-[#FDFBF0] border border-[#D4C3A3] rounded-2xl px-6 text-sm font-medium outline-none appearance-none" value={newBooking.package} onChange={e => setNewBooking({...newBooking, package: e.target.value})}>
                    <option>Paket Silver</option><option>Paket Gold</option><option>Paket Platinum</option>
                 </select>
              </div>
              <button className="w-full h-16 bg-[#2A1E17] text-white rounded-2xl font-bold uppercase tracking-widest text-xs">SIMPAN DATA</button>
           </form>
        </div>
      )}
    </div>
  );
}
