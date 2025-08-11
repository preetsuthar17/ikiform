import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Switch } from "@/components/ui/switch";
import type { FormField } from "@/lib/database";
import { ActionListEditor } from "./ActionListEditor";
import { ConditionGroupEditor } from "./ConditionGroupEditor";
import type { LogicAction, LogicConditionGroup, LogicRule } from "./types";

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
    <Modal onOpenChange={onClose} open={open}>
      <ModalContent className="max-w-lg">
        <ModalHeader>
          <ModalTitle>{rule ? "Edit Rule" : "Add Rule"}</ModalTitle>
        </ModalHeader>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-medium text-sm">Rule Name</label>
            <Input
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Show SSN for US Adults"
              value={name}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={enabled} onCheckedChange={setEnabled} />
            <span className="text-sm">Enabled</span>
          </div>
          <div className="border-t pt-4">
            <div className="mb-2 font-semibold">Conditions</div>
            <ConditionGroupEditor
              fields={fields}
              group={conditions}
              onChange={setConditions}
            />
          </div>
          <div className="border-t pt-4">
            <div className="mb-2 font-semibold">Actions</div>
            <ActionListEditor
              actions={actions}
              fields={fields}
              onChange={setActions}
            />
          </div>
        </div>
        <ModalFooter>
          <Button onClick={onClose} variant="outline">
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
