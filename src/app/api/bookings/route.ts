import { randomInt, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, getAdminCredentials, verifyAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

type BookingRow = {
  id: string;
  code: string;
  pin: string;
  client_name: string;
  client_phone: string;
  event_date: string;
  package: string;
  status: "confirmed" | "completed";
  assigned_team: string[];
  team_locked: boolean;
  request_status: "Belum Isi" | "Sudah Isi";
  rating: number | null;
  review_comment: string | null;
  review_date: string | null;
  remaining_bill: number;
};

function toBooking(row: BookingRow) {
  return {
    id: row.id,
    code: row.code,
    pin: row.pin,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    date: row.event_date,
    package: row.package,
    status: row.status,
    assignedTeam: row.assigned_team ?? [],
    teamLocked: row.team_locked,
    requestStatus: row.request_status,
    rating: row.rating ?? undefined,
    reviewComment: row.review_comment,
    reviewDate: row.review_date,
    remainingBill: `Rp ${row.remaining_bill.toLocaleString("id-ID")}`,
  };
}

async function isAdminAuthenticated() {
  const credentials = getAdminCredentials();
  if (!credentials) return false;

  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value, credentials.secret);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseBill(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.trunc(value));
  if (typeof value === "string") return Number(value.replace(/\D/g, "")) || 0;
  return 0;
}

export async function GET() {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi di environment server." }, { status: 503 });
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("bookings")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) throw error;
    return NextResponse.json((data as BookingRow[]).map(toBooking));
  } catch (error) {
    console.error("Failed to fetch Supabase bookings:", error);
    return NextResponse.json({ error: "Gagal memuat data booking dari Supabase." }, { status: 500 });
  }
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
    return NextResponse.json({ error: "Data booking tidak valid." }, { status: 400 });
  }

  if (!isRecord(body) || typeof body.clientName !== "string" || typeof body.clientPhone !== "string" ||
      typeof body.date !== "string" || typeof body.package !== "string") {
    return NextResponse.json({ error: "Data booking belum lengkap." }, { status: 400 });
  }

  try {
    const code = `ACC-${body.date.replace(/-/g, "")}-${randomInt(100, 1000)}`;
    const pin = randomInt(1000, 10000).toString();
    const { data, error } = await getSupabaseAdmin()
      .from("bookings")
      .insert({
        id: randomUUID(),
        code,
        pin,
        client_name: body.clientName,
        client_phone: body.clientPhone,
        event_date: body.date,
        package: body.package,
        remaining_bill: parseBill(body.remainingBill),
        assigned_team: [],
        drive_url: typeof body.driveUrl === "string" && body.driveUrl.trim() ? body.driveUrl.trim() : null,
        status: "confirmed",
      })
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json(toBooking(data as BookingRow), { status: 201 });
  } catch (error) {
    console.error("Failed to create Supabase booking:", error);
    return NextResponse.json({ error: "Gagal menyimpan booking. Periksa kode booking agar tidak duplikat." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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
    return NextResponse.json({ error: "Data pembaruan tidak valid." }, { status: 400 });
  }

  if (!isRecord(body) || typeof body.id !== "string") {
    return NextResponse.json({ error: "ID booking wajib diisi." }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  const fieldMap = {
    clientName: "client_name",
    clientPhone: "client_phone",
    date: "event_date",
    package: "package",
    status: "status",
    requestStatus: "request_status",
    rating: "rating",
    requestDetail: "request_detail",
    driveUrl: "drive_url",
  } as const;

  for (const [field, column] of Object.entries(fieldMap)) {
    if (field in body) updates[column] = body[field];
  }
  if ("remainingBill" in body) updates.remaining_bill = parseBill(body.remainingBill);
  if (Array.isArray(body.assignedTeam) && body.assignedTeam.every(name => typeof name === "string")) {
    updates.assigned_team = body.assignedTeam;
  }
  if (typeof body.teamLocked === "boolean") updates.team_locked = body.teamLocked;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Tidak ada data yang diperbarui." }, { status: 400 });
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("bookings")
      .update(updates)
      .eq("id", body.id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Booking tidak ditemukan." }, { status: 404 });
    return NextResponse.json(toBooking(data as BookingRow));
  } catch (error) {
    console.error("Failed to update Supabase booking:", error);
    return NextResponse.json({ error: "Gagal memperbarui booking." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi di environment server." }, { status: 503 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID booking wajib diisi." }, { status: 400 });

  try {
    const { error, count } = await getSupabaseAdmin()
      .from("bookings")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) throw error;
    if (!count) return NextResponse.json({ error: "Booking tidak ditemukan." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete Supabase booking:", error);
    return NextResponse.json({ error: "Gagal menghapus booking." }, { status: 500 });
  }
}
