import { Lock } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordProtectionModalProps {
  isOpen: boolean;
  message: string;
  onPasswordSubmit: (password: string) => void;
  onCancel: () => void;
}

export function PasswordProtectionModal({
  isOpen,
  message,
  onPasswordSubmit,
  onCancel,
}: PasswordProtectionModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }
    setError('');
    onPasswordSubmit(password);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (error) setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm">
      <Card className="flex w-full max-w-md flex-col gap-4">
        <CardHeader className="flex flex-col gap-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-card bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Password Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-center text-muted-foreground text-sm">
            {message}
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  autoFocus
                  id="password"
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter password"
                  size="lg"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={onCancel}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button className="flex-1" type="submit">
                Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
