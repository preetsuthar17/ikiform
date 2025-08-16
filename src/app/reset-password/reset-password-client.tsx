'use client';

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const handleRecoverySession = async () => {
      const supabase = createClient();

      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      if (accessToken && refreshToken) {
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Session error:', error);
            toast.error(
              'Invalid or expired reset link. Please request a new one.'
            );
            router.push('/login');
          } else if (data.session) {
            setSessionReady(true);
            toast.success('Ready to reset your password!');
            window.history.replaceState({}, '', '/reset-password');
          }
        } catch (error) {
          console.error('Recovery session error:', error);
          toast.error('Something went wrong. Please try again.');
          router.push('/login');
        }
      } else {
        toast.error(
          'No reset token found. Please request a new password reset.'
        );
        router.push('/login');
      }
    };

    handleRecoverySession();
  }, [searchParams, router]);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const validatePasswords = () => {
    const { password, confirmPassword } = passwords;

    if (!(password && confirmPassword)) {
      toast.error('Please fill in both password fields');
      return false;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) return;

    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password updated successfully!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!sessionReady) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Card className="flex w-full max-w-sm flex-col items-center justify-center gap-6 text-center">
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
              <p className="text-muted-foreground text-sm">
                Verifying reset token...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Card className="flex w-full max-w-sm flex-col items-center justify-center gap-6 text-center">
        <CardHeader>
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="flex items-center justify-center gap-2 font-semibold text-3xl tracking-tight">
                <Image
                  alt="Ikiform Logo"
                  height={40}
                  src="/favicon.ico"
                  width={40}
                />
                <span className="text-black">Ikiform</span>
              </span>
            </Link>
          </div>
          <div className="mt-4">
            <h2 className="font-semibold text-2xl">Reset Password</h2>
            <p className="text-muted-foreground text-sm">
              Enter your new password below
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex w-full flex-col gap-4">
          <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  className="pr-10"
                  disabled={loading || !sessionReady}
                  id="password"
                  onChange={(e) =>
                    handlePasswordChange('password', e.target.value)
                  }
                  placeholder="Enter your new password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.password}
                />
                <Button
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  disabled={loading || !sessionReady}
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
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  className="pr-10"
                  disabled={loading || !sessionReady}
                  id="confirmPassword"
                  onChange={(e) =>
                    handlePasswordChange('confirmPassword', e.target.value)
                  }
                  placeholder="Confirm your new password"
                  required
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwords.confirmPassword}
                />
                <Button
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  disabled={loading || !sessionReady}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Password must be at least 6 characters long
              </p>
            </div>

            <Button
              className="w-full"
              disabled={loading || !sessionReady}
              size="lg"
              type="submit"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>

          <div className="text-center">
            <Button asChild className="text-sm" type="button" variant="link">
              <Link href="/login">Back to Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
