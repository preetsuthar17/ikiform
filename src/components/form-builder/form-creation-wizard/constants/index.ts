import { FileText, Layers } from "lucide-react";

import type { FormTypeDefinition } from "../types";

export const FORM_TYPES: FormTypeDefinition[] = [
  {
    id: "single",
    title: "Single Page Form",
    description: "Traditional form with all fields on one page",
    icon: FileText,
    features: [
      "All fields visible at once",
      "Simple submission flow",
      "Best for short forms",
      "Quick to fill out",
    ],
  },
  {
    id: "multi",
    title: "Multi-Step Form",
    description: "Guided form experience with multiple steps",
    icon: Layers,
    features: [
      "Step-by-step guidance",
      "Progress tracking",
      "Better user experience",
      "Ideal for longer forms",
    ],
  },
];
