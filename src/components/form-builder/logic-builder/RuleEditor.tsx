import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import type { LogicRule, LogicConditionGroup, LogicAction } from "./types";
import { ConditionGroupEditor } from "./ConditionGroupEditor";
import { ActionListEditor } from "./ActionListEditor";
import type { FormField } from "@/lib/database";

function RuleEditor({
  open,
  onClose,
  rule,
  onSave,
  fields,
}: {
  open: boolean;
  onClose: () => void;
  rule?: LogicRule;
  onSave?: (rule: LogicRule) => void;
  fields: FormField[];
}) {
  // Local state for editing
  const [name, setName] = React.useState(rule?.name || "");
  const [enabled, setEnabled] = React.useState(rule?.enabled ?? true);
  const [conditions, setConditions] = React.useState<LogicConditionGroup>(
    rule?.conditions || {
      id: `group-${Date.now()}`,
      logic: "AND",
      conditions: [],
    },
  );
  const [actions, setActions] = React.useState<LogicAction[]>(
    rule?.actions || [],
  );

  React.useEffect(() => {
    setName(rule?.name || "");
    setEnabled(rule?.enabled ?? true);
    setConditions(
      rule?.conditions || {
        id: `group-${Date.now()}`,
        logic: "AND",
        conditions: [],
      },
    );
    setActions(rule?.actions || []);
  }, [rule]);

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent className="max-w-lg">
        <ModalHeader>
          <ModalTitle>{rule ? "Edit Rule" : "Add Rule"}</ModalTitle>
        </ModalHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rule Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Show SSN for US Adults"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={enabled} onCheckedChange={setEnabled} />
            <span className="text-sm">Enabled</span>
          </div>
          <div className="border-t pt-4">
            <div className="font-semibold mb-2">Conditions</div>
            <ConditionGroupEditor
              group={conditions}
              onChange={setConditions}
              fields={fields}
            />
          </div>
          <div className="border-t pt-4">
            <div className="font-semibold mb-2">Actions</div>
            <ActionListEditor
              actions={actions}
              onChange={setActions}
              fields={fields}
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSave?.({
                ...rule,
                name,
                enabled,
                conditions,
                actions,
              } as LogicRule)
            }
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export { RuleEditor };
