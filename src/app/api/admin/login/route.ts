import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  constantTimeEqual,
  createAdminSession,
  getAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const credentials = getAdminCredentials();
  if (!credentials) {
    return NextResponse.json(
      { error: "Login admin belum dikonfigurasi. Isi variabel ADMIN_* di environment server." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan login tidak valid." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("username" in body) ||
    !("password" in body) ||
    typeof body.username !== "string" ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json({ error: "Username dan password wajib diisi." }, { status: 400 });
  }

  if (
    !constantTimeEqual(body.username, credentials.username) ||
    !constantTimeEqual(body.password, credentials.password)
  ) {
    return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSession(credentials.secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  return response;
}
