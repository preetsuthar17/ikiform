"use client";

import React from "react";

// Components
import { MultiStepForm } from "./multi-step-form";
import { SingleStepForm } from "./public-form/components";

// Types
import type { PublicFormProps } from "./public-form/types";

export function PublicForm({ formId, schema }: PublicFormProps) {
  const isMultiStep = schema.settings.multiStep || schema.blocks?.length > 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {isMultiStep ? (
        <MultiStepForm formId={formId} schema={schema} />
      ) : (
        <SingleStepForm formId={formId} schema={schema} />
      )}
    </div>
  );
}
