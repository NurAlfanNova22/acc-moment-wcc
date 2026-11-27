import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, getAdminCredentials, verifyAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

type TeamProfileField = "phone" | "email" | "role" | "photo_url" | "notes";
type TeamProfileInputField = "phone" | "email" | "role" | "photoUrl" | "notes";
type TeamProfile = Partial<Record<TeamProfileField, string | null>>;

const TEAM_MEMBER_COLUMNS = "id,name,phone,email,role,photo_url,notes,created_at";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readOptionalText(value: unknown, maxLength: number): { valid: boolean; value: string | null } {
  if (value === undefined || value === null) return { valid: true, value: null };
  if (typeof value !== "string") return { valid: false, value: null };
  const text = value.trim();
  return text.length <= maxLength
    ? { valid: true, value: text || null }
    : { valid: false, value: null };
}

function isValidPhotoUrl(value: string | null): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function toTeamMember(row: {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  role: string | null;
  photo_url: string | null;
  notes: string | null;
  created_at: string;
}) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    role: row.role,
    photoUrl: row.photo_url,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

async function isAdminAuthenticated() {
  const credentials = getAdminCredentials();
  if (!credentials) return false;
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value, credentials.secret);
}

export async function GET() {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi di environment server." }, { status: 503 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("team_members")
    .select(TEAM_MEMBER_COLUMNS)
    .order("name");

  if (error) {
    console.error("Failed to fetch team members:", error);
    return NextResponse.json({ error: "Gagal memuat anggota tim." }, { status: 500 });
  }

  return NextResponse.json(data.map(toTeamMember));
}

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi di environment server." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data anggota tim tidak valid." }, { status: 400 });
  }

  if (!isRecord(body) || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Nama anggota tim wajib diisi." }, { status: 400 });
  }

  const phone = readOptionalText(body.phone, 40);
  const email = readOptionalText(body.email, 254);
  const role = readOptionalText(body.role, 100);
  const photoUrl = readOptionalText(body.photoUrl, 2048);
  const notes = readOptionalText(body.notes, 1000);
  if (![phone, email, role, photoUrl, notes].every(field => field.valid) || !isValidPhotoUrl(photoUrl.value)) {
    return NextResponse.json({ error: "Data profil tidak valid atau melebihi batas karakter." }, { status: 400 });
  }
  if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
  }

  const name = body.name.trim();
  const { data, error } = await getSupabaseAdmin()
    .from("team_members")
    .insert({
      name,
      phone: phone.value,
      email: email.value,
      role: role.value,
      photo_url: photoUrl.value,
      notes: notes.value,
    })
    .select(TEAM_MEMBER_COLUMNS)
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Nama anggota tim sudah digunakan." }, { status: 409 });
    }
    console.error("Failed to add team member:", error);
    return NextResponse.json({ error: "Gagal menambahkan anggota tim." }, { status: 500 });
  }

  return NextResponse.json(toTeamMember(data), { status: 201 });
}

export async function PATCH(request: Request) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi di environment server." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data profil tidak valid." }, { status: 400 });
  }
  if (!isRecord(body) || typeof body.id !== "string" || !body.id.trim()) {
    return NextResponse.json({ error: "ID anggota tim wajib diisi." }, { status: 400 });
  }

  const inputFields: Array<[TeamProfileInputField, TeamProfileField, number]> = [
    ["phone", "phone", 40],
    ["email", "email", 254],
    ["role", "role", 100],
    ["photoUrl", "photo_url", 2048],
    ["notes", "notes", 1000],
  ];
  const profile: TeamProfile = {};
  for (const [inputKey, column, maxLength] of inputFields) {
    if (!(inputKey in body)) continue;
    const field = readOptionalText(body[inputKey], maxLength);
    if (!field.valid) {
      return NextResponse.json({ error: "Data profil tidak valid atau melebihi batas karakter." }, { status: 400 });
    }
    profile[column] = field.value;
  }
  if (Object.keys(profile).length === 0) {
    return NextResponse.json({ error: "Tidak ada informasi profil untuk diperbarui." }, { status: 400 });
  }
  if (!isValidPhotoUrl(profile.photo_url ?? null)) {
    return NextResponse.json({ error: "URL foto harus menggunakan http atau https." }, { status: 400 });
  }
  if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("team_members")
    .update(profile)
    .eq("id", body.id.trim())
    .select(TEAM_MEMBER_COLUMNS)
    .maybeSingle();

  if (error) {
    console.error("Failed to update team member profile:", error);
    return NextResponse.json({ error: "Gagal memperbarui profil anggota tim." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Anggota tim tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json(toTeamMember(data));
}

export async function DELETE(request: Request) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi di environment server." }, { status: 503 });
  }

  const name = new URL(request.url).searchParams.get("name");
  if (!name) return NextResponse.json({ error: "Nama anggota tim wajib diisi." }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data: bookings, error: bookingsError } = await supabase.from("bookings").select("id, assigned_team");
  if (bookingsError) {
    console.error("Failed to load team assignments:", bookingsError);
    return NextResponse.json({ error: "Gagal memperbarui penugasan tim." }, { status: 500 });
  }

  for (const booking of bookings) {
    const assigned = Array.isArray(booking.assigned_team) ? booking.assigned_team : [];
    if (!assigned.includes(name)) continue;

    const { error } = await supabase
      .from("bookings")
      .update({ assigned_team: assigned.filter(member => member !== name), team_locked: false })
      .eq("id", booking.id);
    if (error) {
      console.error("Failed to remove member from booking assignment:", error);
      return NextResponse.json({ error: "Gagal menghapus anggota dari salah satu penugasan." }, { status: 500 });
    }
  }

  const { error } = await supabase.from("team_members").delete().eq("name", name);
  if (error) {
    console.error("Failed to delete team member:", error);
    return NextResponse.json({ error: "Gagal menghapus anggota tim." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
