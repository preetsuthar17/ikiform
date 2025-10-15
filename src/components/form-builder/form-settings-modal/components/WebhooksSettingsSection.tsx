import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WebhookManagementPanel } from "@/components/webhooks/WebhookManagementPanel";

export function WebhooksSettingsSection({ formId }: { formId: string }) {
  return (
    <Card
      aria-labelledby="webhooks-title"
      className="shadow-none"
      role="region"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle
              className="flex items-center gap-2 text-lg tracking-tight"
              id="webhooks-title"
            >
              Webhooks
            </CardTitle>
            <CardDescription>
              Send submissions to external services
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <WebhookManagementPanel formId={formId} />
      </CardContent>
    </Card>
  );
}
