import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WebhookListItemProps {
  webhook: {
    id: string;
    url: string;
    events: string[];
    enabled: boolean;
    // lastDelivery: string | null; // Remove for now
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
    <div className="p-4 flex flex-col gap-4">
      <div>
        <div className="font-mono text-sm text-muted-foreground break-all">
          {webhook.url}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {webhook.events.map((event) => (
            <Badge key={event} size="sm" className="bg-blue-100 text-blue-700">
              {event}
            </Badge>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Status:{" "}
          {webhook.enabled ? (
            <span className="text-green-600 font-semibold">Enabled</span>
          ) : (
            <span className="text-muted-foreground">Disabled</span>
          )}
        </div>
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        <Button variant="secondary" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
        <Button variant="outline" size="sm" onClick={onToggleEnabled}>
          {webhook.enabled ? "Disable" : "Enable"}
        </Button>
        <Button variant="default" size="sm" onClick={onTest}>
          Test
        </Button>
        <Button variant="outline" size="sm" onClick={onViewLogs}>
          View Logs
        </Button>
      </div>
    </div>
  );
}
