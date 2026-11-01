import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

export interface Product {
  id: string;
  reference: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description: string;
  availability: "available" | "sold_out" | "hidden";
  featured: boolean;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  username: string;
  password_hash: string;
  salt: string;
  created_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "rekhacollection.db");

// Singleton database instance
let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  // Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      reference TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      images TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      availability TEXT NOT NULL DEFAULT 'available',
      featured INTEGER NOT NULL DEFAULT 0,
      is_demo INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Admins table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // Rate limiting table
  db.exec(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      ip TEXT PRIMARY KEY,
      attempts INTEGER NOT NULL DEFAULT 0,
      last_attempt INTEGER NOT NULL DEFAULT 0,
      blocked_until INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Seed default admin if none exists
  const adminCount = db.prepare("SELECT COUNT(*) as count FROM admins").get() as { count: number };
  if (adminCount.count === 0) {
    const salt = crypto.randomBytes(32).toString("hex");
    const initialPass = process.env.ADMIN_INITIAL_PASSWORD || "RekhaCollection@2026!";
    const hash = crypto.pbkdf2Sync(initialPass, salt, 100000, 64, "sha512").toString("hex");
    const adminId = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO admins (id, username, password_hash, salt, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(adminId, "admin", hash, salt, now);

    console.log("[DB] Default admin initialized with username: admin");
  }

  // Seed initial demonstration products if catalogue is empty
  const prodCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (prodCount.count === 0) {
    const now = new Date().toISOString();
    const demoItems = [
      {
        id: "prod-rc-101",
        reference: "RC-101",
        name: "Imperial Royal Bridal Choker Set",
        price: 185000,
        images: JSON.stringify(["/images/necklace.jpg"]),
        category: "Necklaces & Sets",
        description: "An awe-inspiring masterpiece featuring intricately carved floral lattice, cascading fine lustrous pearls, and regal gemstone accents. Ideal for bridal elegance and grand celebrations.",
        availability: "available",
        featured: 1,
        is_demo: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: "prod-rc-102",
        reference: "RC-102",
        name: "Mayur Filigree Heritage Jhumkas",
        price: 48000,
        images: JSON.stringify(["/images/jhumkas.jpg"]),
        category: "Earrings & Jhumkas",
        description: "Exquisite artisan-crafted traditional jhumkas with hand-carved peacock (Mayur) motifs, delicate bell drops, and fine pearl cluster hangings.",
        availability: "available",
        featured: 1,
        is_demo: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: "prod-rc-103",
        reference: "RC-103",
        name: "Devi Antique Floral Kada Bangles",
        price: 95000,
        images: JSON.stringify(["/images/bangles.jpg"]),
        category: "Bangles & Bracelets",
        description: "Substantial antique gold finish bridal bangles embossed with heritage floral motifs and ruby & emerald accents. Features a secure traditional hinge clasp.",
        availability: "available",
        featured: 1,
        is_demo: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: "prod-rc-104",
        reference: "RC-104",
        name: "Crown Solitaire Filigree Ring",
        price: 36000,
        images: JSON.stringify(["/images/ring.jpg"]),
        category: "Rings",
        description: "Brilliant cut centerpiece held within an elevated crown gallery, adorned with master-level filigree detailing along the textured golden band.",
        availability: "available",
        featured: 1,
        is_demo: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: "prod-rc-105",
        reference: "RC-105",
        name: "Navratna Emerald Maharani Rani Haar",
        price: 165000,
        images: JSON.stringify(["/images/rani-haar.jpg"]),
        category: "Bridal & Heritage",
        description: "Opulent multi-tiered heritage long necklace with deep green emerald drops and an elaborate handcrafted royal medallion pendant.",
        availability: "available",
        featured: 1,
        is_demo: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: "prod-rc-106",
        reference: "RC-106",
        name: "Apsara Traditional Filigree Choker",
        price: 120000,
        images: JSON.stringify(["/images/necklace.jpg"]),
        category: "Necklaces & Sets",
        description: "Delicately balanced gold choker accented with natural freshwater pearls and matching filigree earrings. A classic choice for wedding ceremonies.",
        availability: "sold_out",
        featured: 0,
        is_demo: 1,
        created_at: now,
        updated_at: now,
      },
    ];

    const insertStmt = db.prepare(`
      INSERT INTO products (id, reference, name, price, images, category, description, availability, featured, is_demo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of demoItems) {
      insertStmt.run(
        item.id,
        item.reference,
        item.name,
        item.price,
        item.images,
        item.category,
        item.description,
        item.availability,
        item.featured,
        item.is_demo,
        item.created_at,
        item.updated_at
      );
    }

    console.log("[DB] Seeded initial demonstration products");
  }
}

// Product Database Methods
export function getAllProducts(includeHidden = false): Product[] {
  const db = getDb();
  let query = "SELECT * FROM products";
  if (!includeHidden) {
    query += " WHERE availability != 'hidden'";
  }
  query += " ORDER BY created_at DESC";

  const rows = db.prepare(query).all() as any[];
  return rows.map(formatProductRow);
}

export function getFeaturedProducts(): Product[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT * FROM products 
    WHERE availability != 'hidden' AND featured = 1 
    ORDER BY created_at DESC 
    LIMIT 6
  `).all() as any[];
  return rows.map(formatProductRow);
}

export function getProductById(id: string): Product | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as any;
  if (!row) return null;
  return formatProductRow(row);
}

export function getProductByReference(reference: string): Product | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE reference = ?").get(reference) as any;
  if (!row) return null;
  return formatProductRow(row);
}

export function getRelatedProducts(category: string, currentId: string, limit = 4): Product[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT * FROM products 
    WHERE availability != 'hidden' AND category = ? AND id != ?
    ORDER BY created_at DESC 
    LIMIT ?
  `).all(category, currentId, limit) as any[];

  if (rows.length < limit) {
    const extra = db.prepare(`
      SELECT * FROM products 
      WHERE availability != 'hidden' AND id != ? AND id NOT IN (${rows.map(() => "?").join(",") || "''"})
      ORDER BY created_at DESC 
      LIMIT ?
    `).all(currentId, ...rows.map((r: any) => r.id), limit - rows.length) as any[];
    rows.push(...extra);
  }

  return rows.map(formatProductRow);
}

export function createProduct(data: {
  reference: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
  availability?: "available" | "sold_out" | "hidden";
  featured?: boolean;
  is_demo?: boolean;
}): Product {
  const db = getDb();
  const id = "prod-" + crypto.randomUUID();
  const now = new Date().toISOString();
  const imagesJson = JSON.stringify(data.images && data.images.length > 0 ? data.images : ["/images/necklace.jpg"]);

  db.prepare(`
    INSERT INTO products (id, reference, name, price, images, category, description, availability, featured, is_demo, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.reference.trim().toUpperCase(),
    data.name.trim(),
    Math.round(data.price),
    imagesJson,
    data.category.trim() || "General",
    data.description?.trim() || "",
    data.availability || "available",
    data.featured ? 1 : 0,
    data.is_demo ? 1 : 0,
    now,
    now
  );

  return getProductById(id)!;
}

export function updateProduct(id: string, data: {
  reference?: string;
  name?: string;
  price?: number;
  images?: string[];
  category?: string;
  description?: string;
  availability?: "available" | "sold_out" | "hidden";
  featured?: boolean;
}): Product | null {
  const db = getDb();
  const existing = getProductById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const reference = data.reference !== undefined ? data.reference.trim().toUpperCase() : existing.reference;
  const name = data.name !== undefined ? data.name.trim() : existing.name;
  const price = data.price !== undefined ? Math.round(data.price) : existing.price;
  const images = data.images !== undefined ? JSON.stringify(data.images) : JSON.stringify(existing.images);
  const category = data.category !== undefined ? data.category.trim() : existing.category;
  const description = data.description !== undefined ? data.description.trim() : existing.description;
  const availability = data.availability !== undefined ? data.availability : existing.availability;
  const featured = data.featured !== undefined ? (data.featured ? 1 : 0) : (existing.featured ? 1 : 0);

  db.prepare(`
    UPDATE products 
    SET reference = ?, name = ?, price = ?, images = ?, category = ?, description = ?, availability = ?, featured = ?, is_demo = 0, updated_at = ?
    WHERE id = ?
  `).run(reference, name, price, images, category, description, availability, featured, now, id);

  return getProductById(id);
}

export function deleteProduct(id: string): boolean {
  const db = getDb();
  const info = db.prepare("DELETE FROM products WHERE id = ?").run(id);
  return info.changes > 0;
}

export function clearDemoProducts(): number {
  const db = getDb();
  const info = db.prepare("DELETE FROM products WHERE is_demo = 1").run();
  return Number(info.changes);
}

export function getProductStats() {
  const db = getDb();
  const total = (db.prepare("SELECT COUNT(*) as count FROM products").get() as any).count;
  const available = (db.prepare("SELECT COUNT(*) as count FROM products WHERE availability = 'available'").get() as any).count;
  const soldOut = (db.prepare("SELECT COUNT(*) as count FROM products WHERE availability = 'sold_out'").get() as any).count;
  const hidden = (db.prepare("SELECT COUNT(*) as count FROM products WHERE availability = 'hidden'").get() as any).count;
  const demoCount = (db.prepare("SELECT COUNT(*) as count FROM products WHERE is_demo = 1").get() as any).count;

  return { total, available, soldOut, hidden, demoCount };
}

function formatProductRow(row: any): Product {
  let images: string[] = [];
  try {
    images = JSON.parse(row.images);
  } catch {
    images = [row.images || "/images/necklace.jpg"];
  }

  return {
    id: row.id,
    reference: row.reference,
    name: row.name,
    price: Number(row.price),
    images,
    category: row.category,
    description: row.description || "",
    availability: row.availability as "available" | "sold_out" | "hidden",
    featured: Boolean(row.featured),
    is_demo: Boolean(row.is_demo),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
