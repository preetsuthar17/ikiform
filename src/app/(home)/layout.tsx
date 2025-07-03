import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
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
    default: "Beautiful, budget-friendly forms without compromises - Ikiform",
    template: "%s | Ikiform",
  },
  description:
    "Create beautiful forms with Ikiform - An open-source alternative to Typeform and Google Forms. Build surveys, collect responses, and analyze data effortlessly.",
  applicationName: "Ikiform",
  authors: [{ name: "Preet Suthar", url: "https://Ikiform.com" }],
  creator: "Ikiform",
  publisher: "Ikiform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://Ikiform.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://Ikiform.com",
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
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
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

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col justify-between z-10 w-full">
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
