// Profile information display component
import React from "react";

// UI Components
import { CardContent } from "@/components/ui/card";

// Icons
import { Crown } from "lucide-react";

// Utils
import { extractUserName } from "../utils";

// Types
import type { ProfileInfoProps } from "../types";

export function ProfileInfo({ user, hasPremium }: ProfileInfoProps) {
  const name = extractUserName(user);

  return (
    <CardContent className="flex flex-col flex flex-col gap-4">
      <div className="flex flex-col flex flex-col gap-1 text-center">
        <div className="text-xl font-semibold flex items-center justify-center gap-2">
          {name}
          {hasPremium && <Crown className="w-5 h-5 text-yellow-500" />}
        </div>
        <div className="text-muted-foreground text-sm">{user.email}</div>
      </div>
    </CardContent>
  );
}
