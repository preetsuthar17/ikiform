// External imports
import React from "react";
import { Check } from "lucide-react";

// UI components
import { Card } from "@/components/ui/card";

// types and utilities
import { Theme } from "../types";
import {
  getThemeCardStyles,
  getSelectionIndicatorStyles,
  getImageContainerStyles,
  getImageStyles,
  getSelectionOverlayStyles,
  getGradientOverlayStyles,
  getThemeNameOverlayStyles,
} from "../utils";

interface ThemeCardProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: (themeId: string) => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  isSelected,
  onSelect,
}) => {
  const Icon = theme.icon;

  return (
    <Card
      className={getThemeCardStyles(isSelected)}
      onClick={() => onSelect(theme.id)}
    >
      {isSelected && (
        <div className={getSelectionIndicatorStyles()}>
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
      <div className={getImageContainerStyles()}>
        <img
          src={theme.image}
          alt={`${theme.name} theme preview`}
          className={getImageStyles()}
        />
        {isSelected && <div className={getSelectionOverlayStyles()} />}
        <div className={getGradientOverlayStyles()} />
        <div className={getThemeNameOverlayStyles()}>
          <Icon className="w-4 h-4 text-white" />
          <span className="font-medium text-white text-sm">{theme.name}</span>
        </div>
      </div>
    </Card>
  );
};
