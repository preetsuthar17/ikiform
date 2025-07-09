import React from "react";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
      <div className="flex items-center gap-3 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium">Response Limit</h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Switch
            size="sm"
            id="response-limit-enabled"
            checked={responseLimit.enabled || false}
            onCheckedChange={(checked) =>
              updateResponseLimit({ enabled: checked })
            }
          />
          <Label
            htmlFor="response-limit-enabled"
            className="text-sm font-medium"
          >
            Enable Response Limit
          </Label>
        </div>
        {responseLimit.enabled ? (
          <div className="flex flex-col gap-4 border-l-2 border-muted pl-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="max-responses">Max Responses</Label>
              <Input
                id="max-responses"
                type="number"
                min={1}
                value={responseLimit.maxResponses || 100}
                onChange={(e) =>
                  updateResponseLimit({
                    maxResponses: parseInt(e.target.value) || 1,
                  })
                }
                placeholder="100"
              />
              <p className="text-xs text-muted-foreground">
                The maximum number of responses allowed for this form.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="response-limit-message">
                Limit Reached Message
              </Label>
              <Textarea
                id="response-limit-message"
                value={
                  responseLimit.message ||
                  "This form is no longer accepting responses."
                }
                onChange={(e) =>
                  updateResponseLimit({ message: e.target.value })
                }
                placeholder="This form is no longer accepting responses."
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Message shown when the response limit is reached.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Limit the total number of responses this form can accept. Once the
              limit is reached, new submissions will be blocked.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
