import React from "react";
import { BasicInfoSection } from "./BasicInfoSection";
import { RateLimitSection } from "./RateLimitSection";
import { ResponseLimitSection } from "./ResponseLimitSection";
import { ProfanityFilterSection } from "./ProfanityFilterSection";
import { PasswordProtectionSection } from "./PasswordProtectionSection";
import { SocialMediaSection } from "./SocialMediaSection";
import type { FormSettingsSection } from "../types";

interface FormSettingsContentProps {
  section: FormSettingsSection;
  localSettings: any;
  updateSettings: any;
  updateRateLimit: any;
  updateProfanityFilter: any;
  updateResponseLimit: any;
  updatePasswordProtection: any;
  updateSocialMedia: any;
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
}: FormSettingsContentProps) {
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
          <ProfanityFilterSection
            localSettings={localSettings}
            updateProfanityFilter={updateProfanityFilter}
          />
        </section>
      );
    case "branding":
      return (
        <section className="flex flex-col gap-4">
          <SocialMediaSection
            localSettings={localSettings}
            updateSocialMedia={updateSocialMedia}
          />
        </section>
      );
    default:
      return null;
  }
}
