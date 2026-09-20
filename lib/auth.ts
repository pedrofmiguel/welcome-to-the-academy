import "server-only";
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Admin session, kept deliberately small.
 *
 * The password lives in an environment variable and is compared on the
 * server. The browser only ever receives an httpOnly cookie holding an
 * HMAC — nothing a viewer can read tells them the password, and nothing
 * they can forge without AUTH_SECRET will verify.
 *
 * This is the real difference from the Artifact version, where the word
 * sat in the page source for anyone who opened devtools.
 */

const COOKIE = "academy_proctor";
const MAX_AGE = 60 * 60 * 12; // a long session, then sign out

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set. See .env.local.");
  return s;
}

function expectedToken(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD is not set. See .env.local.");
  return createHmac("sha256", secret()).update(password).digest("hex");
}

/** Constant-time string compare that tolerates length mismatch. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  // Hash both sides so the comparison length never leaks the real length.
  const ah = createHmac("sha256", secret()).update(ab).digest();
  const bh = createHmac("sha256", secret()).update(bb).digest();
  return timingSafeEqual(ah, bh);
}

export function passwordIsCorrect(submitted: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return safeEqual(submitted, password);
}

export async function isSignedIn(): Promise<boolean> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) return false;
    return safeEqual(token, expectedToken());
  } catch {
    return false;
  }
}

export async function signIn(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function signOut(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** Convenience for generating a fresh AUTH_SECRET. */
export function newSecret(): string {
  return randomBytes(32).toString("hex");
}
