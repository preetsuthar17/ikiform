import { Edit3, FileText, Layers } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";

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
        {}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMultiStep ? (
                <Layers className="h-5 w-5 text-primary" />
              ) : (
                <FileText className="h-5 w-5 text-primary" />
              )}
              <div>
                <p className="font-medium">Form Type</p>
                <p className="text-muted-foreground text-sm">
                  {isMultiStep ? "Multi-Step Form" : "Single Page Form"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {isMultiStep ? "Multi-Step" : "Single Page"}
              </Badge>
              <Button
                onClick={() => onEditStep("type")}
                size={"icon"}
                title="Edit form type"
                variant={"secondary"}
              >
                <Edit3 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </Button>
            </div>
          </div>
        </Card>

        {}
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <p className="font-medium">Form Configuration</p>
              </div>
              <div className="flex flex-col gap-2">
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
            </div>
            <Button
              onClick={() => onEditStep("configure")}
              size={"icon"}
              title="Edit form configuration"
              variant={"secondary"}
            >
              <Edit3 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Button>
          </div>
        </Card>
      </div>

      {}
      {showPreview && (
        <Card className="p-4">
          <div className="overflow-hidden rounded-2xl border">
            <FormPreview
              onFieldDelete={() => {}}
              onFieldSelect={() => {}}
              onFieldsReorder={() => {}}
              schema={previewSchema}
              selectedFieldId={null}
            />
          </div>
        </Card>
      )}
    </div>
  );
};
