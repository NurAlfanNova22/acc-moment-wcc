"use client";

import { Play, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex items-center bg-cream pt-20 pb-12 sm:pt-24 sm:pb-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-2 md:items-center md:gap-14">
        {/* Konten Teks */}
        <div className="order-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold tracking-wide text-secondary uppercase">
            <Sparkles size={13} aria-hidden="true" />
            <span>WCC & All Event • Tulungagung, Blitar, Kediri & Trenggalek</span>
          </div>

          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-text-dark sm:text-4xl md:text-5xl lg:text-6xl">
            Abadikan Momen{" "}
            <span className="text-primary italic">Terindahmu</span> Menjadi Konten Estetik
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-text-medium sm:text-base md:text-lg">
            Kami hadir untuk merekam setiap momen berharga hari pernikahanmu langsung dalam format video kekinian (Reels & TikTok) siap upload tanpa menunggu berminggu-minggu.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#paket"
              className="flex min-h-[48px] w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 active:bg-primary/80 sm:w-auto"
            >
              Lihat Paket & Harga
            </a>
            <a
              href="#portofolio"
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-border bg-warm-white px-6 py-3 text-sm font-semibold text-text-dark transition-colors hover:bg-primary-pale active:bg-primary-pale/80 sm:w-auto"
            >
              <Play size={16} aria-hidden="true" className="text-primary" />
              Lihat Portofolio
            </a>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs text-text-light border-t border-border/70 pt-4">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span>Jadwal 2026 Dibuka</span>
            </div>
            <span>•</span>
            <span>Tulungagung, Blitar, Kediri & Trenggalek</span>
          </div>
        </div>

        {/* Video / Visual Showreel Preview */}
        <div className="order-2 flex justify-center">
          <div className="relative aspect-[9/14] w-full max-w-[280px] overflow-hidden rounded-2xl bg-black ring-1 ring-border shadow-md sm:max-w-xs">
            <iframe
              title="Video highlight ACC Moment di TikTok"
              src="https://www.tiktok.com/player/v1/7708950246709103880?description=0&music_info=0"
              className="absolute inset-0 h-full w-full border-0"
              allow="encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-warm-white to-transparent" />
    </section>
  );
}
