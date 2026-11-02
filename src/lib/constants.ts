export const BRAND = {
  name: "Rekha Collection",
  title: "Find Your Sparkle",
  location: "Butwal, Nepal",
  phone: "+977 9764688779",
  phoneRaw: "9779764688779",
  whatsappUrl: "https://wa.me/9779764688779",
  tiktokHandle: "@rekhacollectionbutwal",
  tiktokUrl: "https://www.tiktok.com/@rekhacollectionbutwal",
  logo: "/rekha-logo.png",
  notice: "Cash on delivery available all over Nepal. No returns or exchanges.",
  standardCategories: [
    "All",
    "Earrings",
    "Necklaces",
    "Rings",
    "Bracelets",
    "Other",
  ] as const,
};

export function formatNpr(amount: number): string {
  return `NPR ${amount.toLocaleString("en-IN")}`;
}

export function buildWhatsAppOrderUrl(product: {
  name: string;
  reference: string;
  price: number;
}): string {
  const priceFormatted = formatNpr(product.price);

  const message = `Hello Rekha Collection! I would like to order:
Product: ${product.name}
Reference: ${product.reference}
Price: ${priceFormatted}

Please confirm availability and delivery charges.`;

  return `https://wa.me/${BRAND.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppUrl(inquiry?: string): string {
  if (!inquiry) {
    return BRAND.whatsappUrl;
  }
  return `https://wa.me/${BRAND.phoneRaw}?text=${encodeURIComponent(inquiry)}`;
}

