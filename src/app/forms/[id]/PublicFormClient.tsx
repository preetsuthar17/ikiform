"use client";
import dynamic from "next/dynamic";

const PublicForm = dynamic(() => import("@/components/forms/public-form"), {
  ssr: false,
});

export default function PublicFormClient({
  formId,
  schema,
}: {
  formId: string;
  schema: any;
}) {
  return <PublicForm formId={formId} schema={schema} />;
}
