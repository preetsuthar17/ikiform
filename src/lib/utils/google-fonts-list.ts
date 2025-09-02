// Popular Google Fonts categorized by style
export const GOOGLE_FONTS_CATEGORIES = {
  "Sans Serif": [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Source Sans Pro",
    "Oswald",
    "Raleway",
    "PT Sans",
    "Lora",
    "Nunito",
    "Ubuntu",
    "Poppins",
    "Mukti",
    "Fira Sans",
    "Work Sans",
    "Noto Sans",
    "IBM Plex Sans",
    "Rubik",
    "Barlow",
    "DM Sans",
    "Manrope",
    "Outfit",
    "Plus Jakarta Sans",
    "Lexend",
    "Geist",
  ],
  Serif: [
    "Playfair Display",
    "Merriweather",
    "PT Serif",
    "Georgia",
    "Crimson Text",
    "Libre Baskerville",
    "Cormorant Garamond",
    "Vollkorn",
    "Cardo",
    "Gentium Plus",
    "EB Garamond",
    "Noticia Text",
    "Bitter",
    "Arvo",
    "Rokkitt",
    "Spectral",
    "IBM Plex Serif",
    "Source Serif Pro",
    "Noto Serif",
    "Literata",
  ],
  Display: [
    "Bebas Neue",
    "Fredoka One",
    "Righteous",
    "Lobster",
    "Pacifico",
    "Dancing Script",
    "Satisfy",
    "Great Vibes",
    "Amatic SC",
    "Caveat",
    "Bangers",
    "Creepster",
    "Orbitron",
    "Exo 2",
    "Russo One",
    "Anton",
    "Fjalla One",
    "Alfa Slab One",
    "Bungee",
    "Permanent Marker",
  ],
  Monospace: [
    "Fira Code",
    "JetBrains Mono",
    "Source Code Pro",
    "IBM Plex Mono",
    "Roboto Mono",
    "Space Mono",
    "Inconsolata",
    "Monaco",
    "Courier Prime",
    "Ubuntu Mono",
    "PT Mono",
    "Noto Sans Mono",
    "Overpass Mono",
    "Cutive Mono",
    "Share Tech Mono",
  ],
} as const;

export const ALL_GOOGLE_FONTS = Object.values(GOOGLE_FONTS_CATEGORIES).flat();

export interface GoogleFont {
  family: string;
  category: keyof typeof GOOGLE_FONTS_CATEGORIES;
  variants: string[];
  subsets: string[];
}

// Enhanced Google Fonts data with metadata
export const GOOGLE_FONTS_DATA: GoogleFont[] = [
  // Sans Serif
  {
    family: "Inter",
    category: "Sans Serif",
    variants: ["400", "500", "600", "700"],
    subsets: ["latin"],
  },
  {
    family: "Roboto",
    category: "Sans Serif",
    variants: ["300", "400", "500", "700"],
    subsets: ["latin"],
  },
  {
    family: "Open Sans",
    category: "Sans Serif",
    variants: ["400", "600", "700"],
    subsets: ["latin"],
  },
  {
    family: "Lato",
    category: "Sans Serif",
    variants: ["400", "700"],
    subsets: ["latin"],
  },
  {
    family: "Montserrat",
    category: "Sans Serif",
    variants: ["400", "500", "600", "700"],
    subsets: ["latin"],
  },
  {
    family: "Poppins",
    category: "Sans Serif",
    variants: ["400", "500", "600", "700"],
    subsets: ["latin"],
  },
  {
    family: "Nunito",
    category: "Sans Serif",
    variants: ["400", "600", "700"],
    subsets: ["latin"],
  },
  {
    family: "Work Sans",
    category: "Sans Serif",
    variants: ["400", "500", "600"],
    subsets: ["latin"],
  },
  {
    family: "DM Sans",
    category: "Sans Serif",
    variants: ["400", "500", "700"],
    subsets: ["latin"],
  },
  {
    family: "Plus Jakarta Sans",
    category: "Sans Serif",
    variants: ["400", "500", "600", "700"],
    subsets: ["latin"],
  },

  // Serif
  {
    family: "Playfair Display",
    category: "Serif",
    variants: ["400", "500", "600", "700"],
    subsets: ["latin"],
  },
  {
    family: "Merriweather",
    category: "Serif",
    variants: ["400", "700"],
    subsets: ["latin"],
  },
  {
    family: "PT Serif",
    category: "Serif",
    variants: ["400", "700"],
    subsets: ["latin"],
  },
  {
    family: "Crimson Text",
    category: "Serif",
    variants: ["400", "600"],
    subsets: ["latin"],
  },
  {
    family: "EB Garamond",
    category: "Serif",
    variants: ["400", "500", "600"],
    subsets: ["latin"],
  },
  {
    family: "Spectral",
    category: "Serif",
    variants: ["400", "500", "600"],
    subsets: ["latin"],
  },
  {
    family: "IBM Plex Serif",
    category: "Serif",
    variants: ["400", "500", "600"],
    subsets: ["latin"],
  },
  {
    family: "Literata",
    category: "Serif",
    variants: ["400", "500", "600"],
    subsets: ["latin"],
  },

  // Display
  {
    family: "Bebas Neue",
    category: "Display",
    variants: ["400"],
    subsets: ["latin"],
  },
  {
    family: "Oswald",
    category: "Display",
    variants: ["400", "500", "600"],
    subsets: ["latin"],
  },
  {
    family: "Righteous",
    category: "Display",
    variants: ["400"],
    subsets: ["latin"],
  },
  {
    family: "Lobster",
    category: "Display",
    variants: ["400"],
    subsets: ["latin"],
  },
  {
    family: "Dancing Script",
    category: "Display",
    variants: ["400", "700"],
    subsets: ["latin"],
  },
  {
    family: "Caveat",
    category: "Display",
    variants: ["400", "700"],
    subsets: ["latin"],
  },
  {
    family: "Amatic SC",
    category: "Display",
    variants: ["400", "700"],
    subsets: ["latin"],
  },

  // Monospace
  {
    family: "Fira Code",
    category: "Monospace",
    variants: ["400", "500", "700"],
    subsets: ["latin"],
  },
  {
    family: "JetBrains Mono",
    category: "Monospace",
    variants: ["400", "500", "700"],
    subsets: ["latin"],
  },
  {
    family: "Source Code Pro",
    category: "Monospace",
    variants: ["400", "500", "600"],
    subsets: ["latin"],
  },
  {
    family: "IBM Plex Mono",
    category: "Monospace",
    variants: ["400", "500", "600"],
    subsets: ["latin"],
  },
  {
    family: "Roboto Mono",
    category: "Monospace",
    variants: ["400", "500"],
    subsets: ["latin"],
  },
];

export function getFontsByCategory(
  category: keyof typeof GOOGLE_FONTS_CATEGORIES
) {
  return GOOGLE_FONTS_DATA.filter((font) => font.category === category);
}

export function searchFonts(query: string) {
  const lowercaseQuery = query.toLowerCase();
  return GOOGLE_FONTS_DATA.filter((font) =>
    font.family.toLowerCase().includes(lowercaseQuery)
  );
}

export function getFontVariants(fontFamily: string) {
  const font = GOOGLE_FONTS_DATA.find((f) => f.family === fontFamily);
  return font?.variants || ["400"];
}
