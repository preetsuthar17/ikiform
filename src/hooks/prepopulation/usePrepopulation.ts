import { useEffect, useMemo, useState } from "react";
import type { FormField } from "@/lib/database";
import { ApiEngine } from "@/lib/prepopulation/engines/ApiEngine";
import { UrlEngine } from "@/lib/prepopulation/engines/UrlEngine";
import type { PrepopulationResult } from "@/lib/prepopulation/types";

interface PrepopulationData {
  fieldId: string;
  value: any;
  source: string;
  success: boolean;
  error?: string;
}

interface UsePrepopulationResult {
  prepopulatedData: Record<string, any>;
  loading: boolean;
  errors: Record<string, string>;
  sources: Record<string, string>;
}

export function usePrepopulation(fields: FormField[]): UsePrepopulationResult {
  const [prepopulatedData, setPrepopulatedData] = useState<Record<string, any>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sources, setSources] = useState<Record<string, string>>({});

  const prepopulationKey = useMemo(() => {
    return fields
      .filter((field) => field.prepopulation?.enabled)
      .map(
        (field) =>
          `${field.id}-${field.prepopulation!.source}-${JSON.stringify(field.prepopulation!.config)}`,
      )
      .join("|");
  }, [fields]);

  useEffect(() => {
    async function loadPrepopulatedData() {
      const fieldsWithPrepopulation = fields.filter(
        (field) => field.prepopulation?.enabled,
      );

      if (fieldsWithPrepopulation.length === 0) {
        setLoading(false);
        setPrepopulatedData({});
        setErrors({});
        setSources({});
        return;
      }

      setLoading(true);
      setErrors({});
      setSources({});

      const urlEngine = new UrlEngine();
      const apiEngine = new ApiEngine();

      const data: Record<string, any> = {};
      const errorMap: Record<string, string> = {};
      const sourceMap: Record<string, string> = {};

      const prepopulationPromises = fieldsWithPrepopulation.map(
        async (field: FormField): Promise<PrepopulationData> => {
          const prepopConfig = field.prepopulation!;
          let result: PrepopulationResult;

          try {
            switch (prepopConfig.source) {
              case "url":
                result = await urlEngine.getValue(prepopConfig.config);
                break;
              case "api":
                result = await apiEngine.getValue(prepopConfig.config);
                break;
              case "profile":
                result = {
                  success: false,
                  error: "Profile prepopulation not implemented yet",
                  source: "profile",
                  executionTime: 0,
                };
                break;
              case "previous":
                result = {
                  success: false,
                  error:
                    "Previous submission prepopulation not implemented yet",
                  source: "previous",
                  executionTime: 0,
                };
                break;
              case "template":
                result = {
                  success: false,
                  error: "Template prepopulation not implemented yet",
                  source: "template",
                  executionTime: 0,
                };
                break;
              default:
                result = {
                  success: false,
                  error: "Unknown prepopulation source",
                  source: "unknown",
                  executionTime: 0,
                };
            }
          } catch (error) {
            result = {
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
              source: prepopConfig.source,
              executionTime: 0,
            };
          }

          return {
            fieldId: field.id,
            value: result.value,
            source: result.source,
            success: result.success,
            error: result.error,
          };
        },
      );

      const results = await Promise.allSettled(prepopulationPromises);

      results.forEach((result: PromiseSettledResult<PrepopulationData>) => {
        if (result.status === "fulfilled") {
          const prepopData = result.value;

          if (
            prepopData.success &&
            prepopData.value !== null &&
            prepopData.value !== undefined
          ) {
            data[prepopData.fieldId] = prepopData.value;
            sourceMap[prepopData.fieldId] = prepopData.source;
          } else if (prepopData.error) {
            errorMap[prepopData.fieldId] = prepopData.error;
          }
        } else {
          console.error("Prepopulation promise rejected:", result.reason);
        }
      });

      setPrepopulatedData(data);
      setErrors(errorMap);
      setSources(sourceMap);
      setLoading(false);
    }

    loadPrepopulatedData();
  }, [prepopulationKey]);

  return {
    prepopulatedData,
    loading,
    errors,
    sources,
  };
}

export function useUrlPrepopulation(fields: FormField[]) {
  const urlFields = fields.filter(
    (field) =>
      field.prepopulation?.enabled && field.prepopulation.source === "url",
  );

  const { prepopulatedData, loading, errors } = usePrepopulation(urlFields);

  return { prepopulatedData, loading, errors };
}

export function useApiPrepopulation(fields: FormField[]) {
  const apiFields = fields.filter(
    (field) =>
      field.prepopulation?.enabled && field.prepopulation.source === "api",
  );

  const { prepopulatedData, loading, errors } = usePrepopulation(apiFields);

  return { prepopulatedData, loading, errors };
}
