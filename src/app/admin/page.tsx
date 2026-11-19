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
  ArrowLeft,
  CheckCircle2
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
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const [newBooking, setNewBooking] = useState({ name: "", phone: "", date: "", package: "Wedding 2 (Standard)", bill: "350000" });

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
        package: "Wedding 2 (Standard)", 
        status: "confirmed",
        assignedTeam: ["Andi"],
        requestStatus: "Belum Isi",
        rating: 5,
        remainingBill: "Rp 350.000"
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
    setNewBooking({ name: "", phone: "", date: "", package: "Wedding 2 (Standard)", bill: "350000" });
  };

  const handleDelete = (id: string) => {
    if(confirm("Hapus data pesanan ini?")) {
      saveToLocal(bookings.filter(b => b.id !== id));
    }
  };

  const handleSendWA = (b: Booking) => {
    const message = encodeURIComponent(`Halo ${b.clientName}! Terlampir akses Portal Klien ACC Moment.\n\n• Kode Booking: *${b.code}*\n• PIN Akses: *${b.pin}*\n\nAkses di: ${window.location.origin}/client/login`);
    window.open(`https://wa.me/${b.clientPhone.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF0] text-[#2A1E17] font-body pb-24">
      {/* HEADER NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#D4C3A3] px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="relative w-36 h-12 transform hover:scale-105 transition-transform">
            <Image src="/logo-v2.png" alt="Logo" fill className="object-contain" priority />
          </Link>
          <div className="flex bg-[#FDFBF0] p-1 rounded-2xl border border-[#D4C3A3]/50">
            {[
              { id: "orders", label: "Orders", icon: ShoppingBag },
              { id: "team", label: "Team", icon: Calendar },
              { id: "finance", label: "Finance", icon: DollarSign }
            ].map(t => (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id as any)} 
                className={`flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${activeTab === t.id ? "bg-[#2A1E17] text-white shadow-lg" : "text-[#8E7F75] hover:text-[#2A1E17]"}`}
              >
                <t.icon size={14} /> <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#D4C3A3]/20 pb-4">
                <div>
                   <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight">Pesanan Klien</h2>
                   <p className="text-[10px] text-[#8E7F75] font-bold uppercase tracking-widest mt-1">Kelola Jadwal & Akses Portal</p>
                </div>
                <button 
                  onClick={() => setIsAddBookingModalOpen(true)} 
                  className="w-full sm:w-auto bg-[#C5A059] text-white px-6 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-[#C5A059]/20 active:scale-[0.98] transition-all"
                >
                  <Plus size={16}/> Tambah Klien Baru
                </button>
             </div>

             <div className="grid gap-5 md:grid-cols-2">
                {bookings.map(b => (
                  <div key={b.id} className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-[#D4C3A3]/30 shadow-sm flex flex-col justify-between gap-6 hover:border-[#C5A059] hover:shadow-xl transition-all">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                         <div>
                           <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#2A1E17]">{b.clientName}</h3>
                           <p className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.2em] mt-1">{b.package}</p>
                         </div>
                         <div className="flex gap-2">
                            <button onClick={() => handleSendWA(b)} title="Kirim WA" className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                              <MessageCircle size={18}/>
                            </button>
                            <button onClick={() => handleDelete(b.id)} title="Hapus" className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                              <Trash2 size={18}/>
                            </button>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 bg-[#FDFBF0] p-4 rounded-2xl border border-[#D4C3A3]/20">
                         <div className="space-y-1">
                            <p className="text-[8px] text-[#8E7F75] font-bold uppercase tracking-widest">ID / PIN</p>
                            <p className="text-xs font-mono font-bold text-[#2A1E17]">{b.code} / <span className="text-[#C5A059]">{b.pin}</span></p>
                         </div>
                         <div className="space-y-1 text-right">
                            <p className="text-[8px] text-[#8E7F75] font-bold uppercase tracking-widest">Tanggal</p>
                            <p className="text-xs font-bold text-[#2A1E17] uppercase">{b.date}</p>
                         </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#FDFBF0] pt-4">
                       <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${b.requestStatus === 'Sudah Isi' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                          <ClipboardList size={12} /> {b.requestStatus}
                       </span>
                       {b.rating && (
                         <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full text-amber-600 border border-amber-100">
                           <Star size={12} className="fill-amber-600" />
                           <span className="text-[10px] font-bold">{b.rating}</span>
                         </div>
                       )}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>

      {/* POPUP MODAL: TAMBAH KLIEN (DILENGKAPI TOMBOL KEMBALI) */}
      {isAddBookingModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-[#D4C3A3] space-y-6 max-h-[90vh] overflow-y-auto">
              
              {/* HEADER MODAL DENGAN TOMBOL KEMBALI */}
              <div className="flex items-center justify-between border-b border-[#FDFBF0] pb-4">
                 <button 
                  type="button" 
                  onClick={() => setIsAddBookingModalOpen(false)}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8E7F75] hover:text-[#2A1E17] bg-[#FDFBF0] px-3.5 py-2 rounded-xl transition-all"
                 >
                   <ArrowLeft size={14} /> Kembali
                 </button>
                 <h2 className="font-heading text-lg font-bold text-[#2A1E17] uppercase tracking-tight">Tambah Klien</h2>
                 <button 
                  type="button" 
                  onClick={() => setIsAddBookingModalOpen(false)}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-all"
                 >
                   <X size={18} />
                 </button>
              </div>

              <form onSubmit={handleAddBooking} className="space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#8E7F75] ml-1">Nama Klien / Pasangan</label>
                    <input required placeholder="Contoh: Sarah & Dimas" className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3] rounded-xl px-4 text-xs font-medium outline-none focus:border-[#C5A059]" value={newBooking.name} onChange={e => setNewBooking({...newBooking, name: e.target.value})}/>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#8E7F75] ml-1">Nomor WhatsApp</label>
                    <input required type="tel" placeholder="081234567890" className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3] rounded-xl px-4 text-xs font-medium outline-none focus:border-[#C5A059]" value={newBooking.phone} onChange={e => setNewBooking({...newBooking, phone: e.target.value})}/>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-[#8E7F75] ml-1">Tanggal Acara</label>
                       <input required type="date" className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3] rounded-xl px-3 text-xs font-medium outline-none focus:border-[#C5A059]" value={newBooking.date} onChange={e => setNewBooking({...newBooking, date: e.target.value})}/>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-[#8E7F75] ml-1">Sisa Pembayaran</label>
                       <input required type="number" placeholder="350000" className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3] rounded-xl px-4 text-xs font-medium outline-none focus:border-[#C5A059]" value={newBooking.bill} onChange={e => setNewBooking({...newBooking, bill: e.target.value})}/>
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#8E7F75] ml-1">Pilihan Paket</label>
                    <select className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3] rounded-xl px-4 text-xs font-medium outline-none focus:border-[#C5A059]" value={newBooking.package} onChange={e => setNewBooking({...newBooking, package: e.target.value})}>
                       <option>Wedding 1 (Basic)</option>
                       <option>Wedding 2 (Standard)</option>
                       <option>Wedding 3 (Premium)</option>
                       <option>Paket Engagement</option>
                       <option>Paket Graduation</option>
                       <option>Paket All Event</option>
                    </select>
                 </div>

                 <div className="pt-4 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsAddBookingModalOpen(false)}
                      className="w-1/3 h-14 bg-[#FDFBF0] border border-[#D4C3A3] text-[#2A1E17] rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="w-2/3 h-14 bg-[#2A1E17] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all"
                    >
                      Simpan & Generate
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
