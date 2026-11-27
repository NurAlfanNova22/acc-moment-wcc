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
  Heart,
  X,
  Download,
  MessageSquare
} from "lucide-react";

type RequestData = {
  igUsername: string;
  vendorList: {
    dekor: string;
    makeup: string;
    fg: string;
    vg: string;
    mahar: string;
    henna: string;
    others: string;
  };
  customVendors: { id: string; label: string; value: string; }[];
  gmaps: string;
  songRecap: string;
  storySongs: string[];
  tiktokRefs: string[];
  mandatoryMoments: string[];
  specialNote: string;
};

type ClientData = {
  id: string;
  code: string;
  clientName: string;
  date: string;
  package: string;
  assignedTeam: string[];
  remainingBill: number;
  requestDetail: RequestData | null;
  rating: number | null;
  reviewComment: string | null;
  reviewDate: string | null;
  driveUrl: string | null;
};

export default function ClientDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"info" | "files" | "request" | "testimoni">("info");
  const [successMsg, setSuccessMsg] = useState("");
  const [pageError, setPageError] = useState("");
  const [clientData, setClientData] = useState<ClientData | null>(null);

  // Form States
  const [requestData, setRequestData] = useState<RequestData>({
    igUsername: "",
    vendorList: { dekor: "", makeup: "", fg: "", vg: "", mahar: "", henna: "", others: "" },
    customVendors: [],
    gmaps: "",
    songRecap: "",
    storySongs: [""],
    tiktokRefs: [""],
    mandatoryMoments: [""],
    specialNote: ""
  });

  const [rating, setRating] = useState(5);
  const [testimoni, setTestimoni] = useState("");

  useEffect(() => {
    let active = true;
    const loadClientData = async () => {
      try {
        const response = await fetch("/api/client/session");
        if (response.status === 401) {
          router.replace("/client/login");
          return;
        }
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Gagal memuat portal klien.");

        if (active) {
          const data = result as ClientData;
          setClientData(data);
          if (data.requestDetail) setRequestData(data.requestDetail);
          if (data.rating) setRating(data.rating);
          if (data.reviewComment) setTestimoni(data.reviewComment);
        }
      } catch (error) {
        if (active) setPageError(error instanceof Error ? error.message : "Gagal memuat portal klien.");
      }
    };

    void loadClientData();
    return () => { active = false; };
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/client/logout", { method: "POST" });
    router.replace("/client/login");
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const handleSaveRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setPageError("");
    try {
      const response = await fetch("/api/client/request", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal menyimpan detail request.");
      showNotification("BERHASIL! DETAIL REQUEST ANDA TELAH TERSIMPAN.");
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Gagal menyimpan detail request.");
    }
  };

  const handleSendTestimoni = async (e: React.FormEvent) => {
    e.preventDefault();
    setPageError("");
    try {
      const response = await fetch("/api/client/review", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: testimoni }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal menyimpan ulasan.");
      showNotification("TERIMA KASIH! ULASAN ANDA SANGAT BERARTI BAGI KAMI. 🤍");
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Gagal menyimpan ulasan.");
    }
  };

  if (!clientData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FDFBF0] p-6 text-center">
        {pageError
          ? <p role="alert" className="max-w-md rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">{pageError}</p>
          : <p className="text-sm font-bold text-[#8E7F75]">Memuat portal klien...</p>}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF0] text-[#2A1E17] font-body">
      {successMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md bg-emerald-600 text-white p-5 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-6 duration-300">
          <div className="bg-white/20 p-2 rounded-full"><CheckCircle2 size={24} /></div>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em]">{successMsg}</p>
        </div>
      )}

      <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b border-[#D4C3A3] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="relative w-36 h-12">
            <Image src="/logo-v2.png" alt="Logo" fill className="object-contain" priority />
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-all">
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 sm:p-10 pb-32">
        {pageError && (
          <div role="alert" className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {pageError}
          </div>
        )}
        <div className="mb-10 text-center sm:text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">PORTAL CLIENT ACC MOMENT</p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mt-2 uppercase tracking-tight">{clientData.clientName}</h1>
        </div>

        <div className="flex bg-white p-2 rounded-3xl border border-[#D4C3A3]/40 shadow-sm mb-10 overflow-x-auto no-scrollbar gap-2">
          {[
            { id: "info", label: "INFO", icon: Sparkles },
            { id: "request", label: "REQUEST", icon: ClipboardList },
            { id: "files", label: "DRIVE", icon: FolderArchive },
            { id: "testimoni", label: "REVIEW", icon: Star }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "info" | "files" | "request" | "testimoni")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? "bg-[#2A1E17] text-white shadow-xl" : "text-[#8E7F75] hover:text-[#2A1E17] hover:bg-[#FDFBF0]"
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: INFO */}
        {activeTab === "info" && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white p-8 rounded-[2.5rem] border border-[#D4C3A3]/30 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-[#FDFBF0] rounded-2xl text-[#C5A059]"><Calendar size={24} /></div>
                <h3 className="font-heading text-xl font-bold uppercase tracking-wider">Detail Reservasi</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#8E7F75] uppercase tracking-widest">Tanggal Acara</p>
                  <p className="font-bold text-lg">{clientData.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#8E7F75] uppercase tracking-widest">Paket Pilihan</p>
                  <p className="font-bold text-lg text-[#C5A059]">{clientData.package}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#8E7F75] uppercase tracking-widest">Booking Code</p>
                  <p className="font-mono font-bold">{clientData.code}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#8E7F75] uppercase tracking-widest">Status Pembayaran</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      clientData.remainingBill === 0 ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {clientData.remainingBill === 0 ? "Lunas" : "Belum Lunas"}
                    </span>
                    <p className="text-xs font-medium text-[#8E7F75]">
                      (Sisa: Rp {clientData.remainingBill.toLocaleString("id-ID")})
                    </p>
                  </div>
                </div>
              </div>

              {/* QRIS SECTION */}
              {clientData.remainingBill > 0 && (
                <div className="mt-10 pt-8 border-t border-[#FDFBF0]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8E7F75] mb-6 text-center">Pembayaran via QRIS</p>
                  <div className="relative w-64 h-64 mx-auto border-2 border-[#D4C3A3] rounded-2xl overflow-hidden shadow-md">
                    <Image src="/qris.jpg" alt="QRIS Payment" fill className="object-cover" />
                  </div>
                  <div className="flex justify-center mt-6">
                    <a 
                      href="/qris.jpg" 
                      download="QRIS_AccMoment.jpg"
                      className="bg-[#2A1E17] text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-all"
                    >
                      Download QRIS
                    </a>
                  </div>
                  <p className="text-[9px] text-[#8E7F75] mt-4 text-center italic">Mohon lampirkan bukti transfer di WhatsApp setelah scan.</p>
                </div>
              )}
            </div>

            <div className="bg-[#2A1E17] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="font-heading text-xl font-bold uppercase mb-4">Tim Kreatif Anda</h3>
                  <p className="text-white/60 text-xs mb-6 max-w-md">Tim profesional kami siap mengabadikan momen mewah Anda dengan hasil terbaik.</p>
                  <div className="flex flex-wrap gap-4">
                    {clientData.assignedTeam.length > 0
                      ? clientData.assignedTeam.map(name => (
                        <div key={name} className="flex items-center gap-3 bg-white/10 px-5 py-3 rounded-2xl">
                          <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center font-bold">{name.charAt(0).toUpperCase()}</div>
                          <div>
                            <p className="text-[10px] font-bold uppercase text-white/50">Tim Bertugas</p>
                            <p className="text-sm font-bold">{name}</p>
                          </div>
                        </div>
                      ))
                      : <p className="text-xs text-white/60">Tim acara Anda sedang dijadwalkan.</p>}
                  </div>
               </div>
               <Heart className="absolute -bottom-10 -right-10 w-40 h-40 text-white/5 rotate-12" />
            </div>
          </div>
        )}

        {/* TAB 2: REQUEST */}
        {activeTab === "request" && (
          <form onSubmit={handleSaveRequest} className="bg-white p-8 sm:p-12 rounded-[3rem] border border-[#D4C3A3]/30 shadow-xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center border-b border-[#FDFBF0] pb-8">
                <h2 className="font-heading text-3xl font-bold uppercase tracking-tight">💐 DETAIL REQUEST CLIENT</h2>
                <p className="inline-block text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.2em] mt-3 border-b-2 border-[#C5A059] pb-1 leading-relaxed">Wajib diisi maksimal H-7 Acara</p>
             </div>

             <div className="space-y-10">
                <div className="space-y-4">
                  <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#2A1E17]">
                    <Sparkles size={18} className="text-[#C5A059]" /> Instagram User
                  </label>
                  <input required placeholder="@username" className="w-full h-14 bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-2xl px-6 text-xs font-medium outline-none focus:border-[#C5A059] transition-all" value={requestData.igUsername} onChange={(e) => setRequestData({...requestData, igUsername: e.target.value})}/>
                </div>

                <div className="space-y-6 pt-6 border-t border-[#FDFBF0]">
                   <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#2A1E17]">
                    <ClipboardList size={18} className="text-[#C5A059]" /> List Vendor Acara
                   </label>
                   <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { key: 'dekor', label: 'Dekorasi' },
                        { key: 'makeup', label: 'Make Up' },
                        { key: 'fg', label: 'Fotografer' },
                        { key: 'vg', label: 'Videografer' },
                        { key: 'mahar', label: 'Mahar/Seserahan' },
                        { key: 'henna', label: 'Henna' },
                        { key: 'others', label: 'Lainnya' }
                      ].map(v => (
                         <div key={v.key} className="space-y-1">
                            <label className="text-[9px] font-bold uppercase text-[#8E7F75] ml-1">{v.label}</label>
                            <input className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-xl px-4 text-xs outline-none focus:border-[#C5A059]" value={requestData.vendorList[v.key as keyof typeof requestData.vendorList]} onChange={(e) => setRequestData({...requestData, vendorList: {...requestData.vendorList, [v.key]: e.target.value}})}/>
                         </div>
                      ))}
                      {requestData.customVendors.map((cv, i) => (
                         <div key={cv.id} className="space-y-1">
                            <input className="w-full h-8 bg-transparent border-b border-[#D4C3A3] text-[9px] font-bold uppercase text-[#8E7F75] outline-none" placeholder="Nama Vendor Custom" value={cv.label} onChange={(e) => { const n = [...requestData.customVendors]; n[i].label = e.target.value; setRequestData({...requestData, customVendors: n}); }}/>
                            <input className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-xl px-4 text-xs outline-none focus:border-[#C5A059]" value={cv.value} onChange={(e) => { const n = [...requestData.customVendors]; n[i].value = e.target.value; setRequestData({...requestData, customVendors: n}); }}/>
                         </div>
                      ))}
                      <button type="button" onClick={() => setRequestData({...requestData, customVendors: [...requestData.customVendors, {id: Date.now().toString(), label: "", value: ""}]})} className="col-span-full h-12 border-2 border-dashed border-[#D4C3A3] rounded-xl text-[10px] font-bold uppercase text-[#C5A059] hover:bg-[#FDFBF0]">+ Tambah Vendor Lain</button>
                   </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-[#FDFBF0]">
                  <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#2A1E17]">
                    <MapPin size={18} className="text-[#C5A059]" /> Lokasi & Map
                  </label>
                  <input required placeholder="Link Google Maps..." className="w-full h-14 bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-2xl px-6 text-xs font-medium outline-none focus:border-[#C5A059] transition-all" value={requestData.gmaps} onChange={(e) => setRequestData({...requestData, gmaps: e.target.value})}/>
                </div>

                <div className="space-y-6 pt-6 border-t border-[#FDFBF0]">
                  <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#2A1E17]">
                    <Music size={18} className="text-[#C5A059]" /> Request Musik
                  </label>
                  <div className="grid gap-6">
                    <input placeholder="Judul Lagu Highlight Video" className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-xl px-5 text-xs outline-none focus:border-[#C5A059]" value={requestData.songRecap} onChange={(e) => setRequestData({...requestData, songRecap: e.target.value})}/>

                    <div className="space-y-3">
                       <div className="flex justify-between items-center">
                         <p className="text-[10px] font-bold text-[#8E7F75] uppercase ml-1">List Lagu Story:</p>
                         <button type="button" onClick={() => setRequestData({...requestData, storySongs: [...requestData.storySongs, ""]})} className="text-[9px] font-bold text-[#C5A059] uppercase hover:underline">+ Tambah Lagu</button>
                       </div>
                       {requestData.storySongs.map((song, i) => (
                         <div key={i} className="flex gap-2">
                           <input placeholder={`Judul Lagu ${i+1}`} className="flex-1 h-12 bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-xl px-5 text-xs outline-none focus:border-[#C5A059]" value={song} onChange={(e) => { const n = [...requestData.storySongs]; n[i] = e.target.value; setRequestData({...requestData, storySongs: n}); }}/>
                           {requestData.storySongs.length > 1 && <button type="button" onClick={() => setRequestData({...requestData, storySongs: requestData.storySongs.filter((_, idx) => idx !== i)})} className="p-3 text-red-400 hover:bg-red-50 rounded-xl"><X size={16} /></button>}
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-[#FDFBF0]">
                  <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#2A1E17]">
                    <Video size={18} className="text-[#C5A059]" /> Referensi TikTok
                  </label>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center">
                        <p className="text-[10px] font-bold text-[#8E7F75] uppercase ml-1">Link Video Trend:</p>
                        <button type="button" onClick={() => setRequestData({...requestData, tiktokRefs: [...requestData.tiktokRefs, ""]})} className="text-[9px] font-bold text-[#C5A059] uppercase hover:underline">+ Tambah Link</button>
                     </div>
                    {requestData.tiktokRefs.map((ref, i) => (
                      <div key={i} className="flex gap-2">
                        <input placeholder={`Link TikTok ${i+1}...`} className="flex-1 h-12 bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-xl px-5 text-xs outline-none focus:border-[#C5A059]" value={ref} onChange={(e) => { const n = [...requestData.tiktokRefs]; n[i] = e.target.value; setRequestData({...requestData, tiktokRefs: n}); }}/>
                        {requestData.tiktokRefs.length > 1 && <button type="button" onClick={() => setRequestData({...requestData, tiktokRefs: requestData.tiktokRefs.filter((_, idx) => idx !== i)})} className="p-3 text-red-400 hover:bg-red-50 rounded-xl"><X size={16} /></button>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-[#FDFBF0]">
                  <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#2A1E17]">
                    <Camera size={18} className="text-[#C5A059]" /> Momen Wajib
                  </label>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center">
                        <p className="text-[10px] font-bold text-[#8E7F75] uppercase ml-1">Daftar Momen Penting:</p>
                        <button type="button" onClick={() => setRequestData({...requestData, mandatoryMoments: [...requestData.mandatoryMoments, ""]})} className="text-[9px] font-bold text-[#C5A059] uppercase hover:underline">+ Tambah Momen</button>
                     </div>
                    {requestData.mandatoryMoments.map((mom, i) => (
                      <div key={i} className="flex gap-2">
                        <input placeholder={`Contoh: Salaman dengan Nenek / Teman SMP`} className="flex-1 h-12 bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-xl px-5 text-xs outline-none focus:border-[#C5A059]" value={mom} onChange={(e) => { const n = [...requestData.mandatoryMoments]; n[i] = e.target.value; setRequestData({...requestData, mandatoryMoments: n}); }}/>
                        {requestData.mandatoryMoments.length > 1 && <button type="button" onClick={() => setRequestData({...requestData, mandatoryMoments: requestData.mandatoryMoments.filter((_, idx) => idx !== i)})} className="p-3 text-red-400 hover:bg-red-50 rounded-xl"><X size={16} /></button>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* REQUEST KHUSUS */}
                <div className="space-y-4 pt-6 border-t border-[#FDFBF0]">
                   <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#2A1E17]">
                    <MessageSquare size={18} className="text-[#C5A059]" /> Request Khusus
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Tuliskan catatan tambahan atau request khusus lainnya di sini..."
                    className="w-full bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-2xl p-6 text-xs outline-none focus:border-[#C5A059] transition-all resize-none"
                    value={requestData.specialNote}
                    onChange={(e) => setRequestData({...requestData, specialNote: e.target.value})}
                  />
                </div>
             </div>

             <button type="submit" className="w-full h-16 bg-[#C5A059] text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl active:scale-[0.98] transition-all">SIMPAN DETAIL REQUEST</button>
          </form>
        )}

        {/* TAB 3: DRIVE */}
        {activeTab === "files" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-white p-10 rounded-[3rem] border border-[#D4C3A3]/30 shadow-xl">
                <div className="text-center mb-10">
                   <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FolderArchive size={36} />
                   </div>
                   <h3 className="font-heading text-2xl font-bold uppercase">Cloud Storage</h3>
                   <p className="text-sm text-[#8E7F75] mt-2">Unduh seluruh hasil dokumentasi Anda melalui tautan di bawah ini.</p>
                </div>

                <div className="grid gap-4">
                   {clientData.driveUrl ? (
                   <a href={clientData.driveUrl} target="_blank" rel="noreferrer" className="group flex items-center justify-between p-6 bg-[#FDFBF0] border border-[#D4C3A3]/30 rounded-3xl hover:border-[#C5A059] transition-all">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-white rounded-2xl text-[#C5A059] shadow-sm"><Download size={20} /></div>
                         <div className="text-left">
                            <p className="text-xs font-bold uppercase tracking-wider">Hasil Dokumentasi Lengkap</p>
                            <p className="text-[10px] text-[#8E7F75] mt-1">Akses semua file original & editan (Drive)</p>
                         </div>
                      </div>
                      <ExternalLink size={18} className="text-[#C5A059] opacity-0 group-hover:opacity-100 transition-all" />
                   </a>
                   ) : (
                     <p className="rounded-2xl bg-[#FDFBF0] p-5 text-center text-xs text-[#8E7F75]">
                       Link dokumentasi akan tersedia di sini setelah diunggah admin.
                     </p>
                   )}
                </div>
             </div>
          </div>
        )}

        {/* TAB 4: REVIEW */}
        {activeTab === "testimoni" && (
          <div className="bg-white p-8 sm:p-12 rounded-[3rem] border border-[#D4C3A3]/30 shadow-xl animate-in fade-in slide-in-from-bottom-4">
             <div className="text-center mb-12">
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star size={32} />
                </div>
                <h3 className="font-heading text-2xl font-bold uppercase">Beri Ulasan</h3>
                <p className="text-sm text-[#8E7F75] mt-2">Kepuasan Anda adalah prioritas kemewahan kami.</p>
                {clientData.reviewDate && (
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                    Ulasan tersimpan · {clientData.reviewDate}
                  </p>
                )}
             </div>

             <form onSubmit={handleSendTestimoni} className="space-y-10">
                <div className="flex flex-col items-center gap-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8E7F75]">Rating Kepuasan</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`p-2 transition-all ${rating >= s ? "text-amber-400 scale-110" : "text-[#D4C3A3] hover:text-amber-200"}`}
                      >
                        <Star size={40} fill={rating >= s ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-[#8E7F75]">Pesan & Kesan</label>
                   <textarea
                    rows={5}
                    placeholder="Ceritakan pengalaman Anda menggunakan jasa ACC Moment..."
                    className="w-full bg-[#FDFBF0] border border-[#D4C3A3]/50 rounded-2xl p-6 text-sm outline-none focus:border-[#C5A059] transition-all resize-none shadow-inner"
                    value={testimoni}
                    onChange={(e) => setTestimoni(e.target.value)}
                   />
                </div>

                <button type="submit" className="w-full h-16 bg-[#2A1E17] text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl active:scale-[0.98] transition-all">
                  KIRIM ULASAN MEWAH ANDA
                </button>
             </form>
          </div>
        )}
      </main>
    </div>
  );
}
