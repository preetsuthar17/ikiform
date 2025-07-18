"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/home/header";
import Footer from "@/components/home/footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  const hideHeaderFooter =
    pathname.startsWith("/form-builder") ||
    pathname.includes("/preview") ||
    pathname.includes("/forms") ||
    pathname.includes("/ai-builder") ||
    pathname.includes("/login") ||
    pathname.includes("/demo-form-builder");

  if (hideHeaderFooter) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col justify-between min-h-screen z-10 gap-12">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
