"use client";

import { MessageCircle, Calendar } from "lucide-react";

export default function MobileBottomBar() {
  return (
    <aside
      aria-label="Aksi Cepat Mobile"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-warm-white/95 px-4 py-2.5 backdrop-blur-md md:hidden pb-[max(0.625rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex max-w-md items-center gap-2.5">
        <a
          href="https://wa.me/6282245294775?text=Halo%20ACC%20Moment,%20saya%20mau%20tanya%20info%20paket%20wedding%20content"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-cream px-3 py-3 text-xs font-semibold text-text-dark transition-colors active:bg-primary-pale min-h-[44px]"
        >
          <MessageCircle size={16} className="text-secondary shrink-0" aria-hidden="true" />
          <span>Chat WhatsApp</span>
        </a>

        <a
          href="#pesan"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-3 text-xs font-semibold text-white shadow-sm transition-colors active:bg-primary/90 min-h-[44px]"
        >
          <Calendar size={16} className="shrink-0" aria-hidden="true" />
          <span>Booking Tanggal</span>
        </a>
      </div>
    </aside>
  );
}
