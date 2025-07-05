import { LucideIcon } from "lucide-react";

export interface Theme {
  id: string;
  name: string;
  icon: LucideIcon;
  image: string;
}

export type ThemeId = "light" | "dark" | "system";
