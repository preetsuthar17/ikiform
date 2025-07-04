"use client";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, CreditCard, Crown, Settings } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
} from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SettingsModal } from "@/components/settings/settings-modal";

export default function ProfileCard() {
  const { user, signOut, loading } = useAuth();
  const [hasPremium, setHasPremium] = useState(false);
  const [hasCustomerPortal, setHasCustomerPortal] = useState(false);
  const [checkingPremium, setCheckingPremium] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Check user's premium status and customer portal access
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user?.email) {
        setHasPremium(false);
        setHasCustomerPortal(false);
        setCheckingPremium(false);
        return;
      }

      setCheckingPremium(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("users")
          .select("has_premium, polar_customer_id")
          .eq("email", user.email)
          .single();

        if (!error && data) {
          setHasPremium(data.has_premium || false);
          setHasCustomerPortal(!!data.polar_customer_id);
        } else {
          setHasPremium(false);
          setHasCustomerPortal(false);
        }
      } catch (error) {
        console.error("Error checking premium status:", error);
        setHasPremium(false);
        setHasCustomerPortal(false);
      } finally {
        setCheckingPremium(false);
      }
    };

    checkPremiumStatus();
  }, [user]);

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
    <Card className="flex flex-col items-center gap-6 w-full grow relative py-24">
      <CardHeader className="flex items-center gap-2">
        <Avatar size="xl">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={name} />
          ) : (
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
      </CardHeader>
      <div className="absolute right-3 top-3 flex items-center gap-2">
        <Button
          variant={"secondary"}
          size={"icon"}
          onClick={() => setShowSettings(true)}
        >
          <Settings />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
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
      <CardContent className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1 text-center">
          <div className="text-xl font-semibold flex items-center justify-center gap-2">
            {name}
            {hasPremium && <Crown className="w-5 h-5 text-yellow-500" />}
          </div>
          <div className="text-muted-foreground text-sm">{user.email}</div>
        </div>

        {/* Customer Portal Button */}
        {hasCustomerPortal && (
          <div className="flex justify-center">
            <Link href="/portal" target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Manage Subscription
              </Button>
            </Link>
          </div>
        )}
      </CardContent>

      {/* Settings Modal */}
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </Card>
  );
}
