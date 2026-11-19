"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, User, ChevronRight, ArrowLeft } from "lucide-react";

const NAV_LINKS = [
  { href: "/#portofolio", label: "Portofolio" },
  { href: "/#paket", label: "Paket Harga" },
  { href: "/#pesan", label: "Pemesanan" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] bg-cream/95 border-b border-border backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20" aria-label="Navigasi utama">
          
          <div className="flex flex-1 items-center justify-start lg:flex-none">
            <Link href="/client/login" className="relative z-[110] flex h-10 items-center gap-1.5 rounded-lg border border-border bg-warm-white px-4 text-[10px] font-bold tracking-widest text-text-dark uppercase transition-all active:scale-95 lg:hidden">
              <User size={14} className="text-primary" />
              <span>Portal</span>
            </Link>
            
            <Link href="/" onClick={handleLogoClick} className="hidden lg:flex relative w-48 h-16 group items-center">
              <Image 
                src="/logo-v2.png" 
                alt="ACC Moment Logo" 
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>

          <div className="flex flex-none items-center justify-center lg:flex-1">
            <Link href="/" onClick={handleLogoClick} className="relative w-36 h-12 lg:hidden">
              <Image 
                src="/logo-v2.png" 
                alt="ACC Moment Logo" 
                fill
                className="object-contain"
              />
            </Link>

            <ul className="hidden lg:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-[11px] font-bold tracking-[0.25em] text-text-medium uppercase transition-colors hover:text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-1 items-center justify-end lg:flex-none">
            <div className="hidden lg:flex items-center gap-6">
               <Link href="/client/login" className="text-[11px] font-bold tracking-widest text-text-dark uppercase hover:text-primary transition-colors">Portal Klien</Link>
               <a href="https://wa.me/6282245294775" target="_blank" rel="noopener noreferrer" className="flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-[11px] font-bold tracking-widest text-white shadow-lg shadow-primary/20 hover:bg-secondary transition-all">
                <Phone size={14} /> CONTACT
              </a>
            </div>

            <button type="button" onClick={() => setIsOpen(!isOpen)} className="relative z-[110] flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-warm-white text-text-dark transition-all active:scale-90 lg:hidden">
              {isOpen ? <X size={24} className="text-primary" /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        <div className={`absolute inset-x-0 top-full z-[90] bg-cream border-b border-border shadow-2xl transition-all duration-300 ease-in-out lg:hidden ${isOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-4 opacity-0 invisible"}`}>
          <div className="p-5 space-y-1">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="flex items-center justify-between rounded-xl p-4 text-xs font-bold uppercase tracking-[0.2em] text-text-dark active:bg-primary-pale active:text-primary">
                {link.label}
                <ChevronRight size={14} className="text-primary/40" />
              </a>
            ))}
            <div className="pt-4 mt-2 border-t border-border flex flex-col gap-3">
               <Link href="/client/login" onClick={() => setIsOpen(false)} className="flex h-12 items-center justify-center rounded-xl border border-border bg-warm-white text-[10px] font-bold uppercase tracking-widest text-text-dark">Akses Portal Klien</Link>
               <a href="https://wa.me/6282245294775" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/20 active:scale-95">
                <Phone size={14} /> Hubungi WhatsApp
              </a>
            </div>
          </div>
        </div>
      </header>
      {isOpen && <div className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
}
