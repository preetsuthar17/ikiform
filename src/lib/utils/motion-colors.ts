import * as React from 'react';


// Light theme colors
const lightColors = {
  background: 'hsl(0, 0%, 99%)',
  foreground: 'hsl(0, 0%, 10%)',
  card: 'hsl(0, 0%, 98%)',
  cardForeground: 'hsl(0, 0%, 10%)',
  primary: 'hsl(0, 0%, 20%)',
  primaryForeground: 'hsl(0, 0%, 98%)',
  secondary: 'hsl(0, 0%, 94%)',
  secondaryForeground: 'hsl(0, 0%, 20%)',
  muted: 'hsl(0, 0%, 95%)',
  mutedForeground: 'hsl(0, 0%, 40%)',
  accent: 'hsl(0, 0%, 93%)',
  accentForeground: 'hsl(0, 0%, 20%)',
  destructive: 'hsl(0, 60%, 50%)',
  destructiveForeground: 'hsl(0, 0%, 98%)',
  border: 'hsl(0, 0%, 95%)',
  input: 'hsl(0, 0%, 100%)',
  ring: 'hsl(0, 0%, 50%)',
  homeCardBg: 'hsl(228, 79%, 52%)',
} as const;

// Dark theme colors
const darkColors = {
  background: 'hsl(0, 0%, 7%)',
  foreground: 'hsl(0, 0%, 100%)',
  card: 'hsl(0, 0%, 10%)',
  cardForeground: 'hsl(0, 0%, 92%)',
  primary: 'hsl(0, 0%, 100%)',
  primaryForeground: 'hsl(0, 0%, 0%)',
  secondary: 'hsl(0, 0%, 14%)',
  secondaryForeground: 'hsl(0, 0%, 92%)',
  muted: 'hsl(0, 0%, 14%)',
  mutedForeground: 'hsl(0, 0%, 60%)',
  accent: 'hsl(0, 0%, 16%)',
  accentForeground: 'hsl(0, 0%, 92%)',
  destructive: 'hsl(0, 60%, 50%)',
  destructiveForeground: 'hsl(0, 0%, 98%)',
  border: 'hsl(0, 0%, 15%)',
  input: 'hsl(0, 0%, 14%)',
  ring: 'hsl(0, 0%, 48%)',
  homeCardBg: 'hsl(228, 79%, 52%)',
} as const;

type ColorKey = keyof typeof lightColors;

export function getMotionColor(colorKey: ColorKey): string {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return lightColors[colorKey];
  }

  // Check for dark theme
  const isDark = document.documentElement.classList.contains('dark');
  
  return isDark ? darkColors[colorKey] : lightColors[colorKey];
}

export function useMotionColors() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    // Initial check
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const getColor = (colorKey: ColorKey): string => {
    return isDark ? darkColors[colorKey] : lightColors[colorKey];
  };

  return { getColor, isDark };
}

// Export color constants for direct usage
export { lightColors, darkColors };
export type { ColorKey };
