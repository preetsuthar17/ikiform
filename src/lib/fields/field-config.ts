import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckSquare,
  ChevronDown,
  Circle,
  Clock,
  Hash,
  Link2,
  Mail,
  MapPin,
  MessageSquare,
  PenLine,
  Phone,
  Share2,
  Sliders,
  Square,
  Star,
  Tags,
  Type,
  Upload,
} from "lucide-react";
import type { FormField } from "@/lib/database";

export interface FieldTypeConfig {
  type: FormField["type"];
  label: string;
  description: string;
  icon: LucideIcon;
  category: "input" | "selection" | "media" | "layout" | "advanced";
  defaultLabel: string;
  defaultPlaceholder?: string;
  defaultOptions?: string[];
  defaultSettings?: Partial<FormField["settings"]>;
  canBeGrouped?: boolean;
}

export const FIELD_TYPE_CONFIGS: FieldTypeConfig[] = [
  {
    type: "text",
    label: "Text Input",
    description: "A single line for short text responses.",
    icon: Type,
    category: "input",
    defaultLabel: "Text Field",
    defaultPlaceholder: "Enter text",
    canBeGrouped: true,
  },
  {
    type: "email",
    label: "Email",
    description: "Collect a valid email address.",
    icon: Mail,
    category: "input",
    defaultLabel: "Email Field",
    defaultPlaceholder: "Enter email address",
    canBeGrouped: true,
  },
  {
    type: "number",
    label: "Number",
    description: "Input for numeric values.",
    icon: Hash,
    category: "input",
    defaultLabel: "Number Field",
    defaultPlaceholder: "Enter number",
    canBeGrouped: true,
  },
  {
    type: "phone",
    label: "Phone Number",
    description: "Input for phone numbers with validation.",
    icon: Phone,
    category: "input",
    defaultLabel: "Phone Field",
    defaultPlaceholder: "Enter phone number",
    canBeGrouped: true,
  },
  {
    type: "textarea",
    label: "Textarea",
    description: "A multi-line field for longer text.",
    icon: MessageSquare,
    category: "input",
    defaultLabel: "Textarea Field",
    defaultPlaceholder: "Enter text",
    defaultSettings: { rows: 4 },
  },
  {
    type: "date",
    label: "Date",
    description: "Pick a date from a calendar.",
    icon: Calendar,
    category: "input",
    defaultLabel: "Date Field",
    canBeGrouped: true,
  },
  {
    type: "time",
    label: "Time",
    description: "Select or enter a time value.",
    icon: Clock,
    category: "input",
    defaultLabel: "Time Field",
    canBeGrouped: true,
  },
  {
    type: "address",
    label: "Address",
    description: "Input for street, city, and other address details.",
    icon: MapPin,
    category: "input",
    defaultLabel: "Address Field",
  },
  {
    type: "link",
    label: "Link",
    description: "Input for a valid website URL.",
    icon: Link2,
    category: "input",
    defaultLabel: "Link Field",
    defaultPlaceholder: "Enter URL",
    canBeGrouped: true,
  },

  {
    type: "select",
    label: "Select Dropdown",
    description: "Dropdown to choose one option.",
    icon: ChevronDown,
    category: "selection",
    defaultLabel: "Select Field",
    defaultOptions: ["Option 1", "Option 2"],
    canBeGrouped: true,
  },
  {
    type: "radio",
    label: "Radio Buttons",
    description: "Pick a single option from a list.",
    icon: Circle,
    category: "selection",
    defaultLabel: "Radio Field",
    defaultOptions: ["Option 1", "Option 2"],
    canBeGrouped: true,
  },
  {
    type: "checkbox",
    label: "Checkboxes",
    description: "Select one or more options.",
    icon: CheckSquare,
    category: "selection",
    defaultLabel: "Checkbox Field",
    defaultOptions: ["Option 1", "Option 2"],
    canBeGrouped: true,
  },
  {
    type: "slider",
    label: "Slider",
    description: "Pick a value by sliding a handle.",
    icon: Sliders,
    category: "selection",
    defaultLabel: "Slider Field",
    defaultSettings: { min: 0, max: 100, step: 1, defaultValue: 50 },
  },
  {
    type: "rating",
    label: "Rating",
    description: "Collect a star or icon rating.",
    icon: Star,
    category: "selection",
    defaultLabel: "Rating Field",
    defaultSettings: { starCount: 5 },
  },
  {
    type: "poll",
    label: "Poll",
    description: "Let users vote on multiple options.",
    icon: BarChart3,
    category: "selection",
    defaultLabel: "Poll Field",
    defaultOptions: ["Option 1", "Option 2"],
    defaultSettings: { pollOptions: ["Option 1", "Option 2"] },
  },

  {
    type: "file",
    label: "File Upload",
    description: "Upload files with size and type limits.",
    icon: Upload,
    category: "media",
    defaultLabel: "File Upload Field",
  },
  {
    type: "signature",
    label: "Signature",
    description: "Draw or sign with mouse or touch.",
    icon: PenLine,
    category: "media",
    defaultLabel: "Signature Field",
  },

  {
    type: "statement",
    label: "Statement",
    description: "Display a heading or description in the form.",
    icon: MessageSquare,
    category: "layout",
    defaultLabel: "",
    defaultSettings: {
      statementHeading: "Heading",
      statementDescription: "Description text",
      statementAlign: "left",
      statementSize: "md",
    },
  },
  {
    type: "banner",
    label: "Banner",
    description: "Show a highlighted message or warning.",
    icon: AlertTriangle,
    category: "layout",
    defaultLabel: "",
    defaultSettings: {
      bannerVariant: "info",
      bannerTitle: "",
      bannerDescription: "Highlight disclaimers, warnings, or key benefits.",
    },
  },
  {
    type: "field-group",
    label: "Field Group",
    description: "Group fields together in a row.",
    icon: Square,
    category: "layout",
    defaultLabel: "Field Group",
    defaultSettings: {
      groupFields: [],
      groupLayout: "horizontal",
      groupSpacing: "normal",
      groupColumns: 2,
    },
  },

  {
    type: "tags",
    label: "Tag Input",
    description: "Enter and manage multiple tags.",
    icon: Tags,
    category: "advanced",
    defaultLabel: "Tags Field",
    defaultPlaceholder: "Enter tags",
    defaultSettings: { maxTags: 10, allowDuplicates: false },
  },
  {
    type: "social",
    label: "Social Media",
    description: "Add social media profile links.",
    icon: Share2,
    category: "advanced",
    defaultLabel: "Social Media Field",
  },
  {
    type: "scheduler",
    label: "Scheduler",
    description: "Embed a scheduling link (e.g. Calendly).",
    icon: Calendar,
    category: "advanced",
    defaultLabel: "Scheduler Field",
    defaultSettings: {
      schedulerProvider: "calcom",
      schedulerButtonText: "Schedule Meeting",
    },
  },
];

export function getFieldTypeConfig(
  type: FormField["type"]
): FieldTypeConfig | undefined {
  return FIELD_TYPE_CONFIGS.find((config) => config.type === type);
}

export function getFieldTypesByCategory(
  category: FieldTypeConfig["category"]
): FieldTypeConfig[] {
  return FIELD_TYPE_CONFIGS.filter((config) => config.category === category);
}

export function getGroupableFieldTypes(): FieldTypeConfig[] {
  return FIELD_TYPE_CONFIGS.filter((config) => config.canBeGrouped);
}

export function createFieldFromType(type: FormField["type"]): FormField {
  const config = getFieldTypeConfig(type);
  if (!config) {
    throw new Error(`Unknown field type: ${type}`);
  }

  return {
    id: generateFieldId(),
    type: config.type,
    label: config.defaultLabel,
    placeholder: config.defaultPlaceholder || "",
    required: false,
    options: config.defaultOptions,
    validation: {},
    settings: config.defaultSettings || {},
  };
}

function generateFieldId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const FIELD_TYPES = FIELD_TYPE_CONFIGS.map((config) => ({
  type: config.type,
  label: config.label,
  description: config.description,
  icon: config.icon,
}));

export const FIELD_CATEGORIES = {
  input: "Input Fields",
  selection: "Selection Fields",
  media: "Media Fields",
  layout: "Layout Fields",
  advanced: "Advanced Fields",
} as const;
