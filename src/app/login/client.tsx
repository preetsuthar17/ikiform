'use client';

import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';

export default function LoginForm() {
  const { user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'email' | 'password' | 'name'>('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const [focusedFields, setFocusedFields] = useState({
    name: false,
    email: false,
    password: false,
  });

  if (user) {
    const redirectUrl =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('redirectAfterLogin')
        : null;
    if (redirectUrl) {
      sessionStorage.removeItem('redirectAfterLogin');
      redirect(redirectUrl);
    } else {
      redirect('/dashboard');
    }
  }

  function handleInputChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleFocus(field: string) {
    setFocusedFields(prev => ({ ...prev, [field]: true }));
  }

  function handleBlur(field: string) {
    setFocusedFields(prev => ({ ...prev, [field]: false }));
  }

  function isFieldActive(field: string) {
    return focusedFields[field as keyof typeof focusedFields] || formData[field as keyof typeof formData] !== '';
  }

  function validateEmail() {
    const { email } = formData;
    if (!email) {
      toast.error('Email is required');
      return false;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  }

  function validatePassword() {
    const { password } = formData;
    if (!password) {
      toast.error('Password is required');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    return true;
  }

  function validateName() {
    const { name } = formData;
    if (!name.trim()) {
      toast.error('Name is required for sign up');
      return false;
    }
    return true;
  }

  function handleNextStep(e: React.FormEvent) {
    e.preventDefault();
    
    if (currentStep === 'email') {
      if (!validateEmail()) return;
      
      if (isSignUp) {
        setCurrentStep('name');
      } else {
        setCurrentStep('password');
      }
    } else if (currentStep === 'name') {
      if (!validateName()) return;
      setCurrentStep('password');
    } else if (currentStep === 'password') {
      if (!validatePassword()) return;
      handleAuth();
    }
  }

  function handleBackStep() {
    if (currentStep === 'password') {
      if (isSignUp) {
        setCurrentStep('name');
      } else {
        setCurrentStep('email');
      }
    } else if (currentStep === 'name') {
      setCurrentStep('email');
    }
  }

  function resetSteps() {
    setCurrentStep('email');
    setFormData({ email: '', password: '', name: '' });
  }

  async function handleForgotPassword() {
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
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAuth() {
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
          try {
            await fetch('/api/user', { method: 'POST' });
          } catch {}
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
          try {
            await fetch('/api/user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ensureOnly: true }),
            });
          } catch {}
          toast.success('Signed in successfully!');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuthLogin(provider: 'github' | 'google') {
    toast(`Logging in with ${provider === 'google' ? 'Google' : 'GitHub'}`);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
  }

  function getStepTitle() {
    if (currentStep === 'email') {
      return isSignUp ? 'Create account' : 'Welcome back';
    } else if (currentStep === 'name') {
      return 'What\'s your name?';
    } else {
      return 'Enter your password';
    }
  }

  function getButtonText() {
    if (currentStep === 'password') {
      return isSignUp ? 'Create account' : 'Sign in';
    }
    return 'Continue';
  }

  function hasContent(field: string) {
    return formData[field as keyof typeof formData] !== '';
  }

  function shouldShowBackButtonBelow() {
    return currentStep !== 'email';
  }

  return (
    <>
      <div className="mx-3 flex h-screen flex-col items-center justify-center gap-4 overflow-hidden">
        <Card className="flex w-full max-w-sm flex-col items-center justify-center gap-8 text-center bg-transparent border-none shadow-none" size={"lg"}>
          <CardHeader className='w-full'>
            <div className='flex items-center justify-center'>
            
                  <h2 className="font-semibold text-xl md:text-2xl ">
                {getStepTitle()}
              </h2>
            </div>
          </CardHeader>

          <CardContent className="flex w-full flex-col gap-6">
            <form className="flex flex-col gap-4" onSubmit={handleNextStep}>
              {/* Email Step */}
              {currentStep === 'email' && (
                <div className="relative w-full">
                  <Input
                    disabled={loading}
                    className={`rounded-full px-4 py-3 text-sm transition-all duration-300 linear
                      ${
                        hasContent('email')
                          ? 'ring-2 ring-offset-2 ring-ring'
                          : focusedFields.email
                            ? ''
                            : 'border-border '
                      }`}
                    id="email"
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    required
                    size="xl"
                    type="email"
                    value={formData.email}
                    autoFocus
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-4 pointer-events-none select-none transition-all duration-300 linear ${
                      isFieldActive('email')
                        ? '-top-3.5 text-sm bg-linear-to-t dark:from-input from-card to-background px-2 text-primary'
                        : 'top-3.5 text-sm opacity-30 left-6'
                    } ${focusedFields.email && !isFieldActive('email') ? 'text-primary' : ''}`}
                  >
                    Enter your email
                  </label>
                
                </div>
              )}

              {/* Name Step (for sign up) */}
              {currentStep === 'name' && isSignUp && (
                <div className="relative w-full">
                  <Input
                    disabled={loading}
                    className={`rounded-full px-4 py-3 text-sm transition-all duration-300 linear
                      ${
                        hasContent('name')
                          ? 'ring-2 ring-offset-2 ring-ring'
                          : focusedFields.name
                            ? 'border-border'
                            : 'border-border '
                      }`}
                    id="name"
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onFocus={() => handleFocus('name')}
                    onBlur={() => handleBlur('name')}
                    required={isSignUp}
                    size="xl"
                    type="text"
                    value={formData.name}
                    autoFocus
                  />
                  <label
                    htmlFor="name"
                    className={`absolute left-4 pointer-events-none select-none transition-all duration-300 linear ${
                      isFieldActive('name')
                        ? '-top-3.5 text-sm bg-linear-to-t dark:from-input from-card to-background px-2 text-primary'
                        : 'top-3.5 text-sm opacity-30 left-6'
                    } ${focusedFields.name && !isFieldActive('name') ? 'text-primary' : ''}`}
                  >
                    Enter your name
                  </label>
                
                </div>
              )}

              {/* Password Step */}
              {currentStep === 'password' && (
                <div className="relative w-full">
                  <Input
                    disabled={loading}
                    className={`rounded-full px-4 py-3 text-sm transition-all duration-300 linear
                      ${
                        hasContent('password')
                          ? 'ring-2 ring-offset-2 ring-ring'
                          : focusedFields.password
                            ? 'border-border'
                            : 'border-border '
                      }`}
                    type='password'
                    id="password"
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onFocus={() => handleFocus('password')}
                    onBlur={() => handleBlur('password')}
                    required
                    size="xl"
                    value={formData.password}
                    autoFocus
                  />
                  <label
                    htmlFor="password"
                    className={`absolute left-4 pointer-events-none select-none transition-all duration-300 linear ${
                      isFieldActive('password')
                        ? '-top-3.5 text-sm bg-linear-to-t dark:from-input from-card to-background px-2 text-primary'
                        : 'top-3.5 text-sm opacity-30 left-6'
                    } ${focusedFields.password && !isFieldActive('password') ? 'text-primary' : ''}`}
                  >
                    Enter your password
                  </label>
                
                </div>
              )}

              <Button
                className="w-full rounded-full text-sm"
                disabled={loading}
                loading={loading}
                size="xl"
                type="submit"
              >
                {loading ? '' : getButtonText()}
              </Button>

              {/* Add back button below the continue/sign in/create acc button */}
              {shouldShowBackButtonBelow() && (
                <Button
                  className="w-full rounded-full text-sm flex items-center justify-center gap-2"
                  disabled={loading}
                  onClick={handleBackStep}
                  size="xl"
                  type="button"
                  variant="ghost"
                >
                  Back
                </Button>
              )}

              {/* Forgot Password - only show on password step for sign in */}
              {currentStep === 'password' && !isSignUp && (
                <div className="text-center">
                  <Button
                    className="text-muted-foreground text-sm p-0 m-0 py-0 h-fit"
                    disabled={loading}
                    onClick={handleForgotPassword}
                    type="button"
                    variant="link"
                  >
                    Forgot your password?
                  </Button>
                </div>
              )}
            </form>

            {/* Toggle between Sign In / Sign Up - only show on email step */}
            {currentStep === 'email' && (
              <div className="text-center">
                <Button
                  className="text-sm p-0 m-0 py-0 h-fit"
                  disabled={loading}
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    resetSteps();
                  }}
                  type="button"
                  variant="link"
                >
                  {isSignUp
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Sign up"}
                </Button>
              </div>
            )}

            {/* OAuth buttons - only show on email step */}
            {currentStep === 'email' && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>

                <div className="flex w-full flex-col items-start justify-center gap-2">
                  <Button
                    className="flex bg-card shadow-none w-full items-center gap-2 font-medium rounded-full text-sm"
                    disabled={loading}
                    onClick={() => handleOAuthLogin('google')}
                    size="xl"
                    type="button"
                    variant="outline"
                  >
                    <FcGoogle size={22} />
                    Continue with Google
                  </Button>
                  <Button
                    className="flex bg-card shadow-none w-full items-center gap-2 font-medium rounded-full text-sm"
                    disabled={loading}
                    onClick={() => handleOAuthLogin('github')}
                    size="xl"
                    type="button"
                    variant="outline"
                  >
                    <FaGithub size={22} />
                    Continue with GitHub
                  </Button>
                </div>
              </>
            )}
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