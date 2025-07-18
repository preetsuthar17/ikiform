import { Loader } from "../ui/loader";
import { WebhookListItem } from "./WebhookListItem";
import { WebhookConfig } from "./hooks/useWebhookManagement";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WebhookListProps {
  webhooks: WebhookConfig[];
  loading: boolean;
  onEdit: (webhook: WebhookConfig) => void;
  onDelete: (id: string) => void;
  onToggleEnabled?: (webhook: WebhookConfig) => void;
  onTest?: (webhook: WebhookConfig) => void;
  onViewLogs?: (webhook: WebhookConfig) => void;
}

export function WebhookList({
  webhooks,
  loading,
  onEdit,
  onDelete,
  onToggleEnabled,
  onTest,
  onViewLogs,
}: WebhookListProps) {
  if (loading)
    return (
      <div className="text-center py-8">
        <Loader />
      </div>
    );
  if (!webhooks.length)
    return (
      <div className="text-center py-8 text-muted-foreground">
        No webhooks found.
      </div>
    );
  return (
    <ScrollArea className="max-h-[60vh]">
      <ul className="space-y-4">
        {webhooks.map((webhook) => (
          <Card key={webhook.id} className="p-0">
            <WebhookListItem
              webhook={webhook}
              onEdit={() => onEdit(webhook)}
              onDelete={() => onDelete(webhook.id)}
              onToggleEnabled={() => onToggleEnabled?.(webhook)}
              onTest={() => onTest?.(webhook)}
              onViewLogs={() => onViewLogs?.(webhook)}
            />
          </Card>
        ))}
      </ul>
    </ScrollArea>
  );
}
