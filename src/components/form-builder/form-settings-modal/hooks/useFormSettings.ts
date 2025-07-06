// External imports
import { useState, useEffect } from "react";

// Internal imports
import type { FormSchema } from "@/lib/database";
import {
  DEFAULT_RATE_LIMIT_SETTINGS,
  DEFAULT_PROFANITY_FILTER_SETTINGS,
  DEFAULT_RESPONSE_LIMIT_SETTINGS,
} from "@/lib/forms";
import type { LocalSettings } from "../types";

export function useFormSettings(schema: FormSchema) {
  const [localSettings, setLocalSettings] = useState<LocalSettings>({
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
  });

  useEffect(() => {
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
    });
  }, [schema.settings]);

  const updateSettings = (updates: Partial<LocalSettings>) => {
    setLocalSettings({
      ...localSettings,
      ...updates,
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
    });
  };

  const updateRateLimit = (
    rateLimitUpdates: Partial<NonNullable<LocalSettings["rateLimit"]>>
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
    >
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
    responseLimitUpdates: Partial<NonNullable<LocalSettings["responseLimit"]>>
  ) => {
    setLocalSettings({
      ...localSettings,
      responseLimit: {
        ...localSettings.responseLimit,
        ...responseLimitUpdates,
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
    });
  };

  return {
    localSettings,
    updateSettings,
    updateRateLimit,
    updateProfanityFilter,
    updateResponseLimit,
    resetSettings,
  };
}
