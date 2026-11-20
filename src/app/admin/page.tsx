"use client";

import { useState, useEffect, type FormEvent } from "react";
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
  LogOut,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Pencil
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

type TeamMember = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  role: string | null;
  photoUrl: string | null;
  notes: string | null;
  createdAt: string;
};

type TeamProfileForm = {
  phone: string;
  email: string;
  role: string;
  photoUrl: string;
  notes: string;
};

type TeamProfilePayload = {
  [Field in keyof TeamProfileForm]: string | null;
};

const EMPTY_TEAM_PROFILE: TeamProfileForm = {
  phone: "",
  email: "",
  role: "",
  photoUrl: "",
  notes: "",
};

async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body && !isFormData ? { "Content-Type": "application/json" } : {}),
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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [assignments, setAssignments] = useState<{bookingId: string, teamNames: string[], isLocked: boolean}[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dataError, setDataError] = useState("");
  const [calendarMonth, setCalendarMonth] = useState("");
  const [selectedScheduleDate, setSelectedScheduleDate] = useState<string | null>(null);

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
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);
  const [isAddFinanceModalOpen, setIsAddFinanceModalOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [newTeamName, setNewTeamName] = useState("");
  const [teamProfileForm, setTeamProfileForm] = useState<TeamProfileForm>(EMPTY_TEAM_PROFILE);
  const [teamPhotoFile, setTeamPhotoFile] = useState<File | null>(null);
  const [teamPhotoPreview, setTeamPhotoPreview] = useState<string | null>(null);
  const [teamPhotoError, setTeamPhotoError] = useState("");
  const [isSavingTeamProfile, setIsSavingTeamProfile] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ amount: "", description: "", type: "in" as 'in' | 'out' });
  const [newBooking, setNewBooking] = useState({ name: "", phone: "", date: "", package: "Wedding 2 (Standard)", bill: "350000", driveUrl: "" });

  useEffect(() => {
    return () => {
      if (teamPhotoPreview?.startsWith("blob:")) URL.revokeObjectURL(teamPhotoPreview);
    };
  }, [teamPhotoPreview]);

  useEffect(() => {
    let active = true;
    const loadAdminData = async () => {
      try {
        const [loadedBookings, loadedTeams, loadedTransactions] = await Promise.all([
          apiRequest<Booking[]>("/api/bookings"),
          apiRequest<TeamMember[]>("/api/team"),
          apiRequest<Transaction[]>("/api/transactions"),
        ]);
        if (!active) return;
        const today = new Date();
        setCalendarMonth(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);
        setBookings(loadedBookings);
        setAssignments(loadedBookings.map(b => ({
          bookingId: b.id,
          teamNames: Array.isArray(b.assignedTeam) ? b.assignedTeam : [],
          isLocked: Boolean(b.teamLocked),
        })));
        setTeamMembers(loadedTeams);
        setTeams(loadedTeams.map(member => member.name));
        setTransactions(loadedTransactions);
      } catch (error) {
        if (active) {
          const today = new Date();
          setCalendarMonth(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);
          setDataError(error instanceof Error ? error.message : "Gagal memuat data admin.");
        }
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
      setTeamMembers(previous => previous.filter(member => member.name !== teamName));
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

  const saveTeamProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingTeamProfile(true);
    const profile: TeamProfilePayload = {
      phone: teamProfileForm.phone.trim() || null,
      email: teamProfileForm.email.trim() || null,
      role: teamProfileForm.role.trim() || null,
      photoUrl: teamProfileForm.photoUrl.trim() || null,
      notes: teamProfileForm.notes.trim() || null,
    };

    try {
      if (teamPhotoFile) {
        const formData = new FormData();
        formData.append("photo", teamPhotoFile);
        const uploaded = await apiRequest<{ photoUrl: string }>("/api/team/photo", {
          method: "POST",
          body: formData,
        });
        profile.photoUrl = uploaded.photoUrl;
        setTeamProfileForm(previous => ({ ...previous, photoUrl: uploaded.photoUrl }));
        setTeamPhotoFile(null);
        setTeamPhotoPreview(uploaded.photoUrl);
      }

      if (editingTeam) {
        const updated = await apiRequest<TeamMember>("/api/team", {
          method: "PATCH",
          body: JSON.stringify({ id: editingTeam.id, ...profile }),
        });
        setTeamMembers(previous => previous.map(member => member.id === updated.id ? updated : member));
      } else {
        const created = await apiRequest<TeamMember>("/api/team", {
          method: "POST",
          body: JSON.stringify({ name: newTeamName.trim(), ...profile }),
        });
        setTeamMembers(previous => [...previous, created]);
        setTeams(previous => [...previous, created.name]);
      }

      setDataError("");
      setIsAddTeamModalOpen(false);
      setEditingTeam(null);
      setNewTeamName("");
      setTeamProfileForm(EMPTY_TEAM_PROFILE);
      setTeamPhotoFile(null);
      setTeamPhotoPreview(null);
      setTeamPhotoError("");
    } catch (error) {
      setDataError(error instanceof Error ? error.message : "Gagal menyimpan profil anggota tim.");
    } finally {
      setIsSavingTeamProfile(false);
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
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) {
        setAuthError("Gagal keluar. Silakan coba lagi.");
        return;
      }

      setIsLogoutConfirmOpen(false);
      router.replace("/admin-login");
      router.refresh();
    } catch {
      setAuthError("Tidak dapat menghubungi server untuk keluar.");
    } finally {
      setIsLoggingOut(false);
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

  const moveCalendarMonth = (amount: number) => {
    if (!calendarMonth) return;
    const [year, month] = calendarMonth.split("-").map(Number);
    const nextMonth = new Date(year, month - 1 + amount, 1);
    setCalendarMonth(`${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}`);
    setSelectedScheduleDate(null);
  };

  const calendarCells: (number | null)[] = [];
  if (calendarMonth) {
    const [year, month] = calendarMonth.split("-").map(Number);
    const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month, 0).getDate();
    calendarCells.push(...Array.from({ length: firstWeekday }, () => null));
    calendarCells.push(...Array.from({ length: daysInMonth }, (_, index) => index + 1));
  }
  const visibleTeamBookings = selectedScheduleDate
    ? bookings.filter(booking => booking.date === selectedScheduleDate)
    : bookings;

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
            <button onClick={() => setIsLogoutConfirmOpen(true)} className="flex items-center gap-2 rounded-xl border border-[#D4C3A3]/60 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-[#8E7F75] hover:border-red-200 hover:text-red-500">
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
      </div>

      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
        <div className="flex justify-end sm:hidden">
          <button
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#D4C3A3]/60 bg-white px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest text-[#8E7F75] transition hover:border-red-200 hover:text-red-500"
          >
            <LogOut size={14} /> Keluar Admin
          </button>
        </div>
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
                <button
                  onClick={() => {
                    setEditingTeam(null);
                    setNewTeamName("");
                    setTeamProfileForm(EMPTY_TEAM_PROFILE);
                    setTeamPhotoFile(null);
                    setTeamPhotoPreview(null);
                    setTeamPhotoError("");
                    setIsAddTeamModalOpen(true);
                  }}
                  className="bg-[#C5A059] text-white px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest"
                >
                  + Anggota Baru
                </button>
             </div>

             <section className="overflow-hidden rounded-[2rem] border border-[#D4C3A3]/40 bg-white p-4 shadow-sm sm:p-6">
               <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                 <div>
                   <h3 className="font-heading text-lg font-bold capitalize">
                     {calendarMonth
                       ? new Date(
                           Number(calendarMonth.slice(0, 4)),
                           Number(calendarMonth.slice(5, 7)) - 1,
                           1,
                         ).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
                       : "Kalender acara"}
                   </h3>
                   <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#8E7F75]">
                     Pilih tanggal untuk melihat penugasan
                   </p>
                 </div>
                 <div className="flex items-center gap-2">
                   <button
                     onClick={() => {
                       const today = new Date();
                       setCalendarMonth(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);
                       setSelectedScheduleDate(
                         `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
                       );
                     }}
                     className="rounded-xl border border-[#D4C3A3]/60 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-[#8E7F75] hover:border-[#C5A059] hover:text-[#2A1E17]"
                   >
                     Hari ini
                   </button>
                   <button
                     aria-label="Bulan sebelumnya"
                     onClick={() => moveCalendarMonth(-1)}
                     className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D4C3A3]/60 text-[#8E7F75] hover:border-[#C5A059] hover:text-[#2A1E17]"
                   >
                     <ChevronLeft size={16} />
                   </button>
                   <button
                     aria-label="Bulan berikutnya"
                     onClick={() => moveCalendarMonth(1)}
                     className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D4C3A3]/60 text-[#8E7F75] hover:border-[#C5A059] hover:text-[#2A1E17]"
                   >
                     <ChevronRight size={16} />
                   </button>
                 </div>
               </div>

               <div className="grid grid-cols-7 border-b border-[#F1EBDD] pb-2 text-center">
                 {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(day => (
                   <span key={day} className="text-[8px] font-bold uppercase tracking-widest text-[#8E7F75] sm:text-[9px]">
                     {day}
                   </span>
                 ))}
               </div>

               <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
                 {calendarCells.map((day, index) => {
                   if (day === null) {
                     return <div key={`empty-${index}`} className="min-h-16 rounded-xl sm:min-h-24" />;
                   }

                   const dateKey = `${calendarMonth}-${String(day).padStart(2, "0")}`;
                   const dayBookings = bookings.filter(booking => booking.date === dateKey);
                   const isSelected = selectedScheduleDate === dateKey;
                   const hasEvents = dayBookings.length > 0;

                   return (
                     <button
                       key={dateKey}
                       aria-label={`${day} ${dayBookings.length} acara`}
                       aria-pressed={isSelected}
                       onClick={() => setSelectedScheduleDate(isSelected ? null : dateKey)}
                       className={`min-h-16 rounded-xl border p-1.5 text-left transition-colors sm:min-h-24 sm:p-2 ${
                         isSelected
                           ? "border-[#2A1E17] bg-[#2A1E17] text-white"
                           : hasEvents
                             ? "border-[#E5D5B0] bg-[#FDFBF0] text-[#2A1E17] hover:border-[#C5A059]"
                             : "border-transparent bg-white text-[#8E7F75] hover:border-[#D4C3A3]/60 hover:bg-[#FDFBF0]"
                       }`}
                     >
                       <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold sm:h-7 sm:w-7 ${
                         isSelected ? "bg-[#C5A059] text-white" : hasEvents ? "text-[#8C6239]" : ""
                       }`}>
                         {day}
                       </span>
                       {hasEvents && (
                         <span className={`mt-1 block truncate text-[7px] font-bold leading-tight sm:text-[9px] ${
                           isSelected ? "text-white/80" : "text-[#8C6239]"
                         }`}>
                           {dayBookings.length > 1 ? `${dayBookings.length} acara` : dayBookings[0].clientName}
                         </span>
                       )}
                     </button>
                   );
                 })}
               </div>
             </section>

             <div className="flex flex-wrap items-center justify-between gap-3">
               <h3 className="font-heading text-lg font-bold">
                 {selectedScheduleDate
                   ? `Jadwal ${new Date(`${selectedScheduleDate}T00:00:00`).toLocaleDateString("id-ID", {
                       day: "numeric",
                       month: "long",
                       year: "numeric",
                     })}`
                   : "Semua jadwal"}
               </h3>
               {selectedScheduleDate && (
                 <button
                   onClick={() => setSelectedScheduleDate(null)}
                   className="text-[9px] font-bold uppercase tracking-widest text-[#C5A059] hover:text-[#8C6239]"
                 >
                   Lihat semua tanggal
                 </button>
               )}
             </div>

             <div className="grid gap-6">
                {visibleTeamBookings.length === 0 && (
                  <div className="rounded-[2rem] border border-dashed border-[#D4C3A3] bg-white px-6 py-10 text-center">
                    <Calendar size={24} className="mx-auto text-[#C5A059]" />
                    <p className="mt-3 text-sm font-bold">
                      {selectedScheduleDate ? "Tidak ada acara pada tanggal ini" : "Belum ada jadwal acara"}
                    </p>
                    <p className="mt-1 text-[10px] text-[#8E7F75]">
                      {selectedScheduleDate ? "Pilih tanggal lain di kalender atau lihat semua jadwal." : "Booking baru akan muncul di kalender setelah disimpan."}
                    </p>
                  </div>
                )}
                {visibleTeamBookings.map(b => {
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
                            const member = teamMembers.find(teamMember => teamMember.name === t);

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
                                {member?.photoUrl ? (
                                  <Image
                                    src={member.photoUrl}
                                    alt=""
                                    width={40}
                                    height={40}
                                    unoptimized
                                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                                  />
                                ) : (
                                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                    isAssigned ? "bg-[#C5A059] text-white" : "bg-[#FDFBF0] text-[#C5A059]"
                                  }`}>
                                    {t.charAt(0).toUpperCase()}
                                  </span>
                                )}
                                <span className="min-w-0 flex-1">
                                  <span className="block text-xs font-bold">{t}</span>
                                  <span className={`mt-0.5 block text-[8px] font-bold uppercase tracking-widest ${
                                    isAssigned ? "text-white/60" : "text-[#8E7F75]"
                                  }`}>
                                    {member?.role
                                      ? `${member.role} · ${isAssigned ? "Ditugaskan" : "Tersedia"}`
                                      : isAssigned ? "Ditugaskan" : "Tersedia"}
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
               <div className="grid gap-3 sm:grid-cols-2">
                  {teamMembers.map(member => (
                    <article key={member.id} className="rounded-2xl border border-[#D4C3A3]/30 bg-white p-4">
                      <div className="flex items-start gap-3">
                        {member.photoUrl ? (
                          <Image
                            src={member.photoUrl}
                            alt={`Foto ${member.name}`}
                            width={56}
                            height={56}
                            unoptimized
                            className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FDFBF0] text-lg font-bold text-[#C5A059]">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sm text-[#2A1E17]">{member.name}</h4>
                          <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#8C6239]">
                            {member.role || "Peran belum diisi"}
                          </p>
                          {member.phone && (
                            <a
                              href={`https://wa.me/${member.phone.replace(/\D/g, "").replace(/^0/, "62")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 flex items-center gap-2 text-xs text-[#2A1E17] hover:text-[#C5A059]"
                            >
                              <Phone size={13} /> {member.phone}
                            </a>
                          )}
                          {member.email && (
                            <a href={`mailto:${member.email}`} className="mt-2 flex items-center gap-2 break-all text-xs text-[#8E7F75] hover:text-[#C5A059]">
                              <Mail size={13} /> {member.email}
                            </a>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button
                            aria-label={`Edit profil ${member.name}`}
                            onClick={() => {
                              setEditingTeam(member);
                              setNewTeamName(member.name);
                              setTeamProfileForm({
                                phone: member.phone || "",
                                email: member.email || "",
                                role: member.role || "",
                                photoUrl: member.photoUrl || "",
                                notes: member.notes || "",
                              });
                              setTeamPhotoFile(null);
                              setTeamPhotoPreview(member.photoUrl);
                              setTeamPhotoError("");
                              setIsAddTeamModalOpen(true);
                            }}
                            className="rounded-lg p-2 text-[#8E7F75] hover:bg-[#FDFBF0] hover:text-[#2A1E17]"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            aria-label={`Hapus ${member.name}`}
                            onClick={() => removeTeam(member.name)}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                      {member.notes && (
                        <p className="mt-3 border-t border-[#D4C3A3]/20 pt-3 text-xs leading-relaxed text-[#8E7F75]">
                          {member.notes}
                        </p>
                      )}
                    </article>
                  ))}
                  {teamMembers.length === 0 && (
                    <p className="rounded-xl border border-dashed border-[#D4C3A3] p-5 text-center text-xs text-[#8E7F75] sm:col-span-2">
                      Belum ada anggota tim.
                    </p>
                  )}
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
           <div className="max-h-[92vh] w-full max-w-lg space-y-5 overflow-y-auto rounded-[2rem] bg-white p-6 sm:p-8">
              <div>
                <h2 className="font-heading text-lg font-bold uppercase">
                  {editingTeam ? "Edit Profil Anggota" : "Tambah Anggota Tim"}
                </h2>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#8E7F75]">
                  Informasi ini membantu admin mengenali dan menghubungi tim
                </p>
              </div>
              <form onSubmit={saveTeamProfile} className="space-y-3">
                 <label className="block space-y-1">
                   <span className="ml-1 text-[9px] font-bold uppercase tracking-widest text-[#8E7F75]">Nama anggota</span>
                   <input
                     required
                     placeholder="Nama Anggota"
                     disabled={Boolean(editingTeam)}
                     className="h-12 w-full rounded-xl border border-[#D4C3A3] bg-[#FDFBF0] px-4 text-xs disabled:opacity-70"
                     value={newTeamName}
                     onChange={e => setNewTeamName(e.target.value)}
                   />
                 </label>
                 <label className="block space-y-1">
                   <span className="ml-1 text-[9px] font-bold uppercase tracking-widest text-[#8E7F75]">Nomor WhatsApp</span>
                   <input
                     type="tel"
                     placeholder="Contoh: 081234567890"
                     className="h-12 w-full rounded-xl border border-[#D4C3A3] bg-[#FDFBF0] px-4 text-xs"
                     value={teamProfileForm.phone}
                     onChange={e => setTeamProfileForm(previous => ({ ...previous, phone: e.target.value }))}
                   />
                 </label>
                 <label className="block space-y-1">
                   <span className="ml-1 text-[9px] font-bold uppercase tracking-widest text-[#8E7F75]">Email (opsional)</span>
                   <input
                     type="email"
                     placeholder="nama@email.com"
                     className="h-12 w-full rounded-xl border border-[#D4C3A3] bg-[#FDFBF0] px-4 text-xs"
                     value={teamProfileForm.email}
                     onChange={e => setTeamProfileForm(previous => ({ ...previous, email: e.target.value }))}
                   />
                 </label>
                 <label className="block space-y-1">
                   <span className="ml-1 text-[9px] font-bold uppercase tracking-widest text-[#8E7F75]">Peran / keahlian</span>
                   <input
                     placeholder="Contoh: Fotografer, Videografer, MUA"
                     className="h-12 w-full rounded-xl border border-[#D4C3A3] bg-[#FDFBF0] px-4 text-xs"
                     value={teamProfileForm.role}
                     onChange={e => setTeamProfileForm(previous => ({ ...previous, role: e.target.value }))}
                   />
                 </label>
                 <div className="space-y-2">
                   <label className="ml-1 block text-[9px] font-bold uppercase tracking-widest text-[#8E7F75]">
                     Foto profil (opsional)
                   </label>
                   <div className="flex items-center gap-4 rounded-xl border border-[#D4C3A3] bg-[#FDFBF0] p-3">
                     {teamPhotoPreview ? (
                       <Image
                         src={teamPhotoPreview}
                         alt="Pratinjau foto profil"
                         width={64}
                         height={64}
                         unoptimized
                         className="h-16 w-16 shrink-0 rounded-xl object-cover"
                       />
                     ) : (
                       <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white text-[#C5A059]">
                         <Pencil size={20} />
                       </div>
                     )}
                     <div className="min-w-0 flex-1">
                       <input
                         type="file"
                         accept="image/jpeg,image/png,image/webp,image/avif"
                         className="block w-full text-[10px] text-[#8E7F75] file:mr-2 file:rounded-lg file:border-0 file:bg-[#2A1E17] file:px-3 file:py-2 file:text-[9px] file:font-bold file:uppercase file:text-white"
                         onChange={event => {
                           const file = event.target.files?.[0];
                           if (!file) return;
                           if (file.size > 5 * 1024 * 1024) {
                             setTeamPhotoError("Ukuran foto maksimal 5 MB.");
                             event.target.value = "";
                             return;
                           }
                           if (file.type && !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
                             setTeamPhotoError("Pilih foto berformat JPG, PNG, WebP, atau AVIF.");
                             event.target.value = "";
                             return;
                           }
                           setTeamPhotoFile(file);
                           setTeamPhotoPreview(URL.createObjectURL(file));
                           setTeamPhotoError("");
                         }}
                       />
                       <p className="mt-2 text-[9px] text-[#8E7F75]">JPG, PNG, WebP, atau AVIF. Maksimal 5 MB.</p>
                     </div>
                     {(teamPhotoPreview || teamProfileForm.photoUrl) && (
                       <button
                         type="button"
                         onClick={() => {
                           setTeamPhotoFile(null);
                           setTeamPhotoPreview(null);
                           setTeamProfileForm(previous => ({ ...previous, photoUrl: "" }));
                           setTeamPhotoError("");
                         }}
                         className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50"
                         aria-label="Hapus foto profil"
                       >
                         <Trash2 size={15} />
                       </button>
                     )}
                   </div>
                   {teamPhotoError && <p className="ml-1 text-[10px] font-medium text-red-600">{teamPhotoError}</p>}
                 </div>
                 <label className="block space-y-1">
                   <span className="ml-1 text-[9px] font-bold uppercase tracking-widest text-[#8E7F75]">Catatan (opsional)</span>
                   <textarea
                     rows={3}
                     placeholder="Contoh: domisili, ketersediaan, atau informasi kerja"
                     className="w-full rounded-xl border border-[#D4C3A3] bg-[#FDFBF0] px-4 py-3 text-xs"
                     value={teamProfileForm.notes}
                     onChange={e => setTeamProfileForm(previous => ({ ...previous, notes: e.target.value }))}
                   />
                 </label>
                 <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddTeamModalOpen(false);
                        setEditingTeam(null);
                        setTeamPhotoFile(null);
                        setTeamPhotoPreview(null);
                        setTeamPhotoError("");
                      }}
                      className="h-12 w-1/3 rounded-2xl border border-[#D4C3A3] text-[10px] font-bold uppercase"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingTeamProfile}
                      className="h-12 w-2/3 rounded-2xl bg-[#2A1E17] text-[10px] font-bold uppercase text-white disabled:opacity-60"
                    >
                      {isSavingTeamProfile ? "Mengunggah..." : "Simpan Profil"}
                    </button>
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

      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-logout-title"
            className="w-full max-w-sm rounded-[2rem] border border-[#D4C3A3]/40 bg-white p-7 shadow-2xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <LogOut size={20} />
            </div>
            <h2 id="admin-logout-title" className="font-heading text-xl font-bold text-[#2A1E17]">
              Keluar dari admin?
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#8E7F75]">
              Anda perlu login kembali untuk membuka dashboard admin.
            </p>
            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                disabled={isLoggingOut}
                className="h-12 flex-1 rounded-xl border border-[#D4C3A3] bg-white text-[10px] font-bold uppercase tracking-widest text-[#2A1E17]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="h-12 flex-1 rounded-xl bg-red-500 text-[10px] font-bold uppercase tracking-widest text-white disabled:opacity-60"
              >
                {isLoggingOut ? "Memproses..." : "Ya, Keluar"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
