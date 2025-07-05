// Profile action buttons component
import React from "react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Icons
import { MoreVertical, Settings } from "lucide-react";

// Types
import type { ProfileActionsProps } from "../types";

export function ProfileActions({
  onSettingsClick,
  onSignOut,
}: ProfileActionsProps) {
  return (
    <div className="absolute right-3 top-3 flex items-center gap-2">
      <Button variant="secondary" size="icon" onClick={onSettingsClick}>
        <Settings />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon">
            <MoreVertical className="w-6 h-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="font-medium shadow-md/2">
          <DropdownMenuItem onClick={onSignOut} variant="destructive">
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
