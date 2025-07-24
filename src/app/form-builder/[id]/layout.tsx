import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Form Editor",
    template: "%s — Ikiform",
  },
  description:
    "Create and customize forms easily with the Ikiform Form Editor. Build, edit, and manage your forms with our intuitive, open-source editor.",
  applicationName: "Ikiform",
  authors: [{ name: "Preet Suthar", url: "https://preetsuthar.me" }],
  creator: "Ikiform",
  publisher: "Ikiform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.ikiform.com/form-builder"),
  alternates: {
    canonical: "/form-builder",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.ikiform.com/form-builder",
    siteName: "Ikiform",
    title: "Form Editor | Ikiform",
    description:
      "Design and edit your forms with Ikiform's powerful Form Editor. Drag-and-drop fields, customize layouts, and streamline your form creation process.",
    images: [
      {
        url: "https://av5on64jc4.ufs.sh/f/jYAIyA6pXigns6CclqBuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa",
        width: 1200,
        height: 630,
        alt: "Ikiform Form Editor",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Ikiform",
    creator: "@Ikiform",
    title: "Form Editor | Ikiform",
    description:
      "Build and edit forms effortlessly with Ikiform's open-source Form Editor. Customize fields, layouts, and more.",
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
    "form editor",
    "form builder",
    "custom forms",
    "Ikiform editor",
    "drag and drop forms",
    "form customization",
    "open source form builder",
    "form creation",
    "survey editor",
    "form management",
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
