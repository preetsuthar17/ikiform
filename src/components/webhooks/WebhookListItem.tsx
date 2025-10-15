import { Edit, FileText, MoreHorizontal, Play, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

import type { WebhookConfig } from "./hooks/useWebhookManagement";

interface WebhookListItemProps {
  webhook: WebhookConfig;
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
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-col gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2">
              {webhook.name ? (
                <div className="truncate font-medium text-foreground">
                  {webhook.name}
                </div>
              ) : null}
              {webhook.description ? (
                <div className="truncate text-muted-foreground text-xs">
                  {webhook.description}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Badge className="font-mono" variant="outline">
              {webhook.method}
            </Badge>
            <div
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              role="presentation"
            >
              <Switch
                checked={webhook.enabled}
                onCheckedChange={() => {
                  onToggleEnabled();
                }}
              />
            </div>
            <Badge variant={webhook.enabled ? "default" : "secondary"}>
              {webhook.enabled ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {webhook.events.map((event) => (
            <Badge
              className="border-blue-200 bg-blue-50 text-blue-700"
              key={event}
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
            className=""
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            size="icon"
            variant="ghost"
          >
            <Edit className="size-4" />
          </Button>
          <Button
            className=""
            onClick={(e) => {
              e.stopPropagation();
              onTest();
            }}
            size="icon"
            variant="ghost"
          >
            <Play className="size-4" />
          </Button>
          <Button
            className=""
            onClick={(e) => {
              e.stopPropagation();
              onViewLogs();
            }}
            size="icon"
            variant="ghost"
          >
            <FileText className="size-4" />
          </Button>
          <Button
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            size="icon"
            variant="ghost"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        {/* Desktop: Show dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="hidden sm:flex"
              onClick={(e) => e.stopPropagation()}
              size="icon"
              variant="ghost"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="shadow-xs">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onTest();
              }}
            >
              <Play className="size-4" />
              Test
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onViewLogs();
              }}
            >
              <FileText className="size-4" />
              View Logs
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              variant="destructive"
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
