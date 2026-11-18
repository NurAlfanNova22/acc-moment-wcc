"use client";

import Link from "next/link";
import { Phone, User } from "lucide-react";

const NAV_LINKS = [
  { href: "#portofolio", label: "Portofolio" },
  { href: "#paket", label: "Paket Harga" },
  { href: "#pesan", label: "Pemesanan" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 border-b border-border backdrop-blur-sm">
      <nav
        className="mx-auto grid max-w-6xl grid-cols-3 items-center px-4 py-2 sm:py-4"
        aria-label="Navigasi utama"
      >
        {/* Left Side: Portal Button */}
        <div className="flex justify-start">
          <Link
            href="/client/login"
            className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-warm-white px-3 text-[10px] font-bold tracking-widest text-text-dark uppercase transition-all active:scale-95 active:bg-primary-pale lg:text-xs"
          >
            <User size={14} className="text-primary lg:hidden" />
            <span className="hidden lg:inline">Portal Klien</span>
            <span className="lg:hidden">Portal</span>
          </Link>
        </div>

        {/* Center: Brand Logo */}
        <div className="flex justify-center">
          <Link href="/" className="group flex flex-col items-center leading-none">
            <span className="font-cursive text-xl text-text-dark group-hover:text-primary transition-colors sm:text-2xl">
              Acc
            </span>
            <span className="font-heading text-lg font-bold tracking-widest text-primary -mt-1 uppercase sm:text-xl">
              Moment
            </span>
          </Link>
        </div>

        {/* Right Side: Desktop Nav / Mobile Contact */}
        <div className="flex justify-end">
          {/* Desktop Nav Links */}
          <ul className="hidden items-center gap-6 lg:flex mr-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-[10px] font-bold tracking-[0.2em] text-text-medium uppercase transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 transition-all active:scale-90 lg:h-11 lg:w-auto lg:rounded-lg lg:px-5 lg:gap-2"
          >
            <Phone size={16} />
            <span className="hidden text-[10px] font-bold tracking-widest uppercase lg:inline">Contact</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
