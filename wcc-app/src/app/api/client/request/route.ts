import { NextResponse } from "next/server";
import { getAuthenticatedClientBookingId } from "@/lib/client-auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function PUT(request: Request) {
  const bookingId = await getAuthenticatedClientBookingId();
  if (!bookingId) return NextResponse.json({ error: "Login klien diperlukan." }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi di environment server." }, { status: 503 });
  }

  let requestDetail: unknown;
  try {
    requestDetail = await request.json();
  } catch {
    return NextResponse.json({ error: "Data request tidak valid." }, { status: 400 });
  }
  if (typeof requestDetail !== "object" || requestDetail === null || Array.isArray(requestDetail)) {
    return NextResponse.json({ error: "Data request tidak valid." }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin()
    .from("bookings")
    .update({ request_detail: requestDetail, request_status: "Sudah Isi" })
    .eq("id", bookingId);

  if (error) {
    console.error("Failed to save client request:", error);
    return NextResponse.json({ error: "Gagal menyimpan detail request." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
