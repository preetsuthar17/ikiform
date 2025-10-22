import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Analytics",
    template: "Ikiform: %s",
  },
  description:
    "Analyze your form responses with Ikiform Analytics. Gain insights, visualize trends, and make data-driven decisions with our open-source analytics tools.",
  applicationName: "Ikiform",
  authors: [{ name: "Preet Suthar", url: "https://preetsuthar.me" }],
  creator: "Ikiform",
  publisher: "Ikiform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.ikiform.com/dashboard/forms/analytics"),
  alternates: {
    canonical: "/dashboard/forms/analytics",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.ikiform.com/dashboard/forms/analytics",
    siteName: "Ikiform",
    title: "Analytics | Ikiform",
    description:
      "Visualize and analyze your form data with Ikiform Analytics. Unlock actionable insights and improve your workflow.",
    images: [
      {
        url: "https://av5on64jc4.ufs.sh/f/jYAIyA6pXigns6CclqBuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa",
        width: 1200,
        height: 630,
        alt: "Ikiform Analytics Dashboard",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Ikiform",
    creator: "@Ikiform",
    title: "Analytics | Ikiform",
    description:
      "Explore analytics for your forms and responses with Ikiform. Visualize trends and make informed decisions.",
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
    "analytics",
    "form analytics",
    "data visualization",
    "Ikiform analytics",
    "survey insights",
    "data trends",
    "form responses",
    "open source analytics",
    "dashboard",
    "data-driven decisions",
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
