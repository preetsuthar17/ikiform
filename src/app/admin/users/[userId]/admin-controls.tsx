"use client";

import {
  Crown,
  Shield,
  ShieldOff,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminControlsProps {
  userId: string;
  userName: string;
  hasFreeTrial: boolean;
  hasPremium: boolean;
  assignTrial: (userId: string) => void;
  removeTrial: (userId: string) => void;
  assignPremium: (userId: string) => void;
  removePremium: (userId: string) => void;
  deleteUser: (userId: string) => void;
}

export function AdminControls({
  userId,
  userName,
  hasFreeTrial,
  hasPremium,
  assignTrial,
  removeTrial,
  assignPremium,
  removePremium,
  deleteUser,
}: AdminControlsProps) {
  const handleDeleteClick = () => {
    if (
      confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone and will delete all their forms and data.`
      )
    ) {
      deleteUser(userId);
    }
  };

  return (
    <Card className="gap-0 border-orange-200 bg-orange-50/50 p-4 shadow-none md:p-6">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <Shield className="size-5" />
          Admin Controls
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Manage user status and permissions
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Trial Controls */}
          <div className="space-y-2">
            <label className="font-medium text-muted-foreground text-sm">
              Free Trial
            </label>
            <div className="flex gap-2">
              {hasFreeTrial ? (
                <form action={removeTrial.bind(null, userId)}>
                  <Button
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    size="sm"
                    type="submit"
                    variant="outline"
                  >
                    <UserX className="size-4" />
                    Remove Trial
                  </Button>
                </form>
              ) : (
                <form action={assignTrial.bind(null, userId)}>
                  <Button
                    className="border-green-300 text-green-600 hover:bg-green-50"
                    size="sm"
                    type="submit"
                    variant="outline"
                  >
                    <UserCheck className="size-4" />
                    Assign Trial
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Premium Controls */}
          <div className="space-y-2">
            <label className="font-medium text-muted-foreground text-sm">
              Premium Status
            </label>
            <div className="flex gap-2">
              {hasPremium ? (
                <form action={removePremium.bind(null, userId)}>
                  <Button
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    size="sm"
                    type="submit"
                    variant="outline"
                  >
                    <ShieldOff className="size-4" />
                    Remove Premium
                  </Button>
                </form>
              ) : (
                <form action={assignPremium.bind(null, userId)}>
                  <Button
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    size="sm"
                    type="submit"
                    variant="outline"
                  >
                    <Crown className="size-4" />
                    Assign Premium
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Delete User */}
          <div className="space-y-2">
            <label className="font-medium text-muted-foreground text-sm">
              Danger Zone
            </label>
            <div className="flex gap-2">
              <form action={deleteUser.bind(null, userId)}>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDeleteClick}
                  size="sm"
                  type="submit"
                  variant="destructive"
                >
                  <Trash2 className="size-4" />
                  Delete User
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-3">
          <p className="text-xs text-yellow-800">
            <strong>Warning:</strong> Deleting a user will permanently remove
            all their forms, submissions, and data. This action cannot be
            undone.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
