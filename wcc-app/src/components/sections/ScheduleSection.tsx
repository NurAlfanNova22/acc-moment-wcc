"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

type BookedDate = {
  date: string;
  status: "booked" | "tentative";
  label?: string;
};

// Data contoh jadwal terisi untuk demo
const SAMPLE_BOOKED: BookedDate[] = [
  { date: "2026-11-20", status: "booked", label: "Nadia & Reza" },
  { date: "2026-11-28", status: "booked", label: "Resepsi Tulungagung" },
  { date: "2026-12-05", status: "tentative", label: "Fitri & Bayu (Pending DP)" },
  { date: "2026-12-12", status: "booked", label: "Akad & Resepsi" },
  { date: "2026-12-25", status: "booked", label: "Sarah & Dimas" },
  { date: "2026-12-26", status: "tentative", label: "Lamaran" },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function ScheduleSection() {
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(10); // November (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [todayDate, setTodayDate] = useState({ day: 17, month: 10, year: 2026 });

  useEffect(() => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setTodayDate({
      day: today.getDate(),
      month: today.getMonth(),
      year: today.getFullYear(),
    });
    setMounted(true);
  }, []);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  const getDateInfo = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return SAMPLE_BOOKED.find((b) => b.date === dateStr);
  };

  const isToday = (day: number) => {
    return (
      day === todayDate.day &&
      currentMonth === todayDate.month &&
      currentYear === todayDate.year
    );
  };

  const isPast = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const todayStart = new Date(todayDate.year, todayDate.month, todayDate.day);
    return date < todayStart;
  };

  const handleSelectDate = (day: number, status?: "booked" | "tentative") => {
    setSelectedDay(day);
    if (!status) {
      const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dateInput = document.getElementById("eventDate") as HTMLInputElement;
      if (dateInput) {
        dateInput.value = formattedDate;
        dateInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  };

  return (
    <section id="jadwal" className="bg-warm-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-5 md:items-start md:gap-12">
          {/* Sisi Kiri / Header */}
          <div className="md:col-span-2">
            <p className="text-xs font-semibold tracking-wider text-secondary uppercase sm:text-sm">
              Ketersediaan Waktu
            </p>
            <h2 className="mt-1.5 font-heading text-2xl font-bold text-text-dark sm:text-3xl md:text-4xl">
              Cek Kalender Jadwal
            </h2>
            <p className="mt-2 text-xs text-text-medium sm:text-sm leading-relaxed">
              Pilih tanggal acaramu. Kami membatasi maksimal 1-2 acara per hari agar hasil video tetap fokus, maksimal, dan tidak terburu-buru.
            </p>

            {/* Legend Status */}
            <div className="mt-5 flex flex-wrap gap-3 sm:flex-col sm:space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3.5 w-3.5 rounded bg-primary-pale border border-border" />
                <span className="text-xs text-text-dark font-medium">Tersedia (Bisa Booking)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3.5 w-3.5 rounded bg-primary" />
                <span className="text-xs text-text-dark font-medium">Sudah Terisi (Booked)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3.5 w-3.5 rounded bg-amber-400" />
                <span className="text-xs text-text-dark font-medium">Tentative (Tunggu DP)</span>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-cream border border-border p-3.5 text-xs text-text-medium">
              <p className="font-semibold text-text-dark">💡 Tips Praktis:</p>
              <p className="mt-1">
                Sentuh tanggal kosong di kalender untuk langsung mengisi formulir pemesanan di bawah secara otomatis!
              </p>
            </div>
          </div>

          {/* Sisi Kanan: Kalender Mobile-Optimized */}
          <div className="md:col-span-3">
            <div className="rounded-xl border border-border bg-cream p-4 sm:p-6 shadow-sm">
              {/* Header Bulan */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <button
                  type="button"
                  onClick={goToPrevMonth}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-text-dark transition-colors hover:bg-primary-pale active:bg-primary-pale/80"
                  aria-label="Bulan sebelumnya"
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <h3 className="font-heading text-base sm:text-lg font-bold text-text-dark">
                  {MONTHS[currentMonth]} {currentYear}
                </h3>
                <button
                  type="button"
                  onClick={goToNextMonth}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-text-dark transition-colors hover:bg-primary-pale active:bg-primary-pale/80"
                  aria-label="Bulan berikutnya"
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </div>

              {/* Grid Hari */}
              <div className="mt-3 grid grid-cols-7 gap-1 sm:gap-1.5">
                {DAYS.map((day, idx) => (
                  <div
                    key={day}
                    className={`py-1.5 text-center text-xs font-semibold ${
                      idx === 0 ? "text-primary" : "text-text-medium"
                    }`}
                  >
                    {day}
                  </div>
                ))}

                {/* Empty Cells */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10 sm:h-11" />
                ))}

                {/* Date Cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateInfo = getDateInfo(day);
                  const status = dateInfo?.status;
                  const past = isPast(day);
                  const todayMark = isToday(day);
                  const isSelected = selectedDay === day;

                  let cellClass =
                    "flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-all min-h-[42px] sm:min-h-[46px] select-none ";

                  if (past) {
                    cellClass += "text-text-light/40 bg-transparent cursor-not-allowed";
                  } else if (status === "booked") {
                    cellClass += "bg-primary text-white font-bold cursor-not-allowed";
                  } else if (status === "tentative") {
                    cellClass += "bg-amber-400 text-amber-950 font-bold";
                  } else {
                    cellClass +=
                      "bg-warm-white text-text-dark border border-border/80 hover:border-primary active:bg-primary-pale";
                  }

                  if (todayMark && !past && !status) {
                    cellClass += " ring-2 ring-primary ring-offset-1";
                  }

                  if (isSelected && !past && !status) {
                    cellClass += " !bg-secondary !text-white !border-secondary font-bold";
                  }

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={past || status === "booked"}
                      onClick={() => handleSelectDate(day, status)}
                      className={cellClass}
                      title={status ? dateInfo?.label : "Tersedia, klik untuk pilih"}
                    >
                      <span>{day}</span>
                      {status === "booked" && (
                        <span className="text-[9px] font-normal leading-none opacity-90">Full</span>
                      )}
                      {status === "tentative" && (
                        <span className="text-[9px] font-normal leading-none">Hold</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Status info bar saat tanggal dipilih */}
              {selectedDay && (
                <div className="mt-4 rounded-lg bg-warm-white border border-border p-3 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-secondary shrink-0" />
                    <span>
                      Tanggal terpilih: <strong className="text-text-dark">{selectedDay} {MONTHS[currentMonth]} {currentYear}</strong>
                    </span>
                  </div>
                  <a
                    href="#pesan"
                    className="font-semibold text-primary underline hover:no-underline shrink-0 ml-2"
                  >
                    Lanjut Isi Form &darr;
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
