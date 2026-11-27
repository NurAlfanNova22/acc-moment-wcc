"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border bg-cream pb-20 md:pb-0">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:items-start">
          <div className="text-center md:text-left">
            <p className="font-heading text-xl font-bold text-primary">
              ACC Moment
            </p>
            <p className="mt-1 text-sm text-text-light">
              WCC & All Event
            </p>
            <p className="text-sm text-text-light">
              Tulungagung, Blitar, Kediri & Trenggalek
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4 text-center md:text-right">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-text-dark">Layanan</p>
              <ul className="mt-2 space-y-1 text-sm text-text-light font-medium uppercase tracking-tighter">
                <li>
                  <Link href="/terms" className="hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-text-dark">Hubungi Kami</p>
              <a
                href="https://wa.me/6282245294775"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block w-full sm:w-auto py-3 px-6 bg-primary rounded-xl text-xs font-bold text-white text-center hover:bg-secondary transition-all"
              >
                Hubungi Kami di WhatsApp
              </a>
              <p className="mt-1 text-xs text-text-light">
                Tulungagung, Jawa Timur
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-1.5 border-t border-border pt-6 text-xs text-text-light uppercase tracking-widest">
          <div className="flex items-center gap-1.5 font-bold">
            <span>&copy; {year} ACC Moment.</span>
            <span className="inline-flex items-center gap-1">
              Dibuat dengan{" "}
              <Heart
                size={12}
                className="text-primary"
                fill="currentColor"
                aria-hidden="true"
              />{" "}
              di Tulungagung
            </span>
          </div>
          <p className="mt-2 text-[10px] opacity-60">Wedding Content Creator & All Event</p>
        </div>
      </div>
    </footer>
  );
}
