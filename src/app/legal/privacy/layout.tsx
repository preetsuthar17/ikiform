import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Privacy Policy",
    template: "Ikiform: %s",
  },
  description:
    "Read the Privacy Policy for Ikiform. Learn how we collect, use, and protect your personal data when you use our form builder services.",
  applicationName: "Ikiform",
  authors: [{ name: "Preet Suthar", url: "https://preetsuthar.me" }],
  creator: "Ikiform",
  publisher: "Ikiform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.ikiform.com"),
  alternates: {
    canonical: "/legal/privacy",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.ikiform.com/legal/privacy",
    siteName: "Ikiform",
    title: "Privacy Policy",
    description:
      "Read the Privacy Policy for Ikiform. Learn how we collect, use, and protect your personal data when you use our form builder services.",
    images: [
      {
        url: "https://av5on64jc4.ufs.sh/f/jYAIyA6pXigns6CclqBuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa",
        width: 1200,
        height: 630,
        alt: "Ikiform Privacy Policy",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Ikiform",
    creator: "@Ikiform",
    title: "Privacy Policy",
    description:
      "Read the Privacy Policy for Ikiform. Learn how we collect, use, and protect your personal data when you use our form builder services.",
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
    "privacy",
    "data protection",
    "Ikiform",
    "form builder privacy",
    "user data",
    "data security",
    "personal information",
    "compliance",
    "user rights",
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
