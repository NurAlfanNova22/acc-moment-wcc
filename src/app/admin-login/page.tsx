"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertCircle, LockKeyhole, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Login gagal. Periksa kembali data Anda.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FDFBF0] p-5 text-[#2A1E17]">
      <section className="w-full max-w-md rounded-[2.5rem] border border-[#D4C3A3]/40 bg-white p-8 shadow-2xl shadow-[#2A1E17]/10 sm:p-12">
        <div className="mb-9 flex justify-center">
          <div className="relative h-16 w-48">
            <Image src="/logo.png" alt="ACC Moment" fill sizes="192px" className="object-contain" priority />
          </div>
        </div>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDFBF0] text-[#C5A059]">
            <LockKeyhole size={24} />
          </div>
          <h1 className="font-heading text-2xl font-bold uppercase">Login Admin</h1>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#8E7F75]">
            Masuk untuk mengelola ACC Moment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="username" className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[#8E7F75]">
              Username
            </label>
            <input
              id="username"
              autoComplete="username"
              required
              value={username}
              onChange={event => setUsername(event.target.value)}
              className="h-14 w-full rounded-2xl border border-[#D4C3A3] bg-[#FDFBF0] px-5 text-sm font-bold outline-none transition focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/10"
              placeholder="Masukkan username"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[#8E7F75]">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="h-14 w-full rounded-2xl border border-[#D4C3A3] bg-[#FDFBF0] px-5 text-sm font-bold outline-none transition focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/10"
              placeholder="Masukkan password"
            />
          </div>

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-xs font-medium text-red-600">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#2A1E17] text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl transition hover:bg-[#8C6239] disabled:opacity-60"
          >
            <LogIn size={16} />
            {isLoading ? "Memeriksa..." : "Masuk Dashboard"}
          </button>
        </form>

        <p className="mt-6 text-center text-[9px] leading-relaxed text-[#8E7F75]">
          Akses admin dilindungi. Jika login belum dikonfigurasi, atur variabel environment server.
        </p>
      </section>
    </main>
  );
}
