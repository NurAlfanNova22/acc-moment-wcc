"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, User, ChevronRight } from "lucide-react";

const NAV_LINKS = [
  { href: "#portofolio", label: "Portofolio" },
  { href: "#paket", label: "Paket Harga" },
  { href: "#pesan", label: "Pemesanan" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[60] bg-cream/95 border-b border-border backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:py-3" aria-label="Navigasi utama">
          
          {/* Mobile: Portal (Left) | Desktop: Logo (Left) */}
          <div className="flex flex-1 items-center lg:flex-none">
            <Link
              href="/client/login"
              className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-warm-white px-3 text-[10px] font-bold tracking-widest text-text-dark uppercase transition-all active:scale-95 lg:hidden"
            >
              <User size={14} className="text-primary" />
              Portal
            </Link>
            
            <Link href="/" className="hidden lg:flex flex-col leading-none group">
              <span className="font-cursive text-2xl text-text-dark group-hover:text-primary transition-colors">Acc</span>
              <span className="font-heading text-lg font-bold tracking-[0.2em] text-primary uppercase -mt-1">Moment</span>
            </Link>
          </div>

          {/* Mobile: Logo (Center) | Desktop: Nav Links (Center) */}
          <div className="flex flex-1 justify-center lg:flex-none lg:mx-auto">
            <Link href="/" className="flex lg:hidden flex-col items-center leading-none">
              <span className="font-cursive text-xl text-text-dark">Acc</span>
              <span className="font-heading text-base font-bold tracking-widest text-primary uppercase -mt-1">Moment</span>
            </Link>

            <ul className="hidden lg:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[11px] font-bold tracking-[0.25em] text-text-medium uppercase transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile: Menu Toggle (Right) | Desktop: Buttons (Right) */}
          <div className="flex flex-1 justify-end items-center gap-4 lg:flex-none">
            <div className="hidden lg:flex items-center gap-4">
               <Link href="/client/login" className="text-[11px] font-bold tracking-widest text-text-dark uppercase hover:text-primary transition-colors">
                  Portal Klien
               </Link>
               <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-[11px] font-bold tracking-widest text-white shadow-lg shadow-primary/20 hover:bg-secondary transition-all"
              >
                <Phone size={14} />
                CONTACT
              </a>
            </div>

            {/* HAMBURGER BUTTON (Mobile Only) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-warm-white text-text-dark transition-all active:scale-90 lg:hidden"
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* MOBILE MENU OVERLAY */}
        <div 
          className={`fixed inset-x-0 top-[53px] z-[55] bg-cream border-b border-border shadow-2xl transition-all duration-300 ease-in-out lg:hidden ${
            isOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible"
          }`}
        >
          <div className="p-5 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-xl p-4 text-xs font-bold uppercase tracking-[0.2em] text-text-dark active:bg-primary-pale active:text-primary"
              >
                {link.label}
                <ChevronRight size={14} className="text-primary/40" />
              </a>
            ))}
            <div className="pt-4 mt-2 border-t border-border flex flex-col gap-3">
               <Link 
                 href="/client/login" 
                 onClick={() => setIsOpen(false)}
                 className="flex h-12 items-center justify-center rounded-xl border border-border bg-warm-white text-[10px] font-bold uppercase tracking-widest text-text-dark"
               >
                 Akses Portal Klien
               </Link>
               <a
                href="https://wa.me/6281234567890"
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/20"
              >
                <Phone size={14} />
                Hubungi WhatsApp
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop for mobile menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[50] bg-black/20 backdrop-blur-sm lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
