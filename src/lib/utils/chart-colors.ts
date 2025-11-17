import * as React from "react";

export function getChartTooltipStyle(isDark?: boolean) {
  const isCurrentlyDark =
    isDark ??
    (typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark"));

  return {
    backgroundColor: isCurrentlyDark ? "hsl(0, 0%, 10%)" : "hsl(0, 0%, 98%)",
    border: `1px solid ${isCurrentlyDark ? "hsl(0, 0%, 15%)" : "hsl(0, 0%, 95%)"}`,
    borderRadius: "8px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    color: isCurrentlyDark ? "hsl(0, 0%, 92%)" : "hsl(0, 0%, 10%)",
  };
}

export function useChartColors() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return {
    isDark,
    tooltipStyle: getChartTooltipStyle(isDark),
  };
}

export function getServerSafeTooltipStyle(isDark = false) {
  return getChartTooltipStyle(isDark);
}
