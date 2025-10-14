import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { FormConfigurationStepProps } from "../types";

export const FormConfigurationStep: React.FC<FormConfigurationStepProps> = ({
  configuration,
  onConfigurationChange,
}) => (
  <div className="flex flex-col gap-6">
    <Card className="shadow-none">
      <CardHeader className="[.border-b]:border-border">
        <CardTitle className="text-base">Form details</CardTitle>
        <CardDescription>
          Set the internal and public information for your form.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="form-title">
              Internal Title <span aria-hidden>*</span>
            </Label>
            <Input
              aria-describedby="form-title-help"
              autoCapitalize="sentences"
              autoComplete="off"
              className="w-full text-sm"
              id="form-title"
              inputMode="text"
              name="internal-title"
              onBlur={(e) =>
                onConfigurationChange({ title: e.target.value.trim() })
              }
              onChange={(e) => onConfigurationChange({ title: e.target.value })}
              placeholder="Enter internal title for your reference…"
              required
              spellCheck={false}
              value={configuration.title}
            />
            <p className="text-muted-foreground text-xs" id="form-title-help">
              Only visible in the dashboard and builder.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="form-public-title">Public Title</Label>
            <Input
              aria-describedby="form-public-title-help"
              autoCapitalize="sentences"
              className="w-full text-sm"
              id="form-public-title"
              inputMode="text"
              name="public-title"
              onBlur={(e) =>
                onConfigurationChange({ publicTitle: e.target.value.trim() })
              }
              onChange={(e) =>
                onConfigurationChange({ publicTitle: e.target.value })
              }
              placeholder="Enter title to display to users…"
              value={configuration.publicTitle || ""}
            />
            <p
              className="text-muted-foreground text-xs"
              id="form-public-title-help"
            >
              Shown to users on the form. Leave empty to reuse the internal
              title.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="form-description">Form Description</Label>
            <Textarea
              aria-describedby="form-description-help"
              className="min-h-[100px] w-full text-sm"
              id="form-description"
              inputMode="text"
              name="form-description"
              onBlur={(e) =>
                onConfigurationChange({ description: e.target.value.trim() })
              }
              onChange={(e) =>
                onConfigurationChange({ description: e.target.value })
              }
              placeholder="Enter a short description to guide users…"
              rows={4}
              value={configuration.description}
            />
            <p
              className="text-muted-foreground text-xs"
              id="form-description-help"
            >
              Optional. Helps users understand the form’s purpose.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
