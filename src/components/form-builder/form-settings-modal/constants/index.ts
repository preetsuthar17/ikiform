// Form design constants
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

export const FORM_DESIGN_MODES = [
  {
    value: "default",
    label: "Default",
    description: "Standard form design with borders and shadows",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Clean design with minimal visual elements",
  },
] as const;

export const DEFAULT_FORM_DESIGN = {
  maxWidth: "md",
  padding: "md",
  designMode: "default",
} as const;
