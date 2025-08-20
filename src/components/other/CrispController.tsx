'use client';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const CrispWithNoSSR = dynamic(() => import('./crisp'), { ssr: false });

export default function CrispController() {
  const pathname = usePathname();

  const shouldHide =
    pathname.startsWith('/forms') ||
    pathname.startsWith('/f') ||
    pathname.startsWith('/dashboard/forms') ||
    (pathname.startsWith('/dashboard/forms/') &&
      pathname.includes('analytics'));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    (window as any).$crisp = (window as any).$crisp || [];

    if (shouldHide) {
      (window as any).$crisp.push(['do', 'chat:hide']);
      (window as any).$crisp.push(['do', 'chat:close']);
    } else {
      (window as any).$crisp.push(['do', 'chat:show']);
    }
  }, [shouldHide]);

  return <CrispWithNoSSR />;
}
