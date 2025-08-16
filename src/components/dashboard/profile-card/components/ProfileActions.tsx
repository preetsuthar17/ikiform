import { MoreVertical } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { ProfileActionsProps } from '../types';

export function ProfileActions({
  onSignOut,
}: ProfileActionsProps) {
  return (
    <div className="absolute top-5 right-5 flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className='rounded-full'>
            <MoreVertical className="h-6 w-6" />
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
