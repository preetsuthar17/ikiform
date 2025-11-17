import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";

export interface FormPreset {
  id: string;
  name: string;
  description: string;
  category: "minimal" | "professional" | "creative" | "elegant" | "modern";
  thumbnail?: string;
  settings: Partial<LocalSettings>;
}

export const FORM_PRESETS: FormPreset[] = [
  {
    id: "minimal-clean",
    name: "Clean Minimal",
    description: "Simple, clean design with subtle borders",
    category: "minimal",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "md",
        borderRadius: "lg",
        spacing: "normal",
        alignment: "left",
      },
      colors: {
        background: "#ffffff",
        text: "#1f2937",
        primary: "#3b82f6",
        border: "#e5e7eb",
      },
      typography: {
        fontFamily: "Inter",
        fontSize: "base",
        fontWeight: "normal",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "minimal-white",
    name: "Pure White",
    description: "Minimal white background with subtle shadows",
    category: "minimal",
    settings: {
      layout: {
        maxWidth: "sm",
        padding: "lg",
        margin: "lg",
        borderRadius: "xl",
        spacing: "relaxed",
        alignment: "center",
      },
      colors: {
        background: "#ffffff",
        text: "#374151",
        primary: "#6b7280",
        border: "#f3f4f6",
      },
      typography: {
        fontFamily: "DM Sans",
        fontSize: "sm",
        fontWeight: "normal",
        lineHeight: "relaxed",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "minimal-paper",
    name: "Paper Simple",
    description: "Warm off-white background like paper with soft edges",
    category: "minimal",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "lg",
        borderRadius: "md",
        spacing: "relaxed",
        alignment: "left",
      },
      colors: {
        background: "#fefefe",
        text: "#2d3748",
        primary: "#4a5568",
        border: "#edf2f7",
      },
      typography: {
        fontFamily: "Source Sans Pro",
        fontSize: "base",
        fontWeight: "normal",
        lineHeight: "relaxed",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "minimal-zen",
    name: "Zen Minimal",
    description: "Ultra-minimal design with maximum white space",
    category: "minimal",
    settings: {
      layout: {
        maxWidth: "sm",
        padding: "lg",
        margin: "lg",
        borderRadius: "none",
        spacing: "relaxed",
        alignment: "center",
      },
      colors: {
        background: "#fdfdfd",
        text: "#2d3748",
        primary: "#718096",
        border: "#f7fafc",
      },
      typography: {
        fontFamily: "Lato",
        fontSize: "base",
        fontWeight: "light",
        lineHeight: "relaxed",
        letterSpacing: "wide",
      },
    },
  },

  {
    id: "professional-corporate",
    name: "Corporate Blue",
    description: "Professional blue theme for business forms",
    category: "professional",
    settings: {
      layout: {
        maxWidth: "lg",
        padding: "lg",
        margin: "md",
        borderRadius: "md",
        spacing: "normal",
        alignment: "left",
      },
      colors: {
        background: "#f8fafc",
        text: "#1e293b",
        primary: "#1e40af",
        border: "#cbd5e1",
      },
      typography: {
        fontFamily: "Inter",
        fontSize: "base",
        fontWeight: "medium",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "professional-slate",
    name: "Slate Professional",
    description: "Modern slate color scheme for professional use",
    category: "professional",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "md",
        borderRadius: "lg",
        spacing: "normal",
        alignment: "left",
      },
      colors: {
        background: "#ffffff",
        text: "#0f172a",
        primary: "#475569",
        border: "#e2e8f0",
      },
      typography: {
        fontFamily: "Work Sans",
        fontSize: "base",
        fontWeight: "medium",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "professional-navy",
    name: "Executive Navy",
    description: "Distinguished navy theme for executive communications",
    category: "professional",
    settings: {
      layout: {
        maxWidth: "lg",
        padding: "lg",
        margin: "md",
        borderRadius: "sm",
        spacing: "normal",
        alignment: "left",
      },
      colors: {
        background: "#f1f5f9",
        text: "#0f172a",
        primary: "#1e3a8a",
        border: "#cbd5e1",
      },
      typography: {
        fontFamily: "Roboto",
        fontSize: "base",
        fontWeight: "medium",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "professional-forest",
    name: "Forest Green",
    description: "Earthy green theme for sustainable businesses",
    category: "professional",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "md",
        borderRadius: "lg",
        spacing: "normal",
        alignment: "left",
      },
      colors: {
        background: "#f0fdf4",
        text: "#14532d",
        primary: "#15803d",
        border: "#bbf7d0",
      },
      typography: {
        fontFamily: "Open Sans",
        fontSize: "base",
        fontWeight: "medium",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
    },
  },

  {
    id: "creative-gradient",
    name: "Gradient Magic",
    description: "Vibrant gradient background with modern typography",
    category: "creative",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "lg",
        borderRadius: "xl",
        spacing: "relaxed",
        alignment: "center",
      },
      colors: {
        background: "#fef3c7",
        text: "#1f2937",
        primary: "#f59e0b",
        border: "#fed7aa",
      },
      typography: {
        fontFamily: "Poppins",
        fontSize: "lg",
        fontWeight: "medium",
        lineHeight: "relaxed",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "creative-dark",
    name: "Dark Creative",
    description: "Dark theme with bright accent colors",
    category: "creative",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "md",
        borderRadius: "lg",
        spacing: "normal",
        alignment: "left",
      },
      colors: {
        background: "#1f2937",
        text: "#f9fafb",
        primary: "#10b981",
        border: "#374151",
      },
      typography: {
        fontFamily: "Nunito",
        fontSize: "base",
        fontWeight: "normal",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "creative-sunset",
    name: "Sunset Vibes",
    description: "Warm sunset colors with playful typography",
    category: "creative",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "lg",
        borderRadius: "xl",
        spacing: "relaxed",
        alignment: "center",
      },
      colors: {
        background: "#fff7ed",
        text: "#9a3412",
        primary: "#ea580c",
        border: "#fed7aa",
      },
      typography: {
        fontFamily: "Montserrat",
        fontSize: "base",
        fontWeight: "medium",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "creative-ocean",
    name: "Ocean Wave",
    description: "Cool ocean-inspired blues and teals",
    category: "creative",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "md",
        borderRadius: "lg",
        spacing: "normal",
        alignment: "left",
      },
      colors: {
        background: "#ecfeff",
        text: "#164e63",
        primary: "#0891b2",
        border: "#a7f3d0",
      },
      typography: {
        fontFamily: "Quicksand",
        fontSize: "base",
        fontWeight: "medium",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "creative-berry",
    name: "Berry Burst",
    description: "Rich berry colors with energetic styling",
    category: "creative",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "lg",
        borderRadius: "xl",
        spacing: "relaxed",
        alignment: "center",
      },
      colors: {
        background: "#fdf2f8",
        text: "#831843",
        primary: "#be185d",
        border: "#fbcfe8",
      },
      typography: {
        fontFamily: "Raleway",
        fontSize: "base",
        fontWeight: "medium",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
    },
  },

  {
    id: "elegant-serif",
    name: "Elegant Serif",
    description: "Classic serif typography with refined styling",
    category: "elegant",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "lg",
        borderRadius: "md",
        spacing: "relaxed",
        alignment: "center",
      },
      colors: {
        background: "#fffbeb",
        text: "#292524",
        primary: "#92400e",
        border: "#fde68a",
      },
      typography: {
        fontFamily: "Playfair Display",
        fontSize: "lg",
        fontWeight: "normal",
        lineHeight: "relaxed",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "elegant-gold",
    name: "Golden Elegance",
    description: "Luxurious gold accents with elegant typography",
    category: "elegant",
    settings: {
      layout: {
        maxWidth: "sm",
        padding: "lg",
        margin: "lg",
        borderRadius: "lg",
        spacing: "relaxed",
        alignment: "center",
      },
      colors: {
        background: "#fefce8",
        text: "#451a03",
        primary: "#d97706",
        border: "#fde047",
      },
      typography: {
        fontFamily: "Crimson Text",
        fontSize: "base",
        fontWeight: "normal",
        lineHeight: "relaxed",
        letterSpacing: "wide",
      },
    },
  },
  {
    id: "elegant-marble",
    name: "Marble Classic",
    description: "Sophisticated marble-inspired design with classical elements",
    category: "elegant",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "lg",
        borderRadius: "md",
        spacing: "relaxed",
        alignment: "center",
      },
      colors: {
        background: "#fafaf9",
        text: "#1c1917",
        primary: "#78716c",
        border: "#e7e5e4",
      },
      typography: {
        fontFamily: "Cormorant Garamond",
        fontSize: "lg",
        fontWeight: "normal",
        lineHeight: "relaxed",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "elegant-midnight",
    name: "Midnight Elegance",
    description: "Dark elegant theme with gold accents",
    category: "elegant",
    settings: {
      layout: {
        maxWidth: "sm",
        padding: "lg",
        margin: "lg",
        borderRadius: "lg",
        spacing: "relaxed",
        alignment: "center",
      },
      colors: {
        background: "#18181b",
        text: "#fafafa",
        primary: "#eab308",
        border: "#27272a",
      },
      typography: {
        fontFamily: "Libre Baskerville",
        fontSize: "base",
        fontWeight: "normal",
        lineHeight: "relaxed",
        letterSpacing: "wide",
      },
    },
  },
  {
    id: "elegant-rose",
    name: "Rose Garden",
    description: "Soft rose tones with romantic elegant styling",
    category: "elegant",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "lg",
        borderRadius: "lg",
        spacing: "relaxed",
        alignment: "center",
      },
      colors: {
        background: "#fef7f0",
        text: "#7c2d12",
        primary: "#c2410c",
        border: "#fed7aa",
      },
      typography: {
        fontFamily: "Lora",
        fontSize: "base",
        fontWeight: "normal",
        lineHeight: "relaxed",
        letterSpacing: "normal",
      },
    },
  },

  {
    id: "modern-tech",
    name: "Tech Modern",
    description: "Modern tech-inspired design with clean lines",
    category: "modern",
    settings: {
      layout: {
        maxWidth: "lg",
        padding: "md",
        margin: "sm",
        borderRadius: "sm",
        spacing: "compact",
        alignment: "left",
      },
      colors: {
        background: "#ffffff",
        text: "#111827",
        primary: "#7c3aed",
        border: "#e5e7eb",
      },
      typography: {
        fontFamily: "JetBrains Mono",
        fontSize: "sm",
        fontWeight: "medium",
        lineHeight: "tight",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "modern-neon",
    name: "Neon Modern",
    description: "Futuristic neon accents with modern styling",
    category: "modern",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "md",
        borderRadius: "xl",
        spacing: "normal",
        alignment: "left",
      },
      colors: {
        background: "#0f172a",
        text: "#e2e8f0",
        primary: "#06b6d4",
        border: "#1e293b",
      },
      typography: {
        fontFamily: "Plus Jakarta Sans",
        fontSize: "base",
        fontWeight: "medium",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "modern-glass",
    name: "Glass Morphism",
    description: "Modern glassmorphism effect with transparency",
    category: "modern",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "lg",
        borderRadius: "xl",
        spacing: "normal",
        alignment: "center",
      },
      colors: {
        background: "#f8fafc",
        text: "#1e293b",
        primary: "#3b82f6",
        border: "#e2e8f0",
      },
      typography: {
        fontFamily: "Inter",
        fontSize: "base",
        fontWeight: "medium",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "modern-carbon",
    name: "Carbon Fiber",
    description: "Sleek dark theme inspired by carbon fiber",
    category: "modern",
    settings: {
      layout: {
        maxWidth: "lg",
        padding: "md",
        margin: "sm",
        borderRadius: "sm",
        spacing: "compact",
        alignment: "left",
      },
      colors: {
        background: "#0a0a0a",
        text: "#fafafa",
        primary: "#22d3ee",
        border: "#262626",
      },
      typography: {
        fontFamily: "Space Grotesk",
        fontSize: "sm",
        fontWeight: "medium",
        lineHeight: "tight",
        letterSpacing: "tight",
      },
    },
  },
  {
    id: "modern-arctic",
    name: "Arctic Modern",
    description: "Clean arctic white with cool blue accents",
    category: "modern",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "md",
        borderRadius: "lg",
        spacing: "normal",
        alignment: "left",
      },
      colors: {
        background: "#ffffff",
        text: "#0f172a",
        primary: "#0284c7",
        border: "#f1f5f9",
      },
      typography: {
        fontFamily: "Outfit",
        fontSize: "base",
        fontWeight: "medium",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
    },
  },
  {
    id: "modern-electric",
    name: "Electric Purple",
    description: "Bold electric purple with high contrast",
    category: "modern",
    settings: {
      layout: {
        maxWidth: "md",
        padding: "lg",
        margin: "md",
        borderRadius: "lg",
        spacing: "normal",
        alignment: "left",
      },
      colors: {
        background: "#faf5ff",
        text: "#581c87",
        primary: "#8b5cf6",
        border: "#e9d5ff",
      },
      typography: {
        fontFamily: "Manrope",
        fontSize: "base",
        fontWeight: "medium",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
    },
  },
];

export function getPresetsByCategory(category: FormPreset["category"]) {
  return FORM_PRESETS.filter((preset) => preset.category === category);
}

export function getPresetById(id: string) {
  return FORM_PRESETS.find((preset) => preset.id === id);
}

export const PRESET_CATEGORIES = [
  { id: "minimal", label: "Minimal", description: "Clean and simple designs" },
  {
    id: "professional",
    label: "Professional",
    description: "Business-ready forms",
  },
  { id: "creative", label: "Creative", description: "Bold and vibrant styles" },
  { id: "elegant", label: "Elegant", description: "Sophisticated and refined" },
  {
    id: "modern",
    label: "Modern",
    description: "Contemporary and tech-inspired",
  },
] as const;
