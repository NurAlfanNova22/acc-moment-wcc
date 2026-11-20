import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, getAdminCredentials, verifyAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

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
    .select("name")
    .order("name");

  if (error) {
    console.error("Failed to fetch team members:", error);
    return NextResponse.json({ error: "Gagal memuat anggota tim." }, { status: 500 });
  }

  return NextResponse.json(data.map(member => member.name));
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

  if (typeof body !== "object" || body === null || !("name" in body) || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Nama anggota tim wajib diisi." }, { status: 400 });
  }

  const name = body.name.trim();
  const { data, error } = await getSupabaseAdmin()
    .from("team_members")
    .insert({ name })
    .select("name")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Nama anggota tim sudah digunakan." }, { status: 409 });
    }
    console.error("Failed to add team member:", error);
    return NextResponse.json({ error: "Gagal menambahkan anggota tim." }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
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
