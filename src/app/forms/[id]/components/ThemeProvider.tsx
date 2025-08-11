"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeProviderProps {
  theme?: string;
  children: React.ReactNode;
}

export default function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && theme) {
      setTheme(theme);
    }
  }, [theme, setTheme, mounted]);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
