import type { FormLogic } from "@/components/form-builder/logic-builder/types";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      forms: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          slug?: string | null;
          schema: FormSchema;
          is_published: boolean;
          created_at: string;
          updated_at: string;
          api_key?: string | null;
          api_enabled?: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          slug?: string | null;
          schema: FormSchema;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          api_key?: string | null;
          api_enabled?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          slug?: string | null;
          schema?: FormSchema;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          api_key?: string | null;
          api_enabled?: boolean;
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
      inbound_webhook_mappings: {
        Row: {
          created_at: string;
          enabled: boolean;
          endpoint: string;
          id: string;
          mapping_rules: Json;
          secret: string | null;
          target_form_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          enabled?: boolean;
          endpoint: string;
          id?: string;
          mapping_rules?: Json;
          secret?: string | null;
          target_form_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          enabled?: boolean;
          endpoint?: string;
          id?: string;
          mapping_rules?: Json;
          secret?: string | null;
          target_form_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inbound_webhook_mappings_target_form_id_fkey";
            columns: ["target_form_id"];
            isOneToOne: false;
            referencedRelation: "forms";
            referencedColumns: ["id"];
          },
        ];
      };
      redemption_codes: {
        Row: {
          code: string;
          created_at: string | null;
          current_uses: number | null;
          expires_at: string | null;
          id: string;
          is_active: boolean | null;
          max_uses: number | null;
          metadata: Json | null;
          redeemed_at: string | null;
          redeemer_email: string | null;
          redeemer_user_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          code: string;
          created_at?: string | null;
          current_uses?: number | null;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          max_uses?: number | null;
          metadata?: Json | null;
          redeemed_at?: string | null;
          redeemer_email?: string | null;
          redeemer_user_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          code?: string;
          created_at?: string | null;
          current_uses?: number | null;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          max_uses?: number | null;
          metadata?: Json | null;
          redeemed_at?: string | null;
          redeemer_email?: string | null;
          redeemer_user_id?: string | null;
          updated_at?: string | null;
        };
      };
      waitlist: {
        Row: {
          created_at: string;
          email: string;
          id: number;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: number;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: number;
        };
      };
      webhook_logs: {
        Row: {
          attempt: number;
          error: string | null;
          event: string;
          id: string;
          request_payload: Json | null;
          response_body: string | null;
          response_status: number | null;
          status: string;
          timestamp: string;
          webhook_id: string | null;
        };
        Insert: {
          attempt?: number;
          error?: string | null;
          event: string;
          id?: string;
          request_payload?: Json | null;
          response_body?: string | null;
          response_status?: number | null;
          status: string;
          timestamp?: string;
          webhook_id?: string | null;
        };
        Update: {
          attempt?: number;
          error?: string | null;
          event?: string;
          id?: string;
          request_payload?: Json | null;
          response_body?: string | null;
          response_status?: number | null;
          status?: string;
          timestamp?: string;
          webhook_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "webhook_logs_webhook_id_fkey";
            columns: ["webhook_id"];
            isOneToOne: false;
            referencedRelation: "webhooks";
            referencedColumns: ["id"];
          },
        ];
      };
      webhooks: {
        Row: {
          account_id: string | null;
          created_at: string;
          enabled: boolean;
          events: string[];
          form_id: string | null;
          headers: Json;
          id: string;
          method: string;
          notification_email: string | null;
          notify_on_failure: boolean;
          notify_on_success: boolean;
          payload_template: string | null;
          secret: string | null;
          updated_at: string;
          url: string;
        };
        Insert: {
          account_id?: string | null;
          created_at?: string;
          enabled?: boolean;
          events: string[];
          form_id?: string | null;
          headers?: Json;
          id?: string;
          method: string;
          notification_email?: string | null;
          notify_on_failure?: boolean;
          notify_on_success?: boolean;
          payload_template?: string | null;
          secret?: string | null;
          updated_at?: string;
          url: string;
        };
        Update: {
          account_id?: string | null;
          created_at?: string;
          enabled?: boolean;
          events?: string[];
          form_id?: string | null;
          headers?: Json;
          id?: string;
          method?: string;
          notification_email?: string | null;
          notify_on_failure?: boolean;
          notify_on_success?: boolean;
          payload_template?: string | null;
          secret?: string | null;
          updated_at?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "webhooks_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["uid"];
          },
          {
            foreignKeyName: "webhooks_form_id_fkey";
            columns: ["form_id"];
            isOneToOne: false;
            referencedRelation: "forms";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      cleanup_orphaned_files: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      get_form_file_stats: {
        Args: { form_id_param: string };
        Returns: {
          file_types: string[];
          total_files: number;
          total_size_bytes: number;
        }[];
      };
      get_form_file_url: {
        Args: { file_path: string; form_id: string };
        Returns: string;
      };
      is_admin_request: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      submit_form_bypass_rls: {
        Args: {
          p_form_id: string;
          p_ip_address?: unknown;
          p_submission_data: Json;
        };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export interface FormField {
  valueKey?: string;
  labelKey?: string;
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
    | "rating"
    | "time"
    | "scheduler"
    | "statement"
    | "phone"
    | "address"
    | "link"
    | "banner"
    | "field-group";
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: Array<string | { value: string; label?: string }>;
  optionsApi?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;

    requiredMessage?: string;
    minLengthMessage?: string;
    maxLengthMessage?: string;
    minMessage?: string;
    maxMessage?: string;
    patternMessage?: string;
    emailMessage?: string;
    numberMessage?: string;

    phoneMessage?: string;

    addressMessage?: string;

    linkMessage?: string;
  };
  settings?: {
    rows?: number;
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: any;
    placeholder?: string;
    maxTags?: number;
    allowDuplicates?: boolean;

    socialPlatforms?: string[];
    showIcons?: boolean;
    iconSize?: "sm" | "md" | "lg";
    customLinks?: { label: string; placeholder?: string }[];

    emailValidation?: {
      allowedDomains?: string[];
      blockedDomains?: string[];
      autoCompleteDomain?: string;
      requireBusinessEmail?: boolean;
      customValidationMessage?: string;
    };

    schedulerProvider?: "calcom" | "calendly" | "tidycal";
    schedulerLinks?: {
      calcom?: string;
      calendly?: string;
      tidycal?: string;
    };
    schedulerButtonText?: string;

    size?: "sm" | "md" | "lg";
    variant?: "default" | "filled" | "ghost" | "underline";
    helpText?: string;
    width?: "full" | "half" | "third" | "quarter";

    pollOptions?: string[];
    showResults?: boolean;

    allowMultiple?: boolean;

    starCount?: number;
    icon?: string;
    color?: string;
    starSize?: number;
    showCurrentTimeButton?: boolean;

    statementHeading?: string;
    statementDescription?: string;
    statementAlign?: "left" | "center" | "right";
    statementSize?: "sm" | "md" | "lg";

    bannerVariant?: "warning" | "error" | "info" | "success";
    bannerTitle?: string;
    bannerDescription?: string;

    pattern?: string;
    patternMessage?: string;

    requiredLines?: number;
    requiredMessage?: string;

    isQuizField?: boolean;
    correctAnswer?: string | string[];
    points?: number;
    showCorrectAnswer?: boolean;
    explanation?: string;

    // Field grouping settings
    groupFields?: FormField[];
    groupLayout?: "horizontal" | "vertical";
    groupSpacing?: "compact" | "normal" | "relaxed";
    groupColumns?: 2 | 3 | 4;
  };
  prepopulation?: {
    enabled: boolean;
    source: "url" | "api" | "profile" | "previous" | "template";
    config: {
      urlParam?: string;

      apiEndpoint?: string;
      apiMethod?: "GET" | "POST";
      apiHeaders?: Record<string, string>;
      apiBodyTemplate?: string;
      jsonPath?: string;

      lookbackDays?: number;
      matchingFields?: string[];

      profileField?: "name" | "email" | "phone" | "address" | "custom";

      templateId?: string;

      fallbackValue?: any;
      overwriteExisting?: boolean;

      requireConsent?: boolean;
      consentMessage?: string;
    };
  };
}

export interface FormBlock {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];

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
    publicTitle?: string;
    description?: string;
    submitText?: string;
    successMessage?: string;
    redirectUrl?: string;
    multiStep?: boolean;
    showProgress?: boolean;
    hideHeader?: boolean;

    colors?: {
      background?: string;
      text?: string;
      primary?: string;
      border?: string;
    };
    typography?: {
      fontFamily?: string;
      fontSize?: "xs" | "sm" | "base" | "lg" | "xl";
      fontWeight?: "light" | "normal" | "medium" | "semibold" | "bold";
      lineHeight?: "tight" | "normal" | "relaxed";
      letterSpacing?: "tight" | "normal" | "wide";
    };
    layout?: {
      maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
      padding?: "none" | "sm" | "md" | "lg";
      margin?: "none" | "sm" | "md" | "lg";
      borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
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

    notifications?: {
      enabled?: boolean;
      email?: string;
      subject?: string;
      message?: string;
    };

    quiz?: {
      enabled?: boolean;
      passingScore?: number;
      showScore?: boolean;
      showCorrectAnswers?: boolean;
      allowRetake?: boolean;
      timeLimit?: number;
      resultMessage?: {
        pass?: string;
        fail?: string;
      };
    };

    rtl?: boolean;
    duplicatePrevention?: {
      enabled?: boolean;
      strategy?: "ip" | "email" | "session" | "combined";
      mode?: "one-time" | "time-based";
      timeWindow?: number;
      message?: string;
      allowOverride?: boolean;
      maxAttempts?: number;
    };
    botProtection?: {
      enabled?: boolean;
      message?: string;
    };
    api?: {
      enabled?: boolean;
      apiKey?: string;
      allowExternalSubmissions?: boolean;
    };
  };
  logic?: FormLogic;
}

export type WebhookEventType =
  | "form_submitted"
  | "form_updated"
  | "user_registered"
  | "analytics_event"
  | "custom";

export interface WebhookConfig {
  id: string;
  formId?: string;
  accountId?: string;
  url: string;
  events: WebhookEventType[];
  secret?: string;
  method: "POST" | "PUT";
  headers?: Record<string, string>;
  payloadTemplate?: string;
  enabled: boolean;
  notificationEmail?: string | null;
  notifyOnSuccess?: boolean;
  notifyOnFailure?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookLog {
  id: string;
  webhook_id: string;
  event: WebhookEventType;
  status: "success" | "failed" | "pending";
  request_payload: any;
  response_status?: number;
  response_body?: string;
  error?: string;
  timestamp: string;
  attempt: number;
}
