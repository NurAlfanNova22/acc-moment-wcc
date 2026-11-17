"use client";

import { useState } from "react";
import { ExternalLink, Play, Film } from "lucide-react";

type PortfolioItem = {
  id: string;
  clientName: string;
  eventType: string;
  location: string;
  views: string;
};

const SAMPLE_PORTFOLIO: PortfolioItem[] = [
  {
    id: "1",
    clientName: "Anisa & Fajar",
    eventType: "Pernikahan",
    location: "Crown Victoria Tulungagung",
    views: "125K Views",
  },
  {
    id: "2",
    clientName: "Rina & Yoga",
    eventType: "Engagement",
    location: "Kafe De Savanna",
    views: "84K Views",
  },
  {
    id: "3",
    clientName: "Sarah & Dimas",
    eventType: "Pernikahan",
    location: "Gedung Barata Tulungagung",
    views: "210K Views",
  },
  {
    id: "4",
    clientName: "Mega & Dion",
    eventType: "Pre-Wedding",
    location: "Pantai Gemah",
    views: "95K Views",
  },
];

const EVENT_TYPES = ["Semua", "Pernikahan", "Engagement", "Pre-Wedding"];

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filtered =
    activeFilter === "Semua"
      ? SAMPLE_PORTFOLIO
      : SAMPLE_PORTFOLIO.filter((item) => item.eventType === activeFilter);

  return (
    <section id="portofolio" className="bg-warm-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-wider text-secondary uppercase sm:text-sm">
            Karya Kami
          </p>
          <h2 className="mt-1.5 font-heading text-2xl font-bold text-text-dark sm:text-3xl md:text-4xl">
            Portofolio Konten Viral
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs text-text-medium sm:text-sm md:text-base">
            Hasil karya video format vertikal 9:16 untuk TikTok & Instagram Reels yang estetik, emosional, dan siap FYP.
          </p>
        </div>

        {/* Filter Bar: Scrollable di Mobile, Centered di Desktop */}
        <div className="mt-6 flex justify-start overflow-x-auto no-scrollbar px-1 py-1 sm:justify-center">
          <div
            className="flex gap-2"
            role="tablist"
            aria-label="Filter jenis acara"
          >
            {EVENT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                role="tab"
                aria-selected={activeFilter === type}
                onClick={() => setActiveFilter(type)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all min-h-[40px] ${
                  activeFilter === type
                    ? "bg-primary text-white shadow-sm"
                    : "bg-cream text-text-medium border border-border hover:border-primary-light active:bg-primary-pale"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Video 9:16 - 2 Kolom di Mobile, 4 Kolom di Desktop (Persis TikTok/Reels Grid!) */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-cream shadow-sm transition-all hover:border-primary-light hover:shadow-md"
            >
              {/* Mockup Vertical Video Reel 9:16 */}
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-gradient-to-b from-primary-pale/40 to-primary-light/40">
                <div className="flex h-full flex-col justify-between p-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      {item.eventType}
                    </span>
                    <span className="rounded-full bg-primary/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      {item.views}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center my-auto">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-md backdrop-blur-sm transition-transform group-hover:scale-110 active:scale-95">
                      <Play size={20} className="translate-x-0.5" aria-hidden="true" />
                    </div>
                    <span className="mt-2 text-[10px] font-medium text-text-dark bg-white/70 px-2 py-0.5 rounded-full">
                      Putar Video
                    </span>
                  </div>

                  {/* Caption Bawah */}
                  <div className="rounded-lg bg-black/50 p-2 text-white backdrop-blur-sm">
                    <p className="font-heading text-xs font-semibold truncate">
                      {item.clientName}
                    </p>
                    <p className="text-[10px] text-white/80 truncate">
                      {item.location}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Bawah */}
        <div className="mt-8 text-center">
          <a
            href="https://www.tiktok.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-border bg-cream px-5 py-2.5 text-xs font-semibold text-text-dark transition-colors hover:bg-primary-pale active:bg-primary-pale"
          >
            <Film size={15} aria-hidden="true" className="text-primary" />
            Lihat Lebih Banyak di TikTok & Instagram
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
