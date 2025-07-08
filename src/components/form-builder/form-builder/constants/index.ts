export const FORM_BUILDER_CONSTANTS = {
  AUTOSAVE_DELAY: 1000,
  DEFAULT_FORM_TITLE: "Untitled Form",
  DEFAULT_FORM_DESCRIPTION: "",
  DEFAULT_SUBMIT_TEXT: "Submit",
  DEFAULT_SUCCESS_MESSAGE: "Thank you for your submission!",
  DEFAULT_REDIRECT_URL: "",
  HEADER_HEIGHT: "81px",
} as const;

export const DRAFT_KEYS = {
  getDraftKey: (formId?: string) =>
    formId ? `form-draft-${formId}` : "form-draft-new",
  IMPORTED_FORM_SCHEMA: "importedFormSchema",
} as const;

export const PANEL_SIZES = {
  LEFT_PANEL: {
    default: 30,
    min: 15,
    max: 30,
  },
  PREVIEW_PANEL: {
    default: 40,
    min: 35,
    max: 70,
  },
  RIGHT_PANEL: {
    default: 30,
    min: 20,
    max: 45,
  },
} as const;
