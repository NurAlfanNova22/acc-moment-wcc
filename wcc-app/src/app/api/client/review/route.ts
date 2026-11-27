import { NextResponse } from "next/server";
import { getAuthenticatedClientBookingId } from "@/lib/client-auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function PUT(request: Request) {
  const bookingId = await getAuthenticatedClientBookingId();
  if (!bookingId) return NextResponse.json({ error: "Login klien diperlukan." }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi di environment server." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data ulasan tidak valid." }, { status: 400 });
  }

  if (
    typeof body !== "object" || body === null ||
    !("rating" in body) || typeof body.rating !== "number" || !Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5 ||
    !("comment" in body) || typeof body.comment !== "string"
  ) {
    return NextResponse.json({ error: "Rating dan komentar ulasan tidak valid." }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin()
    .from("bookings")
    .update({
      rating: body.rating,
      review_comment: body.comment.trim(),
      review_date: new Date().toISOString().slice(0, 10),
    })
    .eq("id", bookingId);

  if (error) {
    console.error("Failed to save client review:", error);
    return NextResponse.json({ error: "Gagal menyimpan ulasan." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
