// Libraries
import React from "react";
import Link from "next/link";

// Types
import type { PublicFormProps } from "../types";

// Hooks
import { useSingleStepForm } from "../hooks/use-single-step-form";

// Utilities
import { getAllFields } from "../utils/form-utils";

// Components
import { SingleStepSuccessScreen } from "./single-step-success-screen";
import { SingleStepFormContent } from "./single-step-form-content";

export const SingleStepForm: React.FC<PublicFormProps> = ({
  formId,
  schema,
}) => {
  const fields = getAllFields(schema);
  const formState = useSingleStepForm(formId, schema, fields);
  const {
    formData,
    errors,
    submitting,
    submitted,
    handleFieldValueChange,
    handleSubmit,
  } = formState;

  if (submitted) {
    return <SingleStepSuccessScreen schema={schema} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center w-full">
      <div className="max-w-2xl mx-auto flex flex-col gap-8 w-full">
        <SingleStepFormContent
          schema={schema}
          fields={fields}
          formData={formData}
          errors={errors}
          submitting={submitting}
          onFieldValueChange={handleFieldValueChange}
          onSubmit={handleSubmit}
        />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <span className="font-medium underline text-foreground">
              <Link href="https://ikiform.com">Ikiform</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
