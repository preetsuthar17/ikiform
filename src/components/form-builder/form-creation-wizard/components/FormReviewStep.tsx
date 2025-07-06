// External imports
import React from "react";

// UI imports
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Icon imports
import { FileText, Layers, Check, Edit3, Eye } from "lucide-react";

// Component imports
import { FormPreview } from "../../form-preview";

// Utility imports
import { createDefaultFormSchema } from "@/lib/forms";

// Type imports
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
    title: configuration.title || "Untitled Form",
    description: configuration.description || "",
    multiStep: isMultiStep,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {/* Form Type */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMultiStep ? (
                <Layers className="w-5 h-5 text-primary" />
              ) : (
                <FileText className="w-5 h-5 text-primary" />
              )}
              <div>
                <p className="font-medium">Form Type</p>
                <p className="text-sm text-muted-foreground">
                  {isMultiStep ? "Multi-Step Form" : "Single Page Form"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {isMultiStep ? "Multi-Step" : "Single Page"}
              </Badge>
              <Button
                size={"icon"}
                variant={"secondary"}
                onClick={() => onEditStep("type")}
                title="Edit form type"
              >
                <Edit3 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Form Configuration */}
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <p className="font-medium">Form Configuration</p>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-sm font-medium">Title</p>
                  <p className="text-sm text-muted-foreground">
                    {configuration.title || "Untitled Form"}
                  </p>
                </div>
                {configuration.description && (
                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">
                      {configuration.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <Button
              size={"icon"}
              variant={"secondary"}
              onClick={() => onEditStep("configure")}
              title="Edit form configuration"
            >
              <Edit3 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </Button>
          </div>
        </Card>

        {/* Preview Toggle */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Form Preview</p>
                <p className="text-sm text-muted-foreground">
                  See how your form will look
                </p>
              </div>
            </div>
            <Button
              variant={showPreview ? "secondary" : "outline"}
              onClick={() => setShowPreview(!showPreview)}
              size="sm"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
        </Card>
      </div>

      {/* Form Preview */}
      {showPreview && (
        <Card className="p-4">
          <div className="border rounded-lg overflow-hidden">
            <FormPreview
              schema={previewSchema}
              selectedFieldId={null}
              onFieldSelect={() => {}}
              onFieldsReorder={() => {}}
              onFieldDelete={() => {}}
            />
          </div>
        </Card>
      )}
    </div>
  );
};
