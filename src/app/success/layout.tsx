import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Beautiful, budget-friendly forms without compromises",
    template: "%s | Ikiform",
  },
  description:
    "Create beautiful forms with Ikiform - An open-source alternative to Typeform and Google Forms. Build surveys, collect responses, and analyze data effortlessly.",
  applicationName: "Ikiform",
  authors: [{ name: "Preet Suthar", url: "https://ikiform.com" }],
  creator: "Ikiform",
  publisher: "Ikiform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ikiform.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ikiform.com",
    siteName: "Ikiform",
    title: "Ikiform",
    description:
      "Create beautiful, interactive forms with Ikiform - An open-source alternative to Typeform and Google Forms. Build surveys, collect responses, and analyze data effortlessly.",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Ikiform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Ikiform",
    creator: "@Ikiform",
    title: "Ikiform",
    description:
      "Create beautiful, interactive forms with Ikiform - An open-source alternative to Typeform and Google Forms.",
    images: ["/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
  keywords: [
    "form builder",
    "online forms",
    "surveys",
    "questionnaires",
    "open source",
    "typeform alternative",
    "google forms alternative",
    "form creator",
    "survey tool",
    "data collection",
    "Ikiform",
    "form software",
    "custom forms",
    "interactive forms",
    "form analytics",
  ],
  category: "technology",
  classification: "Business Software",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
