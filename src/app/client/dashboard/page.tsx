"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FolderArchive,
  Star,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Sparkles,
  ClipboardList,
  MapPin,
  Music,
  Video,
  Camera,
  Heart
} from "lucide-react";

export default function ClientDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "files" | "request" | "testimoni">("info");
  const [successMsg, setSuccessMsg] = useState("");

  // Data Klien dari Sesi Login
  const [clientData, setClientData] = useState<any>(null);

  // State Form Request
  const [requestData, setRequestData] = useState({
    gmaps: "",
    songRecap: "",
    storySongs: ["", "", ""],
    tiktokRefs: ["", "", ""],
    mandatoryMoments: ["", "", ""],
    specialNote: ""
  });

  // State Testimoni
  const [rating, setRating] = useState(5);
  const [testimoni, setTestimoni] = useState("");

  useEffect(() => {
    setMounted(true);
    const session = sessionStorage.getItem("clientSession");
    if (!session) {
      router.push("/client/login");
    } else {
      setClientData(JSON.parse(session));
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("clientSession");
    router.push("/client/login");
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const handleSaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Simpan ke localStorage juga agar Admin bisa liat status berubah
    const savedBookings = JSON.parse(localStorage.getItem("acc_bookings") || "[]");
    const updated = savedBookings.map((b: any) => 
      b.id === clientData.id ? { ...b, requestStatus: "Sudah Isi" } : b
    );
    localStorage.setItem("acc_bookings", JSON.stringify(updated));
    
    showNotification("BERHASIL! DETAIL REQUEST ANDA TELAH TERSIMPAN.");
  };

  const handleSendTestimoni = (e: React.FormEvent) => {
    e.preventDefault();
    const savedBookings = JSON.parse(localStorage.getItem("acc_bookings") || "[]");
    const updated = savedBookings.map((b: any) => 
      b.id === clientData.id ? { ...b, rating: rating } : b
    );
    localStorage.setItem("acc_bookings", JSON.stringify(updated));

    showNotification("TERIMA KASIH! REVIEW ANDA SANGAT BERARTI BAGI KAMI. 🤍");
  };

  if (!mounted || !clientData) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF0] text-[#2A1E17] font-body">
      
      {/* NOTIFIKASI SUCCESS */}
      {successMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md bg-emerald-600 text-white p-5 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-6 duration-300">
          <div className="bg-white/20 p-2 rounded-full">
            <CheckCircle2 size={24} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em]">{successMsg}</p>
        </div>
      )}

      {/* HEADER DASHBOARD */}
      <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b border-[#D4C3A3] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="relative w-36 h-12">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-all border border-transparent hover:border-red-100"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 sm:p-10 pb-32">
        <div className="mb-10 text-center sm:text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">PORTAL CLIENT ACC MOMENT</p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mt-2 uppercase tracking-tight">{clientData.clientName}</h1>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex bg-white p-2 rounded-3xl border border-[#D4C3A3]/40 shadow-sm mb-10 overflow-x-auto no-scrollbar gap-2">
          {[
            { id: "info", label: "INFO", icon: Sparkles },
            { id: "request", label: "REQUEST", icon: ClipboardList },
            { id: "files", label: "DRIVE", icon: FolderArchive },
            { id: "testimoni", label: "REVIEW", icon: Star }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? "bg-[#2A1E17] text-white shadow-xl shadow-black/10" : "text-[#8E7F75] hover:text-[#2A1E17] hover:bg-[#FDFBF0]"
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT: INFO */}
        {activeTab === "info" && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#2A1E17] text-white p-8 sm:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-125 duration-700"></div>
               <div className="relative z-10 grid sm:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">Client Booking Status</p>
                      <h3 className="text-2xl font-bold mt-2 uppercase flex items-center gap-3">
                        {clientData.status} <CheckCircle2 className="text-[#C5A059]" size={24} />
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[8px] uppercase tracking-widest text-[#8E7F75] font-bold">Booking Code</p>
                        <p className="text-xs font-mono font-bold tracking-widest text-[#E5D5B0] mt-1">{clientData.code}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[8px] uppercase tracking-widest text-[#8E7F75] font-bold">PIN Akses</p>
                        <p className="text-xs font-mono font-bold tracking-[0.4em] text-[#E5D5B0] mt-1">{clientData.pin}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end space-y-4 sm:text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-8 sm:pt-0 sm:pl-10">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#8E7F75]">Pilihan Paket</p>
                        <p className="text-lg font-bold text-[#E5D5B0]">{clientData.package}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#8E7F75]">Tanggal Acara</p>
                        <p className="text-lg font-bold">{clientData.date}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-[#D4C3A3]/20 shadow-sm">
               <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] font-bold text-[#8E7F75] uppercase tracking-[0.2em]">Sisa Pelunasan</p>
                    <p className="text-3xl font-bold text-red-500 mt-2 tracking-tighter">{clientData.remainingBill || "Rp 0"}</p>
                  </div>
                  <div className="h-0.5 w-12 bg-[#FDFBF0] sm:h-12 sm:w-0.5"></div>
                  <div className="text-center sm:text-right">
                    <p className="text-[10px] font-bold text-[#8E7F75] uppercase tracking-[0.2em]">Layanan Standby</p>
                    <p className="text-lg font-bold text-[#2A1E17] mt-1 uppercase">30-60 Menit Sebelum Acara</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* CONTENT: REQUEST FORM */}
        {activeTab === "request" && (
          <form onSubmit={handleSaveRequest} className="bg-white p-8 sm:p-12 rounded-[3rem] border border-[#D4C3A3]/30 shadow-xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center border-b border-[#FDFBF0] pb-8">
                <h2 className="font-heading text-3xl font-bold uppercase tracking-tight">💐 DETAIL REQUEST CLIENT</h2>
                <p className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.3em] mt-3 underline underline-offset-8">Wajib diisi maksimal H-7 Acara</p>
             </div>

             <div className="space-y-10">
                {/* LOKASI */}
                <div className="space-y-4">
                  <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#2A1E17]">
                    <div className="p-2 bg-[#FDFBF0] rounded-lg text-[#C5A059]"><MapPin size={18} /></div> 
                    Data Acara & Lokasi
                  </label>
                  <input 
                    required
                    placeholder="Tempel link Google Maps lokasi acara di sini..."
                    className="w-full h-14 bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-2xl px-6 text-xs font-medium outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all"
                    value={requestData.gmaps}
                    onChange={(e) => setRequestData({...requestData, gmaps: e.target.value})}
                  />
                </div>

                {/* MUSIK */}
                <div className="space-y-6 pt-6 border-t border-[#FDFBF0]">
                  <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#2A1E17]">
                    <div className="p-2 bg-[#FDFBF0] rounded-lg text-[#C5A059]"><Music size={18} /></div>
                    Request Lagu (🎥 Audio)
                  </label>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                       <p className="text-[10px] font-bold text-[#8E7F75] uppercase ml-1">Lagu Video Recap (Highlight Utama):</p>
                       <input 
                         placeholder="Contoh: Taylor Swift - Lover (Kirim Judul & Penyanyi)"
                         className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-xl px-5 text-xs outline-none focus:border-[#C5A059]"
                         value={requestData.songRecap}
                         onChange={(e) => setRequestData({...requestData, songRecap: e.target.value})}
                       />
                    </div>
                    <div className="space-y-3">
                       <p className="text-[10px] font-bold text-[#8E7F75] uppercase ml-1">List 3 Lagu untuk Story:</p>
                       {requestData.storySongs.map((song, i) => (
                         <div key={i} className="relative">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#C5A059]">{i+1}.</span>
                           <input 
                             placeholder={`Judul Lagu ${i+1}`}
                             className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-xl pl-10 pr-5 text-xs outline-none focus:border-[#C5A059]"
                             value={song}
                             onChange={(e) => {
                               const newSongs = [...requestData.storySongs];
                               newSongs[i] = e.target.value;
                               setRequestData({...requestData, storySongs: newSongs});
                             }}
                           />
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                {/* TIKTOK TREND */}
                <div className="space-y-6 pt-6 border-t border-[#FDFBF0]">
                  <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#2A1E17]">
                    <div className="p-2 bg-[#FDFBF0] rounded-lg text-[#C5A059]"><Video size={18} /></div>
                    Referensi / Trend TikTok
                  </label>
                  <div className="space-y-3">
                    {requestData.tiktokRefs.map((ref, i) => (
                      <input 
                        key={i}
                        placeholder={`Masukkan link video TikTok referensi ${i+1}...`}
                        className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-xl px-5 text-xs outline-none focus:border-[#C5A059]"
                        value={ref}
                        onChange={(e) => {
                          const newRefs = [...requestData.tiktokRefs];
                          newRefs[i] = e.target.value;
                          setRequestData({...requestData, tiktokRefs: newRefs});
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* MOMEN WAJIB */}
                <div className="space-y-6 pt-6 border-t border-[#FDFBF0]">
                  <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#2A1E17]">
                    <div className="p-2 bg-[#FDFBF0] rounded-lg text-[#C5A059]"><Camera size={18} /></div>
                    Momen yang Wajib Diabadikan
                  </label>
                  <div className="space-y-3">
                    {requestData.mandatoryMoments.map((mom, i) => (
                      <input 
                        key={i}
                        placeholder={`Contoh: Salaman dengan Nenek / Teman SMA (List ${i+1})`}
                        className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-xl px-5 text-xs outline-none focus:border-[#C5A059]"
                        value={mom}
                        onChange={(e) => {
                          const newMoms = [...requestData.mandatoryMoments];
                          newMoms[i] = e.target.value;
                          setRequestData({...requestData, mandatoryMoments: newMoms});
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* SPECIAL REQUEST */}
                <div className="space-y-4 pt-6 border-t border-[#FDFBF0]">
                  <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#2A1E17]">
                    <div className="p-2 bg-[#FDFBF0] rounded-lg text-[#C5A059]"><Sparkles size={18} /></div>
                    Request Khusus / Konsep
                  </label>
                  <textarea 
                    rows={5}
                    placeholder="Tulis request atau konsep tertentu yang diinginkan, atau tambahkan apapun yang tidak ada di list atas..."
                    className="w-full bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-[1.5rem] p-6 text-xs font-medium outline-none focus:border-[#C5A059] transition-all"
                    value={requestData.specialNote}
                    onChange={(e) => setRequestData({...requestData, specialNote: e.target.value})}
                  />
                </div>
             </div>

             <div className="pt-6 border-t border-[#FDFBF0] space-y-4">
                <button 
                  type="submit"
                  className="w-full h-16 bg-[#C5A059] text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-[#C5A059]/30 active:scale-[0.98] transition-all"
                >
                  SIMPAN DETAIL REQUEST
                </button>
                <p className="text-center italic text-[#8E7F75] text-[10px]">Silakan isi dengan lengkap agar kami dapat menyiapkan dokumentasi terbaik! 😊</p>
             </div>
          </form>
        )}

        {/* CONTENT: FILES */}
        {activeTab === "files" && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-10 rounded-[3rem] border border-[#D4C3A3]/30 shadow-sm text-center space-y-6">
              <div className="h-24 w-24 bg-[#FDFBF0] rounded-full flex items-center justify-center text-[#C5A059] mx-auto shadow-inner">
                <FolderArchive size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="font-heading text-3xl font-bold uppercase tracking-tight">AKSES DOKUMENTASI</h2>
                <p className="text-xs text-[#8E7F75] max-w-sm mx-auto font-medium">Klik tombol di bawah untuk melihat folder Google Drive acara Anda.</p>
              </div>
              
              <div className="grid gap-4 mt-8">
                 <a href={clientData.rawLink} target="_blank" className="flex h-16 items-center justify-center gap-4 bg-[#FDFBF0] border border-[#D4C3A3] rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] hover:border-[#C5A059] transition-all group">
                   SEMUA FILE MENTAH (RAW) <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                 </a>
                 <a href={clientData.editedLink} target="_blank" className="flex h-16 items-center justify-center gap-4 bg-[#2A1E17] text-white rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-black/20 transition-all active:scale-95 group">
                   HASIL EDIT (RECAP VIDEO) <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                 </a>
              </div>
            </div>
          </div>
        )}

        {/* CONTENT: REVIEW */}
        {activeTab === "testimoni" && (
          <form onSubmit={handleSendTestimoni} className="bg-white p-10 rounded-[3rem] border border-[#D4C3A3]/30 shadow-xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center space-y-2">
                <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-[#2A1E17]">TESTIMONI ANDA</h2>
                <p className="text-[10px] text-[#8E7F75] font-bold uppercase tracking-[0.3em]">Bantu kami terus berkembang dengan ulasan Anda</p>
             </div>

             <div className="space-y-4">
                <label className="block text-center text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">BERIKAN RATING BINTANG</label>
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-all transform hover:scale-110 active:scale-125"
                    >
                      <Star 
                        size={48} 
                        className={star <= rating ? "fill-[#C5A059] text-[#C5A059]" : "text-[#D4C3A3]"} 
                      />
                    </button>
                  ))}
                </div>
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#8E7F75] ml-2">PESAN KESAN ANDA</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Ceritakan pengalaman bahagia Anda menggunakan jasa ACC Moment..."
                  className="w-full bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-[2rem] p-6 text-xs font-medium outline-none focus:border-[#C5A059] transition-all"
                  value={testimoni}
                  onChange={(e) => setTestimoni(e.target.value)}
                />
             </div>

             <button 
              type="submit"
              className="w-full h-16 bg-[#2A1E17] text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 group"
             >
               KIRIM REVIEW SEKARANG <Heart size={18} className="group-hover:scale-110 transition-transform" />
             </button>
          </form>
        )}
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-[150] bg-white border-t border-[#D4C3A3]/40 px-8 py-5 lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
        <div className="flex items-center justify-between">
           {[
             { id: "info", icon: Sparkles, label: "Info" },
             { id: "request", icon: ClipboardList, label: "Request" },
             { id: "files", icon: FolderArchive, label: "Files" },
             { id: "testimoni", icon: Star, label: "Review" }
           ].map(item => (
             <button 
               key={item.id}
               onClick={() => setActiveTab(item.id as any)} 
               className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === item.id ? 'text-[#C5A059] scale-110' : 'text-[#8E7F75]'}`}
             >
                <item.icon size={22} className={activeTab === item.id ? 'fill-[#C5A059]/10' : ''} />
                <span className="text-[8px] font-bold uppercase tracking-widest">{item.label}</span>
             </button>
           ))}
        </div>
      </nav>
    </div>
  );
}
