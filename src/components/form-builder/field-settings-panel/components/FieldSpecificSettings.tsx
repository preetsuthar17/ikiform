import type React from "react";
import type { FormField } from "@/lib/database";
import { EmailValidationSettings } from "./EmailValidationSettings";
import {
  AddressFieldSettings,
  BannerFieldSettings,
  CheckboxFieldSettings,
  DateFieldSettings,
  FieldGroupSettings,
  FileFieldSettings,
  NumberFieldSettings,
  LinkFieldSettings,
  PhoneFieldSettings,
  PollFieldSettings,
  RadioFieldSettings,
  RatingFieldSettings,
  SelectFieldSettings,
  SchedulerFieldSettings,
  SliderFieldSettings,
  SocialFieldSettings,
  TextFieldSettings,
  TagsFieldSettings,
  TextareaFieldSettings,
  TimeFieldSettings,
} from "./field-settings";

interface FieldSpecificSettingsProps {
  field: FormField;
  onUpdateSettings: (updates: Partial<FormField["settings"]>) => void;
  onFieldUpdate: (field: FormField) => void;
}

export function FieldSpecificSettings({
  field,
  onUpdateSettings,
  onFieldUpdate,
}: FieldSpecificSettingsProps) {
  const fieldSettingsMap: Record<string, React.ComponentType<any>> = {
    text: TextFieldSettings,
    number: NumberFieldSettings,
    date: DateFieldSettings,
    email: EmailValidationSettings,
    select: SelectFieldSettings,
    phone: PhoneFieldSettings,
    link: LinkFieldSettings,
    address: AddressFieldSettings,
    textarea: TextareaFieldSettings,
    slider: SliderFieldSettings,
    tags: TagsFieldSettings,
    social: SocialFieldSettings,
    poll: PollFieldSettings,
    rating: RatingFieldSettings,
    banner: BannerFieldSettings,
    checkbox: CheckboxFieldSettings,
    radio: RadioFieldSettings,
    scheduler: SchedulerFieldSettings,
    time: TimeFieldSettings,
    file: FileFieldSettings,
    "field-group": FieldGroupSettings,
  };

  const FieldComponent = fieldSettingsMap[field.type];

  if (!FieldComponent) {
    return null;
  }

  return (
    <FieldComponent
      field={field}
      onFieldUpdate={onFieldUpdate}
      onUpdateSettings={onUpdateSettings}
    />
  );
}
