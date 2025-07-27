// Profile information display component

// Icons
import { Crown } from 'lucide-react';
import React from 'react';
// UI Components
import { CardContent } from '@/components/ui/card';
// Types
import type { ProfileInfoProps } from '../types';
// Utils
import { extractUserName } from '../utils';

export function ProfileInfo({ user, hasPremium }: ProfileInfoProps) {
  const name = extractUserName(user);

  return (
    <CardContent className="flex flex flex-col flex-col gap-4">
      <div className="flex flex flex-col flex-col gap-1 text-center">
        <div className="flex items-center justify-center gap-2 font-semibold text-xl">
          {name}
          {hasPremium && <Crown className="h-5 w-5 text-yellow-500" />}
        </div>
        <div className="text-muted-foreground text-sm">{user.email}</div>
      </div>
    </CardContent>
  );
}
