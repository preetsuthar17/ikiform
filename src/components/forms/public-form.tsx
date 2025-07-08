"use client";

import React from "react";

// Components
import { MultiStepForm } from "./multi-step-form";
import { SingleStepForm } from "./public-form/components";

// Types
import type { PublicFormProps } from "./public-form/types";

export function PublicForm({ formId, schema }: PublicFormProps) {
  const isMultiStep = schema.settings.multiStep || schema.blocks?.length > 1;
  const dir = schema.settings.rtl ? "rtl" : "ltr";

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
