import crypto from "node:crypto";
import { getDb } from "./db";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "rekha_admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "rekha_collection_butwal_luxury_secret_key_2026";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export interface SessionPayload {
  adminId: string;
  username: string;
  issuedAt: number;
  expiresAt: number;
}

// Rate Limiting helper
export function checkRateLimit(ip: string): { allowed: boolean; waitMinutes?: number } {
  try {
    const db = getDb();
    const now = Date.now();
    const record = db.prepare("SELECT * FROM login_attempts WHERE ip = ?").get(ip) as any;

    if (!record) {
      return { allowed: true };
    }

    if (record.blocked_until && record.blocked_until > now) {
      const remainingMinutes = Math.ceil((record.blocked_until - now) / 60000);
      return { allowed: false, waitMinutes: remainingMinutes };
    }

    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

export function recordLoginFailure(ip: string): { blocked: boolean; attemptsRemaining: number } {
  try {
    const db = getDb();
    const now = Date.now();
    const record = db.prepare("SELECT * FROM login_attempts WHERE ip = ?").get(ip) as any;

    if (!record) {
      db.prepare(`
        INSERT INTO login_attempts (ip, attempts, last_attempt, blocked_until)
        VALUES (?, 1, ?, 0)
      `).run(ip, now);
      return { blocked: false, attemptsRemaining: MAX_ATTEMPTS - 1 };
    }

    // If previous attempt was over 15 minutes ago and not locked, reset
    const isExpired = now - record.last_attempt > LOCKOUT_MINUTES * 60 * 1000 && record.blocked_until < now;
    const newAttempts = isExpired ? 1 : record.attempts + 1;

    if (newAttempts >= MAX_ATTEMPTS) {
      const blockedUntil = now + LOCKOUT_MINUTES * 60 * 1000;
      db.prepare(`
        UPDATE login_attempts 
        SET attempts = ?, last_attempt = ?, blocked_until = ?
        WHERE ip = ?
      `).run(newAttempts, now, blockedUntil, ip);
      return { blocked: true, attemptsRemaining: 0 };
    }

    db.prepare(`
      UPDATE login_attempts 
      SET attempts = ?, last_attempt = ?, blocked_until = 0
      WHERE ip = ?
    `).run(newAttempts, now, ip);

    return { blocked: false, attemptsRemaining: MAX_ATTEMPTS - newAttempts };
  } catch {
    return { blocked: false, attemptsRemaining: 4 };
  }
}

export function recordLoginSuccess(ip: string) {
  try {
    const db = getDb();
    db.prepare("DELETE FROM login_attempts WHERE ip = ?").run(ip);
  } catch {
    // ignore
  }
}

// Verify credentials
export function verifyAdminCredentials(username: string, password: string, clientIp: string) {
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return { success: false, error: `Too many failed attempts. Please try again in ${rateLimit.waitMinutes} minutes.` };
  }

  const db = getDb();
  const admin = db.prepare("SELECT * FROM admins WHERE username = ?").get(username) as any;

  if (!admin) {
    const { blocked, attemptsRemaining } = recordLoginFailure(clientIp);
    return {
      success: false,
      error: blocked
        ? `Account temporarily locked due to repeated failed attempts. Please try in ${LOCKOUT_MINUTES} minutes.`
        : `Invalid credentials. (${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} left)`,
    };
  }

  const calculatedHash = crypto.pbkdf2Sync(password, admin.salt, 100000, 64, "sha512").toString("hex");

  const hashBuffer = Buffer.from(calculatedHash, "hex");
  const storedBuffer = Buffer.from(admin.password_hash, "hex");

  if (hashBuffer.length !== storedBuffer.length || !crypto.timingSafeEqual(hashBuffer, storedBuffer)) {
    const { blocked, attemptsRemaining } = recordLoginFailure(clientIp);
    return {
      success: false,
      error: blocked
        ? `Account temporarily locked due to repeated failed attempts. Please try in ${LOCKOUT_MINUTES} minutes.`
        : `Invalid credentials. (${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} left)`,
    };
  }

  recordLoginSuccess(clientIp);
  return { success: true, admin: { id: admin.id, username: admin.username } };
}

// Session Creation & Token Signing
export function signSessionToken(payload: SessionPayload): string {
  const json = JSON.stringify(payload);
  const base64Payload = Buffer.from(json).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(base64Payload).digest("base64url");
  return `${base64Payload}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [base64Payload, signature] = parts;

    const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(base64Payload).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const json = Buffer.from(base64Payload, "base64url").toString("utf-8");
    const payload = JSON.parse(json) as SessionPayload;

    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function getAdminSessionFromRequest(req: NextRequest): SessionPayload | null {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function createSessionCookie(payload: SessionPayload) {
  const token = signSessionToken(payload);
  return {
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  };
}

export function updateAdminPassword(adminId: string, oldPass: string, newPass: string) {
  const db = getDb();
  const admin = db.prepare("SELECT * FROM admins WHERE id = ?").get(adminId) as any;
  if (!admin) return { success: false, error: "Admin not found" };

  const oldHash = crypto.pbkdf2Sync(oldPass, admin.salt, 100000, 64, "sha512").toString("hex");
  if (oldHash !== admin.password_hash) {
    return { success: false, error: "Current password is incorrect" };
  }

  if (newPass.length < 8) {
    return { success: false, error: "New password must be at least 8 characters long" };
  }

  const newSalt = crypto.randomBytes(32).toString("hex");
  const newHash = crypto.pbkdf2Sync(newPass, newSalt, 100000, 64, "sha512").toString("hex");

  db.prepare(`
    UPDATE admins 
    SET password_hash = ?, salt = ? 
    WHERE id = ?
  `).run(newHash, newSalt, adminId);

  return { success: true };
}
