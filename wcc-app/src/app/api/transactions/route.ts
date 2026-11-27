import { randomUUID } from "node:crypto";
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
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json({ error: "Gagal memuat transaksi." }, { status: 500 });
  }

  return NextResponse.json(data.map(transaction => ({
    id: transaction.id,
    date: transaction.date,
    amount: Number(transaction.amount),
    description: transaction.description,
    type: transaction.type,
  })));
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
    return NextResponse.json({ error: "Data transaksi tidak valid." }, { status: 400 });
  }

  if (
    typeof body !== "object" || body === null ||
    !("type" in body) || (body.type !== "in" && body.type !== "out") ||
    !("amount" in body) || typeof body.amount !== "number" || !Number.isSafeInteger(body.amount) || body.amount <= 0 ||
    !("description" in body) || typeof body.description !== "string" || !body.description.trim()
  ) {
    return NextResponse.json({ error: "Jenis, keterangan, dan nominal transaksi wajib diisi." }, { status: 400 });
  }

  const date = new Date().toISOString().slice(0, 10);
  const { data, error } = await getSupabaseAdmin()
    .from("transactions")
    .insert({
      id: randomUUID(),
      type: body.type,
      amount: body.amount,
      description: body.description.trim(),
      date,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Failed to save transaction:", error);
    return NextResponse.json({ error: "Gagal menyimpan transaksi." }, { status: 500 });
  }

  return NextResponse.json({
    id: data.id,
    date: data.date,
    amount: Number(data.amount),
    description: data.description,
    type: data.type,
  }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi di environment server." }, { status: 503 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID transaksi wajib diisi." }, { status: 400 });

  const { error, count } = await getSupabaseAdmin()
    .from("transactions")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    console.error("Failed to delete transaction:", error);
    return NextResponse.json({ error: "Gagal menghapus transaksi." }, { status: 500 });
  }
  if (!count) return NextResponse.json({ error: "Transaksi tidak ditemukan." }, { status: 404 });

  return NextResponse.json({ success: true });
}
