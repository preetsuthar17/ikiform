import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Data Processing Agreement (DPA)",
    template: "%s | Ikiform",
  },
  description:
    "Read the Data Processing Agreement (DPA) for Ikiform. Understand how we process and protect your data as part of our form builder services.",
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
    canonical: "/legal/dpa",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ikiform.com/legal/dpa",
    siteName: "Ikiform",
    title: "Data Processing Agreement (DPA)",
    description:
      "Read the Data Processing Agreement (DPA) for Ikiform. Understand how we process and protect your data as part of our form builder services.",
    images: [
      {
        url: "https://av5on64jc4.ufs.sh/f/jYAIyA6pXigns6CclqBuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa",
        width: 1200,
        height: 630,
        alt: "Ikiform DPA",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Ikiform",
    creator: "@Ikiform",
    title: "Data Processing Agreement (DPA)",
    description:
      "Read the Data Processing Agreement (DPA) for Ikiform. Understand how we process and protect your data as part of our form builder services.",
    images: [
      "https://av5on64jc4.ufs.sh/f/jYAIyA6pXigns6CclqBuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa",
    ],
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
    "data processing agreement",
    "DPA",
    "Ikiform",
    "data protection",
    "compliance",
    "form builder",
    "user data",
    "privacy",
    "legal",
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
