import type {
  LogicAction,
  LogicActionCondition,
  LogicCondition,
  LogicConditionGroup,
} from "@/components/form-builder/logic-builder/types";

export type { LogicAction };

export function evaluateLogic(
  logicItems: LogicActionCondition[],
  formState: Record<string, any>,
  userAttributes?: Record<string, any>
): LogicAction[] {
  const actions: LogicAction[] = [];
  for (const item of logicItems) {
    if (
      item &&
      item.condition &&
      Array.isArray(item.condition.conditions) &&
      evaluateConditionGroup(item.condition, formState, userAttributes)
    ) {
      actions.push(item.action);
    }
  }
  return actions;
}

export function getLogicFieldDefaults(
  logicItems: LogicActionCondition[],
  allFieldIds: string[]
): Record<string, { visible: boolean; disabled: boolean }> {
  const defaults: Record<string, { visible: boolean; disabled: boolean }> = {};
  for (const fieldId of allFieldIds) {
    let visible = true;
    let disabled = false;
    for (const item of logicItems) {
      const action = item && item.action;
      if (action && action.target === fieldId) {
        if (action.type === "show") visible = false;
        if (action.type === "hide") visible = true;
        if (action.type === "enable") disabled = true;
        if (action.type === "disable") disabled = false;
      }
    }
    defaults[fieldId] = { visible, disabled };
  }
  return defaults;
}

function evaluateConditionGroup(
  group: LogicConditionGroup,
  formState: Record<string, any>,
  userAttributes?: Record<string, any>
): boolean {
  if (!(group && Array.isArray(group.conditions))) return false;
  const results = group.conditions.map((cond) =>
    "logic" in cond
      ? evaluateConditionGroup(cond, formState, userAttributes)
      : evaluateCondition(cond, formState, userAttributes)
  );
  return group.logic === "AND" ? results.every(Boolean) : results.some(Boolean);
}

function evaluateCondition(
  cond: LogicCondition,
  formState: Record<string, any>,
  userAttributes?: Record<string, any>
): boolean {
  const value = formState[cond.field] ?? userAttributes?.[cond.field];
  switch (cond.operator) {
    case "equals":
      return value === cond.value;
    case "not_equals":
      return value !== cond.value;
    case "greater_than": {
      if (
        value == null ||
        value === "" ||
        cond.value == null ||
        cond.value === ""
      )
        return false;
      const numValue = Number(value);
      const numCond = Number(cond.value);
      if (isNaN(numValue) || isNaN(numCond)) return false;
      return numValue > numCond;
    }
    case "less_than": {
      if (
        value == null ||
        value === "" ||
        cond.value == null ||
        cond.value === ""
      )
        return false;
      const numValue = Number(value);
      const numCond = Number(cond.value);
      if (isNaN(numValue) || isNaN(numCond)) return false;
      return numValue < numCond;
    }
    case "contains":
      return Array.isArray(value)
        ? value.includes(cond.value)
        : typeof value === "string"
          ? value.includes(cond.value)
          : false;
    case "not_contains":
      return Array.isArray(value)
        ? !value.includes(cond.value)
        : typeof value === "string"
          ? !value.includes(cond.value)
          : false;
    case "is_empty":
      return (
        value == null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      );
    case "is_not_empty":
      return (
        value != null &&
        value !== "" &&
        (!Array.isArray(value) || value.length > 0)
      );
    case "includes":
      return Array.isArray(value)
        ? value.includes(cond.value)
        : typeof value === "string"
          ? value.includes(cond.value)
          : false;
    default:
      return false;
  }
}
