"use client";

import { useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Package,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

const PACKAGES_OPTIONS = [
  { value: "", label: "Pilih paket yang diinginkan..." },
  { value: "silver", label: "Paket Silver (Rp 1.500.000)" },
  { value: "gold", label: "Paket Gold (Rp 2.500.000) - Terpopuler" },
  { value: "platinum", label: "Paket Platinum (Rp 3.800.000) - VIP" },
  { value: "custom", label: "Paket Custom (Konsultasi via WA)" },
];

const EVENT_TYPES = [
  { value: "", label: "Pilih jenis acara..." },
  { value: "pernikahan", label: "Pernikahan (Akad & Resepsi)" },
  { value: "akad", label: "Akad Nikah Saja" },
  { value: "resepsi", label: "Resepsi Saja" },
  { value: "engagement", label: "Lamaran / Engagement" },
  { value: "prewedding", label: "Pre-Wedding" },
  { value: "lainnya", label: "Acara Lainnya" },
];

type FormState = "idle" | "submitting" | "success";

export default function BookingSection() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    eventDate: "",
    eventType: "",
    eventLocation: "",
    package: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nama lengkap wajib diisi";
    if (!formData.phone.trim()) newErrors.phone = "Nomor WhatsApp wajib diisi";
    if (!formData.eventDate) newErrors.eventDate = "Pilih rencana tanggal acara";
    if (!formData.package) newErrors.package = "Pilih paket yang ingin ditanyakan";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormState("submitting");

    const selectedPackage =
      PACKAGES_OPTIONS.find((p) => p.value === formData.package)?.label ?? "";
    const selectedEvent =
      EVENT_TYPES.find((t) => t.value === formData.eventType)?.label ?? "";

    // Flow: Langsung ke WhatsApp tanpa simpan database dulu (Mencegah Spam DB)
    const message = encodeURIComponent(
      `Halo ACC Moment! Saya tertarik untuk konsultasi booking:\n\n` +
        `• Nama: ${formData.name}\n` +
        `• No. WA: ${formData.phone}\n` +
        `• Rencana Tanggal: ${formData.eventDate}\n` +
        `• Jenis Acara: ${selectedEvent || "-"}\n` +
        `• Lokasi: ${formData.eventLocation || "-"}\n` +
        `• Paket yg Diminati: ${selectedPackage}\n` +
        `• Catatan: ${formData.notes || "-"}\n\n` +
        `Apakah jadwal tersebut masih tersedia? Mohon info rinciannya ya min. Terima kasih!`
    );

    await new Promise((r) => setTimeout(r, 1000));
    window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
    setFormState("success");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  if (formState === "success") {
    return (
      <section id="pesan" className="bg-cream py-14 sm:py-20">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="rounded-2xl border border-secondary/40 bg-warm-white p-6 sm:p-8 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/20">
              <MessageCircle size={30} className="text-secondary" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-heading text-2xl font-bold text-text-dark">
              Permintaan Terkirim!
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-medium leading-relaxed">
              Detail konsultasi Anda sudah diarahkan ke WhatsApp Admin. Kami akan membalas ketersediaan jadwal dan info lainnya di sana.
            </p>
            <button
              type="button"
              onClick={() => setFormState("idle")}
              className="mt-6 flex min-h-[46px] w-full items-center justify-center rounded-lg border border-border bg-cream px-5 py-2.5 text-xs sm:text-sm font-semibold text-text-dark transition-colors active:bg-primary-pale"
            >
              Kembali ke Formulir
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pesan" className="bg-cream py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-5 md:items-start md:gap-12">
          <div className="md:col-span-2">
            <p className="text-xs font-semibold tracking-wider text-secondary uppercase sm:text-sm">
              Konsultasi Gratis
            </p>
            <h2 className="mt-1.5 font-heading text-2xl font-bold text-text-dark sm:text-3xl md:text-4xl">
              Tanya Jadwal & Paket
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-text-medium leading-relaxed">
              Isi rencana acaramu di sini. Kami akan mengecek ketersediaan tim dan membantu memilihkan paket yang paling pas buat kamu.
            </p>

            <div className="mt-6 space-y-3.5">
              <div className="flex items-start gap-3 rounded-lg bg-warm-white p-3 border border-border">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  1
                </span>
                <div>
                  <p className="text-xs font-bold text-text-dark">Lengkapi Form</p>
                  <p className="text-[11px] text-text-medium">Beri tahu kami detail rencana acaramu</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-warm-white p-3 border border-border">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  2
                </span>
                <div>
                  <p className="text-xs font-bold text-text-dark">Konsultasi via WA</p>
                  <p className="text-[11px] text-text-medium">Ngobrol langsung dengan admin kami</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-warm-white p-3 border border-border">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  3
                </span>
                <div>
                  <p className="text-xs font-bold text-text-dark">Dapatkan Akses Portal</p>
                  <p className="text-[11px] text-text-medium">Diberikan setelah deal / pembayaran DP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-border bg-warm-white p-5 sm:p-7 shadow-sm"
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-text-dark">
                    <User size={14} className="text-primary" /> Nama Lengkap
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Sarah & Dimas"
                    className={`min-h-[46px] w-full rounded-lg border bg-cream px-3.5 py-2.5 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.name ? "border-red-400" : "border-border"
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-text-dark">
                    <Phone size={14} className="text-primary" /> No. WhatsApp
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0812..."
                    className={`min-h-[46px] w-full rounded-lg border bg-cream px-3.5 py-2.5 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.phone ? "border-red-400" : "border-border"
                    }`}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="eventDate" className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-text-dark">
                      <Calendar size={14} className="text-primary" /> Rencana Tanggal
                    </label>
                    <input
                      id="eventDate"
                      name="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="min-h-[46px] w-full rounded-lg border border-border bg-cream px-3.5 py-2.5 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="package" className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-text-dark">
                      <Package size={14} className="text-primary" /> Paket Minat
                    </label>
                    <select
                      id="package"
                      name="package"
                      value={formData.package}
                      onChange={handleChange}
                      className="min-h-[46px] w-full rounded-lg border border-border bg-cream px-3.5 py-2.5 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {PACKAGES_OPTIONS.map((pkg) => (
                        <option key={pkg.value} value={pkg.value}>{pkg.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-text-dark">
                    <FileText size={14} className="text-primary" /> Catatan / Request
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Tuliskan jika ada request khusus..."
                    className="w-full rounded-lg border border-border bg-cream px-3.5 py-2.5 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formState === "submitting"}
                className="mt-6 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {formState === "submitting" ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Send size={18} /> Cek Jadwal via WhatsApp
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
