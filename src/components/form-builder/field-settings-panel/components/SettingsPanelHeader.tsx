import { X } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

interface SettingsPanelHeaderProps {
  onClose: () => void;
}

export function SettingsPanelHeader({ onClose }: SettingsPanelHeaderProps) {
  return (
    <div className="hidden p-4 lg:flex">
      <div className="flex w-full items-center justify-between">
        <h2 className="font-semibold text-foreground text-lg">
          Field Settings
        </h2>
        <Button
          className="flex gap-2"
          onClick={onClose}
          size="sm"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
