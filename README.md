# Rekha Collection — Premium Jewellery Catalogue & Management System

> **"Elegance in every sparkle"**  
> Fine Jewellery Catalogue based in **Butwal, Nepal**  
> Cash on Delivery Available Throughout Nepal • WhatsApp Ordering Direct to Owner

---

## 💎 Brand Identity

- **Business Name:** Rekha Collection
- **Tagline:** Elegance in every sparkle
- **Location:** Butwal, Nepal
- **Official WhatsApp:** `+977 9764688779` ([wa.me/9779764688779](https://wa.me/9779764688779))
- **TikTok Profile:** `@rekhacollectionbutwal` ([tiktok.com/@rekhacollectionbutwal](https://www.tiktok.com/@rekhacollectionbutwal))
- **Phone Inquiries:** `+977 9764688779`
- **Payment Method:** Cash on delivery (COD) throughout all districts of Nepal
- **Store Policy:** *No returns or exchanges. Cash on delivery available all over Nepal. Please check the product details before confirming your order.*

---

## 🎨 Design System & Palette

- **Warm Ivory:** `#FAF6EE` (Main background)
- **Champagne Beige:** `#E8C99F` (Subtle section backgrounds, pill highlights)
- **Antique Gold:** `#B88632` (Accents, badges, borders, CTA focus)
- **Deep Charcoal:** `#211A14` (Typography, primary buttons, footers)
- **Pure White:** `#FFFFFF` (Cards, product details, dialogs)
- **Typography:** Serif headings (`Playfair Display`), clean body sans (`Plus Jakarta Sans`)
- **Logo Artwork:** Official Rekha Collection logo rendered uncropped, unstretched, and uncoloured with exact aspect ratio preserved.

---

## 🚀 Architecture & Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with luxury tokens and animations
- **Database:** Node 22 built-in `node:sqlite` (`rekhacollection.db`) with zero external native compilation dependencies
- **Authentication:** Salted PBKDF2 (SHA-512, 100,000 iterations) with cryptographic HMAC session tokens and brute-force rate limiting
- **Image Storage:** Protected multi-part upload endpoint saving to `public/uploads/` with MIME and file size validation (up to 8MB)
- **SEO & Social:** OpenGraph tags, dynamic XML sitemap (`/sitemap.xml`), and robots configuration (`/robots.txt`)

---

## 📱 WhatsApp Ordering Workflow

1. Customer browses catalogue or searches by name or unique reference code (e.g. `RC-101`).
2. Customer selects a piece and clicks **"Order on WhatsApp"**.
3. WhatsApp opens with an automatically encoded message:
   ```text
   Hello Rekha Collection! I would like to order:
   Product: [Product Name]
   Product Reference: [Product Reference]
   Price: NPR [Price]
   Product Link: [Product URL]

   Please confirm availability, delivery charge, and total payable amount.
   ```
4. Rekha Collection owner reviews the chat, confirms stock, provides exact delivery charges and estimated timeline, and requests customer delivery address.
5. Sold-out items cannot be ordered directly; customers are given a direct restock inquiry link.

---

## 🔐 Secure Admin Dashboard (`/admin`)

- **Login URL:** `/admin/login`
- **Default Owner Login ID:** `admin`
- **Initial Password:** `RekhaCollection@2026!` *(Changeable immediately via dashboard)*

### Dashboard Capabilities:
- **Real-Time Inventory Overview:** Total products, available stock, sold out items, and hidden drafts.
- **Product Management:**
  - Add new products with auto-generated or custom reference codes (`RC-XXX`).
  - Set positive prices in NPR (Nepalese Rupees).
  - Assign categories (*Necklaces & Sets, Earrings & Jhumkas, Bangles & Bracelets, Rings, Bridal & Heritage*).
  - Upload real photographs directly from mobile or laptop.
  - Set availability status: **Available**, **Sold Out**, or **Hidden** (internal draft).
  - Mark products as **Featured** for the homepage showcase.
- **Sample Demonstrations Management:** Clear initial preview samples in one click once real stock is uploaded.
- **In-App Password Management:** Change password securely with validation and salt regeneration.
- **CLI Password Reset Tool:**
  ```bash
  node scripts/reset-admin-password.js <NewSecurePassword>
  ```

---

## 🛠️ Getting Started & Local Development

### Prerequisites:
- Node.js `v22.5.0` or higher (Node v22.16.0 included)
- npm `10+`

### Installation:
```bash
# Clone or navigate to the repository
cd c:\Users\canmo\Desktop\rekhacollection

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Launch:
```bash
# Compile optimized build
npm run build

# Start production server
npm run start
```

---

## 🔒 Security Best Practices Implemented

- **Server-Side Authorization:** Admin routes and API mutations (`/api/admin/*`) are strictly guarded on the server via cryptographic HMAC tokens.
- **Brute-Force Rate Limiting:** Consecutive failed login attempts trigger an IP lockout for 15 minutes.
- **Safe File Uploads:** Uploaded photos are inspected for allowed MIME types (`image/jpeg`, `image/png`, `image/webp`) and capped at 8MB.
- **Hidden Items Privacy:** Products flagged as `hidden` are filtered at the database level and never served to public visitors or search engines.
