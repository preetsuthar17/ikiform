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
    | "tags";
  label: string;
  description?: string; // Field description shown below the field
  placeholder?: string;
  required: boolean;
  options?: string[]; // For radio, checkbox, select
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    // Custom error messages
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
    allowMultiple?: boolean; // For select
    placeholder?: string; // For select, tags
    maxTags?: number; // For tags
    allowDuplicates?: boolean; // For tags
    // Visual customization
    size?: "sm" | "md" | "lg"; // Field size
    variant?: "default" | "filled" | "ghost" | "underline"; // Field variant
    helpText?: string; // Additional help text
    width?: "full" | "half" | "third" | "quarter"; // Field width
  };
}

export interface FormBlock {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  // Block customization
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
  fields: FormField[]; // Keep for backward compatibility
  settings: {
    title: string;
    description?: string;
    submitText?: string;
    successMessage?: string;
    redirectUrl?: string;
    multiStep?: boolean; // Enable multi-step mode
    showProgress?: boolean; // Show progress bar
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
      spacing?: "compact" | "normal" | "relaxed";
      alignment?: "left" | "center" | "right";
    };
    branding?: {
      showPoweredBy?: boolean;
      customFooter?: string;
      logoUrl?: string;
      logoPosition?: "top" | "header" | "footer";
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
      maxSubmissions?: number; // Maximum number of submissions
      timeWindow?: number; // Time window in minutes
      message?: string; // Custom rate limit message
      blockDuration?: number; // How long to block after limit is reached (in minutes)
    };
  };
}
