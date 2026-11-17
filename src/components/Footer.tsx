"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:items-start">
          <div className="text-center md:text-left">
            <p className="font-heading text-xl font-bold text-primary">
              ACC Moment
            </p>
            <p className="mt-1 text-sm text-text-light">
              Wedding Content Creator & All Event
            </p>
            <p className="text-sm text-text-light">
              Tulungagung dan sekitarnya
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm font-medium text-text-dark">Kontak</p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm text-primary hover:underline"
            >
              WhatsApp: [NOMOR WA]
            </a>
            <p className="mt-1 text-sm text-text-light">
              Tulungagung, Jawa Timur
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-1.5 border-t border-border pt-6 text-sm text-text-light">
          <span>&copy; {year} ACC Moment.</span>
          <span className="inline-flex items-center gap-1">
            Dibuat dengan{" "}
            <Heart
              size={14}
              className="text-primary"
              fill="currentColor"
              aria-hidden="true"
            />{" "}
            di Tulungagung
          </span>
        </div>
      </div>
    </footer>
  );
}
