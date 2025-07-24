"use client";

import React, { useEffect } from "react";

// Components
import { MultiStepForm } from "./multi-step-form";
import { SingleStepForm } from "./public-form/components";

// Types
import type { PublicFormProps } from "./public-form/types";

export function PublicForm({ formId, schema }: PublicFormProps) {
  const isMultiStep = schema.settings.multiStep || schema.blocks?.length > 1;
  const dir = schema.settings.rtl ? "rtl" : "ltr";

  useEffect(() => {
    const val = schema?.settings?.layout?.borderRadius || "md";
    // Map to px values
    let borderRadiusValue = "8px";
    let cardRadiusValue = "16px";
    switch (val) {
      case "none":
        borderRadiusValue = "0px";
        cardRadiusValue = "0px";
        break;
      case "sm":
        borderRadiusValue = "4px";
        cardRadiusValue = "8px";
        break;
      case "md":
        borderRadiusValue = "10px";
        cardRadiusValue = "16px";
        break;
      case "lg":
        borderRadiusValue = "16px";
        cardRadiusValue = "24px";
        break;
      case "xl":
        borderRadiusValue = "24px";
        cardRadiusValue = "32px";
        break;
    }
    document.documentElement.style.setProperty("--radius", borderRadiusValue);
    document.documentElement.style.setProperty(
      "--card-radius",
      cardRadiusValue,
    );
    return () => {
      document.documentElement.style.setProperty("--radius", "0.7rem");
      document.documentElement.style.setProperty("--card-radius", "1rem");
    };
  }, [schema?.settings?.layout?.borderRadius]);

  return (
    <div dir={dir} className="flex flex-col gap-4 w-full">
      {isMultiStep ? (
        <MultiStepForm formId={formId} schema={schema} dir={dir} />
      ) : (
        <SingleStepForm formId={formId} schema={schema} dir={dir} />
      )}
    </div>
  );
}

export default PublicForm;
