"use client";

import { useState } from "react";
import { Send, Calendar, User, Phone, MessageSquare } from "lucide-react";

export default function BookingSection() {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    date: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `Halo ACC Moment! Saya ingin konsultasi booking WCC:\n\n` +
      `Nama: ${formData.name}\n` +
      `WhatsApp: ${formData.whatsapp}\n` +
      `Rencana Tanggal: ${formData.date}\n` +
      `Catatan: ${formData.notes || "-"}`
    );
    window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
  };

  return (
    <section id="pesan" className="bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-3xl border border-border bg-warm-white p-6 shadow-xl shadow-primary/5 sm:p-12">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-2xl font-bold text-text-dark sm:text-4xl">
              Konsultasi & Booking Jadwal
            </h2>
            <p className="mt-3 text-sm text-text-medium sm:text-base uppercase tracking-widest font-semibold">
              Kunci Tanggal Bahagiamu Sekarang
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-medium ml-1">
                <User size={14} className="text-primary" /> Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                required
                placeholder="Masukkan nama Anda..."
                className="h-14 w-full rounded-xl border border-border bg-cream px-4 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="wa" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-medium ml-1">
                <Phone size={14} className="text-primary" /> Nomor WhatsApp
              </label>
              <input
                type="tel"
                id="wa"
                required
                placeholder="Contoh: 081234567890"
                className="h-14 w-full rounded-xl border border-border bg-cream px-4 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="date" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-medium ml-1">
                <Calendar size={14} className="text-primary" /> Rencana Tanggal Acara
              </label>
              <input
                type="date"
                id="date"
                required
                className="h-14 w-full rounded-xl border border-border bg-cream px-4 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-medium ml-1">
                <MessageSquare size={14} className="text-primary" /> Catatan Tambahan
              </label>
              <input
                type="text"
                id="notes"
                placeholder="Lokasi acara, paket, dll..."
                className="h-14 w-full rounded-xl border border-border bg-cream px-4 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="mt-4 sm:col-span-2">
              <button
                type="submit"
                className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-primary text-sm font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-primary/30 transition-all hover:bg-secondary active:scale-95"
              >
                <Send size={20} />
                Konsultasi via WhatsApp
              </button>
              <p className="mt-4 text-center text-[10px] font-medium text-text-light uppercase tracking-widest">
                *Klik tombol di atas untuk langsung terhubung dengan Admin kami.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
