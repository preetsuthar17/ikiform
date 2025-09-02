import React from "react";

import type { FormField } from "@/lib/database";

import {
  CheckboxField,
  DateInputField,
  EmailInputField,
  FileUploadField,
  NumberInputField,
  PollField,
  RadioField,
  RatingField,
  SchedulerField,
  SelectField,
  SignatureField,
  SliderField,
  SocialField,
  StatementField,
  TagsField,
  TextareaField,
  TextInputField,
  TimeInputField,
} from "../components";
import { AddressField } from "../components/AddressField";
import { LinkInputField } from "../components/LinkInputField";
import { PhoneInputField } from "../components/PhoneInputField";
import { QuizField } from "../components/QuizField";
import type { BaseFieldProps } from "../types";

export function createFieldComponent(
  field: FormField,
  value: any,
  onChange: (value: any) => void,
  error?: string,
  fieldRef?: React.RefObject<any>,
  disabled?: boolean,
  formId?: string
): React.ReactElement {
  const props: BaseFieldProps = {
    field,
    value,
    onChange,
    error,
    fieldRef,
    disabled,
    formId,
  };

  switch (field.type) {
    case "text":
      return React.createElement(TextInputField, props);
    case "email":
      return React.createElement(EmailInputField, props);
    case "number":
      return React.createElement(NumberInputField, props);
    case "textarea":
      return React.createElement(TextareaField, props);
    case "radio":
      if (field.settings?.isQuizField) {
        return React.createElement(QuizField, props);
      }
      return React.createElement(RadioField, props);
    case "checkbox":
      return React.createElement(CheckboxField, props);
    case "select":
      return React.createElement(SelectField, props);
    case "slider":
      return React.createElement(SliderField, props);
    case "tags":
      return React.createElement(TagsField, props);
    case "social":
      return React.createElement(SocialField, props);
    case "date":
      return React.createElement(DateInputField, props);
    case "signature":
      return React.createElement(SignatureField, props);
    case "poll":
      return React.createElement(PollField, props);
    case "rating":
      return React.createElement(RatingField, props);
    case "time":
      return React.createElement(TimeInputField, props);
    case "scheduler":
      return React.createElement(SchedulerField, props);
    case "statement":
      return React.createElement(StatementField, props);
    case "phone":
      return React.createElement(PhoneInputField, props);
    case "address":
      return React.createElement(AddressField, props);
    case "link":
      return React.createElement(LinkInputField, props);
    case "file":
      return React.createElement(FileUploadField, props);
    default:
      return React.createElement("div", {}, "Unsupported field type");
  }
}
