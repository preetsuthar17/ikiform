import { Settings2, ExternalLink } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_FORM_DESIGN,
} from "../constants";
import type { LocalSettings } from "../types";

const FORM_MARGIN_OPTIONS = [
  { value: "none", label: "None", preview: "", description: "No margin" },
  { value: "sm", label: "Small", preview: "", description: "8px" },
  { value: "md", label: "Medium", preview: "", description: "16px" },
  { value: "lg", label: "Large", preview: "", description: "32px" },
];

interface DesignSectionProps {
  localSettings: LocalSettings;
  updateSettings: (updates: Partial<LocalSettings>) => void;
  formId?: string;
}

export function DesignSection({
  localSettings,
  updateSettings,
  formId,
}: DesignSectionProps) {


  return (
    <Card className="p-6">
      <h3 className="mb-6 flex items-center gap-2 font-semibold text-lg">
        <Settings2 className="h-5 w-5 text-primary" />
        Basic Design Settings
      </h3>

      <div className="flex flex-col gap-6">
        {/* Progress Bar Toggle */}
        <div className="flex items-center gap-3">
          <Switch
            checked={!!localSettings.showProgress}
            id="show-progress-toggle"
            onCheckedChange={(checked) =>
              updateSettings({ showProgress: checked })
            }
            size="sm"
          />
          <Label
            className="cursor-pointer select-none"
            htmlFor="show-progress-toggle"
          >
            Show Progress Bar
          </Label>
        </div>

        {/* Form Customization CTA */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <Settings2 className="mt-0.5 h-5 w-5 text-primary" />
            <div className="flex-1">
              <h4 className="font-medium text-sm">Advanced Form Customization</h4>
              <p className="text-muted-foreground text-xs mt-1">
                Customize colors, typography, layout, and more with our advanced design tools.
              </p>
              <Button
                className="mt-3 gap-2"
                onClick={() => {
                  if (formId) {
                    window.open(`/form-builder/${formId}/customize`, '_blank');
                  }
                }}
                size="sm"
                variant="outline"
              >
                <ExternalLink className="h-4 w-4" />
                Open Customization Panel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
