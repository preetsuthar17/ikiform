import React from "react";
import {
  Type,
  Mail,
  MessageSquare,
  Circle,
  CheckSquare,
  Hash,
  ChevronDown,
  Sliders,
  Tags,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FormField } from "@/lib/database.types";

interface FieldPaletteProps {
  onAddField: (fieldType: FormField["type"]) => void;
}

const fieldTypes = [
  {
    type: "text" as const,
    label: "Text Input",
    icon: Type,
    description: "Single line text input",
  },
  {
    type: "email" as const,
    label: "Email",
    icon: Mail,
    description: "Email address input",
  },
  {
    type: "textarea" as const,
    label: "Textarea",
    icon: MessageSquare,
    description: "Multi-line text input",
  },
  {
    type: "number" as const,
    label: "Number",
    icon: Hash,
    description: "Numeric input",
  },
  {
    type: "select" as const,
    label: "Select Dropdown",
    icon: ChevronDown,
    description: "Choose from dropdown options",
  },
  {
    type: "radio" as const,
    label: "Radio Buttons",
    icon: Circle,
    description: "Choose one option",
  },
  {
    type: "checkbox" as const,
    label: "Checkboxes",
    icon: CheckSquare,
    description: "Choose multiple options",
  },
  {
    type: "slider" as const,
    label: "Slider",
    icon: Sliders,
    description: "Select value with slider",
  },
  {
    type: "tags" as const,
    label: "Tag Input",
    icon: Tags,
    description: "Enter multiple tags",
  },
];

export function FieldPalette({ onAddField }: FieldPaletteProps) {
  return (
    <div className="h-full bg-card border-r border-border">
      <ScrollArea className="h-full">
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Form Fields
            </h2>
            <p className="text-sm text-muted-foreground">
              Click to add fields to your form
            </p>
          </div>

          <div className="space-y-2">
            {fieldTypes.map((fieldType) => {
              const IconComponent = fieldType.icon;
              return (
                <Card
                  key={fieldType.type}
                  className="group p-3 bg-background border-border hover:border-ring/20 transition-all duration-200 cursor-pointer hover:shadow-md/2"
                  onClick={() => onAddField(fieldType.type)}
                >
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 p-1.5 bg-accent rounded-ele group-hover:bg-primary/10 transition-colors duration-200">
                      <IconComponent className="w-4 h-4 text-accent-foreground group-hover:text-primary transition-colors duration-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200 text-sm">
                        {fieldType.label}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {fieldType.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
