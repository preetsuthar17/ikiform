"use client";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
} from "@/components/ui/skeleton";

export default function ProfileCard() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <Card className="flex flex-col items-center gap-6 w-full grow relative">
        <CardHeader className="flex items-center gap-2">
          <SkeletonAvatar size="xl" />
        </CardHeader>
        <div className="absolute right-3 top-3">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        <CardContent className="flex flex-col space-y-1 w-full items-center">
          <SkeletonText className="h-7 w-32 mb-2" />
          <SkeletonText className="h-5 w-40" />
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.user_name ||
    user.email?.split("@")[0] ||
    "User";
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <Card className="flex flex-col items-center gap-6 w-full grow relative">
      <CardHeader className="flex items-center gap-2">
        <Avatar size="xl">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={name} />
          ) : (
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
      </CardHeader>
      <div className="absolute right-3 top-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-medium shadow-md/2">
            <DropdownMenuItem onClick={signOut} variant={"destructive"}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardContent className="flex flex-col space-y-1">
        <div className="text-xl font-semibold text-center">{name}</div>
        <div className="text-muted-foreground text-sm">{user.email}</div>
      </CardContent>
    </Card>
  );
}
