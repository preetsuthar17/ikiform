export const FORM_WIDTH_OPTIONS = [
  {
    value: "sm",
    label: "Small",
    description: "400px max width",
    preview: "w-20",
  },
  {
    value: "md",
    label: "Medium",
    description: "600px max width",
    preview: "w-32",
  },
  {
    value: "lg",
    label: "Large",
    description: "800px max width",
    preview: "w-40",
  },
  {
    value: "xl",
    label: "Extra Large",
    description: "1000px max width",
    preview: "w-48",
  },
  {
    value: "full",
    label: "Full Width",
    description: "100% width",
    preview: "w-full",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Custom width value",
    preview: "w-auto",
  },
] as const;

export const GOOGLE_FONTS = [
  { value: "Inter", label: "Inter", category: "Sans Serif" },
  { value: "Roboto", label: "Roboto", category: "Sans Serif" },
  { value: "Open Sans", label: "Open Sans", category: "Sans Serif" },
  { value: "Lato", label: "Lato", category: "Sans Serif" },
  { value: "Poppins", label: "Poppins", category: "Sans Serif" },
  { value: "Montserrat", label: "Montserrat", category: "Sans Serif" },
  { value: "Nunito", label: "Nunito", category: "Sans Serif" },
  { value: "Source Sans Pro", label: "Source Sans Pro", category: "Sans Serif" },
  { value: "Merriweather", label: "Merriweather", category: "Serif" },
  { value: "Playfair Display", label: "Playfair Display", category: "Serif" },
  { value: "Lora", label: "Lora", category: "Serif" },
  { value: "PT Serif", label: "PT Serif", category: "Serif" },
  { value: "Fira Code", label: "Fira Code", category: "Monospace" },
  { value: "JetBrains Mono", label: "JetBrains Mono", category: "Monospace" },
  { value: "Source Code Pro", label: "Source Code Pro", category: "Monospace" },
] as const;

export const FONT_SIZE_OPTIONS = [
  { value: "xs", label: "Extra Small", description: "12px" },
  { value: "sm", label: "Small", description: "14px" },
  { value: "base", label: "Base", description: "16px" },
  { value: "lg", label: "Large", description: "18px" },
  { value: "xl", label: "Extra Large", description: "20px" },
] as const;

export const FONT_WEIGHT_OPTIONS = [
  { value: "light", label: "Light", description: "300" },
  { value: "normal", label: "Normal", description: "400" },
  { value: "medium", label: "Medium", description: "500" },
  { value: "semibold", label: "Semibold", description: "600" },
  { value: "bold", label: "Bold", description: "700" },
] as const;

export const PREDEFINED_COLORS = [
  "transparent", "#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1",
  "#64748b", "#475569", "#334155", "#1e293b", "#0f172a",
  "#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d",
  "#16a34a", "#059669", "#0d9488", "#0891b2", "#0284c7",
  "#2563eb", "#4f46e5", "#7c3aed", "#a855f7", "#c026d3",
  "#db2777", "#e11d48",
] as const;

export const TRANSPARENT_PATTERN = "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='checkerboard' patternUnits='userSpaceOnUse' width='8' height='8'%3e%3crect width='4' height='4' fill='%23f1f1f1'/%3e%3crect x='4' y='4' width='4' height='4' fill='%23f1f1f1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23checkerboard)'/%3e%3c/svg%3e";

export const FORM_BORDER_RADIUS_OPTIONS = [
  {
    value: "none",
    label: "None",
    description: "0px (sharp corners)",
    preview: "rounded-none",
  },
  {
    value: "sm",
    label: "Small",
    description: "4px border radius",
    preview: "rounded-sm",
  },
  {
    value: "md",
    label: "Medium",
    description: "8px border radius",
    preview: "rounded-md",
  },
  {
    value: "lg",
    label: "Large",
    description: "16px border radius",
    preview: "rounded-lg",
  },
  {
    value: "xl",
    label: "Extra Large",
    description: "24px border radius",
    preview: "rounded-xl",
  },
] as const;

export const FORM_PADDING_OPTIONS = [
  {
    value: "none",
    label: "None",
    description: "0px padding",
    preview: "p-0",
  },
  {
    value: "sm",
    label: "Small",
    description: "16px padding",
    preview: "p-4",
  },
  {
    value: "md",
    label: "Medium",
    description: "24px padding",
    preview: "p-6",
  },
  {
    value: "lg",
    label: "Large",
    description: "32px padding",
    preview: "p-8",
  },
] as const;



export const DEFAULT_FORM_DESIGN = {
  maxWidth: "md",
  padding: "md",
  margin: "lg",
  borderRadius: "md",
} as const;
