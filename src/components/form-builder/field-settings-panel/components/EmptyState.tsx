import { Settings } from "lucide-react";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { EmptyStateProps } from "../types";

export const EmptyState: React.FC<EmptyStateProps> = ({ onClose }) => (
  <div
    aria-live="polite"
    className="flex h-full flex-col items-center justify-center gap-4 border-border bg-background p-6"
    role="status"
    style={{
      touchAction: "manipulation",
      WebkitTapHighlightColor: "transparent",
    }}
  >
    <Card className="w-full max-w-sm">
      <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <Settings aria-hidden="true" className="size-8 text-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-foreground text-lg">
            No field selected
          </h3>
          <p className="text-muted-foreground text-sm">
            Click on a field in the preview to edit its settings
          </p>
        </div>
        <Button
          aria-label="Close settings panel"
          className="w-full"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClose();
            }
          }}
          style={{
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
          }}
          variant="outline"
        >
          Close Panel
        </Button>
      </CardContent>
    </Card>
  </div>
);
