import { Crown } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import type { ProfileInfoProps } from "../types";
import { extractUserName } from "../utils";

export function ProfileInfo({ user, hasPremium }: ProfileInfoProps) {
  const name = extractUserName(user);

  return (
    <CardContent className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-center">
        <div className="flex items-center justify-center gap-2 font-semibold text-xl">
          <span className="truncate">{name}</span>
          {hasPremium && (
            <Crown
              aria-label="Premium user"
              className="h-5 w-5 flex-shrink-0 text-yellow-500"
            />
          )}
        </div>
        <div
          className="truncate text-muted-foreground text-sm"
          title={user.email}
        >
          {user.email}
        </div>
      </div>
    </CardContent>
  );
}
