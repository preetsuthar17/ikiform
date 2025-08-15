import type React from 'react';
import { Link } from 'react-aria-components';

import { Card } from '@/components/ui/card';

import type { FormSchema } from '@/lib/database';

interface SuccessScreenProps {
  schema: FormSchema;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ schema }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <Card className="flex flex-col gap-6 rounded-card p-8">
          <div className="flex flex-col items-center gap-6">
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
              <p className="text-muted-foreground/70 text-sm">
                Redirecting you in a moment...
              </p>
            )}
          </div>
        </Card>

        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Powered by{' '}
            <span className="font-medium text-foreground underline">
              <Link href="https://www.ikiform.com">Ikiform</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
