import { cn } from "@/lib/utils";
import type { BaseFieldProps } from "../types";

export function StatementField({ field }: BaseFieldProps) {
  const getHeadingText = () => field.settings?.statementHeading || field.label;
  const getDescriptionText = () =>
    field.settings?.statementDescription || field.description;
  const getAlignment = () => field.settings?.statementAlign || "left";
  const getSizeVariant = () => field.settings?.statementSize || "md";

  const getContainerClassName = () =>
    cn(
      "flex flex-col gap-2",
      getAlignment() === "center" && "items-center",
      getAlignment() === "right" && "items-end"
    );

  const getHeadingClassName = () =>
    cn(
      "font-semibold text-foreground",
      getSizeVariant() === "lg"
        ? "text-2xl"
        : getSizeVariant() === "sm"
          ? "text-base"
          : "text-xl"
    );

  const getDescriptionClassName = () =>
    "max-w-prose text-muted-foreground text-sm";

  const headingId = `${field.id}-statement-heading`;

  return (
    <section
      aria-label={getHeadingText() ? undefined : "Statement"}
      aria-labelledby={getHeadingText() ? headingId : undefined}
      className={getContainerClassName()}
      role="group"
    >
      {getHeadingText() && (
        <h3 className={getHeadingClassName()} id={headingId}>
          {getHeadingText()}
        </h3>
      )}
      {getDescriptionText() && (
        <p className={getDescriptionClassName()}>{getDescriptionText()}</p>
      )}
    </section>
  );
}
