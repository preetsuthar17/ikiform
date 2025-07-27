import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader } from '../ui/loader';
import type { WebhookConfig } from './hooks/useWebhookManagement';
import { WebhookListItem } from './WebhookListItem';

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
      <div className="py-8 text-center">
        <Loader />
      </div>
    );
  if (!webhooks.length)
    return (
      <div className="py-8 text-center text-muted-foreground">
        No webhooks found.
      </div>
    );
  return (
    <ScrollArea className="max-h-[60vh]">
      <ul className="space-y-4">
        {webhooks.map((webhook) => (
          <Card className="p-0" key={webhook.id}>
            <WebhookListItem
              onDelete={() => onDelete(webhook.id)}
              onEdit={() => onEdit(webhook)}
              onTest={() => onTest?.(webhook)}
              onToggleEnabled={() => onToggleEnabled?.(webhook)}
              onViewLogs={() => onViewLogs?.(webhook)}
              webhook={webhook}
            />
          </Card>
        ))}
      </ul>
    </ScrollArea>
  );
}
