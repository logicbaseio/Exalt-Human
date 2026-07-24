import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

/**
 * Minimal single-admin auth. Credentials live in environment variables; a
 * successful login mints a signed JWT stored in an httpOnly cookie. No external
 * auth provider, no database table — deliberately small.
 */

const COOKIE = "exalt_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): Uint8Array {
  const s =
    process.env.AUTH_SECRET ||
    "dev-only-insecure-secret-change-me-in-production";
  return new TextEncoder().encode(s);
}

export function adminEmail(): string {
  return (process.env.ADMIN_EMAIL || "admin@exalthuman.com").toLowerCase();
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "exalt-admin";
}

/** Constant-ish credential check. Returns true on match. */
export function checkCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === adminEmail() &&
    password === adminPassword()
  );
}

export async function createSession(email: string): Promise<void> {
  const token = await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Returns the admin email if a valid session exists, else null. */
export async function getSession(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}

export async function isAuthed(): Promise<boolean> {
  return (await getSession()) !== null;
}

/** Redirect to the login page unless a valid session exists. */
export async function requireAuth(): Promise<string> {
  const email = await getSession();
  if (!email) redirect("/admin/login");
  return email;
}
