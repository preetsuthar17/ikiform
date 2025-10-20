import { Edit3, FileText, Layers } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { createDefaultFormSchema } from "@/lib/forms";

import { FormPreview } from "../../form-preview";

import type { FormConfiguration } from "../types";

interface FormReviewStepProps {
  configuration: FormConfiguration;
  onEditStep: (step: "type" | "configure") => void;
}

export const FormReviewStep: React.FC<FormReviewStepProps> = ({
  configuration,
  onEditStep,
}) => {
  const isMultiStep = configuration.type === "multi";
  const [showPreview, setShowPreview] = React.useState(false);

  const previewSchema = createDefaultFormSchema({
    title: configuration.title || "",
    description: configuration.description || "",
    multiStep: isMultiStep,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Card className="shadow-none">
          <CardHeader className="[.border-b]:border-border">
            <div className="flex items-center gap-3">
              {isMultiStep ? (
                <Layers className="size-5 text-primary" />
              ) : (
                <FileText className="size-5 text-primary" />
              )}
              <div>
                <CardTitle className="text-base">Form Type</CardTitle>
                <CardDescription>
                  {isMultiStep ? "Multi-Step Form" : "Single Page Form"}
                </CardDescription>
              </div>
            </div>
            <CardAction>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {isMultiStep ? "Multi-Step" : "Single Page"}
                </Badge>
                <Button
                  aria-label="Edit form type"
                  onClick={() => onEditStep("type")}
                  size={"icon"}
                  title="Edit form type"
                  variant={"secondary"}
                >
                  <Edit3 className="size-4 text-muted-foreground hover:text-foreground" />
                </Button>
              </div>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="[.border-b]:border-border">
            <div className="mb-0.5 flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              <CardTitle className="text-base">Form Configuration</CardTitle>
            </div>
            <CardAction>
              <Button
                aria-label="Edit form configuration"
                onClick={() => onEditStep("configure")}
                size={"icon"}
                title="Edit form configuration"
                variant={"secondary"}
              >
                <Edit3 className="size-4 text-muted-foreground hover:text-foreground" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-medium text-sm">Internal Title</p>
                <p className="text-muted-foreground text-sm">
                  {configuration.title || ""}
                </p>
              </div>
              {configuration.publicTitle && (
                <div>
                  <p className="font-medium text-sm">Public Title</p>
                  <p className="text-muted-foreground text-sm">
                    {configuration.publicTitle}
                  </p>
                </div>
              )}
              {configuration.description && (
                <div>
                  <p className="font-medium text-sm">Description</p>
                  <p className="text-muted-foreground text-sm">
                    {configuration.description}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {showPreview && (
        <Card className="shadow-none">
          <CardHeader className="[.border-b]:border-border">
            <CardTitle className="text-base">Preview</CardTitle>
            <CardDescription>Snapshot of your form.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-2xl border">
              <FormPreview
                onFieldDelete={() => {}}
                onFieldSelect={() => {}}
                onFieldsReorder={() => {}}
                schema={previewSchema}
                selectedFieldId={null}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
