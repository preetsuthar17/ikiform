'use client';

import { useEffect } from 'react';

interface CSSPropertiesProviderProps {
  borderRadius?: string;
  children: React.ReactNode;
}

export function CSSPropertiesProvider({
  borderRadius = 'md',
  children,
}: CSSPropertiesProviderProps) {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');

    let borderRadiusValue = '8px';
    let cardRadiusValue = '16px';

    switch (borderRadius) {
      case 'none':
        borderRadiusValue = '0px';
        cardRadiusValue = '0px';
        break;
      case 'sm':
        borderRadiusValue = '4px';
        cardRadiusValue = '8px';
        break;
      case 'md':
        borderRadiusValue = '10px';
        cardRadiusValue = '16px';
        break;
      case 'lg':
        borderRadiusValue = '16px';
        cardRadiusValue = '24px';
        break;
      case 'xl':
        borderRadiusValue = '24px';
        cardRadiusValue = '32px';
        break;
    }

    document.documentElement.style.setProperty('--radius', borderRadiusValue);
    document.documentElement.style.setProperty(
      '--card-radius',
      cardRadiusValue
    );

    return () => {
      document.documentElement.style.setProperty('--radius', '0.7rem');
      document.documentElement.style.setProperty('--card-radius', '1rem');
      // Remove forced light theme classes
      document.documentElement.classList.remove('light');
    };
  }, [borderRadius]);

  return <>{children}</>;
}
