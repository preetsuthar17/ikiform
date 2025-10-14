import type React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FormTypeCardProps } from "../types";
import { FormTypePreview } from "./FormTypePreview";

export const FormTypeCard: React.FC<FormTypeCardProps> = ({
  type,
  isSelected,
  onSelect,
}) => {
  const Icon = type.icon;

  return (
    <Card
      className={`w-full cursor-pointer transition shadow-none ${
        isSelected ? "bg-primary/5 ring-2 ring-primary border-primary" : "hover:bg-muted/30"
      }`}
      onClick={() => onSelect(type.id)}
    >
      <CardHeader>
        <div className="flex items-start flex-col gap-3">
          <span
            className={`rounded-lg p-2 flex items-center justify-center ${
              isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-2">
            <CardTitle className="text-base">{type.title}</CardTitle>
            <CardDescription className="text-xs">{type.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
    </Card>
  );
};
