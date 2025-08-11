import { useCallback, useEffect, useRef, useState } from "react";
import { FormProgressStorage } from "../../lib/form-progress/storage";
import type {
  FormProgress,
  FormProgressActions,
  FormProgressConfig,
  FormProgressState,
  SaveProgressOptions,
} from "../../lib/form-progress/types";

const DEFAULT_CONFIG: FormProgressConfig = {
  enabled: true,
  storage: "localStorage",
  autoSaveInterval: 2000,
  retentionDays: 7,
  compressionEnabled: false,
  encryptionEnabled: false,
};

const DEFAULT_SAVE_OPTIONS: SaveProgressOptions = {
  debounceMs: 500,
  maxRetries: 3,
  skipFields: [],
  enableAutoSave: true,
};

/**
 * Custom hook for managing form filling progress
 * Automatically saves user progress as they fill out forms
 */
export function useFormProgress(
  formId: string,
  totalFields: number,
  config: Partial<FormProgressConfig> = {},
  options: Partial<SaveProgressOptions> = {},
): FormProgressState & FormProgressActions {
  const [state, setState] = useState<FormProgressState>({
    progress: null,
    loading: false,
    saving: false,
    error: null,
  });

  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const finalOptions = { ...DEFAULT_SAVE_OPTIONS, ...options };

  const storageRef = useRef<FormProgressStorage | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!storageRef.current) {
      storageRef.current = new FormProgressStorage(finalConfig);
      sessionIdRef.current = storageRef.current.generateSessionId();
    }
  }, [finalConfig]);

  const debouncedSave = useCallback(
    async (formData: Record<string, any>, currentStep = 0, totalSteps = 1) => {
      if (!finalOptions.enableAutoSave) return;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      return new Promise<void>((resolve) => {
        saveTimeoutRef.current = setTimeout(async () => {
          await saveProgress(formData, currentStep, totalSteps);
          resolve();
        }, finalOptions.debounceMs);
      });
    },
    [finalOptions.debounceMs, finalOptions.enableAutoSave],
  );

  const saveProgress = useCallback(
    async (formData: Record<string, any>, currentStep = 0, totalSteps = 1) => {
      if (!(storageRef.current && sessionIdRef.current && finalConfig.enabled))
        return;

      try {
        setState((prev: FormProgressState) => ({
          ...prev,
          saving: true,
          error: null,
        }));

        const filteredFormData = { ...formData };
        finalOptions.skipFields?.forEach((fieldId: string) => {
          delete filteredFormData[fieldId];
        });

        const progress = storageRef.current.createProgress(
          formId,
          sessionIdRef.current,
          filteredFormData,
          currentStep,
          totalSteps,
        );

        await storageRef.current.saveProgress(progress);

        setState((prev: FormProgressState) => ({
          ...prev,
          progress,
          saving: false,
          error: null,
        }));
      } catch (error) {
        setState((prev: FormProgressState) => ({
          ...prev,
          saving: false,
          error:
            error instanceof Error ? error.message : "Failed to save progress",
        }));
      }
    },
    [formId, finalConfig.enabled, finalOptions.skipFields],
  );

  const loadProgress = useCallback(async () => {
    if (!(storageRef.current && sessionIdRef.current && finalConfig.enabled))
      return;

    try {
      setState((prev: FormProgressState) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const progress = await storageRef.current.loadProgress(
        formId,
        sessionIdRef.current,
      );

      setState((prev: FormProgressState) => ({
        ...prev,
        progress,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState((prev: FormProgressState) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to load progress",
      }));
    }
  }, [formId, finalConfig.enabled]);

  const clearProgress = useCallback(async () => {
    if (!(storageRef.current && sessionIdRef.current)) return;

    try {
      await storageRef.current.deleteProgress(formId, sessionIdRef.current);

      setState((prev: FormProgressState) => ({
        ...prev,
        progress: null,
        error: null,
      }));
    } catch (error) {
      setState((prev: FormProgressState) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to clear progress",
      }));
    }
  }, [formId]);

  const restoreProgress = useCallback(() => {}, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    if (finalConfig.autoSaveInterval > 0 && state.progress) {
      autoSaveIntervalRef.current = setInterval(() => {
        if (state.progress) {
          saveProgress(
            state.progress.formData,
            state.progress.currentStep,
            state.progress.totalSteps,
          );
        }
      }, finalConfig.autoSaveInterval);

      return () => {
        if (autoSaveIntervalRef.current) {
          clearInterval(autoSaveIntervalRef.current);
        }
      };
    }
  }, [finalConfig.autoSaveInterval, state.progress, saveProgress]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    saveProgress: debouncedSave,
    loadProgress,
    clearProgress,
    restoreProgress,
  };
}
