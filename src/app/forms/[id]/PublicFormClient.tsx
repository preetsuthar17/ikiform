'use client';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import React from 'react';

const PublicForm = dynamic(() => import('@/components/forms/public-form'), {
  ssr: false,
});

export default function PublicFormClient({
  formId,
  schema,
  theme,
}: {
  formId: string;
  schema: any;
  theme?: string;
}) {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted && theme) {
      setTheme(theme);
    }
  }, [theme, setTheme, mounted]);

  if (!mounted) {
    return null;
  }

  return <PublicForm formId={formId} schema={schema} theme={theme} />;
}
