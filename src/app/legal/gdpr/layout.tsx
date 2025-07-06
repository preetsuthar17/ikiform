import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "GDPR Policy",
    template: "%s | Ikiform",
  },
  description:
    "Read the GDPR compliance policy for Ikiform. Learn how we protect your data, comply with EU regulations, and support your privacy rights.",
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
    canonical: "/legal/gdpr",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ikiform.com/legal/gdpr",
    siteName: "Ikiform",
    title: "GDPR Policy",
    description:
      "Read the GDPR compliance policy for Ikiform. Learn how we protect your data, comply with EU regulations, and support your privacy rights.",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Ikiform GDPR Policy",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Ikiform",
    creator: "@Ikiform",
    title: "GDPR Policy",
    description:
      "Read the GDPR compliance policy for Ikiform. Learn how we protect your data, comply with EU regulations, and support your privacy rights.",
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
    "GDPR",
    "privacy",
    "data protection",
    "compliance",
    "EU regulations",
    "Ikiform",
    "form builder privacy",
    "data rights",
    "user rights",
    "data security",
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
