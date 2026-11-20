import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "acc_admin_session";
export const CLIENT_SESSION_COOKIE = "acc_client_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

type AdminSession = {
  sub: "admin" | "client";
  exp: number;
  bookingId?: string;
};

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!username || !password || !secret || secret.length < 32) {
    return null;
  }

  return { username, password, secret };
}

export function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function createSessionToken(session: AdminSession, secret: string) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");

  return `${payload}.${sign(payload, secret)}`;
}

function verifySessionToken(token: string | undefined, secret: string, subject: AdminSession["sub"]) {
  if (!token) return null;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;

  const expectedSignature = sign(payload, secret);
  if (!constantTimeEqual(signature, expectedSignature)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSession;
    return session.sub === subject && Number.isInteger(session.exp) && session.exp > Math.floor(Date.now() / 1000)
      ? session
      : null;
  } catch {
    return null;
  }
}

export function createAdminSession(secret: string) {
  return createSessionToken({
    sub: "admin",
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE,
  }, secret);
}

export function verifyAdminSession(token: string | undefined, secret: string) {
  return verifySessionToken(token, secret, "admin") !== null;
}

export function createClientSession(bookingId: string, secret: string) {
  return createSessionToken({
    sub: "client",
    bookingId,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE,
  }, secret);
}

export function verifyClientSession(token: string | undefined, secret: string) {
  const session = verifySessionToken(token, secret, "client");
  return session?.bookingId ? session.bookingId : null;
}
