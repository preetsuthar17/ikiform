import React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
      <div className="flex items-center gap-3 mb-4">
        <Lock className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium">Password Protection</h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Switch
            size="sm"
            id="password-protection-enabled"
            checked={passwordProtection.enabled || false}
            onCheckedChange={handleToggle}
          />
          <Label
            htmlFor="password-protection-enabled"
            className="text-sm font-medium"
          >
            Enable Password Protection
          </Label>
        </div>

        {passwordProtection.enabled ? (
          <div className="flex flex-col gap-4 border-l-2 border-muted pl-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="form-password">Password</Label>
              <div className="relative">
                <Input
                  id="form-password"
                  type={showPassword ? "text" : "password"}
                  value={passwordProtection.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter form password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Users will need to enter this password to access the form
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password-message">Custom Message</Label>
              <Textarea
                id="password-message"
                value={passwordProtection.message}
                onChange={(e) => handleMessageChange(e.target.value)}
                placeholder="Enter custom message for password prompt"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Message shown to users when they need to enter the password
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
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
