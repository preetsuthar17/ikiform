import type React from "react";
import { Card } from "@/components/ui/card";
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
      className={`w-full cursor-pointer p-6 transition-all duration-200 hover:shadow-md ${
        isSelected ? "bg-primary/5 ring-2 ring-primary" : "hover:bg-muted/30"
      }`}
      onClick={() => onSelect(type.id)}
    >
      <div className="flex w-full grow items-start justify-between gap-3">
        <div className="flex w-full items-center gap-3 max-sm:flex-col max-sm:justify-center max-sm:text-center">
          <div
            className={`rounded-card p-2 ${
              isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{type.title}</h3>
            <p className="text-muted-foreground text-sm">{type.description}</p>
          </div>
        </div>
      </div>

      <div className="my-4 max-sm:hidden">
        <h4 className="mb-2 font-medium text-sm">Features:</h4>
        <ul className="flex flex-col gap-1">
          {type.features.map((feature, index) => (
            <li
              className="flex items-center gap-2 text-muted-foreground text-sm"
              key={index}
            >
              <div className="h-1 w-1 rounded-card bg-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="max-sm:hidden">
        <FormTypePreview type={type.id} />
      </div>
    </Card>
  );
};
