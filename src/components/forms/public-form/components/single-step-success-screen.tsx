// Libraries

import Link from 'next/link';
import type React from 'react';

// UI Components
import { Card } from '@/components/ui/card';

// Types
import type { FormSchema } from '@/lib/database';

interface SingleStepSuccessScreenProps {
  schema: FormSchema;
}

export const SingleStepSuccessScreen: React.FC<
  SingleStepSuccessScreenProps
> = ({ schema }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <Card
          className="flex flex-col gap-4 rounded-card"
          style={{ padding: '2rem' }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-card bg-accent">
              <svg
                className="h-8 w-8 text-accent-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <h2 className="font-bold text-2xl text-foreground">Thank You!</h2>
            <p className="text-center text-muted-foreground">
              {schema.settings.successMessage ||
                'Your form has been submitted successfully.'}
            </p>
            {schema.settings.redirectUrl && (
              <p className="text-muted-foreground text-sm">
                Redirecting you in a moment...
              </p>
            )}
          </div>
        </Card>

        <div className="text-center">
          {Boolean(
            schema.settings.branding &&
              (schema.settings.branding as any).showIkiformBranding !== false
          ) && (
            <p className="text-muted-foreground text-sm">
              Powered by{' '}
              <span className="font-medium text-foreground underline">
                <Link href="https://www.ikiform.com">Ikiform</Link>
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
