/**
 * Rekha Collection - Admin Password Reset Utility
 * Run via terminal: node scripts/reset-admin-password.js <newPassword>
 */

const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");
const fs = require("node:fs");
const crypto = require("node:crypto");

const newPass = process.argv[2];

if (!newPass || newPass.length < 8) {
  console.error("Usage: node scripts/reset-admin-password.js <newPasswordWithMin8Chars>");
  process.exit(1);
}

const DB_PATH = path.join(process.cwd(), "data", "rekhacollection.db");
if (!fs.existsSync(DB_PATH)) {
  console.error("Database file not found at " + DB_PATH + ". Please run the app first.");
  process.exit(1);
}

const db = new DatabaseSync(DB_PATH);
const salt = crypto.randomBytes(32).toString("hex");
const hash = crypto.pbkdf2Sync(newPass, salt, 100000, 64, "sha512").toString("hex");

const existing = db.prepare("SELECT * FROM admins LIMIT 1").get();

if (existing) {
  db.prepare("UPDATE admins SET password_hash = ?, salt = ? WHERE id = ?").run(hash, salt, existing.id);
  console.log(`[Success] Password successfully updated for admin user: "${existing.username}"`);
} else {
  const id = crypto.randomUUID();
  db.prepare("INSERT INTO admins (id, username, password_hash, salt, created_at) VALUES (?, ?, ?, ?, ?)").run(
    id,
    "admin",
    hash,
    salt,
    new Date().toISOString()
  );
  console.log('[Success] Created new admin user: "admin"');
}

// Clear rate limits
db.prepare("DELETE FROM login_attempts").run();
console.log("[Success] Reset login attempt limits. You may now log in.");
