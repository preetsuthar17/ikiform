"use client";

import React from "react";
import { FormBuilder } from "@/components/form-builder/form-builder";

interface FormBuilderPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function FormBuilderPage({ params }: FormBuilderPageProps) {
  const { id } = React.use(params);
  return <FormBuilder formId={id} />;
}
