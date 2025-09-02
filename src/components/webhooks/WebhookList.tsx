import { Card } from "@/components/ui/card";
import { Loader } from "../ui/loader";
import type { WebhookConfig } from "./hooks/useWebhookManagement";
import { WebhookListItem } from "./WebhookListItem";

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
      <div className="py-4 text-center">
        <Loader />
      </div>
    );

  if (!webhooks.length)
    return (
      <div className="rounded-lg border border-muted-foreground/25 border-dashed p-6 text-center">
        <p className="text-muted-foreground text-sm">
          No webhooks configured yet. Add your first webhook to receive form
          submissions.
        </p>
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      {webhooks.map((webhook) => (
        <div className="p-0" key={webhook.id}>
          <WebhookListItem
            onDelete={() => onDelete(webhook.id)}
            onEdit={() => onEdit(webhook)}
            onTest={() => onTest?.(webhook)}
            onToggleEnabled={() => onToggleEnabled?.(webhook)}
            onViewLogs={() => onViewLogs?.(webhook)}
            webhook={webhook}
          />
        </div>
      ))}
    </div>
  );
}
