import "server-only";
import { cookies } from "next/headers";
import {
  CLIENT_SESSION_COOKIE,
  getAdminCredentials,
  verifyClientSession,
} from "@/lib/admin-auth";

export async function getAuthenticatedClientBookingId() {
  const credentials = getAdminCredentials();
  if (!credentials) return null;

  const cookieStore = await cookies();
  return verifyClientSession(cookieStore.get(CLIENT_SESSION_COOKIE)?.value, credentials.secret);
}
