'use client';

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';

export default function LoginForm() {
  const { user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (user) {
    redirect('/dashboard');
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { email, password, name } = formData;

    if (!(email && password)) {
      toast.error('Email and password are required');
      return false;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    if (isSignUp && !name.trim()) {
      toast.error('Name is required for sign up');
      return false;
    }

    return true;
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address first');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset link sent to your email!');
        setShowForgotPassword(false);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const supabase = createClient();

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              name: formData.name,
            },
          },
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast.error(
              'This email is already registered. Try signing in instead.'
            );
          } else {
            toast.error(error.message);
          }
        } else if (data.user) {
          // Call the user API to create the database record
          try {
            await fetch('/api/user', { method: 'POST' });
          } catch (apiError) {
            console.error('Error creating user record:', apiError);
          }

          if (data.user.email_confirmed_at) {
            toast.success('Account created and verified successfully!');
          } else {
            toast.success(
              'Account created successfully! Please check your email for verification.'
            );
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. Please try again.');
          } else if (error.message.includes('Email not confirmed')) {
            toast.error(
              'Please check your email and click the verification link before signing in.'
            );
          } else {
            toast.error(error.message);
          }
        } else if (data.user) {
          // Call the user API to ensure the database record exists
          try {
            await fetch('/api/user', { method: 'POST' });
          } catch (apiError) {
            console.error('Error updating user record:', apiError);
          }

          toast.success('Signed in successfully!');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    toast(`Redirecting to ${provider === 'google' ? 'Google' : 'GitHub'}...`);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
  };

  return (
    <>
      <div className="m-3 flex h-screen flex-col items-center justify-center gap-4">
        <Card className="flex w-full max-w-sm flex-col items-center justify-center gap-6 text-center shadow-md/2">
          <CardHeader>
            <div>
              <h2 className="font-semibold text-2xl">
                {isSignUp ? 'Create account' : 'Welcome back'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isSignUp
                  ? 'Sign up to get started with Ikiform'
                  : 'Sign in to your account'}
              </p>
            </div>
          </CardHeader>

          <CardContent className="flex w-full flex-col gap-4">
            {/* Email/Password Form */}
            <form className="flex flex-col gap-4" onSubmit={handleEmailAuth}>
              {isSignUp && (
                <div className="flex w-full flex-col items-start justify-center gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    disabled={loading}
                    id="name"
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your name"
                    required={isSignUp}
                    size="lg"
                    type="text"
                    value={formData.name}
                  />
                </div>
              )}

              <div className="flex w-full flex-col items-start justify-center gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  disabled={loading}
                  id="email"
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                  size="lg"
                  type="email"
                  value={formData.email}
                />
              </div>

              <div className="flex w-full flex-col items-start justify-center gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative w-full">
                  <Input
                    disabled={loading}
                    id="password"
                    onChange={(e) =>
                      handleInputChange('password', e.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    size="lg"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                  />
                  <Button
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    disabled={loading}
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
                {isSignUp && (
                  <p className="text-muted-foreground text-xs">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>

              <Button
                className="w-full"
                disabled={loading}
                size="lg"
                type="submit"
              >
                {loading
                  ? 'Please wait...'
                  : isSignUp
                    ? 'Create account'
                    : 'Sign in'}
              </Button>
            </form>

            {/* Forgot Password */}
            {!isSignUp && (
              <div className="text-center">
                <Button
                  className="text-muted-foreground text-sm"
                  disabled={loading}
                  onClick={handleForgotPassword}
                  type="button"
                  variant="link"
                >
                  Forgot your password?
                </Button>
              </div>
            )}

            {/* Toggle between sign in/up */}
            <div className="text-center">
              <Button
                className="text-sm"
                disabled={loading}
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setFormData({ email: '', password: '', name: '' });
                }}
                type="button"
                variant="link"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="flex w-full flex-col items-start justify-center gap-2">
              <Button
                className="flex w-full items-center gap-2 font-medium"
                disabled={loading}
                onClick={() => handleOAuthLogin('google')}
                size="lg"
                type="button"
                variant="secondary"
              >
                <FcGoogle size={22} />
                Continue with Google
              </Button>
              <Button
                className="flex w-full items-center gap-2 font-medium"
                disabled={loading}
                onClick={() => handleOAuthLogin('github')}
                size="lg"
                type="button"
                variant="secondary"
              >
                <FaGithub size={22} />
                Continue with GitHub
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-muted-foreground text-sm">
          <p>
            By signing {isSignUp ? 'up' : 'in'}, you agree to our{' '}
            <Link
              className="text-muted-foreground underline"
              href="/legal/terms"
              target="_blank"
            >
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
