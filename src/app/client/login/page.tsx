"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function ClientLoginPage() {
  const router = useRouter();
  const [bookingCode, setBookingCode] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!bookingCode.trim() || !pin.trim()) {
      setError("Kode booking dan PIN wajib diisi");
      return;
    }

    setLoading(true);

    // Simulasi verifikasi login klien
    // Format demo: Kode: ACC-DEMO, PIN: 1234
    await new Promise((r) => setTimeout(r, 600));

    if (
      bookingCode.toUpperCase() === "ACC-DEMO" &&
      pin === "1234"
    ) {
      // Simpan session simpel di localStorage untuk demo
      localStorage.setItem(
        "client_session",
        JSON.stringify({ bookingCode: "ACC-DEMO", clientName: "Sarah & Dimas" })
      );
      router.push("/client/dashboard");
    } else {
      setError("Kode Booking atau PIN tidak sesuai. Silakan hubungi admin via WhatsApp jika lupa.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-cream px-5 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="font-heading text-2xl font-bold text-primary">
              ACC Moment
            </span>
          </Link>
          <h1 className="mt-4 font-heading text-3xl font-bold text-text-dark">
            Portal Klien
          </h1>
          <p className="mt-2 text-sm text-text-medium">
            Masukkan Kode Booking & PIN yang diberikan oleh admin untuk
            mengakses file dan progres acaramu.
          </p>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-warm-white p-6 shadow-sm">
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="bookingCode"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-text-dark"
              >
                <KeyRound size={15} className="text-text-light" aria-hidden="true" />
                Kode Booking
              </label>
              <input
                id="bookingCode"
                type="text"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                placeholder="Contoh: ACC-20261117-001"
                className="w-full rounded-md border border-border bg-cream px-4 py-2.5 text-sm uppercase tracking-wider text-text-dark placeholder:normal-case placeholder:tracking-normal placeholder:text-text-light/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="pin"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-text-dark"
              >
                <Lock size={15} className="text-text-light" aria-hidden="true" />
                PIN (4 Digit)
              </label>
              <input
                id="pin"
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="4 digit PIN"
                className="w-full rounded-md border border-border bg-cream px-4 py-2.5 text-center text-lg tracking-widest text-text-dark placeholder:text-sm placeholder:tracking-normal placeholder:text-text-light/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk ke Dashboard
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-md bg-primary-pale/60 p-3 text-center text-xs text-text-medium">
            <p className="font-semibold text-text-dark">Petunjuk Demo:</p>
            <p className="mt-1">
              Gunakan Kode: <span className="font-mono font-bold text-primary">ACC-DEMO</span> | PIN:{" "}
              <span className="font-mono font-bold text-primary">1234</span>
            </p>
          </div>

          <div className="mt-6 border-t border-border pt-4 text-center">
            <p className="text-xs text-text-light">
              Belum punya kode booking?{" "}
              <Link href="/#pesan" className="text-primary underline hover:no-underline">
                Pesan paket sekarang
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-text-light hover:text-text-dark"
          >
            &larr; Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
