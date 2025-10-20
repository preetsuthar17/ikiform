import { Button } from "@/components/ui/button";

import type { FieldItemProps } from "../types";

export function FieldItem({ fieldType, onAddField }: FieldItemProps) {
  const IconComponent = fieldType.icon;
  return (
    <Button
      aria-label={`Add ${fieldType.label} field`}
      className="group h-auto min-h-11 w-full justify-start bg-card p-4 text-left"
      onClick={() => onAddField(fieldType.type)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onAddField(fieldType.type);
        }
      }}
      style={{
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
      variant="outline"
    >
      <div className="flex w-full items-center gap-3">
        <div
          className="flex flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20"
          style={{
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <IconComponent aria-hidden="true" className="size-4 text-primary" />
        </div>
        <div
          className="flex min-w-0 flex-1 flex-col gap-1"
          style={{
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-wrap font-medium text-foreground text-sm">
              {fieldType.label}
            </h3>
          </div>
          <p className="text-wrap text-muted-foreground text-xs">
            {fieldType.description}
          </p>
        </div>
      </div>
    </Button>
  );
}
