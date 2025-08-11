import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WebhookListItemProps {
  webhook: {
    id: string;
    url: string;
    events: string[];
    enabled: boolean;
  };
  onEdit: () => void;
  onDelete: () => void;
  onToggleEnabled: () => void;
  onTest: () => void;
  onViewLogs: () => void;
}

export function WebhookListItem({
  webhook,
  onEdit,
  onDelete,
  onToggleEnabled,
  onTest,
  onViewLogs,
}: WebhookListItemProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className="break-all font-mono text-muted-foreground text-sm">
          {webhook.url}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {webhook.events.map((event) => (
            <Badge className="bg-blue-100 text-blue-700" key={event} size="sm">
              {event}
            </Badge>
          ))}
        </div>
        <div className="mt-2 text-gray-500 text-xs">
          Status:{" "}
          {webhook.enabled ? (
            <span className="font-semibold text-green-600">Enabled</span>
          ) : (
            <span className="text-muted-foreground">Disabled</span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onEdit} size="sm" variant="secondary">
          Edit
        </Button>
        <Button onClick={onDelete} size="sm" variant="destructive">
          Delete
        </Button>
        <Button onClick={onToggleEnabled} size="sm" variant="outline">
          {webhook.enabled ? "Disable" : "Enable"}
        </Button>
        <Button onClick={onTest} size="sm" variant="default">
          Test
        </Button>
        <Button onClick={onViewLogs} size="sm" variant="outline">
          View Logs
        </Button>
      </div>
    </div>
  );
}
