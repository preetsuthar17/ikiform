// External imports
import React from "react";

// UI imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

// Icon imports
import { FileText, Info } from "lucide-react";

// Type imports
import type { FormConfigurationStepProps } from "../types";

export const FormConfigurationStep: React.FC<FormConfigurationStepProps> = ({
  configuration,
  onConfigurationChange,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="form-title">Form Title *</Label>
            <Input
              id="form-title"
              placeholder="Enter form title..."
              value={configuration.title}
              onChange={(e) => onConfigurationChange({ title: e.target.value })}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              This will be displayed as the main heading of your form
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="form-description">Form Description</Label>
            <Textarea
              id="form-description"
              placeholder="Enter form description..."
              value={configuration.description}
              onChange={(e) =>
                onConfigurationChange({ description: e.target.value })
              }
              className="w-full min-h-[100px]"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Optional description to help users understand the form's purpose
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
