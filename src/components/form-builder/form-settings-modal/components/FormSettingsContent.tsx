import { useParams } from 'next/navigation';
import React from 'react';
import type { FormSettingsSection } from '../types';
import { BasicInfoSection } from './BasicInfoSection';
import { DesignSection } from './DesignSection';
import { NotificationsSection } from './NotificationsSection';
import { PasswordProtectionSection } from './PasswordProtectionSection';
import { ProfanityFilterSection } from './ProfanityFilterSection';
import { QuizSection } from './QuizSection';
import { RateLimitSection } from './RateLimitSection';
import { ResponseLimitSection } from './ResponseLimitSection';
import { BrandingSection } from './SocialMediaSection';
import { WebhooksSettingsSection } from './WebhooksSettingsSection';

interface FormSettingsContentProps {
  section: FormSettingsSection;
  localSettings: any;
  updateSettings: any;
  updateRateLimit: any;
  updateProfanityFilter: any;
  updateResponseLimit: any;
  updatePasswordProtection: any;
  updateSocialMedia: any;
  updateNotifications: any;
}

export function FormSettingsContent({
  section,
  localSettings,
  updateSettings,
  updateRateLimit,
  updateProfanityFilter,
  updateResponseLimit,
  updatePasswordProtection,
  updateSocialMedia,
  updateNotifications,
}: FormSettingsContentProps) {
  const params = useParams();
  const formId = params?.id as string | undefined;
  switch (section) {
    case 'basic':
      return (
        <section className="flex flex-col gap-4">
          <BasicInfoSection
            localSettings={localSettings}
            updateSettings={updateSettings}
          />
        </section>
      );
    case 'limits':
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
    case 'security':
      return (
        <section className="flex flex-col gap-4">
          <PasswordProtectionSection
            localSettings={localSettings}
            updatePasswordProtection={updatePasswordProtection}
          />
          <ProfanityFilterSection
            localSettings={localSettings}
            updateProfanityFilter={updateProfanityFilter}
          />
        </section>
      );
    case 'branding':
      return (
        <section className="flex flex-col gap-4">
          <BrandingSection
            localSettings={localSettings}
            updateSettings={updateSettings}
            updateSocialMedia={updateSocialMedia}
          />
        </section>
      );
    case 'notifications':
      return (
        <section className="flex flex-col gap-4">
          <NotificationsSection
            localSettings={localSettings}
            updateNotifications={updateNotifications}
          />
        </section>
      );
    case 'quiz':
      return (
        <section className="flex flex-col gap-4">
          <QuizSection
            localSettings={localSettings}
            updateSettings={updateSettings}
          />
        </section>
      );
    case 'design':
      return (
        <section className="flex flex-col gap-4">
          <DesignSection
            localSettings={localSettings}
            updateSettings={updateSettings}
          />
        </section>
      );
    case 'webhooks':
      return (
        <section className="flex flex-col gap-4">
          <WebhooksSettingsSection formId={formId || ''} />
        </section>
      );
    default:
      return null;
  }
}
