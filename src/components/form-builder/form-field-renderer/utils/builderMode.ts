import type { BaseFieldProps } from "../types";

export function applyBuilderMode<T extends Record<string, any>>(
  props: T,
  builderMode: boolean
): T {
  if (!builderMode) return props;

  return {
    ...props,
    disabled: props.disabled || builderMode,
    readOnly: builderMode,
    tabIndex: builderMode ? -1 : props.tabIndex,
    style: builderMode
      ? { ...props.style, pointerEvents: "none" }
      : props.style,

    onChange: builderMode ? undefined : props.onChange,
    onBlur: builderMode ? undefined : props.onBlur,
    onFocus: builderMode ? undefined : props.onFocus,
    onClick: builderMode ? undefined : props.onClick,
    onKeyDown: builderMode ? undefined : props.onKeyDown,
    onKeyUp: builderMode ? undefined : props.onKeyUp,
  };
}

export function getBuilderMode(props: BaseFieldProps): boolean {
  return Boolean(props.builderMode);
}
