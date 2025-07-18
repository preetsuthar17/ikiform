import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
    initialMapping?.targetFormId || "",
  );
  const [mappingRules, setMappingRules] = useState<Record<string, string>>(
    initialMapping?.mappingRules || { externalField: "formField" },
  );
  const [enabled, setEnabled] = useState(initialMapping?.enabled ?? true);

  useEffect(() => {
    setTargetFormId(initialMapping?.targetFormId || "");
    setMappingRules(
      initialMapping?.mappingRules || { externalField: "formField" },
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
      <Card className="w-full max-w-lg relative">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>
            {initialMapping ? "Edit Inbound Webhook" : "Add Inbound Webhook"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleClose}
            aria-label="Close"
          >
            &times;
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1" htmlFor="endpoint">
                Endpoint
              </Label>
              <Input
                id="endpoint"
                className="bg-gray-100 cursor-not-allowed"
                type="text"
                value={
                  initialMapping?.endpoint || "/api/webhook/inbound/[generated]"
                }
                readOnly
                disabled
              />
            </div>
            <div>
              <Label className="mb-1" htmlFor="targetFormId">
                Target Form ID
              </Label>
              <Input
                id="targetFormId"
                type="text"
                value={targetFormId}
                onChange={(e) => setTargetFormId(e.target.value)}
                placeholder="form-123"
                required
              />
            </div>
            <div>
              <Label className="mb-1">Mapping Rules</Label>
              <div className="space-y-2">
                {Object.entries(mappingRules).map(([ext, form]) => (
                  <div key={ext} className="flex gap-2 items-center">
                    <Input
                      className="flex-1"
                      type="text"
                      value={ext}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        setMappingRules((prev) => {
                          const { [ext]: oldVal, ...rest } = prev;
                          return { ...rest, [newKey]: oldVal };
                        });
                      }}
                      placeholder="externalField"
                    />
                    <span className="text-gray-400">→</span>
                    <Input
                      className="flex-1"
                      type="text"
                      value={form}
                      onChange={(e) => handleRuleChange(ext, e.target.value)}
                      placeholder="formField"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRule(ext)}
                      aria-label="Remove rule"
                    >
                      &times;
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleAddRule}
                >
                  Add Rule
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="enabled"
                checked={enabled}
                onCheckedChange={(checked) => setEnabled(!!checked)}
              />
              <Label htmlFor="enabled" className="text-sm">
                Enabled
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={!targetFormId || loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
