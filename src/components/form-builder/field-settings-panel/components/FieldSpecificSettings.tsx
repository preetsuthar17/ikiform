import type React from "react";
import type { FormField } from "@/lib/database";
import { EmailValidationSettings } from "./EmailValidationSettings";
import {
  AddressFieldSettings,
  CheckboxFieldSettings,
  FileFieldSettings,
  LinkFieldSettings,
  PhoneFieldSettings,
  PollFieldSettings,
  RadioFieldSettings,
  RatingFieldSettings,
  BannerFieldSettings,
  SchedulerFieldSettings,
  SliderFieldSettings,
  SocialFieldSettings,
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
    phone: PhoneFieldSettings,
    link: LinkFieldSettings,
    address: AddressFieldSettings,
    textarea: TextareaFieldSettings,
    slider: SliderFieldSettings,
    email: EmailValidationSettings,
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
