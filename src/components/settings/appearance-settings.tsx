"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const themes = [
  {
    id: "light",
    name: "Light",
    icon: Sun,
    image: "./theme-preview/light.png",
  },
  {
    id: "dark",
    name: "Dark",
    icon: Moon,
    image: "./theme-preview/dark.png",
  },
  {
    id: "system",
    name: "System",
    icon: Monitor,
    image: "./theme-preview/system.png",
  },
];

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Appearance</h2>
        <p className="text-muted-foreground">
          Customize the appearance of the app. Choose between light, dark, or
          system theme.
        </p>
      </div>

      {/* Theme Selection */}
      <div className="flex flex-col gap-4">
        <Label className="text-base font-medium">Theme</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = theme === themeOption.id;

            return (
              <Card
                key={themeOption.id}
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-md overflow-hidden aspect-square p-0 rounded-card border-0 ${
                  isSelected && "ring-1 ring-ring ring-offset-2"
                }`}
                onClick={() => setTheme(themeOption.id)}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center z-10">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}

                {/* Theme Image with Gradient Overlay */}
                <div className="relative w-full h-full overflow-hidden rounded-card">
                  <img
                    src={themeOption.image}
                    alt={`${themeOption.name} theme preview`}
                    className="w-full h-full object-cover  rounded-card"
                  />
                  {/* Selection overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-foreground/10" />
                  )}
                  {/* Gradient overlay for text visibility */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

                  {/* Theme name overlay */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-white" />
                    <span className="font-medium text-white text-sm">
                      {themeOption.name}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Additional Appearance Settings */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Additional Options</Label>
        <div className="text-sm text-muted-foreground">
          More appearance customization options coming soon...
        </div>
      </div>
    </div>
  );
}
