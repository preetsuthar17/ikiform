// Libraries
import React from "react";
import { Link } from "react-aria-components";

// UI Components
import { Card } from "@/components/ui/card";

// Types
import type { FormSchema } from "@/lib/database";

interface SuccessScreenProps {
  schema: FormSchema;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ schema }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-2xl mx-auto flex flex-col gap-4 w-full">
        <Card className="rounded-card flex flex-col gap-6 p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-accent rounded-card flex items-center justify-center">
              <svg
                className="w-8 h-8 text-accent-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Thank You!</h2>
            <p className="text-muted-foreground text-center">
              {schema.settings.successMessage ||
                "Your form has been submitted successfully."}
            </p>
            {schema.settings.redirectUrl && (
              <p className="text-sm text-muted-foreground/70">
                Redirecting you in a moment...
              </p>
            )}
          </div>
        </Card>

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
