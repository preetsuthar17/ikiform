export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      ai_analytics_chat: {
        Row: {
          content: string;
          created_at: string | null;
          form_id: string;
          id: string;
          metadata: Json | null;
          role: string;
          session_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          form_id: string;
          id?: string;
          metadata?: Json | null;
          role: string;
          session_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          form_id?: string;
          id?: string;
          metadata?: Json | null;
          role?: string;
          session_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_analytics_chat_form_id_fkey";
            columns: ["form_id"];
            isOneToOne: false;
            referencedRelation: "forms";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_builder_chat: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          metadata: Json | null;
          role: string;
          session_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          role: string;
          session_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          role?: string;
          session_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      form_submissions: {
        Row: {
          flag_reason: string | null;
          flagged_at: string | null;
          flagged_by: string | null;
          form_id: string;
          id: string;
          ip_address: unknown | null;
          is_flagged: boolean;
          submission_data: Json;
          submitted_at: string;
          tags: string[];
        };
        Insert: {
          flag_reason?: string | null;
          flagged_at?: string | null;
          flagged_by?: string | null;
          form_id: string;
          id?: string;
          ip_address?: unknown | null;
          is_flagged?: boolean;
          submission_data: Json;
          submitted_at?: string;
          tags?: string[];
        };
        Update: {
          flag_reason?: string | null;
          flagged_at?: string | null;
          flagged_by?: string | null;
          form_id?: string;
          id?: string;
          ip_address?: unknown | null;
          is_flagged?: boolean;
          submission_data?: Json;
          submitted_at?: string;
          tags?: string[];
        };
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_id_fkey";
            columns: ["form_id"];
            isOneToOne: false;
            referencedRelation: "forms";
            referencedColumns: ["id"];
          },
        ];
      };
      forms: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_published: boolean | null;
          schema: Json;
          slug: string | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_published?: boolean | null;
          schema: Json;
          slug?: string | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_published?: boolean | null;
          schema?: Json;
          slug?: string | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string | null;
          customer_name: string | null;
          email: string;
          has_premium: boolean | null;
          name: string;
          polar_customer_id: string | null;
          uid: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          customer_name?: string | null;
          email: string;
          has_premium?: boolean | null;
          name: string;
          polar_customer_id?: string | null;
          uid: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          customer_name?: string | null;
          email?: string;
          has_premium?: boolean | null;
          name?: string;
          polar_customer_id?: string | null;
          uid?: string;
          updated_at?: string | null;
        };
        Relationships: [];
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
        Relationships: [];
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
