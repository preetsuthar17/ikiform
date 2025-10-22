import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "Ikiform: %s",
  },
  description:
    "Access your Ikiform dashboard to manage forms, view responses, and analyze your data. Streamline your workflow with our open-source form builder.",
  applicationName: "Ikiform",
  authors: [{ name: "Preet Suthar", url: "https://preetsuthar.me" }],
  creator: "Ikiform",
  publisher: "Ikiform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.ikiform.com/dashboard"),
  alternates: {
    canonical: "/dashboard",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.ikiform.com/dashboard",
    siteName: "Ikiform",
    title: "Dashboard | Ikiform",
    description:
      "Manage your forms and responses in the Ikiform dashboard. Analyze data and streamline your workflow with our open-source form builder.",
    images: [
      {
        url: "https://av5on64jc4.ufs.sh/f/jYAIyA6pXigns6CclqBuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa",
        width: 1200,
        height: 630,
        alt: "Ikiform Dashboard",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Ikiform",
    creator: "@Ikiform",
    title: "Dashboard | Ikiform",
    description:
      "Access your Ikiform dashboard to manage forms, view responses, and analyze your data.",
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
    "dashboard",
    "form management",
    "form analytics",
    "Ikiform dashboard",
    "survey responses",
    "data analysis",
    "form builder",
    "open source",
    "form software",
    "workflow",
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
  return <>{children}</>;
}
