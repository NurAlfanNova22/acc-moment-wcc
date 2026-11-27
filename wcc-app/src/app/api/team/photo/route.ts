import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, getAdminCredentials, verifyAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const STORAGE_BUCKET = "team-photos";

const IMAGE_TYPES = {
  jpeg: { mime: "image/jpeg", extension: "jpg" },
  png: { mime: "image/png", extension: "png" },
  webp: { mime: "image/webp", extension: "webp" },
  avif: { mime: "image/avif", extension: "avif" },
} as const;

function identifyImage(bytes: Uint8Array): (typeof IMAGE_TYPES)[keyof typeof IMAGE_TYPES] | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return IMAGE_TYPES.jpeg;
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return IMAGE_TYPES.png;
  }
  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) {
    return IMAGE_TYPES.webp;
  }
  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(4, 8)) === "ftyp" &&
    /avif|avis/.test(String.fromCharCode(...bytes.slice(8, 32)))
  ) {
    return IMAGE_TYPES.avif;
  }
  return null;
}

async function isAdminAuthenticated() {
  const credentials = getAdminCredentials();
  if (!credentials) return false;
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value, credentials.secret);
}

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi di environment server." }, { status: 503 });
  }

  let photo: FormDataEntryValue | null;
  try {
    const formData = await request.formData();
    photo = formData.get("photo");
  } catch {
    return NextResponse.json({ error: "File foto tidak valid." }, { status: 400 });
  }

  if (!photo || typeof photo === "string") {
    return NextResponse.json({ error: "Pilih file foto terlebih dahulu." }, { status: 400 });
  }
  if (photo.size === 0 || photo.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Ukuran foto harus lebih dari 0 dan maksimal 5 MB." }, { status: 400 });
  }

  const bytes = Buffer.from(await photo.arrayBuffer());
  const imageType = identifyImage(bytes);
  if (!imageType || (photo.type && photo.type !== imageType.mime)) {
    return NextResponse.json({ error: "Format foto harus JPG, PNG, WebP, atau AVIF." }, { status: 415 });
  }

  const filePath = `${randomUUID()}.${imageType.extension}`;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .storage
    .from(STORAGE_BUCKET)
    .upload(filePath, bytes, {
      contentType: imageType.mime,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    console.error("Failed to upload team member photo:", {
      message: error.message,
      statusCode: error.statusCode,
    });
    const message = error.message.toLowerCase();
    if (error.statusCode === "404" || message.includes("bucket not found")) {
      return NextResponse.json({
        error: "Bucket team-photos belum tersedia. Jalankan SQL supabase/team_photos_storage.sql di Supabase SQL Editor.",
      }, { status: 503 });
    }
    if (
      error.statusCode === "401" ||
      error.statusCode === "403" ||
      message.includes("row-level security") ||
      message.includes("not authorized")
    ) {
      return NextResponse.json({
        error: "Supabase menolak upload. Pastikan SUPABASE_SERVICE_ROLE_KEY di server menggunakan service-role/secret key.",
      }, { status: 503 });
    }
    return NextResponse.json({ error: "Gagal mengunggah foto ke Supabase Storage." }, { status: 500 });
  }

  const { data: publicUrl } = supabase
    .storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return NextResponse.json({ photoUrl: publicUrl.publicUrl }, { status: 201 });
}
