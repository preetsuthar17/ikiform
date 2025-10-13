import type React from "react";
import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { FormConfigurationStepProps } from "../types";

export const FormConfigurationStep: React.FC<FormConfigurationStepProps> = ({
  configuration,
  onConfigurationChange,
}) => (
  <div className="flex flex-col gap-6">
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="form-title">Internal Title *</Label>
          <Input
            className="w-full"
            id="form-title"
            onChange={(e) => onConfigurationChange({ title: e.target.value })}
            placeholder="Enter internal title for your reference..."
            value={configuration.title}
          />
          <p className="text-muted-foreground text-xs">
            This title is only visible to you in the dashboard and form builder
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="form-public-title">Public Title</Label>
          <Input
            className="w-full"
            id="form-public-title"
            onChange={(e) =>
              onConfigurationChange({ publicTitle: e.target.value })
            }
            placeholder="Enter title to display to users..."
            value={configuration.publicTitle || ""}
          />
          <p className="text-muted-foreground text-xs">
            This title will be displayed to users on the actual form. Leave
            empty to use the internal title.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="form-description">Form Description</Label>
          <Textarea
            className="min-h-[100px] w-full"
            id="form-description"
            onChange={(e) =>
              onConfigurationChange({ description: e.target.value })
            }
            placeholder="Enter form description..."
            rows={4}
            value={configuration.description}
          />
          <p className="text-muted-foreground text-xs">
            Optional description to help users understand the form's purpose
          </p>
        </div>
      </div>
    </Card>
  </div>
);
