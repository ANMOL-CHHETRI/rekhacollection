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

export function buildWhatsAppOrderUrl(
  product: {
    id?: string;
    name: string;
    reference: string;
    price: number;
    images?: string[];
  },
  baseUrl?: string
): string {
  const priceFormatted = formatNpr(product.price);

  let fullImageUrl = "";
  const primaryImg = product.images?.[0];

  const siteOrigin =
    baseUrl ||
    (typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : "https://rekhacollectionbutwal.vercel.app"));

  if (primaryImg) {
    if (primaryImg.startsWith("http://") || primaryImg.startsWith("https://")) {
      fullImageUrl = primaryImg;
    } else if (primaryImg.startsWith("data:")) {
      if (product.id) {
        fullImageUrl = `${siteOrigin}/api/products/${product.id}/image`;
      }
    } else {
      const cleanPath = primaryImg.startsWith("/") ? primaryImg : `/${primaryImg}`;
      fullImageUrl = `${siteOrigin}${cleanPath}`;
    }
  }

  const message = `Hello Rekha Collection! I would like to order:
Product: ${product.name}
Reference: ${product.reference}
Price: ${priceFormatted}${fullImageUrl ? `\nProduct Image: ${fullImageUrl}` : ""}

Please confirm availability and delivery charges.`;

  return `https://wa.me/${BRAND.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppUrl(inquiry?: string): string {
  if (!inquiry) {
    return BRAND.whatsappUrl;
  }
  return `https://wa.me/${BRAND.phoneRaw}?text=${encodeURIComponent(inquiry)}`;
}

