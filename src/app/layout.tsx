import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/home/header";
import Footer from "@/components/home/footer";
import { Toaster } from "@/components/ui/toast";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Beautiful, budget-friendly forms without compromises - Forms0",
    template: "%s | Forms0",
  },
  description:
    "Create beautiful forms with Forms0 - An open-source alternative to Typeform and Google Forms. Build surveys, collect responses, and analyze data effortlessly.",
  applicationName: "Forms0",
  authors: [{ name: "Preet Suthar", url: "https://forms0.com" }],
  creator: "Forms0",
  publisher: "Forms0",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://forms0.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://forms0.com",
    siteName: "Forms0",
    title: "Forms0",
    description:
      "Create beautiful, interactive forms with Forms0 - An open-source alternative to Typeform and Google Forms. Build surveys, collect responses, and analyze data effortlessly.",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Forms0",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Forms0",
    creator: "@Forms0",
    title: "Forms0",
    description:
      "Create beautiful, interactive forms with Forms0 - An open-source alternative to Typeform and Google Forms.",
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
    "Forms0",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col justify-between min-h-screen z-10 max-w-6xl w-[90%] mx-auto">
            <Header />
            {children}
            <Toaster position="top-center" />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
