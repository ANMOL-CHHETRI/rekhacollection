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

export interface LoginAttempt {
  ip: string;
  attempts: number;
  last_attempt: number;
  blocked_until: number;
}

// Default Seed Products
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-rc-101",
    reference: "RC-101",
    name: "Imperial Royal Bridal Choker Set",
    price: 185000,
    images: ["/images/necklace.jpg"],
    category: "Necklaces",
    description: "An awe-inspiring masterpiece featuring intricately carved floral lattice, cascading fine lustrous pearls, and regal gemstone accents. Ideal for bridal elegance and grand celebrations.",
    availability: "available",
    featured: true,
    is_demo: false,
    created_at: "2026-11-01T11:31:03.277Z",
    updated_at: "2026-11-01T11:31:03.277Z",
  },
  {
    id: "prod-rc-102",
    reference: "RC-102",
    name: "Mayur Filigree Heritage Jhumkas",
    price: 48000,
    images: ["/images/jhumkas.jpg"],
    category: "Earrings",
    description: "Exquisite artisan-crafted traditional jhumkas with hand-carved peacock motifs, delicate bell drops, and fine pearl cluster hangings.",
    availability: "available",
    featured: true,
    is_demo: false,
    created_at: "2026-11-01T11:31:03.277Z",
    updated_at: "2026-11-01T11:31:03.277Z",
  },
  {
    id: "prod-rc-103",
    reference: "RC-103",
    name: "Devi Antique Floral Kada Bangles",
    price: 95000,
    images: ["/images/bangles.jpg"],
    category: "Bracelets",
    description: "Substantial antique gold finish bridal bangles embossed with heritage floral motifs and ruby & emerald accents. Features a secure traditional hinge clasp.",
    availability: "available",
    featured: true,
    is_demo: false,
    created_at: "2026-11-01T11:31:03.277Z",
    updated_at: "2026-11-01T11:31:03.277Z",
  },
  {
    id: "prod-rc-104",
    reference: "RC-104",
    name: "Crown Solitaire Filigree Ring",
    price: 36000,
    images: ["/images/ring.jpg"],
    category: "Rings",
    description: "Brilliant cut centerpiece held within an elevated crown gallery, adorned with master-level filigree detailing along the textured golden band.",
    availability: "available",
    featured: true,
    is_demo: false,
    created_at: "2026-11-01T11:31:03.277Z",
    updated_at: "2026-11-01T11:31:03.277Z",
  },
  {
    id: "prod-rc-105",
    reference: "RC-105",
    name: "Navratna Emerald Maharani Rani Haar",
    price: 165000,
    images: ["/images/rani-haar.jpg"],
    category: "Necklaces",
    description: "Opulent multi-tiered heritage long necklace with deep green emerald drops and an elaborate handcrafted royal medallion pendant.",
    availability: "available",
    featured: true,
    is_demo: false,
    created_at: "2026-11-01T11:31:03.277Z",
    updated_at: "2026-11-01T11:31:03.277Z",
  },
  {
    id: "prod-rc-106",
    reference: "RC-106",
    name: "Apsara Traditional Filigree Choker",
    price: 120000,
    images: ["/images/necklace.jpg"],
    category: "Necklaces",
    description: "Delicately balanced gold choker accented with natural freshwater pearls and matching filigree earrings. A classic choice for wedding ceremonies.",
    availability: "available",
    featured: false,
    is_demo: false,
    created_at: "2026-11-01T11:31:03.277Z",
    updated_at: "2026-11-02T13:20:34.950Z",
  },
];

// Helper to get initial products from file or defaults
function getInitialProducts(): Product[] {
  try {
    const jsonPath = path.join(process.cwd(), "data", "initial_products.json");
    if (fs.existsSync(jsonPath)) {
      const content = fs.readFileSync(jsonPath, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_PRODUCTS;
}

// Serverless / Vercel detection
const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT
);

// On Vercel, the only writable directory is /tmp
const DATA_DIR = isServerless
  ? path.join("/tmp", "rekha_data")
  : path.join(process.cwd(), "data");

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {
  // Ignore if already exists or read-only
}

const DB_PATH = path.join(DATA_DIR, "rekhacollection.db");
const JSON_STORE_PATH = path.join(DATA_DIR, "rekhacollection.json");

// In-Memory / File-backed JSON Fallback Store
class MemoryJsonStore {
  products: Product[] = [];
  admins: Admin[] = [];
  login_attempts: LoginAttempt[] = [];

  constructor() {
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(JSON_STORE_PATH)) {
        const raw = fs.readFileSync(JSON_STORE_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        this.products = parsed.products || [];
        this.admins = parsed.admins || [];
        this.login_attempts = parsed.login_attempts || [];
        return;
      }
    } catch {
      // ignore
    }

    // Initialize with seed data
    this.products = getInitialProducts();
    const salt = crypto.randomBytes(32).toString("hex");
    const initialPass = process.env.ADMIN_INITIAL_PASSWORD || "RekhaCollection@2026!";
    const hash = crypto.pbkdf2Sync(initialPass, salt, 100000, 64, "sha512").toString("hex");
    this.admins = [
      {
        id: crypto.randomUUID(),
        username: "admin",
        password_hash: hash,
        salt,
        created_at: new Date().toISOString(),
      },
    ];
    this.save();
  }

  save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(
        JSON_STORE_PATH,
        JSON.stringify(
          {
            products: this.products,
            admins: this.admins,
            login_attempts: this.login_attempts,
          },
          null,
          2
        )
      );
    } catch {
      // In-memory stays in memory if filesystem fails
    }
  }

  prepare(sql: string) {
    const cleanSql = sql.trim();

    return {
      all: (...params: any[]) => {
        if (cleanSql.includes("FROM products")) {
          let list = [...this.products];
          if (cleanSql.includes("availability != 'hidden'")) {
            list = list.filter((p) => p.availability !== "hidden");
          }
          list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          return list.map((p) => ({
            ...p,
            price: Number(p.price),
            images: JSON.stringify(p.images),
            featured: p.featured ? 1 : 0,
            is_demo: p.is_demo ? 1 : 0,
          }));
        }
        return [];
      },
      get: (...params: any[]) => {
        if (cleanSql.includes("COUNT(*) as count FROM products")) {
          if (cleanSql.includes("WHERE availability = 'available'")) {
            return { count: this.products.filter((p) => p.availability === "available").length };
          }
          if (cleanSql.includes("WHERE availability = 'sold_out'")) {
            return { count: this.products.filter((p) => p.availability === "sold_out").length };
          }
          if (cleanSql.includes("WHERE availability = 'hidden'")) {
            return { count: this.products.filter((p) => p.availability === "hidden").length };
          }
          return { count: this.products.length };
        }
        if (cleanSql.includes("FROM products WHERE id = ?")) {
          const item = this.products.find((p) => p.id === params[0]);
          if (!item) return null;
          return {
            ...item,
            price: Number(item.price),
            images: JSON.stringify(item.images),
            featured: item.featured ? 1 : 0,
            is_demo: item.is_demo ? 1 : 0,
          };
        }
        if (cleanSql.includes("FROM products WHERE reference = ?")) {
          const item = this.products.find((p) => p.reference.toUpperCase() === String(params[0]).toUpperCase());
          if (!item) return null;
          return {
            ...item,
            price: Number(item.price),
            images: JSON.stringify(item.images),
            featured: item.featured ? 1 : 0,
            is_demo: item.is_demo ? 1 : 0,
          };
        }
        if (cleanSql.includes("FROM admins WHERE username = ?")) {
          return this.admins.find((a) => a.username === params[0]) || null;
        }
        if (cleanSql.includes("FROM admins WHERE id = ?")) {
          return this.admins.find((a) => a.id === params[0]) || null;
        }
        if (cleanSql.includes("FROM login_attempts WHERE ip = ?")) {
          return this.login_attempts.find((l) => l.ip === params[0]) || null;
        }
        return null;
      },
      run: (...params: any[]) => {
        if (cleanSql.startsWith("INSERT INTO products")) {
          const [id, reference, name, price, imagesJson, category, description, availability, featured, is_demo, created_at, updated_at] = params;
          let parsedImages: string[] = [];
          try {
            parsedImages = JSON.parse(imagesJson);
          } catch {
            parsedImages = [imagesJson];
          }
          const newProduct: Product = {
            id,
            reference,
            name,
            price: Number(price),
            images: parsedImages,
            category,
            description: description || "",
            availability,
            featured: Boolean(featured),
            is_demo: Boolean(is_demo),
            created_at,
            updated_at,
          };
          this.products.unshift(newProduct);
          this.save();
          return { changes: 1 };
        }
        if (cleanSql.startsWith("UPDATE products")) {
          const [reference, name, price, imagesJson, category, description, availability, featured, updated_at, id] = params;
          const idx = this.products.findIndex((p) => p.id === id);
          if (idx !== -1) {
            let parsedImages = this.products[idx].images;
            try {
              parsedImages = JSON.parse(imagesJson);
            } catch {
              parsedImages = [imagesJson];
            }
            this.products[idx] = {
              ...this.products[idx],
              reference,
              name,
              price: Number(price),
              images: parsedImages,
              category,
              description: description || "",
              availability,
              featured: Boolean(featured),
              updated_at,
            };
            this.save();
            return { changes: 1 };
          }
          return { changes: 0 };
        }
        if (cleanSql.startsWith("DELETE FROM products WHERE id = ?")) {
          const initialLen = this.products.length;
          this.products = this.products.filter((p) => p.id !== params[0]);
          this.save();
          return { changes: initialLen - this.products.length };
        }
        if (cleanSql.startsWith("INSERT INTO login_attempts")) {
          const [ip, last_attempt] = params;
          const idx = this.login_attempts.findIndex((l) => l.ip === ip);
          if (idx !== -1) {
            this.login_attempts[idx].attempts += 1;
            this.login_attempts[idx].last_attempt = last_attempt;
          } else {
            this.login_attempts.push({ ip, attempts: 1, last_attempt, blocked_until: 0 });
          }
          this.save();
          return { changes: 1 };
        }
        if (cleanSql.startsWith("UPDATE login_attempts")) {
          const [attempts, last_attempt, blocked_until, ip] = params;
          const idx = this.login_attempts.findIndex((l) => l.ip === ip);
          if (idx !== -1) {
            this.login_attempts[idx] = { ip, attempts, last_attempt, blocked_until };
            this.save();
            return { changes: 1 };
          }
          return { changes: 0 };
        }
        if (cleanSql.startsWith("DELETE FROM login_attempts WHERE ip = ?")) {
          this.login_attempts = this.login_attempts.filter((l) => l.ip !== params[0]);
          this.save();
          return { changes: 1 };
        }
        if (cleanSql.startsWith("UPDATE admins SET password_hash = ?")) {
          const [newHash, newSalt, adminId] = params;
          const idx = this.admins.findIndex((a) => a.id === adminId);
          if (idx !== -1) {
            this.admins[idx].password_hash = newHash;
            this.admins[idx].salt = newSalt;
            this.save();
            return { changes: 1 };
          }
          return { changes: 0 };
        }
        return { changes: 0 };
      },
    };
  }

  exec(sql: string) {
    // Schema creation no-op for JSON store
  }
}

// Singleton database instance
let dbInstance: any = null;

export function getDb(): any {
  if (dbInstance) return dbInstance;

  // Try SQLite first if node:sqlite is supported
  try {
    const sqliteModule = require("node:sqlite");
    if (sqliteModule && sqliteModule.DatabaseSync) {
      const db = new sqliteModule.DatabaseSync(DB_PATH);
      initSqliteSchema(db);
      dbInstance = db;
      return dbInstance;
    }
  } catch (err) {
    console.warn("[DB] node:sqlite could not be initialized, falling back to JSON store:", err);
  }

  // Graceful fallback to file-backed JSON store
  dbInstance = new MemoryJsonStore();
  return dbInstance;
}

function initSqliteSchema(db: any) {
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
  }

  // Seed initial products if catalogue is empty
  const prodCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (prodCount.count === 0) {
    const seedItems = getInitialProducts();
    const insertStmt = db.prepare(`
      INSERT INTO products (id, reference, name, price, images, category, description, availability, featured, is_demo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of seedItems) {
      insertStmt.run(
        item.id,
        item.reference,
        item.name,
        item.price,
        JSON.stringify(item.images),
        item.category,
        item.description || "",
        item.availability,
        item.featured ? 1 : 0,
        item.is_demo ? 1 : 0,
        item.created_at,
        item.updated_at
      );
    }
  }
}

// Product Database Methods
export function getAllProducts(includeHidden = false): Product[] {
  try {
    const db = getDb();
    let query = "SELECT * FROM products";
    if (!includeHidden) {
      query += " WHERE availability != 'hidden'";
    }
    query += " ORDER BY created_at DESC";

    const rows = db.prepare(query).all() as any[];
    return rows.map(formatProductRow);
  } catch (err) {
    console.error("[getAllProducts Error]", err);
    return getInitialProducts().filter((p) => includeHidden || p.availability !== "hidden");
  }
}

export function getProductById(id: string): Product | null {
  try {
    const db = getDb();
    const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as any;
    if (!row) return null;
    return formatProductRow(row);
  } catch {
    return getInitialProducts().find((p) => p.id === id) || null;
  }
}

export function getProductByReference(reference: string): Product | null {
  try {
    const db = getDb();
    const row = db.prepare("SELECT * FROM products WHERE reference = ?").get(reference) as any;
    if (!row) return null;
    return formatProductRow(row);
  } catch {
    return (
      getInitialProducts().find(
        (p) => p.reference.toUpperCase() === reference.toUpperCase()
      ) || null
    );
  }
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
    data.category.trim() || "Necklaces",
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

export function getProductStats() {
  try {
    const db = getDb();
    const total = (db.prepare("SELECT COUNT(*) as count FROM products").get() as any).count;
    const available = (db.prepare("SELECT COUNT(*) as count FROM products WHERE availability = 'available'").get() as any).count;
    const soldOut = (db.prepare("SELECT COUNT(*) as count FROM products WHERE availability = 'sold_out'").get() as any).count;
    const hidden = (db.prepare("SELECT COUNT(*) as count FROM products WHERE availability = 'hidden'").get() as any).count;

    return { total, available, soldOut, hidden };
  } catch {
    const prods = getInitialProducts();
    return {
      total: prods.length,
      available: prods.filter((p) => p.availability === "available").length,
      soldOut: prods.filter((p) => p.availability === "sold_out").length,
      hidden: prods.filter((p) => p.availability === "hidden").length,
    };
  }
}

function formatProductRow(row: any): Product {
  let images: string[] = [];
  try {
    images = typeof row.images === "string" ? JSON.parse(row.images) : row.images;
  } catch {
    images = [row.images || "/images/necklace.jpg"];
  }

  return {
    id: row.id,
    reference: row.reference,
    name: row.name,
    price: Number(row.price),
    images: Array.isArray(images) ? images : [images],
    category: row.category,
    description: row.description || "",
    availability: row.availability as "available" | "sold_out" | "hidden",
    featured: Boolean(row.featured),
    is_demo: Boolean(row.is_demo),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
