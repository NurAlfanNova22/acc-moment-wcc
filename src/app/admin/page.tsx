"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  X, 
  MessageCircle, 
  Calendar, 
  ShoppingBag, 
  DollarSign, 
  Star, 
  ClipboardList,
  Edit2,
  LogOut
} from "lucide-react";

type Booking = {
  id: string;
  code: string;
  pin: string;
  clientName: string;
  clientPhone: string;
  date: string;
  package: string;
  status: "confirmed" | "completed";
  assignedTeam: string[];
  teamLocked?: boolean;
  requestStatus: "Belum Isi" | "Sudah Isi";
  rating?: number;
  reviewComment?: string | null;
  reviewDate?: string | null;
  remainingBill: string;
  driveUrl?: string | null;
};

type Transaction = {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: "in" | "out";
};

async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const result: unknown = await response.json();

  if (!response.ok) {
    const message = typeof result === "object" && result !== null && "error" in result && typeof result.error === "string"
      ? result.error
      : "Permintaan gagal.";
    throw new Error(message);
  }

  return result as T;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const PACKAGES = [
    { name: "Wedding 1 (Basic)", price: 225000 },
    { name: "Wedding 2 (Standard)", price: 350000 },
    { name: "Wedding 3 (Premium)", price: 450000 },
    { name: "Engagement", price: 225000 },
    { name: "Graduation", price: 150000 },
    { name: "All Event", price: 200000 },
  ];
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "team" | "finance">("orders");
  const [teams, setTeams] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<{bookingId: string, teamNames: string[], isLocked: boolean}[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dataError, setDataError] = useState("");

  const toggleAssignment = async (bookingId: string, teamName: string) => {
    const existing = assignments.find(a => a.bookingId === bookingId);
    if (existing?.isLocked) return;

    const current = Array.isArray(existing?.teamNames) ? existing.teamNames : [];
    const updated = current.includes(teamName) ? current.filter(t => t !== teamName) : [...current, teamName];
    try {
      await apiRequest<Booking>("/api/bookings", {
        method: "PUT",
        body: JSON.stringify({ id: bookingId, assignedTeam: updated }),
      });
      setAssignments(previous => [...previous.filter(a => a.bookingId !== bookingId), {
        bookingId,
        teamNames: updated,
        isLocked: false,
      }]);
      setBookings(previous => previous.map(b => b.id === bookingId ? { ...b, assignedTeam: updated } : b));
      setDataError("");
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Gagal menyimpan penugasan.");
    }
  };

  const lockAssignment = async (bookingId: string) => {
    const existing = assignments.find(a => a.bookingId === bookingId);
    const isLocked = !existing?.isLocked;
    const teamNames = existing?.teamNames || [];
    try {
      await apiRequest<Booking>("/api/bookings", {
        method: "PUT",
        body: JSON.stringify({ id: bookingId, teamLocked: isLocked, assignedTeam: teamNames }),
      });
      setAssignments(previous => [...previous.filter(a => a.bookingId !== bookingId), {
        bookingId,
        teamNames,
        isLocked,
      }]);
      setDataError("");
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Gagal menyimpan status penugasan.");
    }
  };
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isAddFinanceModalOpen, setIsAddFinanceModalOpen] = useState(false);
  const [authError, setAuthError] = useState("");

  const [newTeam, setNewTeam] = useState("");
  const [newTransaction, setNewTransaction] = useState({ amount: "", description: "", type: "in" as 'in' | 'out' });
  const [newBooking, setNewBooking] = useState({ name: "", phone: "", date: "", package: "Wedding 2 (Standard)", bill: "350000", driveUrl: "" });

  useEffect(() => {
    let active = true;
    const loadAdminData = async () => {
      try {
        const [loadedBookings, loadedTeams, loadedTransactions] = await Promise.all([
          apiRequest<Booking[]>("/api/bookings"),
          apiRequest<string[]>("/api/team"),
          apiRequest<Transaction[]>("/api/transactions"),
        ]);
        if (!active) return;
        setBookings(loadedBookings);
        setAssignments(loadedBookings.map(b => ({
          bookingId: b.id,
          teamNames: Array.isArray(b.assignedTeam) ? b.assignedTeam : [],
          isLocked: Boolean(b.teamLocked),
        })));
        setTeams(loadedTeams);
        setTransactions(loadedTransactions);
      } catch (error) {
        if (active) setDataError(error instanceof Error ? error.message : "Gagal memuat data admin.");
      }
    };
    void loadAdminData();
    return () => { active = false; };
  }, []);

  const clearAssignment = async (bookingId: string) => {
    try {
      await apiRequest<Booking>("/api/bookings", {
        method: "PUT",
        body: JSON.stringify({ id: bookingId, assignedTeam: [], teamLocked: false }),
      });
      setAssignments(previous => previous.map(a => a.bookingId === bookingId
        ? { ...a, teamNames: [], isLocked: false }
        : a
      ));
      setBookings(previous => previous.map(b => b.id === bookingId ? { ...b, assignedTeam: [] } : b));
      setDataError("");
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Gagal menghapus penugasan.");
    }
  };

  const removeTeam = async (teamName: string) => {
    if (!confirm(`Hapus anggota tim ${teamName}?`)) return;
    try {
      await apiRequest<{success: boolean}>(`/api/team?name=${encodeURIComponent(teamName)}`, { method: "DELETE" });
      setTeams(previous => previous.filter(t => t !== teamName));
      setAssignments(previous => previous.map(a => ({
        ...a,
        teamNames: a.teamNames.filter(name => name !== teamName),
      })));
      setBookings(previous => previous.map(b => ({
        ...b,
        assignedTeam: b.assignedTeam.filter(name => name !== teamName),
      })));
      setDataError("");
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Gagal menghapus anggota tim.");
    }
  };

  const deleteTransaction = async (id: string) => {
    if (confirm("Hapus transaksi ini?")) {
      try {
        await apiRequest<{success: boolean}>(`/api/transactions?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        setTransactions(previous => previous.filter(t => t.id !== id));
        setDataError("");
      } catch (error) {
        setDataError(error instanceof Error ? error.message : "Gagal menghapus transaksi.");
      }
    }
  };

  const handleLogout = async () => {
    setAuthError("");
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) {
        setAuthError("Gagal keluar. Silakan coba lagi.");
        return;
      }

      router.replace("/admin-login");
      router.refresh();
    } catch {
      setAuthError("Tidak dapat menghubungi server untuk keluar.");
    }
  };

  const handleEdit = (b: Booking) => {
    setEditingBooking(b);
    setNewBooking({
      name: b.clientName,
      phone: b.clientPhone,
      date: b.date,
      package: b.package,
      bill: b.remainingBill.replace(/[^0-9]/g, ""),
      driveUrl: b.driveUrl || "",
    });
    setIsAddBookingModalOpen(true);
  };

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = PACKAGES.find(p => p.name === newBooking.package);

    try {
      if (editingBooking) {
        const updated = await apiRequest<Booking>("/api/bookings", {
          method: "PUT",
          body: JSON.stringify({
            id: editingBooking.id,
            clientName: newBooking.name,
            clientPhone: newBooking.phone,
            date: newBooking.date,
            package: newBooking.package,
            remainingBill: parseInt(newBooking.bill, 10),
            driveUrl: newBooking.driveUrl,
          }),
        });
        setBookings(previous => previous.map(b => b.id === updated.id ? updated : b));
        setEditingBooking(null);
      } else {
        const created = await apiRequest<Booking>("/api/bookings", {
          method: "POST",
          body: JSON.stringify({
            clientName: newBooking.name,
            clientPhone: newBooking.phone,
            date: newBooking.date,
            package: newBooking.package,
            remainingBill: parseInt(newBooking.bill, 10),
            driveUrl: newBooking.driveUrl,
          }),
        });
        setBookings(previous => [created, ...previous]);
        setAssignments(previous => [{
          bookingId: created.id,
          teamNames: [],
          isLocked: false,
        }, ...previous]);
      }

      setDataError("");
      setIsAddBookingModalOpen(false);
      setNewBooking({ name: "", phone: "", date: "", package: "Wedding 1 (Basic)", bill: pkg?.price.toString() || "225000", driveUrl: "" });
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Gagal menyimpan booking.");
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm("Hapus data pesanan ini?")) {
      try {
        await apiRequest<{success: boolean}>(`/api/bookings?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        setBookings(previous => previous.filter(b => b.id !== id));
        setAssignments(previous => previous.filter(a => a.bookingId !== id));
        setDataError("");
      } catch (error) {
        setDataError(error instanceof Error ? error.message : "Gagal menghapus booking.");
      }
    }
  };

  const handleSendWA = (b: Booking) => {
    const message = encodeURIComponent(`Halo ${b.clientName}! Terlampir akses Portal Klien ACC Moment.\n\n• Kode Booking: *${b.code}*\n• PIN Akses: *${b.pin}*\n\nAkses di: ${window.location.origin}/client/login`);
    window.open(`https://wa.me/${b.clientPhone.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF0] text-[#2A1E17] font-body pb-24">
      {/* HEADER DESKTOP ONLY */}
      <nav className="hidden sm:block sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#D4C3A3] px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="relative w-36 h-12">
            <Image src="/logo-v2.png" alt="Logo" fill className="object-contain" priority />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex bg-[#FDFBF0] p-1 rounded-2xl border border-[#D4C3A3]/50">
              {[
                { id: "orders", label: "Orders", icon: ShoppingBag },
                { id: "team", label: "Team", icon: Calendar },
                { id: "finance", label: "Keuangan", icon: DollarSign }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as "orders" | "team" | "finance")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${activeTab === t.id ? "bg-[#2A1E17] text-white shadow-lg" : "text-[#8E7F75] hover:text-[#2A1E17]"}`}
                >
                  <t.icon size={14} /> <span>{t.label}</span>
                </button>
              ))}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl border border-[#D4C3A3]/60 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-[#8E7F75] hover:border-red-200 hover:text-red-500">
              <LogOut size={14} /> Keluar
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#D4C3A3] px-2 py-2 pb-safe flex justify-around">
        {[
          { id: "orders", label: "Orders", icon: ShoppingBag },
          { id: "team", label: "Team", icon: Calendar },
          { id: "finance", label: "Keuangan", icon: DollarSign }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as "orders" | "team" | "finance")}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-20 ${activeTab === t.id ? "text-[#C5A059]" : "text-[#8E7F75]"}`}
          >
            <t.icon size={24} />
            <span className="text-[10px] font-bold uppercase">{t.label}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex w-20 flex-col items-center gap-1 rounded-xl p-2 text-[#8E7F75] transition-all hover:text-red-500"
        >
          <LogOut size={24} />
          <span className="text-[10px] font-bold uppercase">Keluar</span>
        </button>
      </div>

      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
        {authError && (
          <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
            {authError}
          </p>
        )}
        {dataError && (
          <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
            {dataError}
          </p>
        )}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#D4C3A3]/20 pb-4">
                <div>
                   <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight">Pesanan Klien</h2>
                   <p className="text-[10px] text-[#8E7F75] font-bold uppercase tracking-widest mt-1">Kelola Jadwal & Akses Portal</p>
                </div>
                <button onClick={() => setIsAddBookingModalOpen(true)} className="bg-[#C5A059] text-white px-6 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl">
                  <Plus size={16}/> Tambah Klien Baru
                </button>
             </div>

             <div className="grid gap-5 grid-cols-1">
                {bookings.map(b => (
                  <div key={b.id} className="bg-white p-6 rounded-[2rem] border border-[#D4C3A3]/30 shadow-sm flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                         <div>
                           <h3 className="font-heading font-bold text-xl text-[#2A1E17]">{b.clientName}</h3>
                           <p className="text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.2em] mt-1">{b.package}</p>
                           <div className="flex flex-wrap gap-4 mt-2 text-[10px] font-bold text-[#8E7F75] uppercase tracking-widest">
                             <span>CODE: <strong className="text-[#2A1E17]">{b.code}</strong></span>
                             <span>PIN: <strong className="text-[#2A1E17]">{b.pin}</strong></span>
                             <span>TGL: <strong className="text-[#2A1E17]">{b.date}</strong></span>
                             <span>SISA: <strong className="text-red-500">{b.remainingBill}</strong></span>
                           </div>
                         </div>
                         <div className="flex gap-2">
                            <button onClick={() => handleEdit(b)} className="p-4 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Edit2 size={20}/></button>
                            <button onClick={() => handleSendWA(b)} className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"><MessageCircle size={20}/></button>
                            <button onClick={() => handleDelete(b.id)} className="p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
                         </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#FDFBF0] pt-4">
                       <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase ${b.requestStatus === 'Sudah Isi' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                          <ClipboardList size={14} /> {b.requestStatus}
                       </span>
                       {b.rating && (
                         <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500">
                           <Star size={13} fill="currentColor" /> {b.rating}/5
                         </span>
                       )}
                    </div>
                    {b.reviewComment && (
                      <p className="mt-3 rounded-xl bg-[#FDFBF0] p-4 text-xs leading-relaxed text-[#5D4F45]">
                        “{b.reviewComment}”
                        {b.reviewDate && <span className="mt-2 block text-[9px] font-bold uppercase tracking-widest text-[#8E7F75]">{b.reviewDate}</span>}
                      </p>
                    )}
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             <div className="flex justify-between items-center border-b border-[#D4C3A3]/20 pb-4">
                <h2 className="font-heading text-2xl font-bold uppercase">Penjadwalan Tim</h2>
                <button onClick={() => setIsAddTeamModalOpen(true)} className="bg-[#C5A059] text-white px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest">+ Anggota Baru</button>
             </div>

             <div className="grid gap-6">
                {bookings.map(b => {
                  const assignment = assignments.find(a => a.bookingId === b.id);
                  const assignedNames = Array.isArray(assignment?.teamNames) ? assignment.teamNames : [];
                  const isLocked = assignment?.isLocked;

                  return (
                    <div key={b.id} className={`overflow-hidden rounded-[2rem] border bg-white shadow-sm transition-all ${
                      isLocked ? "border-emerald-300/70" : "border-[#D4C3A3]/50"
                    }`}>
                      <div className={`px-6 py-5 border-b ${isLocked ? "bg-emerald-50 border-emerald-100" : "bg-[#FDFBF0] border-[#D4C3A3]/30"}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#C5A059]">Acara {b.date}</p>
                            <h3 className="mt-1 font-heading text-xl font-bold text-[#2A1E17]">{b.clientName}</h3>
                            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#8E7F75]">{b.package}</p>
                          </div>
                          <div className={`inline-flex self-start items-center gap-2 rounded-full px-4 py-2 text-[9px] font-bold uppercase tracking-widest ${
                            isLocked
                              ? "bg-emerald-600 text-white"
                              : assignedNames.length > 0
                                ? "bg-[#C5A059] text-white"
                                : "bg-white text-[#8E7F75] border border-[#D4C3A3]"
                          }`}>
                            {isLocked ? <Star size={12} /> : <Calendar size={12} />}
                            {assignedNames.length > 0 ? `${assignedNames.length} tim bertugas` : "Belum ditugaskan"}
                          </div>
                        </div>

                        {assignedNames.length > 0 && (
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="mr-1 text-[9px] font-bold uppercase tracking-widest text-[#8E7F75]">Tim aktif</span>
                            {assignedNames.map(name => (
                              <span key={name} className="inline-flex items-center gap-2 rounded-full bg-[#2A1E17] px-3 py-2 text-[10px] font-bold text-white">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C5A059] text-[9px]">
                                  {name.charAt(0).toUpperCase()}
                                </span>
                                {name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#2A1E17]">Pilih tim bertugas</label>
                            <p className="mt-1 text-[9px] text-[#8E7F75]">
                              {assignedNames.length > 0
                                ? `${assignedNames.length} anggota dipilih`
                                : "Belum ada anggota dipilih"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!isLocked && assignedNames.length > 0 && (
                              <button
                                onClick={() => clearAssignment(b.id)}
                                className="rounded-xl border border-red-200 bg-white px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50"
                              >
                                Hapus pilihan
                              </button>
                            )}
                            <button
                              onClick={() => lockAssignment(b.id)}
                              className={`rounded-xl px-3 py-2 text-[9px] font-bold uppercase tracking-widest transition-all ${
                                isLocked
                                  ? "border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50"
                                  : "border border-[#C5A059] bg-[#C5A059] text-white hover:bg-[#8C6239]"
                              }`}
                            >
                              {isLocked ? "Edit tugas" : "Simpan tugas"}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {teams.map(t => {
                            const isAssigned = assignedNames.includes(t);

                            return (
                              <button
                                key={t}
                                disabled={isLocked}
                                onClick={() => toggleAssignment(b.id, t)}
                                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                                  isAssigned
                                    ? "border-[#2A1E17] bg-[#2A1E17] text-white shadow-lg shadow-[#2A1E17]/10"
                                    : "border-[#D4C3A3]/60 bg-white text-[#8E7F75] hover:border-[#C5A059] hover:text-[#2A1E17]"
                                } ${isLocked ? "cursor-not-allowed" : ""}`}
                              >
                                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                  isAssigned ? "bg-[#C5A059] text-white" : "bg-[#FDFBF0] text-[#C5A059]"
                                }`}>
                                  {t.charAt(0).toUpperCase()}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-xs font-bold">{t}</span>
                                  <span className={`mt-0.5 block text-[8px] font-bold uppercase tracking-widest ${
                                    isAssigned ? "text-white/60" : "text-[#8E7F75]"
                                  }`}>
                                    {isAssigned ? "Ditugaskan" : "Tersedia"}
                                  </span>
                                </span>
                                <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                  isAssigned ? "border-white bg-white text-[#2A1E17]" : "border-[#D4C3A3]"
                                }`}>
                                  {isAssigned && <span className="text-xs font-bold">✓</span>}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

             <div className="border-t border-[#D4C3A3]/20 pt-6 mt-8">
               <h3 className="font-heading text-xl font-bold uppercase mb-4">List Anggota Tim</h3>
               <div className="grid gap-3">
                  {teams.map((t, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#D4C3A3]/30">
                       <span className="font-bold text-sm">{t}</span>
                       <button onClick={() => removeTeam(t)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  ))}
               </div>
             </div>
          </div>
        )}

        {activeTab === "finance" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             {(() => {
               const income = transactions.filter(t => t.type === "in").reduce((sum, t) => sum + t.amount, 0);
               const expense = transactions.filter(t => t.type === "out").reduce((sum, t) => sum + t.amount, 0);
               const balance = income - expense;

               return (
                 <>
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#D4C3A3]/20 pb-4">
                     <div>
                       <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight">Keuangan</h2>
                       <p className="text-[10px] text-[#8E7F75] font-bold uppercase tracking-widest mt-1">Ringkasan arus kas bisnis</p>
                     </div>
                     <button
                       onClick={() => setIsAddFinanceModalOpen(true)}
                       className="flex items-center gap-2 rounded-2xl bg-[#C5A059] px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl shadow-[#C5A059]/20"
                     >
                       <Plus size={16} /> Catat Transaksi
                     </button>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="relative overflow-hidden rounded-[2rem] bg-[#2A1E17] p-6 text-white shadow-lg">
                       <div className="absolute -right-8 -bottom-10 h-28 w-28 rounded-full border-[16px] border-white/5" />
                       <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/60">Saldo Kas</p>
                       <p className="mt-3 font-heading text-2xl sm:text-3xl font-bold">Rp {balance.toLocaleString("id-ID")}</p>
                       <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-[#E5D5B0]">
                         {balance >= 0 ? "Saldo tersedia" : "Kas defisit"}
                       </p>
                     </div>

                     <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6">
                       <div className="flex items-center justify-between">
                         <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-emerald-700">Pemasukan</p>
                         <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">↑</span>
                       </div>
                       <p className="mt-4 text-xl font-bold text-emerald-700">Rp {income.toLocaleString("id-ID")}</p>
                       <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-emerald-700/60">
                         {transactions.filter(t => t.type === "in").length} transaksi
                       </p>
                     </div>

                     <div className="rounded-[2rem] border border-red-100 bg-red-50 p-6">
                       <div className="flex items-center justify-between">
                         <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-red-700">Pengeluaran</p>
                         <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">↓</span>
                       </div>
                       <p className="mt-4 text-xl font-bold text-red-600">Rp {expense.toLocaleString("id-ID")}</p>
                       <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-red-700/60">
                         {transactions.filter(t => t.type === "out").length} transaksi
                       </p>
                     </div>
                   </div>

                   <div className="overflow-hidden rounded-[2rem] border border-[#D4C3A3]/30 bg-white shadow-sm">
                     <div className="flex items-center justify-between border-b border-[#FDFBF0] px-6 py-5">
                       <div>
                         <h3 className="font-heading text-lg font-bold uppercase">Riwayat Transaksi</h3>
                         <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#8E7F75]">
                           {transactions.length} pencatatan
                         </p>
                       </div>
                     </div>

                     {transactions.length === 0 ? (
                       <div className="px-6 py-14 text-center">
                         <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FDFBF0] text-[#C5A059]">
                           <DollarSign size={24} />
                         </div>
                         <p className="mt-4 text-sm font-bold">Belum ada transaksi</p>
                         <p className="mt-1 text-[10px] text-[#8E7F75]">Catat pemasukan atau pengeluaran pertama Anda.</p>
                       </div>
                     ) : (
                       <div className="divide-y divide-[#FDFBF0]">
                         {[...transactions].reverse().map(t => (
                           <div key={t.id} className="flex items-center gap-4 px-5 py-5 sm:px-6">
                             <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                               t.type === "in" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                             }`}>
                               {t.type === "in" ? "↑" : "↓"}
                             </div>
                             <div className="min-w-0 flex-1">
                               <p className="truncate text-sm font-bold text-[#2A1E17]">{t.description}</p>
                               <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#8E7F75]">
                                 {t.type === "in" ? "Pemasukan" : "Pengeluaran"} · {t.date}
                               </p>
                             </div>
                             <div className="text-right">
                               <p className={`text-sm sm:text-base font-bold ${t.type === "in" ? "text-emerald-600" : "text-red-500"}`}>
                                 {t.type === "in" ? "+" : "-"} Rp {t.amount.toLocaleString("id-ID")}
                               </p>
                               <button
                                 onClick={() => deleteTransaction(t.id)}
                                 className="mt-1 inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-[#8E7F75] hover:text-red-500"
                               >
                                 <Trash2 size={11} /> Hapus
                               </button>
                             </div>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 </>
               );
             })()}
          </div>
        )}
      </main>

      {/* MODAL BOOKING */}
      {isAddBookingModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 space-y-6">
              <h2 className="font-heading text-lg font-bold uppercase">{editingBooking ? "Edit Klien" : "Tambah Klien"}</h2>
              <p className="text-[10px] text-[#8E7F75] font-bold uppercase tracking-widest -mt-4">Isi detail data klien di bawah</p>
              <form onSubmit={handleAddBooking} className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#8E7F75] ml-1">Nama Klien</label>
                    <input required placeholder="Nama Klien" className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3] rounded-xl px-4 text-xs" value={newBooking.name} onChange={e => setNewBooking({...newBooking, name: e.target.value})}/>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#8E7F75] ml-1">Nomor WhatsApp</label>
                    <input required placeholder="Nomor WhatsApp" className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3] rounded-xl px-4 text-xs" value={newBooking.phone} onChange={e => setNewBooking({...newBooking, phone: e.target.value})}/>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#8E7F75] ml-1">Tanggal Acara</label>
                    <input required type="date" className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3] rounded-xl px-3 text-xs" value={newBooking.date} onChange={e => setNewBooking({...newBooking, date: e.target.value})}/>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#8E7F75] ml-1">Paket Layanan</label>
                    <select required className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3] rounded-xl px-4 text-xs" value={newBooking.package} onChange={e => setNewBooking({...newBooking, package: e.target.value})}>
                       {PACKAGES.map(p => <option key={p.name} value={p.name}>{p.name} (Rp {p.price.toLocaleString()})</option>)}
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#8E7F75] ml-1">Sisa Tagihan (Rp)</label>
                    <input required type="number" placeholder="Sisa Tagihan (Rp)" className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3] rounded-xl px-4 text-xs" value={newBooking.bill} onChange={e => setNewBooking({...newBooking, bill: e.target.value})}/>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#8E7F75] ml-1">Link Google Drive (Opsional)</label>
                    <input type="url" placeholder="https://drive.google.com/..." className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3] rounded-xl px-4 text-xs" value={newBooking.driveUrl} onChange={e => setNewBooking({...newBooking, driveUrl: e.target.value})}/>
                 </div>
                 <div className="flex gap-3">
                    <button type="button" onClick={() => { setIsAddBookingModalOpen(false); setEditingBooking(null); }} className="w-1/3 h-14 border border-[#D4C3A3] rounded-2xl text-[10px] font-bold uppercase">Batal</button>
                    <button type="submit" className="w-2/3 h-14 bg-[#2A1E17] text-white rounded-2xl text-[10px] font-bold uppercase">Simpan</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* MODAL TEAM */}
      {isAddTeamModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 space-y-6">
              <h2 className="font-heading text-lg font-bold uppercase">Tambah Anggota Tim</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const addTeam = async () => {
                  try {
                    const created = await apiRequest<{name: string}>("/api/team", {
                      method: "POST",
                      body: JSON.stringify({ name: newTeam.trim() }),
                    });
                    setTeams(previous => [...previous, created.name]);
                    setDataError("");
                    setIsAddTeamModalOpen(false);
                    setNewTeam("");
                  } catch (error) {
                    setDataError(error instanceof Error ? error.message : "Gagal menambahkan anggota tim.");
                  }
                };
                void addTeam();
              }} className="space-y-4">
                 <input required placeholder="Nama Anggota" className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3] rounded-xl px-4 text-xs" value={newTeam} onChange={e => setNewTeam(e.target.value)}/>
                 <div className="flex gap-3">
                    <button type="button" onClick={() => setIsAddTeamModalOpen(false)} className="w-1/3 h-14 border border-[#D4C3A3] rounded-2xl text-[10px] font-bold uppercase">Batal</button>
                    <button type="submit" className="w-2/3 h-14 bg-[#2A1E17] text-white rounded-2xl text-[10px] font-bold uppercase">Simpan</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* MODAL FINANCE */}
      {isAddFinanceModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-in fade-in duration-300">
           <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-[2.5rem] border border-[#D4C3A3] bg-white p-6 shadow-2xl sm:rounded-[2.5rem] sm:p-10 space-y-6">
              <div className="flex items-center justify-between border-b border-[#FDFBF0] pb-4">
                 <div>
                   <h2 className="font-heading text-xl font-bold uppercase tracking-tight text-[#2A1E17]">Catat Transaksi</h2>
                   <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#8E7F75]">Tambahkan ke riwayat keuangan</p>
                 </div>
                 <button onClick={() => setIsAddFinanceModalOpen(false)} className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-all"><X size={18} /></button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const addTransaction = async () => {
                  try {
                    const created = await apiRequest<Transaction>("/api/transactions", {
                      method: "POST",
                      body: JSON.stringify({
                        amount: parseInt(newTransaction.amount, 10),
                        description: newTransaction.description,
                        type: newTransaction.type,
                      }),
                    });
                    setTransactions(previous => [created, ...previous]);
                    setDataError("");
                    setIsAddFinanceModalOpen(false);
                    setNewTransaction({ amount: "", description: "", type: "in" });
                  } catch (error) {
                    setDataError(error instanceof Error ? error.message : "Gagal menyimpan transaksi.");
                  }
                };
                void addTransaction();
              }} className="space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#8E7F75] ml-1">Jenis Transaksi</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setNewTransaction({...newTransaction, type: "in"})}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          newTransaction.type === "in"
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-[#D4C3A3]/60 bg-white text-[#8E7F75]"
                        }`}
                      >
                        <span className="block text-lg font-bold">↑</span>
                        <span className="mt-1 block text-[9px] font-bold uppercase tracking-widest">Pemasukan</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewTransaction({...newTransaction, type: "out"})}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          newTransaction.type === "out"
                            ? "border-red-500 bg-red-50 text-red-600"
                            : "border-[#D4C3A3]/60 bg-white text-[#8E7F75]"
                        }`}
                      >
                        <span className="block text-lg font-bold">↓</span>
                        <span className="mt-1 block text-[9px] font-bold uppercase tracking-widest">Pengeluaran</span>
                      </button>
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#8E7F75] ml-1">Keterangan Transaksi</label>
                    <input required placeholder="Contoh: DP Pelanggan / Beli Alat" className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3] rounded-xl px-4 text-xs font-medium outline-none focus:border-[#C5A059]" value={newTransaction.description} onChange={e => setNewTransaction({...newTransaction, description: e.target.value})}/>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#8E7F75] ml-1">Nominal (Rp)</label>
                    <input required type="number" placeholder="500000" className="w-full h-12 bg-[#FDFBF0] border border-[#D4C3A3] rounded-xl px-4 text-xs font-medium outline-none focus:border-[#C5A059]" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})}/>
                 </div>

                 <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setIsAddFinanceModalOpen(false)} className="w-1/3 h-14 bg-[#FDFBF0] border border-[#D4C3A3] text-[#2A1E17] rounded-2xl font-bold uppercase tracking-widest text-[10px]">Batal</button>
                    <button type="submit" className="w-2/3 h-14 bg-[#2A1E17] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all">Simpan</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
