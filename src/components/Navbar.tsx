"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

const NAV_LINKS = [
  { href: "#portofolio", label: "Portofolio" },
  { href: "#paket", label: "Paket Harga" },
  { href: "#jadwal", label: "Cek Jadwal" },
  { href: "#pesan", label: "Pemesanan" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 border-b border-border backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:py-4"
        aria-label="Navigasi utama"
      >
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-cursive text-2xl text-text-dark group-hover:text-primary transition-colors">
            Acc
          </span>
          <span className="font-heading text-xl font-bold tracking-widest text-primary -mt-1 uppercase">
            Moment
          </span>
          <span className="text-[9px] font-medium tracking-[0.2em] text-text-light uppercase mt-0.5">
            Your personal content creator
          </span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
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

        <div className="hidden md:flex md:items-center md:gap-4">
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

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/client/login"
            className="rounded border border-border bg-warm-white px-3 py-2 text-[10px] font-bold tracking-widest text-text-dark uppercase transition-colors active:bg-primary-pale min-h-[40px] flex items-center"
          >
            Portal
          </Link>

          <button
            type="button"
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-md p-2 text-text-dark transition-colors active:bg-primary-pale"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          >
            {mobileOpen ? (
              <X size={24} aria-hidden="true" />
            ) : (
              <Menu size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="border-t border-border bg-cream px-5 py-6 lg:hidden shadow-xl"
          role="navigation"
          aria-label="Menu mobile"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-lg px-4 py-4 text-sm font-bold tracking-widest text-text-dark uppercase transition-colors hover:bg-primary-pale hover:text-primary active:bg-primary-pale"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-5">
            <Link
              href="/client/login"
              className="flex w-full items-center justify-center rounded-lg border border-border bg-warm-white px-4 py-3.5 text-xs font-bold tracking-widest text-text-dark uppercase transition-colors active:bg-primary-pale"
              onClick={() => setMobileOpen(false)}
            >
              Portal Klien (Akses Video)
            </Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 text-xs font-bold tracking-widest text-white uppercase transition-all shadow-lg shadow-primary/20 active:bg-secondary"
            >
              <Phone size={16} aria-hidden="true" />
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
