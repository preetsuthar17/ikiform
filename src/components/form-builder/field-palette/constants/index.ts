// Types
import type { FieldTypeConfig } from "../types";

// Icons
import {
  Type,
  Mail,
  MessageSquare,
  Circle,
  CheckSquare,
  Hash,
  ChevronDown,
  Sliders,
  Tags,
  Share2,
  Calendar,
  PenLine,
  FileUp,
  BarChart3,
  Star,
} from "lucide-react";

export const FIELD_TYPES: FieldTypeConfig[] = [
  {
    type: "text",
    label: "Text Input",
    icon: Type,
    description: "Single line text input",
  },
  {
    type: "email",
    label: "Email",
    icon: Mail,
    description: "Email address input",
  },
  {
    type: "textarea",
    label: "Textarea",
    icon: MessageSquare,
    description: "Multi-line text input",
  },
  {
    type: "number",
    label: "Number",
    icon: Hash,
    description: "Numeric input",
  },
  {
    type: "select",
    label: "Select Dropdown",
    icon: ChevronDown,
    description: "Choose from dropdown options",
  },
  {
    type: "radio",
    label: "Radio Buttons",
    icon: Circle,
    description: "Choose one option",
  },
  {
    type: "checkbox",
    label: "Checkboxes",
    icon: CheckSquare,
    description: "Choose multiple options",
  },
  {
    type: "slider",
    label: "Slider",
    icon: Sliders,
    description: "Select value with slider",
  },
  {
    type: "tags",
    label: "Tag Input",
    icon: Tags,
    description: "Enter multiple tags",
  },
  {
    type: "social",
    label: "Social Media",
    icon: Share2,
    description: "Add social media links",
  },
  {
    type: "date",
    label: "Date",
    icon: Calendar,
    description: "Date input (calendar)",
  },
  {
    type: "signature",
    label: "Signature",
    icon: PenLine,
    description: "Digital signature input (draw with mouse or touch)",
  },
  {
    type: "poll",
    label: "Poll",
    icon: BarChart3,
    description: "Create a poll with multiple options for users to vote",
  },
  {
    type: "rating",
    label: "Rating",
    icon: Star,
    description: "Collect star or custom icon ratings from users",
  },
];

export const PALETTE_CONFIG = {
  COMPACT_GRID_COLS: 2,
  COMPACT_MAX_HEIGHT: "max-h-64",
  HEADER: {
    TITLE: "Form Fields",
    DESCRIPTION: "Click to add fields to your form",
  },
} as const;
