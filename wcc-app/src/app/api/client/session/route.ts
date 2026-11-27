import { NextResponse } from "next/server";
import { getAuthenticatedClientBookingId } from "@/lib/client-auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  const bookingId = await getAuthenticatedClientBookingId();
  if (!bookingId) return NextResponse.json({ error: "Login klien diperlukan." }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi di environment server." }, { status: 503 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("bookings")
    .select("id, code, client_name, event_date, package, assigned_team, remaining_bill, request_detail, rating, review_comment, review_date, drive_url")
    .eq("id", bookingId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load client portal data:", error);
    return NextResponse.json({ error: "Gagal memuat data booking." }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Booking tidak ditemukan." }, { status: 404 });

  return NextResponse.json({
    id: data.id,
    code: data.code,
    clientName: data.client_name,
    date: data.event_date,
    package: data.package,
    assignedTeam: data.assigned_team ?? [],
    remainingBill: Number(data.remaining_bill),
    requestDetail: data.request_detail,
    rating: data.rating,
    reviewComment: data.review_comment,
    reviewDate: data.review_date,
    driveUrl: data.drive_url,
  });
}
