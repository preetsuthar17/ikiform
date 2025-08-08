import type { FormLogic } from '@/components/form-builder/logic-builder/types';

export interface Database {
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
          role: 'user' | 'assistant' | 'system';
          content: string;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string;
          role?: 'user' | 'assistant' | 'system';
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
          role: 'user' | 'assistant' | 'system';
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
          role: 'user' | 'assistant' | 'system';
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
          role?: 'user' | 'assistant' | 'system';
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
      redemption_codes: {
        Row: {
          id: string;
          code: string;
          redeemer_email: string | null;
          redeemer_user_id: string | null;
          redeemed_at: string | null;
          created_at: string;
          updated_at: string;
          is_active: boolean;
          max_uses: number;
          current_uses: number;
          expires_at: string | null;
          metadata: Record<string, any>;
        };
        Insert: {
          id?: string;
          code: string;
          redeemer_email?: string | null;
          redeemer_user_id?: string | null;
          redeemed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          max_uses?: number;
          current_uses?: number;
          expires_at?: string | null;
          metadata?: Record<string, any>;
        };
        Update: {
          id?: string;
          code?: string;
          redeemer_email?: string | null;
          redeemer_user_id?: string | null;
          redeemed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          max_uses?: number;
          current_uses?: number;
          expires_at?: string | null;
          metadata?: Record<string, any>;
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
  valueKey?: string;
  labelKey?: string;
  id: string;
  type:
    | 'text'
    | 'email'
    | 'textarea'
    | 'radio'
    | 'checkbox'
    | 'number'
    | 'select'
    | 'slider'
    | 'tags'
    | 'social'
    | 'date'
    | 'signature'
    | 'file'
    | 'poll'
    | 'rating'
    | 'time'
    | 'scheduler'
    | 'statement'
    | 'phone'
    | 'address'
    | 'link';
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
    iconSize?: 'sm' | 'md' | 'lg';
    customLinks?: { label: string; placeholder?: string }[];

    emailValidation?: {
      allowedDomains?: string[];
      blockedDomains?: string[];
      autoCompleteDomain?: string;
      requireBusinessEmail?: boolean;
      customValidationMessage?: string;
    };

    schedulerProvider?: 'calcom' | 'calendly' | 'tidycal';
    schedulerLinks?: {
      calcom?: string;
      calendly?: string;
      tidycal?: string;
    };
    schedulerButtonText?: string;

    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'filled' | 'ghost' | 'underline';
    helpText?: string;
    width?: 'full' | 'half' | 'third' | 'quarter';

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
    statementAlign?: 'left' | 'center' | 'right';
    statementSize?: 'sm' | 'md' | 'lg';

    pattern?: string;
    patternMessage?: string;

    requiredLines?: number;
    requiredMessage?: string;

    isQuizField?: boolean;
    correctAnswer?: string | string[];
    points?: number;
    showCorrectAnswer?: boolean;
    explanation?: string;
  };
  prepopulation?: {
    enabled: boolean;
    source: 'url' | 'api' | 'profile' | 'previous' | 'template';
    config: {
      urlParam?: string;

      apiEndpoint?: string;
      apiMethod?: 'GET' | 'POST';
      apiHeaders?: Record<string, string>;
      apiBodyTemplate?: string;
      jsonPath?: string;

      lookbackDays?: number;
      matchingFields?: string[];

      profileField?: 'name' | 'email' | 'phone' | 'address' | 'custom';

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
    stepNumberStyle?: 'number' | 'roman' | 'letters';
    layout?: 'single' | 'two-column' | 'three-column';
    spacing?: 'compact' | 'normal' | 'relaxed';
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

    theme?: {
      primaryColor?: string;
      backgroundColor?: string;
      textColor?: string;
      borderColor?: string;
      borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
      fontFamily?: 'system' | 'serif' | 'mono';
      fontSize?: 'sm' | 'md' | 'lg';
    };
    layout?: {
      maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
      padding?: 'none' | 'sm' | 'md' | 'lg';
      margin?: 'none' | 'sm' | 'md' | 'lg';
      borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
      spacing?: 'compact' | 'normal' | 'relaxed';
      alignment?: 'left' | 'center' | 'right';
    };
    branding?: {
      showPoweredBy?: boolean;
      customFooter?: string;
      logoUrl?: string;
      logoPosition?: 'top' | 'header' | 'footer';
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
        iconSize?: 'sm' | 'md' | 'lg';
        position?: 'footer' | 'header' | 'both';
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
    designMode?: 'default' | 'minimal';
  };
  logic?: FormLogic;
}

export type WebhookEventType =
  | 'form_submitted'
  | 'form_updated'
  | 'user_registered'
  | 'analytics_event'
  | 'custom';

export interface WebhookConfig {
  id: string;
  formId?: string;
  accountId?: string;
  url: string;
  events: WebhookEventType[];
  secret?: string;
  method: 'POST' | 'PUT';
  headers?: Record<string, string>;
  payloadTemplate?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookLog {
  id: string;
  webhook_id: string;
  event: WebhookEventType;
  status: 'success' | 'failed' | 'pending';
  request_payload: any;
  response_status?: number;
  response_body?: string;
  error?: string;
  timestamp: string;
  attempt: number;
}

export interface InboundWebhookMapping {
  id: string;
  endpoint: string;
  targetFormId: string;
  mappingRules: Record<string, string>;
  secret?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
