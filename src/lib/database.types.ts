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
  placeholder?: string;
  required: boolean;
  options?: string[]; // For radio, checkbox, select
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
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
  };
}

export interface FormSchema {
  fields: FormField[];
  settings: {
    title: string;
    description?: string;
    submitText?: string;
    successMessage?: string;
    redirectUrl?: string;
  };
}
