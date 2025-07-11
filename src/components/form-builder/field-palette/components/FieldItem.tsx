// Components
import { Card } from "@/components/ui/card";

// Types
import type { FieldItemProps } from "../types";

export function FieldItem({ fieldType, onAddField }: FieldItemProps) {
  const IconComponent = fieldType.icon;

  return (
    <Card
      className="group bg-background border-border hover:border-ring/20 transition-all duration-200 cursor-pointer hover:shadow-md/2 p-1"
      onClick={() => onAddField(fieldType.type)}
    >
      <div className="flex items-center gap-3 p-3">
        <div className="flex-shrink-0 bg-accent rounded-card group-hover:bg-primary/10 transition-colors duration-200 flex items-center justify-center p-2">
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
}
