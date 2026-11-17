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
    <header className="fixed top-0 left-0 right-0 z-50 bg-warm-white/95 border-b border-border backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4"
        aria-label="Navigasi utama"
      >
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-heading text-xl font-bold text-primary tracking-tight">
            ACC Moment
          </span>
          <span className="text-xs text-text-light">
            WCC & All Event Tulungagung
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-text-medium transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex md:items-center md:gap-3">
          <Link
            href="/client/login"
            className="rounded-md border border-border px-3.5 py-2 text-sm font-medium text-text-dark transition-colors hover:bg-primary-pale hover:text-primary"
          >
            Portal Klien
          </Link>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 active:bg-primary/80"
          >
            <Phone size={16} aria-hidden="true" />
            Hubungi Kami
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/client/login"
            className="rounded-md border border-border bg-warm-white px-2.5 py-2 text-xs font-medium text-text-dark transition-colors active:bg-primary-pale min-h-[44px] flex items-center"
          >
            Portal Klien
          </Link>

          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 text-text-dark transition-colors active:bg-primary-pale"
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

      {mobileOpen && (
        <div
          id="mobile-nav"
          className="border-t border-border bg-warm-white px-5 py-4 md:hidden"
          role="navigation"
          aria-label="Menu mobile"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-md px-3 py-3 text-base font-medium text-text-dark transition-colors hover:bg-primary-pale hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            <Link
              href="/client/login"
              className="flex w-full items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-medium text-text-dark transition-colors hover:bg-primary-pale hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Portal Klien (Akses Video & Revisi)
            </Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-base font-medium text-white transition-colors hover:bg-primary/90 active:bg-primary/80"
            >
              <Phone size={18} aria-hidden="true" />
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
