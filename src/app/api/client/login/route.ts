import { NextResponse } from "next/server";
import {
  CLIENT_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  constantTimeEqual,
  createClientSession,
  getAdminCredentials,
} from "@/lib/admin-auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  const credentials = getAdminCredentials();
  if (!credentials) {
    return NextResponse.json({ error: "Portal klien belum dikonfigurasi di server." }, { status: 503 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi di environment server." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data login tidak valid." }, { status: 400 });
  }

  if (
    typeof body !== "object" || body === null ||
    !("code" in body) || typeof body.code !== "string" ||
    !("pin" in body) || typeof body.pin !== "string"
  ) {
    return NextResponse.json({ error: "Kode booking dan PIN wajib diisi." }, { status: 400 });
  }

  const { data: booking, error } = await getSupabaseAdmin()
    .from("bookings")
    .select("id, code, pin")
    .eq("code", body.code.trim().toUpperCase())
    .maybeSingle();

  if (error) {
    console.error("Failed to verify client booking:", error);
    return NextResponse.json({ error: "Gagal memeriksa booking. Coba lagi." }, { status: 500 });
  }

  if (!booking || !constantTimeEqual(booking.pin, body.pin)) {
    return NextResponse.json({ error: "Kode booking atau PIN salah." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(CLIENT_SESSION_COOKIE, createClientSession(booking.id, credentials.secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return response;
}
