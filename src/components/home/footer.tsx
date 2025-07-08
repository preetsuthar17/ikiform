"use client";

// External imports
import Link from "next/link";
import React from "react";

// Internal imports
import { Separator } from "../ui/separator";
import { Tabs } from "../ui/tabs";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

export default function Footer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const themeTabs = [
    { id: "light", icon: <Sun className="w-4 h-4" /> },
    { id: "dark", icon: <Moon className="w-4 h-4" /> },
    { id: "system", icon: <Monitor className="w-4 h-4" /> },
  ];
  return (
    <footer className="flex flex-col items-center justify-center text-center gap-12 py-10 text-sm font-inter max-w-[95%] mx-auto w-full">
      <div className="flex flex-col items-center gap-4">
        {mounted && (
          <Tabs
            items={themeTabs}
            value={theme}
            onValueChange={setTheme}
            size="sm"
            className="mx-auto"
          />
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-muted-foreground">
        © {new Date().getFullYear()} ikiform —
        <Link
          href="https://x.com/ikiform"
          className="text-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          @Ikiform
        </Link>
      </div>
    </footer>
  );
}
