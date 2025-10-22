import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApiSection } from "../sections/api-section";
import type { FormSettingsSection } from "../types";
import { BasicInfoSection } from "./BasicInfoSection";
import { BotProtectionSection } from "./BotProtectionSection";
import { DesignSection } from "./DesignSection";
import { DuplicatePreventionSection } from "./DuplicatePreventionSection";
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
  onSchemaUpdate?: (updates: Partial<any>) => void;
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
  onSchemaUpdate,
}: FormSettingsContentProps) {
  const params = useParams();
  const currentFormId = formId || (params?.id as string | undefined);
  switch (section) {
    case "basic":
      return (
        <section className="h-full">
          <BasicInfoSection
            formId={currentFormId}
            localSettings={localSettings}
            onSchemaUpdate={onSchemaUpdate}
            schema={schema}
            updateSettings={updateSettings}
          />
        </section>
      );
    case "limits":
      return (
        <section className="h-full">
          <ScrollArea className="h-full w-full">
            <div className="flex flex-col gap-4">
              <RateLimitSection
                formId={currentFormId}
                localSettings={localSettings}
                onSchemaUpdate={onSchemaUpdate}
                schema={schema}
                updateRateLimit={updateRateLimit}
              />
              <ResponseLimitSection
                formId={currentFormId}
                localSettings={localSettings}
                onSchemaUpdate={onSchemaUpdate}
                schema={schema}
                updateResponseLimit={updateResponseLimit}
              />
            </div>
          </ScrollArea>
        </section>
      );
    case "security":
      return (
        <section className="h-full">
          <ScrollArea className="h-full w-full">
            <div className="flex flex-col gap-4">
              <PasswordProtectionSection
                formId={currentFormId}
                localSettings={localSettings}
                onSchemaUpdate={onSchemaUpdate}
                schema={schema}
                updatePasswordProtection={updatePasswordProtection}
              />
              <DuplicatePreventionSection
                formId={currentFormId}
                localSettings={localSettings}
                onSchemaUpdate={onSchemaUpdate}
                schema={schema}
                updateDuplicatePrevention={updateDuplicatePrevention}
              />
              <ProfanityFilterSection
                formId={currentFormId}
                localSettings={localSettings}
                onSchemaUpdate={onSchemaUpdate}
                schema={schema}
                updateProfanityFilter={updateProfanityFilter}
              />
              <BotProtectionSection
                formId={currentFormId}
                localSettings={localSettings}
                onSchemaUpdate={onSchemaUpdate}
                schema={schema}
                updateBotProtection={updateBotProtection}
              />
            </div>
          </ScrollArea>
        </section>
      );
    case "branding":
      return (
        <section className="h-full">
          <ScrollArea className="h-full w-full">
            <div>
              <BrandingSection
                formId={currentFormId}
                localSettings={localSettings}
                schema={schema}
                updateSettings={updateSettings}
                updateSocialMedia={updateSocialMedia}
              />
            </div>
          </ScrollArea>
        </section>
      );
    case "notifications":
      return (
        <section className="h-full">
          <ScrollArea className="h-full w-full">
            <div>
              <NotificationsSection
                formId={currentFormId}
                localSettings={localSettings}
                onSchemaUpdate={onSchemaUpdate}
                schema={schema}
                updateNotifications={updateNotifications}
              />
            </div>
          </ScrollArea>
        </section>
      );
    case "quiz":
      return (
        <section className="h-full">
          <ScrollArea className="h-full w-full">
            <div>
              <QuizSection
                formId={currentFormId}
                localSettings={localSettings}
                onSchemaUpdate={onSchemaUpdate}
                schema={schema}
                updateSettings={updateSettings}
              />
            </div>
          </ScrollArea>
        </section>
      );
    case "design":
      return (
        <section className="h-full">
          <ScrollArea className="h-full w-full">
            <div>
              <DesignSection formId={currentFormId} />
            </div>
          </ScrollArea>
        </section>
      );
    case "api":
      return (
        <section className="h-full">
          <ScrollArea className="h-full w-full">
            <div>
              <ApiSection
                formId={currentFormId}
                localSettings={localSettings}
                schema={schema}
                updateApi={updateApi}
              />
            </div>
          </ScrollArea>
        </section>
      );
    case "webhooks":
      return (
        <section className="h-full">
          <ScrollArea className="h-full w-full">
            <div>
              <WebhooksSettingsSection formId={currentFormId || ""} />
            </div>
          </ScrollArea>
        </section>
      );
    case "metadata":
      return (
        <section className="h-full">
          <ScrollArea className="h-full w-full">
            <div>
              <MetadataSection
                formId={currentFormId}
                localSettings={localSettings}
                onSchemaUpdate={onSchemaUpdate}
                schema={schema}
                updateSettings={updateSettings}
              />
            </div>
          </ScrollArea>
        </section>
      );
    default:
      return null;
  }
}
