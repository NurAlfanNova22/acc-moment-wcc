"use client";

import { useState } from "react";
import { Check, MessageCircle, Sparkles, Clock, Users, Video } from "lucide-react";

type Package = {
  id: string;
  name: string;
  price: string;
  duration: string;
  crew: string;
  output: string[];
  description: string;
  badge?: string;
};

type Category = {
  id: string;
  title: string;
  packages: Package[];
};

const CATALOG: Category[] = [
  {
    id: "wedding",
    title: "Wedding",
    packages: [
      {
        id: "w1",
        name: "Wedding 1 (Basic)",
        price: "Rp 225.000",
        duration: "3 Jam Standby",
        crew: "1 Crew Standby",
        description: "Akad / Temu / Resepsi / Unduh Mantu",
        output: ["3–5 IG Story", "1 Recap Video", "1 Wedding Trend (by request)", "All File via Google Drive"],
      },
      {
        id: "w2",
        name: "Wedding 2 (Standard)",
        price: "Rp 350.000",
        duration: "5 Jam Standby",
        crew: "1 Crew Standby",
        description: "Akad – Temu",
        badge: "Populer",
        output: ["6–8 IG Story", "2 Recap Video", "2 Wedding Trend (by request)", "All File via Google Drive"],
      },
      {
        id: "w3",
        name: "Wedding 3 (Premium)",
        price: "Rp 450.000",
        duration: "7 Jam Standby",
        crew: "1 Crew Standby",
        description: "Akad – Temu – Resepsi",
        output: ["10–12 IG Story", "3 Recap Video", "3 Wedding Trend (by request)", "All File via Google Drive"],
      },
    ],
  },
  {
    id: "engagement",
    title: "Engagement",
    packages: [
      {
        id: "e1",
        name: "Paket Engagement",
        price: "Rp 225.000",
        duration: "3 Jam Standby",
        crew: "1 Crew Standby",
        description: "Lamaran / Engagement",
        output: ["4–6 IG Story", "1 Recap Video", "2 Trend (by request)", "All File via Google Drive"],
      },
    ],
  },
  {
    id: "graduation",
    title: "Graduation",
    packages: [
      {
        id: "g1",
        name: "Paket Graduation",
        price: "Rp 150.000",
        duration: "1,5 Jam Standby",
        crew: "1 Crew Standby",
        description: "Sempro, Semhas, Wisuda, dll",
        output: ["2 IG Story", "1 Video Konsep", "1 Trend (by request)", "All File via Google Drive"],
      },
    ],
  },
  {
    id: "event",
    title: "All Event",
    packages: [
      {
        id: "a1",
        name: "Paket All Event",
        price: "Rp 200.000",
        duration: "3 Jam Standby",
        crew: "1 Crew Standby",
        description: "Tedhak Siten, Reuni, dll",
        output: ["4–6 IG Story", "1 Video Rekap", "2 Trend (by request)", "All File via Google Drive"],
      },
    ],
  },
];

const ADDONS = [
  { name: "Extra Time (Tambah Durasi)", price: "+Rp 60.000" },
  { name: "Video Cinematic / Landscape", price: "+Rp 100.000" },
  { name: "Video TikTok", price: "+Rp 25.000" },
  { name: "Ekstra Editing", price: "+Rp 50.000" },
];

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState("wedding");

  return (
    <section id="paket" className="bg-[#FDFBF0] py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">Katalog Layanan</p>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#2A1E17] uppercase tracking-tight">Pilihan Paket Spesial</h2>
          <div className="h-1 w-20 bg-[#C5A059] mx-auto rounded-full"></div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex bg-white p-2 rounded-3xl border border-[#D4C3A3]/40 shadow-sm mb-12 max-w-2xl mx-auto overflow-x-auto no-scrollbar gap-2">
          {CATALOG.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex-1 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === cat.id ? "bg-[#2A1E17] text-white shadow-xl" : "text-[#8E7F75] hover:text-[#2A1E17] hover:bg-[#FDFBF0]"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* PACKAGE CARDS */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {CATALOG.find((c) => c.id === activeTab)?.packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col bg-white p-8 sm:p-10 rounded-[3rem] border shadow-xl transition-all duration-500 hover:-translate-y-2 ${
                pkg.badge ? "border-[#C5A059] ring-1 ring-[#C5A059]/20" : "border-[#D4C3A3]/20"
              }`}
            >
              {pkg.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#C5A059] text-white px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
                    <Sparkles size={12} /> {pkg.badge}
                  </span>
                </div>
              )}

              <div className="mb-8 border-b border-[#FDFBF0] pb-6 text-center">
                <h3 className="font-heading text-2xl font-bold text-[#2A1E17] uppercase tracking-tight">{pkg.name}</h3>
                <p className="mt-2 text-[10px] text-[#8E7F75] font-bold uppercase tracking-widest">{pkg.description}</p>
                <div className="mt-6 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-widest">Investasi Momen</span>
                  <p className="text-3xl sm:text-4xl font-heading font-bold text-[#2A1E17]">{pkg.price}</p>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-3 text-[10px] font-bold uppercase tracking-widest text-[#8E7F75]">
                  <div className="flex items-center gap-2 bg-[#FDFBF0] p-3 rounded-2xl border border-[#D4C3A3]/10">
                    <Clock size={14} className="text-[#C5A059]" /> {pkg.duration}
                  </div>
                  <div className="flex items-center gap-2 bg-[#FDFBF0] p-3 rounded-2xl border border-[#D4C3A3]/10">
                    <Users size={14} className="text-[#C5A059]" /> {pkg.crew}
                  </div>
                </div>

                <ul className="space-y-4">
                  {pkg.output.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 p-0.5 rounded-full bg-emerald-50 text-emerald-600">
                        <Check size={14} />
                      </div>
                      <span className="text-xs font-medium text-[#2A1E17]/80 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={`https://wa.me/6281234567890?text=Halo%20ACC%20Moment,%20saya%20ingin%20booking%20${pkg.name}`}
                className="mt-10 flex h-14 w-full items-center justify-center gap-3 rounded-[1.5rem] bg-[#2A1E17] text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-black/10 transition-all hover:bg-black active:scale-95 group"
              >
                <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                Booking Paket
              </a>
            </div>
          ))}
        </div>

        {/* ADD-ONS SECTION */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-white p-8 sm:p-12 rounded-[3rem] border border-[#D4C3A3]/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="font-heading text-2xl font-bold text-[#2A1E17] uppercase tracking-tight">Additional Services</h3>
                <p className="mt-2 text-xs text-[#8E7F75] font-medium leading-relaxed">
                  Ingin sesuatu yang lebih spesial? Tambahkan layanan ekstra untuk memaksimalkan dokumentasi acara Anda.
                </p>
                <div className="mt-8 p-6 bg-[#FDFBF0] rounded-[2rem] border border-[#C5A059]/20">
                  <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest mb-1">Custom Request?</p>
                  <p className="text-xs font-medium text-[#2A1E17]">Konsultasikan kebutuhan khusus Anda langsung dengan tim kami via WhatsApp.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {ADDONS.map((addon, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#FDFBF0]/50 border border-[#D4C3A3]/20 rounded-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#2A1E17]">{addon.name}</span>
                    <span className="text-xs font-bold text-[#C5A059]">{addon.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center italic text-[#8E7F75] text-[10px] uppercase tracking-[0.2em]">
          Semua Paket Mendapatkan Seluruh File Mentah & Hasil Edit via Google Drive
        </div>
      </div>
    </section>
  );
}
