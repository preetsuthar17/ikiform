"use client";

import { FormBuilder } from "@/components/form-builder/form-builder";

interface FormBuilderPageProps {
  params: { id: string };
}

export default function FormBuilderPage({ params }: FormBuilderPageProps) {
  return <FormBuilder formId={params.id} />;
}
