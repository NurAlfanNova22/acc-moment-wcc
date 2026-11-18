"use client";

import Link from "next/link";
import { Phone } from "lucide-react";

const NAV_LINKS = [
  { href: "#portofolio", label: "Portofolio" },
  { href: "#paket", label: "Paket Harga" },
  { href: "#pesan", label: "Pemesanan" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 border-b border-border backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:py-4"
        aria-label="Navigasi utama"
      >
        {/* Mobile View: Portal Button (Left) */}
        <div className="flex flex-1 lg:hidden">
          <Link
            href="/client/login"
            className="rounded border border-border bg-warm-white px-3 py-1.5 text-[10px] font-bold tracking-widest text-text-dark uppercase transition-colors active:bg-primary-pale min-h-[36px] flex items-center"
          >
            Portal
          </Link>
        </div>

        {/* Brand Logo: Centered on Mobile, Left-aligned on Desktop */}
        <Link href="/" className="group flex flex-col items-center leading-none lg:items-start lg:flex-initial">
          <span className="font-cursive text-xl sm:text-2xl text-text-dark group-hover:text-primary transition-colors">
            Acc
          </span>
          <span className="font-heading text-lg sm:text-xl font-bold tracking-widest text-primary -mt-1 uppercase">
            Moment
          </span>
          <span className="hidden sm:inline-block text-[8px] font-medium tracking-[0.2em] text-text-light uppercase mt-0.5">
            WCC & All Event • Tulungagung, Blitar, Kediri & Trenggalek
          </span>
        </Link>

        {/* Desktop Links (Center) */}
        <ul className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-xs font-bold tracking-widest text-text-medium uppercase transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Controls / Mobile Spacer (Right) */}
        <div className="flex flex-1 justify-end lg:flex-initial lg:gap-4 lg:items-center">
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <Link
              href="/client/login"
              className="text-xs font-bold tracking-widest text-text-dark uppercase hover:text-primary transition-colors"
            >
              Portal Klien
            </Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-xs font-bold tracking-widest text-white uppercase transition-all hover:bg-secondary active:scale-95 shadow-md shadow-primary/20"
            >
              <Phone size={14} aria-hidden="true" />
              Contact
            </a>
          </div>
          {/* Empty spacer for mobile to keep logo centered */}
          <div className="w-[60px] lg:hidden"></div>
        </div>
      </nav>
    </header>
  );
}
