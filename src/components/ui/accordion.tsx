"use client"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import * as React from "react"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

type AccordionValue = string | string[]

type AccordionProps = Omit<
  AccordionPrimitive.Root.Props,
  "defaultValue" | "multiple" | "onValueChange" | "value"
> & {
  collapsible?: boolean
  type?: "single" | "multiple"
  value?: AccordionValue
  defaultValue?: AccordionValue
  onValueChange?: (value: AccordionValue) => void
}

function normalizeAccordionValue(
  value: AccordionValue | undefined,
  isMultiple: boolean
): string[] {
  if (value === undefined) {
    return []
  }

  if (Array.isArray(value)) {
    return isMultiple ? value : value.slice(0, 1)
  }

  return [value]
}

function Accordion({
  className,
  type = "single",
  collapsible = true,
  value,
  defaultValue,
  onValueChange,
  ...props
}: AccordionProps) {
  const isMultiple = type === "multiple"
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(
    () => normalizeAccordionValue(defaultValue, isMultiple)
  )
  const currentValue = isControlled
    ? normalizeAccordionValue(value, isMultiple)
    : uncontrolledValue

  const handleValueChange = React.useCallback(
    (nextValue: unknown[]) => {
      const normalizedNextValue = (nextValue ?? []).map(String)
      const shouldKeepCurrentValue =
        !isMultiple &&
        !collapsible &&
        normalizedNextValue.length === 0 &&
        currentValue.length > 0
      const resolvedValue = shouldKeepCurrentValue
        ? currentValue
        : normalizedNextValue

      if (!isControlled) {
        setUncontrolledValue(resolvedValue)
      }

      if (!onValueChange) {
        return
      }

      if (isMultiple) {
        onValueChange(resolvedValue)
        return
      }

      onValueChange(resolvedValue[0] ?? "")
    },
    [collapsible, currentValue, isControlled, isMultiple, onValueChange]
  )

  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      multiple={isMultiple}
      onValueChange={handleValueChange}
      value={currentValue}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:after:border-ring **:data-[slot=accordion-trigger-icon]:text-muted-foreground rounded-md py-4 text-left text-sm font-medium hover:underline focus-visible:ring-3 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 group/accordion-trigger relative flex flex-1 items-start justify-between border border-transparent transition-all outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 transition-transform duration-200 group-data-[panel-open]/accordion-trigger:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="text-sm overflow-hidden h-(--accordion-panel-height) transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0"
      {...props}
    >
      <div
        className={cn(
          "pt-0 pb-4 [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
