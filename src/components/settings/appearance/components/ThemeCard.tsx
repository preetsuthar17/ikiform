import { Check } from "lucide-react";
import type React from "react";

import { Card } from "@/components/ui/card";

import type { Theme } from "../types";
import {
  getGradientOverlayStyles,
  getImageContainerStyles,
  getImageStyles,
  getSelectionIndicatorStyles,
  getSelectionOverlayStyles,
  getThemeCardStyles,
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
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
      )}
      <div className={getImageContainerStyles()}>
        <img
          alt={`${theme.name} theme preview`}
          className={getImageStyles()}
          src={theme.image}
        />
        {isSelected && <div className={getSelectionOverlayStyles()} />}
        <div className={getGradientOverlayStyles()} />
        <div className={getThemeNameOverlayStyles()}>
          <Icon className="h-4 w-4 text-white" />
          <span className="font-medium text-sm text-white">{theme.name}</span>
        </div>
      </div>
    </Card>
  );
};
