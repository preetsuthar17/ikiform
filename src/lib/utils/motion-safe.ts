import * as React from "react";
import { type ColorKey, useMotionColors } from "./motion-colors";

export function sanitizeAnimationValue(value: any): any {
  if (value === undefined || value === null) {
    return 0;
  }

  if (typeof value === "string") {
    // Replace transparent with proper rgba
    if (value === "transparent") {
      return "rgba(0, 0, 0, 0)";
    }

    // Check for CSS variables and warn in development
    if (value.includes("var(--") && process.env.NODE_ENV === "development") {
      console.warn(
        `CSS variable detected in animation: ${value}. Consider using motion-safe colors instead.`
      );
    }
  }

  return value;
}

export interface MotionSafeVariants {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  whileHover?: Record<string, any>;
  whileTap?: Record<string, any>;
  whileFocus?: Record<string, any>;
}

export function sanitizeVariants(
  variants: MotionSafeVariants
): MotionSafeVariants {
  const sanitizedVariants: MotionSafeVariants = {};

  for (const [key, variant] of Object.entries(variants)) {
    if (variant && typeof variant === "object") {
      sanitizedVariants[key as keyof MotionSafeVariants] = Object.fromEntries(
        Object.entries(variant).map(([prop, value]) => [
          prop,
          sanitizeAnimationValue(value),
        ])
      );
    }
  }

  return sanitizedVariants;
}

export function useMotionSafeColors() {
  const { getColor, isDark } = useMotionColors();

  const createColorVariants = React.useCallback(
    (lightColor: ColorKey | string, darkColor?: ColorKey | string) => {
      const resolvedColor =
        typeof lightColor === "string" ? lightColor : getColor(lightColor);

      const resolvedDarkColor = darkColor
        ? typeof darkColor === "string"
          ? darkColor
          : getColor(darkColor)
        : resolvedColor;

      return isDark ? resolvedDarkColor : resolvedColor;
    },
    [getColor, isDark]
  );

  const safeOpacity = React.useCallback((value?: number) => {
    return value ?? 0;
  }, []);

  const safeBackgroundColor = React.useCallback(
    (color: ColorKey | string, fallback = "rgba(0, 0, 0, 0)") => {
      if (typeof color === "string" && color.includes("var(--")) {
        console.warn(
          `CSS variable in backgroundColor: ${color}, using fallback`
        );
        return fallback;
      }

      if (color === "transparent") {
        return "rgba(0, 0, 0, 0)";
      }

      return typeof color === "string" ? color : getColor(color);
    },
    [getColor]
  );

  const safeBorderColor = React.useCallback(
    (color: ColorKey | string, fallback = "rgba(0, 0, 0, 0.1)") => {
      if (typeof color === "string" && color.includes("var(--")) {
        console.warn(`CSS variable in borderColor: ${color}, using fallback`);
        return fallback;
      }

      if (color === "transparent") {
        return "rgba(0, 0, 0, 0)";
      }

      return typeof color === "string" ? color : getColor(color);
    },
    [getColor]
  );

  return {
    createColorVariants,
    safeOpacity,
    safeBackgroundColor,
    safeBorderColor,
    getColor,
    isDark,
  };
}

export const motionSafePresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },

  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },

  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },

  // Button hover effects with safe colors
  buttonHover: (baseColor = "rgba(0, 0, 0, 0.05)") => ({
    whileHover: {
      backgroundColor:
        baseColor === "transparent" ? "rgba(0, 0, 0, 0.05)" : baseColor,
    },
    whileTap: {
      scale: 0.98,
      backgroundColor:
        baseColor === "transparent" ? "rgba(0, 0, 0, 0.1)" : baseColor,
    },
  }),
} as const;

export type MotionSafePreset = keyof typeof motionSafePresets;
