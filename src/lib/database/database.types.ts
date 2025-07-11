export interface Database {
  public: {
    Tables: {
      forms: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          schema: FormSchema;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          schema: FormSchema;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          schema?: FormSchema;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      form_submissions: {
        Row: {
          id: string;
          form_id: string;
          submission_data: Record<string, any>;
          submitted_at: string;
          ip_address: string | null;
        };
        Insert: {
          id?: string;
          form_id: string;
          submission_data: Record<string, any>;
          submitted_at?: string;
          ip_address?: string | null;
        };
        Update: {
          id?: string;
          form_id?: string;
          submission_data?: Record<string, any>;
          submitted_at?: string;
          ip_address?: string | null;
        };
      };
      ai_builder_chat: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string;
          role?: "user" | "assistant" | "system";
          content?: string;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_analytics_chat: {
        Row: {
          id: string;
          user_id: string;
          form_id: string;
          session_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          form_id: string;
          session_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          form_id?: string;
          session_id?: string;
          role?: "user" | "assistant" | "system";
          content?: string;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          uid: string;
          name: string;
          email: string;
          has_premium: boolean;
          polar_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          uid: string;
          name: string;
          email: string;
          has_premium?: boolean;
          polar_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          uid?: string;
          name?: string;
          email?: string;
          has_premium?: boolean;
          polar_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export interface FormField {
  id: string;
  type:
    | "text"
    | "email"
    | "textarea"
    | "radio"
    | "checkbox"
    | "number"
    | "select"
    | "slider"
    | "tags"
    | "social"
    | "date"
    | "signature"
    | "file"
    | "poll"
    | "rating";
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;

    /** Custom error messages **/

    requiredMessage?: string;
    minLengthMessage?: string;
    maxLengthMessage?: string;
    minMessage?: string;
    maxMessage?: string;
    patternMessage?: string;
    emailMessage?: string;
    numberMessage?: string;
  };
  settings?: {
    rows?: number; // For textarea
    min?: number; // For slider
    max?: number; // For slider
    step?: number; // For slider
    defaultValue?: any; // For slider
    placeholder?: string; // For select, tags
    maxTags?: number; // For tags
    allowDuplicates?: boolean; // For tags
    // Social media settings
    socialPlatforms?: string[]; // For social field: built-in platforms to show
    showIcons?: boolean; // For social field
    iconSize?: "sm" | "md" | "lg"; // For social field
    customLinks?: { label: string; placeholder?: string }[]; // For social field: custom links
    // Email settings
    emailValidation?: {
      allowedDomains?: string[]; // List of allowed domains
      blockedDomains?: string[]; // List of blocked domains (temp email services)
      autoCompleteDomain?: string; // Domain to auto-append
      requireBusinessEmail?: boolean; // Only allow business domains
      customValidationMessage?: string; // Custom validation message
    };
    // Date field settings
    // Visual customization
    size?: "sm" | "md" | "lg"; // Field size
    variant?: "default" | "filled" | "ghost" | "underline"; // Field variant
    helpText?: string; // Additional help text
    width?: "full" | "half" | "third" | "quarter"; // Field width
    // Poll field settings
    pollOptions?: string[]; // List of poll options
    showResults?: boolean; // Show results after voting
    // Checkbox field settings
    allowMultiple?: boolean; // Allow multiple selection for checkbox fields only
    // Rating field settings
    starCount?: number; // Number of stars
    icon?: string; // Icon type (e.g., star, heart)
    color?: string; // Color of the stars
    starSize?: number; // Size of the stars/icons in px
  };
}

export interface FormBlock {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  /** Block settings */
  settings?: {
    showStepNumber?: boolean;
    stepNumberStyle?: "number" | "roman" | "letters";
    layout?: "single" | "two-column" | "three-column";
    spacing?: "compact" | "normal" | "relaxed";
    backgroundColor?: string;
    borderColor?: string;
  };
}

export interface FormSchema {
  blocks: FormBlock[];
  fields: FormField[];
  settings: {
    title: string;
    description?: string;
    submitText?: string;
    successMessage?: string;
    redirectUrl?: string;
    multiStep?: boolean;
    showProgress?: boolean;
    // Enhanced form customization
    theme?: {
      primaryColor?: string;
      backgroundColor?: string;
      textColor?: string;
      borderColor?: string;
      borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
      fontFamily?: "system" | "serif" | "mono";
      fontSize?: "sm" | "md" | "lg";
    };
    layout?: {
      maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
      padding?: "none" | "sm" | "md" | "lg";
      margin?: "none" | "sm" | "md" | "lg";
      spacing?: "compact" | "normal" | "relaxed";
      alignment?: "left" | "center" | "right";
    };
    branding?: {
      showPoweredBy?: boolean;
      customFooter?: string;
      logoUrl?: string;
      logoPosition?: "top" | "header" | "footer";
      socialMedia?: {
        enabled?: boolean;
        platforms?: {
          linkedin?: string;
          twitter?: string;
          youtube?: string;
          instagram?: string;
          facebook?: string;
          github?: string;
          website?: string;
        };
        showIcons?: boolean;
        iconSize?: "sm" | "md" | "lg";
        position?: "footer" | "header" | "both";
      };
    };
    behavior?: {
      allowSaveProgress?: boolean;
      autoSave?: boolean;
      confirmBeforeLeave?: boolean;
      showFieldNumbers?: boolean;
      animateTransitions?: boolean;
    };
    rateLimit?: {
      enabled?: boolean;
      maxSubmissions?: number;
      timeWindow?: number;
      message?: string;
      blockDuration?: number;
    };
    profanityFilter?: {
      enabled?: boolean;
      strictMode?: boolean;
      replaceWithAsterisks?: boolean;
      customWords?: string[];
      customMessage?: string;
      whitelistedWords?: string[];
    };
    responseLimit?: {
      enabled?: boolean;
      maxResponses?: number;
      message?: string;
    };
    passwordProtection?: {
      enabled?: boolean;
      password?: string;
      message?: string;
    };
    /** Notification settings for form submissions */
    notifications?: {
      enabled?: boolean;
      email?: string;
      subject?: string;
      message?: string;
    };
    /** Right-to-left support for forms */
    rtl?: boolean;
    designMode?: "default" | "minimal";
  };
}
