import { useParams } from "next/navigation";
import React from "react";
import { ApiSection } from "../sections/api-section";
import type { FormSettingsSection } from "../types";
import { BasicInfoSection } from "./BasicInfoSection";
import { BotProtectionSection } from "./BotProtectionSection";
import { DesignSection } from "./DesignSection";
import { DuplicatePreventionSection } from "./DuplicatePreventionSection";
import { FormDesignPreview } from "./FormDesignPreview";
import { MetadataSection } from "./MetadataSection";
import { NotificationsSection } from "./NotificationsSection";
import { PasswordProtectionSection } from "./PasswordProtectionSection";
import { ProfanityFilterSection } from "./ProfanityFilterSection";
import { QuizSection } from "./QuizSection";
import { RateLimitSection } from "./RateLimitSection";
import { ResponseLimitSection } from "./ResponseLimitSection";
import { BrandingSection } from "./SocialMediaSection";
import { WebhooksSettingsSection } from "./WebhooksSettingsSection";

interface FormSettingsContentProps {
  section: FormSettingsSection;
  localSettings: any;
  updateSettings: any;
  updateRateLimit: any;
  updateDuplicatePrevention: any;
  updateProfanityFilter: any;
  updateBotProtection: any;
  updateResponseLimit: any;
  updatePasswordProtection: any;
  updateSocialMedia: any;
  updateNotifications: any;
  updateApi: any;
  formId?: string;
  schema?: any;
}

export function FormSettingsContent({
  section,
  localSettings,
  updateSettings,
  updateRateLimit,
  updateDuplicatePrevention,
  updateProfanityFilter,
  updateBotProtection,
  updateResponseLimit,
  updatePasswordProtection,
  updateSocialMedia,
  updateNotifications,
  updateApi,
  formId,
  schema,
}: FormSettingsContentProps) {
  const params = useParams();
  const currentFormId = formId || (params?.id as string | undefined);
  switch (section) {
    case "basic":
      return (
        <section className="flex flex-col gap-4">
          <BasicInfoSection
            localSettings={localSettings}
            updateSettings={updateSettings}
          />
        </section>
      );
    case "limits":
      return (
        <section className="flex flex-col gap-4">
          <RateLimitSection
            localSettings={localSettings}
            updateRateLimit={updateRateLimit}
          />
          <ResponseLimitSection
            localSettings={localSettings}
            updateResponseLimit={updateResponseLimit}
          />
        </section>
      );
    case "security":
      return (
        <section className="flex flex-col gap-4">
          <PasswordProtectionSection
            localSettings={localSettings}
            updatePasswordProtection={updatePasswordProtection}
          />
          <DuplicatePreventionSection
            localSettings={localSettings}
            updateDuplicatePrevention={updateDuplicatePrevention}
          />
          <ProfanityFilterSection
            localSettings={localSettings}
            updateProfanityFilter={updateProfanityFilter}
          />
          <BotProtectionSection
            localSettings={localSettings}
            updateBotProtection={updateBotProtection}
          />
        </section>
      );
    case "branding":
      return (
        <section className="flex flex-col gap-4">
          <BrandingSection
            localSettings={localSettings}
            updateSettings={updateSettings}
            updateSocialMedia={updateSocialMedia}
          />
        </section>
      );
    case "notifications":
      return (
        <section className="flex flex-col gap-4">
          <NotificationsSection
            localSettings={localSettings}
            updateNotifications={updateNotifications}
          />
        </section>
      );
    case "quiz":
      return (
        <section className="flex flex-col gap-4">
          <QuizSection
            localSettings={localSettings}
            updateSettings={updateSettings}
          />
        </section>
      );
    case "design":
      return (
        <section className="flex flex-col gap-4">
          <DesignSection
            formId={currentFormId}
            localSettings={localSettings}
            updateSettings={updateSettings}
          />
        </section>
      );
    case "api":
      return (
        <section className="flex flex-col gap-4">
          <ApiSection
            formId={currentFormId}
            localSettings={localSettings}
            schema={schema}
            updateApi={updateApi}
          />
        </section>
      );
    case "webhooks":
      return (
        <section className="flex flex-col gap-4">
          <WebhooksSettingsSection formId={currentFormId || ""} />
        </section>
      );
    case "metadata":
      return (
        <section className="flex flex-col gap-4">
          <MetadataSection
            localSettings={localSettings}
            updateSettings={updateSettings}
          />
        </section>
      );
    default:
      return null;
  }
}
