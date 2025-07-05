import React from "react";
import { Card } from "@/components/ui/card";
import { FormTypePreview } from "./FormTypePreview";
import type { FormTypeCardProps } from "../types";

export const FormTypeCard: React.FC<FormTypeCardProps> = ({
  type,
  isSelected,
  onSelect,
}) => {
  const Icon = type.icon;

  return (
    <Card
      className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-md w-full ${
        isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/30"
      }`}
      onClick={() => onSelect(type.id)}
    >
      <div className="flex items-start justify-between grow w-full gap-3">
        <div className="flex items-center gap-3 max-sm:flex-col max-sm:justify-center max-sm:text-center w-full">
          <div
            className={`p-2 rounded-lg ${
              isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{type.title}</h3>
            <p className="text-sm text-muted-foreground">{type.description}</p>
          </div>
        </div>
      </div>

      <div className="my-4 max-sm:hidden">
        <h4 className="font-medium mb-2 text-sm">Features:</h4>
        <ul className="flex flex-col gap-1">
          {type.features.map((feature, index) => (
            <li
              key={index}
              className="text-sm text-muted-foreground flex items-center gap-2"
            >
              <div className="w-1 h-1 bg-primary rounded-full"></div>
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
