import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

/**
 * Team access control for Exalt Space (/space).
 *
 * A visitor signs in with their own email (which must be on the allowlist you
 * control) plus a shared team access code. A successful sign-in mints a signed,
 * httpOnly session cookie. No third-party auth, no email delivery required.
 *
 * Env:
 *   SPACE_ALLOWED_EMAILS  comma-separated allowlist, e.g. "you@x.com,teammate@x.com"
 *   SPACE_ACCESS_CODE     the shared team code
 *   SPACE_AUTH_SECRET     long random string used to sign the session cookie
 */

const COOKIE = "exalt_space_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): Uint8Array {
  const s =
    process.env.SPACE_AUTH_SECRET ||
    "dev-only-insecure-space-secret-change-me";
  return new TextEncoder().encode(s);
}

export function allowedEmails(): string[] {
  return (process.env.SPACE_ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function accessCode(): string {
  return process.env.SPACE_ACCESS_CODE || "exalt-team";
}

/** True when this email is on the allowlist and the code matches. */
export function checkTeamCredentials(email: string, code: string): boolean {
  const e = email.trim().toLowerCase();
  const list = allowedEmails();
  const emailOk = list.length === 0 ? false : list.includes(e);
  return emailOk && code === accessCode() && code.length > 0;
}

export async function createSpaceSession(email: string): Promise<void> {
  const token = await new SignJWT({ email: email.trim().toLowerCase(), scope: "space" })
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

export async function clearSpaceSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Returns the signed-in email, or null. */
export async function getSpaceSession(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    // Re-check the allowlist on every request so removing an email revokes access.
    const email = typeof payload.email === "string" ? payload.email : null;
    if (!email) return null;
    const list = allowedEmails();
    if (list.length && !list.includes(email)) return null;
    return email;
  } catch {
    return null;
  }
}
