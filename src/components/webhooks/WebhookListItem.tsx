import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MoreHorizontal, ExternalLink, Trash2, Edit, Play, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="break-all font-mono text-sm text-foreground">
                {webhook.url}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Badge 
              variant="outline" 
              size="sm"
              className="font-mono"
            >
              {webhook.method}
            </Badge>
            <Switch
              checked={webhook.enabled}
              onCheckedChange={onToggleEnabled}
              size="sm"
            />
            <Badge 
              variant={webhook.enabled ? "default" : "secondary"}
              size="sm"
            >
              {webhook.enabled ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {webhook.events.map((event) => (
            <Badge 
              className="bg-blue-50 text-blue-700 border-blue-200" 
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
        <div className="flex sm:hidden items-center gap-1">
          <Button size="sm" variant="ghost" onClick={onEdit} className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onTest} className="h-8 w-8 p-0">
            <Play className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onViewLogs} className="h-8 w-8 p-0">
            <FileText className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete} className="h-8 w-8 p-0 text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Desktop: Show dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="hidden sm:flex h-8 w-8 p-0">
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
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
