import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InboundWebhookFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (mapping: any) => void;
  initialMapping?: {
    id?: string;
    endpoint: string;
    targetFormId: string;
    mappingRules: Record<string, string>;
    enabled: boolean;
  };
  loading?: boolean;
}

export function InboundWebhookFormModal({
  open,
  onClose,
  onSave,
  initialMapping,
  loading,
}: InboundWebhookFormModalProps) {
  const [targetFormId, setTargetFormId] = useState(
    initialMapping?.targetFormId || ""
  );
  const [mappingRules, setMappingRules] = useState<Record<string, string>>(
    initialMapping?.mappingRules || { externalField: "formField" }
  );
  const [enabled, setEnabled] = useState(initialMapping?.enabled ?? true);

  useEffect(() => {
    setTargetFormId(initialMapping?.targetFormId || "");
    setMappingRules(
      initialMapping?.mappingRules || { externalField: "formField" }
    );
    setEnabled(initialMapping?.enabled ?? true);
  }, [initialMapping, open]);

  if (!open) return null;

  function handleRuleChange(key: string, value: string) {
    setMappingRules((prev) => ({ ...prev, [key]: value }));
  }

  function handleAddRule() {
    setMappingRules((prev) => ({
      ...prev,
      ["newField" + Object.keys(prev).length]: "",
    }));
  }

  function handleRemoveRule(key: string) {
    const { [key]: _, ...rest } = mappingRules;
    setMappingRules(rest);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ targetFormId, mappingRules, enabled });
    handleClose();
  }

  function handleClose() {
    onClose();
    setTargetFormId("");
    setMappingRules({ externalField: "formField" });
    setEnabled(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <Card className="relative w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>
            {initialMapping ? "Edit Inbound Webhook" : "Add Inbound Webhook"}
          </CardTitle>
          <Button
            aria-label="Close"
            className="absolute top-2 right-2"
            onClick={handleClose}
            size="sm"
            variant="ghost"
          >
            &times;
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label className="mb-1" htmlFor="endpoint">
                Endpoint
              </Label>
              <Input
                className="cursor-not-allowed bg-gray-100"
                disabled
                id="endpoint"
                readOnly
                type="text"
                value={
                  initialMapping?.endpoint || "/api/webhook/inbound/[generated]"
                }
              />
            </div>
            <div>
              <Label className="mb-1" htmlFor="targetFormId">
                Target Form ID
              </Label>
              <Input
                id="targetFormId"
                onChange={(e) => setTargetFormId(e.target.value)}
                placeholder="form-123"
                required
                type="text"
                value={targetFormId}
              />
            </div>
            <div>
              <Label className="mb-1">Mapping Rules</Label>
              <div className="flex flex-col gap-2">
                {Object.entries(mappingRules).map(([ext, form]) => (
                  <div className="flex items-center gap-2" key={ext}>
                    <Input
                      className="flex-1"
                      onChange={(e) => {
                        const newKey = e.target.value;
                        setMappingRules((prev) => {
                          const { [ext]: oldVal, ...rest } = prev;
                          return { ...rest, [newKey]: oldVal };
                        });
                      }}
                      placeholder="externalField"
                      type="text"
                      value={ext}
                    />
                    <span className="text-gray-400">→</span>
                    <Input
                      className="flex-1"
                      onChange={(e) => handleRuleChange(ext, e.target.value)}
                      placeholder="formField"
                      type="text"
                      value={form}
                    />
                    <Button
                      aria-label="Remove rule"
                      onClick={() => handleRemoveRule(ext)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      &times;
                    </Button>
                  </div>
                ))}
                <Button
                  className="mt-2"
                  onClick={handleAddRule}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Add Rule
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={enabled}
                id="enabled"
                onCheckedChange={(checked) => setEnabled(!!checked)}
              />
              <Label className="text-sm" htmlFor="enabled">
                Enabled
              </Label>
            </div>
          </CardContent>
          <CardFooter className="mt-6 flex justify-end gap-2">
            <Button onClick={handleClose} type="button" variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={!targetFormId || loading}
              type="submit"
              variant="default"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
