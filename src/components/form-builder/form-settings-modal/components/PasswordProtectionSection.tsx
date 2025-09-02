import { Eye, EyeOff, Lock } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface PasswordProtectionSectionProps {
  localSettings: any;
  updatePasswordProtection: (updates: any) => void;
}

export function PasswordProtectionSection({
  localSettings,
  updatePasswordProtection,
}: PasswordProtectionSectionProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const passwordProtection = localSettings.passwordProtection || {
    enabled: false,
    password: "",
    message:
      "This form is password protected. Please enter the password to continue.",
  };

  const handleToggle = (enabled: boolean) => {
    updatePasswordProtection({ enabled });
  };

  const handlePasswordChange = (password: string) => {
    updatePasswordProtection({ password });
  };

  const handleMessageChange = (message: string) => {
    updatePasswordProtection({ message });
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Lock className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">Password Protection</h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={passwordProtection.enabled}
            id="password-protection-enabled"
            onCheckedChange={handleToggle}
            size="sm"
          />
          <Label
            className="font-medium text-sm"
            htmlFor="password-protection-enabled"
          >
            Enable Password Protection
          </Label>
        </div>

        {passwordProtection.enabled ? (
          <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="form-password">Password</Label>
              <div className="relative">
                <Input
                  className="pr-10"
                  id="form-password"
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter form password"
                  type={showPassword ? "text" : "password"}
                  value={passwordProtection.password}
                />
                <Button
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Users will need to enter this password to access the form
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password-message">Custom Message</Label>
              <Textarea
                id="password-message"
                onChange={(e) => handleMessageChange(e.target.value)}
                placeholder="Enter custom message for password prompt"
                rows={2}
                value={passwordProtection.message}
              />
              <p className="text-muted-foreground text-xs">
                Message shown to users when they need to enter the password
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-card bg-muted/30 p-4">
            <p className="text-muted-foreground text-sm">
              Password protection restricts access to your form by requiring
              users to enter a password before they can view and submit the
              form.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
