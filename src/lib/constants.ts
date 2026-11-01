export const BRAND = {
  name: "Rekha Collection",
  tagline: "Elegance in every sparkle",
  location: "Butwal, Nepal",
  phone: "+977 9764688779",
  phoneRaw: "9779764688779",
  whatsappUrl: "https://wa.me/9779764688779",
  tiktokHandle: "@rekhacollectionbutwal",
  tiktokUrl: "https://www.tiktok.com/@rekhacollectionbutwal",
  callUrl: "tel:+9779764688779",
  logo: "/rekha-logo.png",
  policyNotice:
    "Cash on delivery available all over Nepal. No returns or exchanges. Please check the product details before confirming your order.",
  codNotice: "Cash on Delivery Available All Over Nepal",
  returnNotice: "No Returns or Exchanges",
  deliveryNotice:
    "Stock availability, delivery charge, and delivery timeline will be verified by the owner on WhatsApp before dispatch.",
  categories: [
    "All",
    "Necklaces & Sets",
    "Earrings & Jhumkas",
    "Bangles & Bracelets",
    "Rings",
    "Bridal & Heritage",
  ] as const,
};

export function formatNpr(amount: number): string {
  return `NPR ${amount.toLocaleString("en-IN")}`;
}

export function buildWhatsAppOrderUrl(product: {
  name: string;
  reference: string;
  price: number;
  id: string;
}): string {
  const currentOrigin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "https://rekhacollection.com";

  const productUrl = `${currentOrigin}/product/${product.id}`;
  const priceFormatted = formatNpr(product.price);

  const message = `Hello Rekha Collection! I would like to order:
Product: ${product.name}
Product Reference: ${product.reference}
Price: ${priceFormatted}
Product Link: ${productUrl}

Please confirm availability, delivery charge, and total payable amount.`;

  return `https://wa.me/${BRAND.phoneRaw}?text=${encodeURIComponent(message)}`;
}
