import {
  Edit,
  ExternalLink,
  FileText,
  MoreHorizontal,
  Play,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

interface WebhookListItemProps {
  webhook: {
    id: string;
    url: string;
    events: string[];
    method: string;
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
    <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-col gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="break-all font-mono text-foreground text-sm">
                {webhook.url}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Badge className="font-mono" size="sm" variant="outline">
              {webhook.method}
            </Badge>
            <Switch
              checked={webhook.enabled}
              onCheckedChange={onToggleEnabled}
              size="sm"
            />
            <Badge
              size="sm"
              variant={webhook.enabled ? 'default' : 'secondary'}
            >
              {webhook.enabled ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {webhook.events.map((event) => (
            <Badge
              className="border-blue-200 bg-blue-50 text-blue-700"
              key={event}
              size="sm"
              variant="secondary"
            >
              {event}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-0">
        <div className="flex items-center gap-1 sm:hidden">
          <Button
            className="h-8 w-8 p-0"
            onClick={onEdit}
            size="sm"
            variant="ghost"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 w-8 p-0"
            onClick={onTest}
            size="sm"
            variant="ghost"
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 w-8 p-0"
            onClick={onViewLogs}
            size="sm"
            variant="ghost"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 w-8 p-0 text-destructive"
            onClick={onDelete}
            size="sm"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop: Show dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="hidden h-8 w-8 p-0 sm:flex"
              size="sm"
              variant="ghost"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onTest}>
              <Play className="mr-2 h-4 w-4" />
              Test
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onViewLogs}>
              <FileText className="mr-2 h-4 w-4" />
              View Logs
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
