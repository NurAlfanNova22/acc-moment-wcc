"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, ArrowRight, Home, AlertCircle } from "lucide-react";

export default function ClientLoginPage() {
  const router = useRouter();
  const [bookingCode, setBookingCode] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: bookingCode, pin }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "KODE BOOKING ATAU PIN SALAH. MOHON PERIKSA KEMBALI.");
        return;
      }

      router.replace("/client/dashboard");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF0] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2A1E17]/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
      
      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-primary/10 border border-[#D4C3A3]/30 p-10 sm:p-14 relative overflow-hidden">
          
          <div className="flex justify-center mb-12">
            <Link href="/" className="relative w-48 h-16 transform hover:scale-105 transition-transform duration-300">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
            </Link>
          </div>

          <div className="text-center mb-10">
            <h1 className="font-heading text-2xl font-bold text-[#2A1E17] uppercase tracking-tight">Portal Klien</h1>
            <div className="h-0.5 w-12 bg-[#C5A059] mx-auto mt-2"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] ml-1">Kode Booking</label>
              <input 
                type="text" 
                required
                placeholder="ACC-XXXXXXXX-XXX"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                className="w-full h-14 bg-[#FDFBF0] border border-[#D4C3A3] rounded-2xl px-5 text-sm font-bold tracking-widest placeholder:text-[#8E7F75]/30 outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] ml-1">PIN Akses</label>
              <div className="relative group">
                <input 
                  type="password" 
                  required
                  maxLength={4}
                  placeholder="****"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full h-14 bg-[#FDFBF0] border border-[#D4C3A3] rounded-2xl px-5 text-sm font-bold tracking-[0.8em] placeholder:text-[#8E7F75]/30 outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all"
                />
                <Lock size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#D4C3A3] group-focus-within:text-[#C5A059] transition-colors" />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-[9px] font-bold uppercase p-4 rounded-xl border border-red-100 flex items-center gap-3 animate-shake">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-16 bg-[#2A1E17] text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-[#2A1E17]/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  MENGONTROL AKSES...
                </div>
              ) : (
                <>MASUK PORTAL <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-[#FDFBF0] text-center space-y-5">
             <Link href="/" className="inline-flex items-center justify-center w-full h-14 gap-3 bg-[#FDFBF0] rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-[#2A1E17] hover:bg-[#D4C3A3]/20 transition-all group">
               <Home size={16} /> Kembali ke Beranda
             </Link>
             <p className="text-[9px] text-[#D4C3A3] uppercase tracking-tighter leading-relaxed">
               BELUM PUNYA KODE? HUBUNGI ADMIN VIA WHATSAPP
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
