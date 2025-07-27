'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/home/footer';
import Header from '@/components/home/header';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  const hideHeaderFooter =
    pathname.startsWith('/form-builder') ||
    pathname.includes('/preview') ||
    pathname.includes('/forms') ||
    pathname.includes('/ai-builder') ||
    pathname.includes('/login') ||
    pathname.includes('/demo-form-builder');

  if (hideHeaderFooter) {
    return <>{children}</>;
  }

  return (
    <div className="z-10 flex min-h-screen flex-col justify-between gap-12">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
