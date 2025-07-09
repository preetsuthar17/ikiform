// External imports
import { useState, useEffect } from "react";

// Internal imports
import type { FormSchema } from "@/lib/database";
import {
  DEFAULT_RATE_LIMIT_SETTINGS,
  DEFAULT_PROFANITY_FILTER_SETTINGS,
  DEFAULT_RESPONSE_LIMIT_SETTINGS,
  DEFAULT_PASSWORD_PROTECTION_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
} from "@/lib/forms";
import { DEFAULT_FORM_DESIGN } from "../constants";
import type { LocalSettings } from "../types";

export function useFormSettings(schema: FormSchema, userEmail?: string) {
  const [localSettings, setLocalSettings] = useState<LocalSettings>({
    ...schema.settings,
    designMode: schema.settings.designMode || DEFAULT_FORM_DESIGN.designMode,
    layout: {
      maxWidth:
        schema.settings.layout?.maxWidth || DEFAULT_FORM_DESIGN.maxWidth,
      padding: schema.settings.layout?.padding || DEFAULT_FORM_DESIGN.padding,
      spacing: schema.settings.layout?.spacing || "normal",
      alignment: schema.settings.layout?.alignment || "left",
    },
    rateLimit: {
      ...DEFAULT_RATE_LIMIT_SETTINGS,
      ...schema.settings.rateLimit,
    },
    profanityFilter: {
      ...DEFAULT_PROFANITY_FILTER_SETTINGS,
      ...schema.settings.profanityFilter,
    },
    responseLimit: {
      ...DEFAULT_RESPONSE_LIMIT_SETTINGS,
      ...schema.settings.responseLimit,
    },
    passwordProtection: {
      ...DEFAULT_PASSWORD_PROTECTION_SETTINGS,
      ...schema.settings.passwordProtection,
    },
    notifications: {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...schema.settings.notifications,
      email: schema.settings.notifications?.email || userEmail || "",
    },
  });

  useEffect(() => {
    setLocalSettings({
      ...schema.settings,
      designMode: schema.settings.designMode || DEFAULT_FORM_DESIGN.designMode,
      layout: {
        maxWidth:
          schema.settings.layout?.maxWidth || DEFAULT_FORM_DESIGN.maxWidth,
        padding: schema.settings.layout?.padding || DEFAULT_FORM_DESIGN.padding,
        spacing: schema.settings.layout?.spacing || "normal",
        alignment: schema.settings.layout?.alignment || "left",
      },
      rateLimit: {
        ...DEFAULT_RATE_LIMIT_SETTINGS,
        ...schema.settings.rateLimit,
      },
      profanityFilter: {
        ...DEFAULT_PROFANITY_FILTER_SETTINGS,
        ...schema.settings.profanityFilter,
      },
      responseLimit: {
        ...DEFAULT_RESPONSE_LIMIT_SETTINGS,
        ...schema.settings.responseLimit,
      },
      passwordProtection: {
        ...DEFAULT_PASSWORD_PROTECTION_SETTINGS,
        ...schema.settings.passwordProtection,
      },
      notifications: {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        ...schema.settings.notifications,
        email: schema.settings.notifications?.email || userEmail || "",
      },
    });
  }, [schema.settings, userEmail]);

  const updateSettings = (updates: Partial<LocalSettings>) => {
    setLocalSettings({
      ...localSettings,
      ...updates,
      layout: {
        ...localSettings.layout,
        ...updates.layout,
      },
      rateLimit: {
        ...localSettings.rateLimit,
        ...updates.rateLimit,
      },
      profanityFilter: {
        ...localSettings.profanityFilter,
        ...updates.profanityFilter,
      },
      responseLimit: {
        ...localSettings.responseLimit,
        ...updates.responseLimit,
      },
      passwordProtection: {
        ...localSettings.passwordProtection,
        ...updates.passwordProtection,
      },
    });
  };

  const updateRateLimit = (
    rateLimitUpdates: Partial<NonNullable<LocalSettings["rateLimit"]>>,
  ) => {
    setLocalSettings({
      ...localSettings,
      rateLimit: {
        ...localSettings.rateLimit,
        ...rateLimitUpdates,
      },
    });
  };

  const updateProfanityFilter = (
    profanityFilterUpdates: Partial<
      NonNullable<LocalSettings["profanityFilter"]>
    >,
  ) => {
    setLocalSettings({
      ...localSettings,
      profanityFilter: {
        ...localSettings.profanityFilter,
        ...profanityFilterUpdates,
      },
    });
  };

  const updateResponseLimit = (
    responseLimitUpdates: Partial<NonNullable<LocalSettings["responseLimit"]>>,
  ) => {
    setLocalSettings({
      ...localSettings,
      responseLimit: {
        ...localSettings.responseLimit,
        ...responseLimitUpdates,
      },
    });
  };

  const updatePasswordProtection = (
    passwordProtectionUpdates: Partial<
      NonNullable<LocalSettings["passwordProtection"]>
    >,
  ) => {
    setLocalSettings({
      ...localSettings,
      passwordProtection: {
        ...localSettings.passwordProtection,
        ...passwordProtectionUpdates,
      },
    });
  };

  const updateSocialMedia = (
    socialMediaUpdates: Partial<
      NonNullable<NonNullable<LocalSettings["branding"]>["socialMedia"]>
    >,
  ) => {
    setLocalSettings({
      ...localSettings,
      branding: {
        ...localSettings.branding,
        socialMedia: {
          ...localSettings.branding?.socialMedia,
          ...socialMediaUpdates,
        },
      },
    });
  };

  const updateNotifications = (
    notificationUpdates: Partial<LocalSettings["notifications"]>,
  ) => {
    setLocalSettings({
      ...localSettings,
      notifications: {
        ...localSettings.notifications,
        ...notificationUpdates,
      },
    });
  };

  const resetSettings = () => {
    setLocalSettings({
      ...schema.settings,
      rateLimit: {
        ...DEFAULT_RATE_LIMIT_SETTINGS,
        ...schema.settings.rateLimit,
      },
      profanityFilter: {
        ...DEFAULT_PROFANITY_FILTER_SETTINGS,
        ...schema.settings.profanityFilter,
      },
      responseLimit: {
        ...DEFAULT_RESPONSE_LIMIT_SETTINGS,
        ...schema.settings.responseLimit,
      },
      passwordProtection: {
        ...DEFAULT_PASSWORD_PROTECTION_SETTINGS,
        ...schema.settings.passwordProtection,
      },
    });
  };

  return {
    localSettings,
    updateSettings,
    updateRateLimit,
    updateProfanityFilter,
    updateResponseLimit,
    updatePasswordProtection,
    updateSocialMedia,
    updateNotifications,
    resetSettings,
  };
}
