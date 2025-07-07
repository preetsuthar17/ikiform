// utilities
import { cn } from "@/lib/utils";

export const getThemeCardStyles = (isSelected: boolean): string => {
  return cn(
    "relative cursor-pointer transition-all duration-200 hover:shadow-md overflow-hidden aspect-square rounded-card p-0",
    isSelected && "ring-1 ring-ring ring-offset-2",
  );
};

export const getSelectionIndicatorStyles = (): string => {
  return "absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center z-10";
};

export const getImageContainerStyles = (): string => {
  return "relative w-full h-full overflow-hidden rounded-card flex items-center justify-center";
};

export const getImageStyles = (): string => {
  return "w-full h-full object-cover rounded-card";
};

export const getSelectionOverlayStyles = (): string => {
  return "absolute inset-0 bg-foreground/10 flex items-center justify-center";
};

export const getGradientOverlayStyles = (): string => {
  return "absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent";
};

export const getThemeNameOverlayStyles = (): string => {
  return "absolute bottom-3 left-3 flex items-center gap-2";
};
