"use client";

import { Check, MessageCircle, Sparkles } from "lucide-react";

type Package = {
  id: string;
  name: string;
  badge?: string;
  price: string;
  description: string;
  facilities: string[];
};

const PACKAGES: Package[] = [
  {
    id: "silver",
    name: "Paket Silver",
    price: "Rp 1.500.000",
    description: "Ideal untuk acara Akad Nikah atau Lamaran / Engagement (durasi 3-4 jam).",
    facilities: [
      "1 Content Creator profesional",
      "Kamera iPhone 15/16 Pro Max (4K 60fps)",
      "Wireless mic untuk audio akad jernih",
      "2-3 Video Reels/TikTok estetik siap upload",
      "Semua file mentah (raw files) via Google Drive",
      "Pengerjaan cepat (maksimal 24 jam)",
    ],
  },
  {
    id: "gold",
    name: "Paket Gold",
    badge: "Paling Populer",
    price: "Rp 2.500.000",
    description: "Paket lengkap untuk Akad Nikah & Resepsi (durasi 6-8 jam penuh).",
    facilities: [
      "1-2 Content Creator profesional",
      "Setup kamera 4K & stabilizer gimbal",
      "Wireless mic ganda untuk pengantin & penghulu",
      "5-7 Video Reels/TikTok kekinian siap FYP",
      "1 Video highlight recap cinematic (1-2 menit)",
      "Semua file mentah (raw files) via Google Drive",
      "Pengerjaan kilat (12-24 jam setelah acara)",
      "Revisi video hingga 2x",
    ],
  },
  {
    id: "platinum",
    name: "Paket Platinum",
    badge: "All-In VIP",
    price: "Rp 3.800.000",
    description: "Dokumentasi VIP dari persiapan (makeup/siraman) hingga resepsi malam.",
    facilities: [
      "2 Content Creator (Shooter & Live Story Editor)",
      "Live upload Instagram Story real-time di hari H",
      "Peralatan lengkap: 4K camera, gimbal, pro lighting, wireless mic",
      "8-10 Video Reels/TikTok berbagai angle & tren",
      "1 Video cinematic wedding recap (2-3 menit)",
      "Semua file mentah dikirim hari itu juga (same-day)",
      "Revisi video bebas hingga puas",
      "Free 1 konten Pre-Wedding teaser",
    ],
  },
];

export default function PricingSection() {
  return (
    <section id="paket" className="bg-cream py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-wider text-secondary uppercase sm:text-sm">
            Harga Transparan & Terjangkau
          </p>
          <h2 className="mt-1.5 font-heading text-2xl font-bold text-text-dark sm:text-3xl md:text-4xl">
            Pilihan Paket Wedding Content
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs text-text-medium sm:text-sm md:text-base">
            Semua paket sudah termasuk kru terlatih, peralatan sinematik, dan akses file mentahan langsung di Google Drive.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:gap-6 md:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col rounded-xl border bg-warm-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md ${
                pkg.badge
                  ? "border-primary/60 ring-2 ring-primary/20"
                  : "border-border hover:border-primary-light"
              }`}
            >
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                    <Sparkles size={11} aria-hidden="true" />
                    {pkg.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-heading text-xl font-bold text-text-dark">
                  {pkg.name}
                </h3>
                <p className="mt-1 text-xs text-text-medium leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              <div className="mt-4 pb-4 border-b border-border">
                <span className="text-xs text-text-light">Mulai dari</span>
                <p className="font-heading text-2xl sm:text-3xl font-bold text-primary">
                  {pkg.price}
                </p>
              </div>

              <ul className="mt-4 flex-1 space-y-2.5">
                {pkg.facilities.map((facility, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-secondary"
                      aria-hidden="true"
                    />
                    <span className="text-xs text-text-dark leading-snug">
                      {facility}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#pesan"
                className="mt-6 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-primary/90 active:bg-primary/80"
              >
                <MessageCircle size={15} aria-hidden="true" />
                Pilih {pkg.name}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-border bg-warm-white p-4 text-center sm:p-6">
          <p className="text-xs sm:text-sm font-medium text-text-dark">
            Butuh paket khusus (adat tertentu, lokasi luar kota, atau acara multi-hari)?
          </p>
          <a
            href="https://wa.me/6281234567890?text=Halo%20ACC%20Moment,%20saya%20mau%20konsultasi%20paket%20custom"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary underline hover:no-underline"
          >
            Konsultasikan gratis via WhatsApp langsung dengan tim kami &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
