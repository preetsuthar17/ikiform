import { Bell, Palette } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SETTINGS_SECTIONS } from '../constants';
import type { SettingsSection } from '../types';
import { getNavigationItemStyles } from '../utils';

interface SidebarNavigationProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const iconMap = {
  Palette,
  Bell,
};

export function SidebarNavigation({
  activeSection,
  onSectionChange,
}: SidebarNavigationProps) {
  return (
    <ScrollArea className="flex flex-1 flex-col gap-4">
      <nav className="flex flex-col gap-2">
        {SETTINGS_SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          const IconComponent = iconMap[section.iconName];

          return (
            <Button
              className={getNavigationItemStyles(isActive)}
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              variant={isActive ? 'secondary' : 'ghost'}
            >
              <IconComponent className="h-4 w-4" />
              <span className="font-medium text-sm">{section.label}</span>
            </Button>
          );
        })}
      </nav>
    </ScrollArea>
  );
}
