import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FAF6EE",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rekhacollection.com"),
  title: {
    default: "Rekha Collection | Find Your Sparkle | Jewellery Catalogue Butwal",
    template: "%s | Rekha Collection",
  },
  description:
    "Explore timeless jewellery collections at Rekha Collection, Butwal, Nepal. Fine necklaces, bridal chokers, jhumkas, bangles, and rings. Cash on delivery available all over Nepal. Order via WhatsApp.",
  keywords: [
    "Rekha Collection",
    "Jewellery Butwal",
    "Nepal Jewellery",
    "Bridal Jewellery Nepal",
    "Gold Jewellery Butwal",
    "Cash on delivery Nepal jewellery",
    "Elegance in every sparkle",
  ],
  authors: [{ name: "Rekha Collection" }],
  creator: "Rekha Collection",
  publisher: "Rekha Collection",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_NP",
    url: "https://rekhacollection.com",
    title: "Rekha Collection | Find Your Sparkle",
    description:
      "Fine jewellery catalogue based in Butwal, Nepal. Cash on delivery all over Nepal. Handcrafted bridal sets, jhumkas, bangles, and rings.",
    siteName: "Rekha Collection",
    images: [
      {
        url: "/rekha-logo.png",
        width: 800,
        height: 800,
        alt: "Rekha Collection Logo - Elegance in every sparkle",
      },
    ],
  },
  icons: {
    icon: "/rekha-logo.png",
    apple: "/rekha-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#FAF6EE] text-[#211A14] font-sans antialiased selection:bg-[#E8C99F] selection:text-[#211A14]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
