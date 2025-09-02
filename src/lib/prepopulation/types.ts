import type { FormLogic } from "@/components/form-builder/logic-builder/types";

export interface PrepopulationConfig {
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
}

export interface PrepopulationSettings {
  enabled: boolean;
  source: "url" | "api" | "profile" | "previous" | "template";
  config: PrepopulationConfig;
}

export interface FormFieldWithPrepopulation {
  id: string;
  type: string;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  prepopulation?: PrepopulationSettings;
}

export interface PrepopulationTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  template_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PrepopulationLog {
  id: string;
  form_id: string;
  field_id: string;
  source_type: "url" | "api" | "profile" | "previous" | "template";
  success: boolean;
  error_message?: string;
  execution_time_ms: number;
  created_at: string;
}

export interface PrivacySettings {
  requireConsent: boolean;
  consentMessage: string;
  dataRetentionDays: number;
  allowOptOut: boolean;
  anonymizeData: boolean;
}

export interface PrepopulationResult {
  success: boolean;
  value?: any;
  error?: string;
  source: string;
  executionTime: number;
}

export interface FieldMapping {
  sourceField: string;
  targetFieldId: string;
  transform?: (value: any) => any;
  validation?: (value: any) => boolean;
}

export interface ApiEngineConfig extends PrepopulationConfig {
  retryAttempts?: number;
  retryDelay?: number;
  timeout?: number;
  cacheTTL?: number;
}

export interface PreviousSubmissionConfig extends PrepopulationConfig {
  matchCriteria: "email" | "ip" | "custom";
  customMatchField?: string;
  prioritizeRecent?: boolean;
}

export type PrepopulationSource =
  | "url"
  | "api"
  | "profile"
  | "previous"
  | "template";

export interface PrepopulationEngine {
  getValue(
    config: PrepopulationConfig,
    context?: any
  ): Promise<PrepopulationResult>;
  validateConfig(config: PrepopulationConfig): boolean;
}
