"use client";

import { ExternalLink, Film } from "lucide-react";

type PortfolioItem = {
  id: string;
  platform: "Instagram" | "TikTok";
  sourceUrl: string;
  embedUrl: string;
};

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "instagram-1",
    platform: "Instagram",
    sourceUrl: "https://www.instagram.com/reel/DcvLrg6Jdy2/",
    embedUrl: "https://www.instagram.com/reel/DcvLrg6Jdy2/embed/",
  },
  {
    id: "tiktok-1",
    platform: "TikTok",
    sourceUrl: "https://www.tiktok.com/@acc_moment.wcc/video/7708950246709103880",
    embedUrl: "https://www.tiktok.com/player/v1/7708950246709103880?description=0&music_info=0",
  },
  {
    id: "instagram-2",
    platform: "Instagram",
    sourceUrl: "https://www.instagram.com/reel/DeUj2LEJFw0/",
    embedUrl: "https://www.instagram.com/reel/DeUj2LEJFw0/embed/",
  },
  {
    id: "tiktok-2",
    platform: "TikTok",
    sourceUrl: "https://www.tiktok.com/@acc_moment.wcc/video/7673775080450690311",
    embedUrl: "https://www.tiktok.com/player/v1/7673775080450690311?description=0&music_info=0",
  },
];

export default function PortfolioSection() {
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
            Tonton pilihan video kami dari Instagram Reels dan TikTok. Pratinjau video disediakan langsung oleh platform.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 justify-items-center gap-5 md:grid-cols-2 md:gap-6">
          {PORTFOLIO_ITEMS.map(item => (
            <article
              key={item.id}
              className="w-full max-w-[360px] overflow-hidden rounded-xl border border-border bg-cream shadow-sm transition-all hover:border-primary-light hover:shadow-md"
            >
              <iframe
                title={`${item.platform} portfolio video`}
                src={item.embedUrl}
                className="block aspect-[9/16] w-full border-0 bg-black"
                allow="encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-10 items-center justify-center gap-2 text-[10px] font-semibold text-text-medium hover:text-primary"
              >
                Buka di {item.platform}
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="https://www.instagram.com/acc.moment/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-border bg-cream px-5 py-2.5 text-xs font-semibold text-text-dark transition-colors hover:bg-primary-pale"
          >
            <Film size={15} aria-hidden="true" className="text-primary" />
            Instagram
            <ExternalLink size={13} aria-hidden="true" />
          </a>
          <a
            href="https://www.tiktok.com/@acc_moment.wcc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-border bg-cream px-5 py-2.5 text-xs font-semibold text-text-dark transition-colors hover:bg-primary-pale"
          >
            <Film size={15} aria-hidden="true" className="text-primary" />
            TikTok
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
