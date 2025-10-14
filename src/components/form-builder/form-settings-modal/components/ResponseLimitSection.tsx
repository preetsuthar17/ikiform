import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function ResponseLimitSection({
  localSettings,
  updateResponseLimit,
}: {
  localSettings: any;
  updateResponseLimit: (updates: Partial<any>) => void;
}) {
  const responseLimit = localSettings.responseLimit || {};

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">Response Limit</h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={responseLimit.enabled}
            id="response-limit-enabled"
            onCheckedChange={(checked) =>
              updateResponseLimit({ enabled: checked })
            }
            size="sm"
          />
          <Label
            className="font-medium text-sm"
            htmlFor="response-limit-enabled"
          >
            Enable Response Limit
          </Label>
        </div>
        {responseLimit.enabled ? (
          <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="max-responses">Max Responses</Label>
              <Input
                id="max-responses"
                min={1}
                onChange={(e) =>
                  updateResponseLimit({
                    maxResponses: Number.parseInt(e.target.value) || 1,
                  })
                }
                placeholder="100"
                type="number"
                value={responseLimit.maxResponses || 100}
              />
              <p className="text-muted-foreground text-xs">
                The maximum number of responses allowed for this form.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="response-limit-message">
                Limit Reached Message
              </Label>
              <Textarea
                id="response-limit-message"
                onChange={(e) =>
                  updateResponseLimit({ message: e.target.value })
                }
                placeholder="This form is no longer accepting responses."
                rows={2}
                value={
                  responseLimit.message ||
                  "This form is no longer accepting responses."
                }
              />
              <p className="text-muted-foreground text-xs">
                Message shown when the response limit is reached.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-muted/30 p-4">
            <p className="text-muted-foreground text-sm">
              Limit the total number of responses this form can accept. Once the
              limit is reached, new submissions will be blocked.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
