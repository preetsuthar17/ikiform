// External libraries
import React from "react";

// Types import
import type { FormField } from "@/lib/database";

// Components import
import {
  TextInputField,
  EmailInputField,
  NumberInputField,
  TextareaField,
  RadioField,
  CheckboxField,
  SelectField,
  SliderField,
  TagsField,
  SocialField,
  DateInputField,
  SignatureField,
  PollField,
  RatingField,
} from "../components";
import type { BaseFieldProps } from "../types";

export function createFieldComponent(
  field: FormField,
  value: any,
  onChange: (value: any) => void,
  error?: string,
  fieldRef?: React.RefObject<any>,
): React.ReactElement {
  const props: BaseFieldProps = { field, value, onChange, error, fieldRef };

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
    default:
      return React.createElement("div", {}, "Unsupported field type");
  }
}
