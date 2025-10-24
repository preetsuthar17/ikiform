"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Badge, Label } from "@/components/ui";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";

const baseInputClass =
  "linear h-12 rounded-md px-4 py-3 text-sm transition-all duration-300 border-border";

const stepTitles: Record<string, string> = {
  email: "Welcome back",
  name: "What's your name?",
  password: "Enter your password",
};

const stepTitlesSignUp: Record<string, string> = {
  email: "Create account",
  name: "What's your name?",
  password: "Enter your password",
};

export default function LoginForm() {
  const { user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "name" | "password">("email");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});
  const [lastLoginMethod, setLastLoginMethod] = useState<null | string>(null);
  const [focused, setFocused] = useState<{
    email?: boolean;
    name?: boolean;
    password?: boolean;
  }>({});

  const emailRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLastLoginMethod(localStorage.getItem("lastLoginMethod"));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (step === "email") emailRef.current?.focus();
    if (step === "name") nameRef.current?.focus();
    if (step === "password") passwordRef.current?.focus();
  }, [step, loading]);

  useEffect(() => {
    if (!user) return;
    const redirectUrl =
      typeof window !== "undefined"
        ? sessionStorage.getItem("redirectAfterLogin")
        : null;
    if (redirectUrl) {
      sessionStorage.removeItem("redirectAfterLogin");
      redirect(redirectUrl);
    } else {
      redirect("/dashboard");
    }
  }, [user]);

  const handleInput = useCallback((field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }, []);

  const validateEmail = useCallback(() => {
    if (!form.email) {
      setErrors((e) => ({ ...e, email: "Email is required" }));
      return false;
    }
    if (!form.email.includes("@")) {
      setErrors((e) => ({ ...e, email: "Please enter a valid email address" }));
      return false;
    }
    return true;
  }, [form.email]);

  const validatePassword = useCallback(() => {
    if (!form.password) {
      setErrors((e) => ({ ...e, password: "Password is required" }));
      return false;
    }
    if (form.password.length < 6) {
      setErrors((e) => ({
        ...e,
        password: "Password must be at least 6 characters",
      }));
      return false;
    }
    return true;
  }, [form.password]);

  const validateName = useCallback(() => {
    if (!form.name.trim()) {
      setErrors((e) => ({ ...e, name: "Name is required for sign up" }));
      return false;
    }
    return true;
  }, [form.name]);

  const next = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (step === "email") {
        if (!validateEmail()) return emailRef.current?.focus();
        setStep(isSignUp ? "name" : "password");
      } else if (step === "name") {
        if (!validateName()) return nameRef.current?.focus();
        setStep("password");
      } else if (step === "password") {
        if (!validatePassword()) return passwordRef.current?.focus();
        await handleAuth();
      }
    },
    [step, isSignUp, validateEmail, validateName, validatePassword]
  );

  const back = useCallback(() => {
    if (step === "password") setStep(isSignUp ? "name" : "email");
    else if (step === "name") setStep("email");
  }, [step, isSignUp]);

  const reset = useCallback(() => {
    setStep("email");
    setForm({ email: "", password: "", name: "" });
    setErrors({});
    setShowPassword(false);
    setFocused({});
  }, []);

  const handleForgot = useCallback(async () => {
    if (!form.email)
      return toast.error("Please enter your email address first");
    if (!form.email.includes("@"))
      return toast.error("Please enter a valid email address");
    setLoading(true);
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) toast.error(error.message);
      else toast.success("Password reset link sent!");
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [form.email]);

  const handleAuth = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { name: form.name, full_name: form.name } },
        });
        if (error) {
          if (error.message.includes("already registered"))
            toast.error(
              "This email is already registered. Try signing in instead."
            );
          else toast.error(error.message);
        } else {
          try {
            await fetch("/api/user", { method: "POST" });
          } catch {}
          if (data.user?.email_confirmed_at)
            toast.success("Account created and verified!");
          else
            toast.success(
              "Account created! Please check your email for verification."
            );
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setErrors((e) => ({ ...e, password: "Invalid email or password" }));
            passwordRef.current?.focus();
          } else if (error.message.includes("Email not confirmed")) {
            toast.error(
              "Please check your email and click the verification link before signing in."
            );
          } else toast.error(error.message);
        } else {
          try {
            await fetch("/api/user", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ensureOnly: true }),
            });
          } catch {}
          toast.success("Signed in successfully!");
        }
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [isSignUp, form.email, form.password, form.name]);

  const handleOAuth = useCallback(async (provider: "github" | "google") => {
    localStorage.setItem("lastLoginMethod", provider);
    setLastLoginMethod(provider);
    toast(`Logging in with ${provider === "google" ? "Google" : "GitHub"}`);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }, []);

  const renderInput = useCallback(
    (
      ref: React.RefObject<HTMLInputElement | null>,
      field: "email" | "name" | "password",
      label: string,
      type: string,
      extraProps: Record<string, any> = {}
    ) => (
      <div className="relative w-full">
        <Input
          aria-describedby={errors[field] ? `${field}-error` : undefined}
          aria-invalid={!!errors[field] || undefined}
          className={`${baseInputClass} ${form[field] ? "ring-2 ring-ring ring-offset-2" : ""}`}
          disabled={loading}
          id={field}
          name={field}
          onBlur={() => setFocused((f) => ({ ...f, [field]: false }))}
          onChange={(e) => handleInput(field, e.target.value)}
          onFocus={() => setFocused((f) => ({ ...f, [field]: true }))}
          ref={ref}
          required
          type={type}
          value={form[field]}
          {...extraProps}
        />
        <Label
          className={`linear pointer-events-none absolute left-4 select-none transition-all duration-300 ${
            form[field] || focused[field]
              ? "-top-3.5 bg-card px-2 text-primary text-sm"
              : "top-3.5 text-sm opacity-30"
          }`}
          htmlFor={field}
        >
          {label}
        </Label>
        {field === "password" && (
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="-translate-y-1/2 absolute top-1/2 right-2 rounded-md p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            type="button"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {errors[field] && (
          <div
            aria-live="polite"
            className="mt-1 text-left text-destructive text-xs"
            id={`${field}-error`}
            role="status"
          >
            {errors[field]}
          </div>
        )}
      </div>
    ),
    [form, errors, focused, loading, showPassword, handleInput]
  );

  const currentTitle = useMemo(
    () => (isSignUp ? stepTitlesSignUp : stepTitles)[step],
    [isSignUp, step]
  );

  return (
    <div className="mx-3 flex h-screen flex-col items-center justify-center gap-4 overflow-hidden">
      <AnimatedCard className="w-full max-w-sm">
        <Card className="animated-card flex w-full max-w-sm flex-col items-center justify-center rounded-xl text-center shadow-none transition-all">
          <CardHeader className="w-full pt-2">
            <div className="flex items-center justify-center">
              <h2 className="font-semibold text-xl md:text-2xl">
                {currentTitle}
              </h2>
            </div>
          </CardHeader>

          <CardContent className="flex w-full flex-col gap-6">
            <form
              aria-busy={loading}
              className="flex flex-col gap-4"
              noValidate
              onSubmit={next}
            >
              {/* Email input */}
              {step === "email" &&
                renderInput(emailRef, "email", "Enter your email", "email", {
                  autoComplete: "email",
                  spellCheck: false,
                  inputMode: "email",
                })}

              {/* Name input for sign up */}
              {step === "name" &&
                isSignUp &&
                renderInput(nameRef, "name", "Enter your name", "text", {
                  autoComplete: "name",
                })}

              {/* Password input */}
              {step === "password" &&
                renderInput(
                  passwordRef,
                  "password",
                  "Enter your password",
                  showPassword ? "text" : "password",
                  {
                    autoComplete: isSignUp
                      ? "new-password"
                      : "current-password",
                  }
                )}

              <Button
                aria-label={
                  loading
                    ? "Processing..."
                    : step === "password"
                      ? isSignUp
                        ? "Create account"
                        : "Sign in"
                      : "Continue"
                }
                className="h-12 w-full rounded-md text-sm"
                disabled={loading}
                loading={loading}
                type="submit"
              >
                {loading
                  ? ""
                  : step === "password"
                    ? isSignUp
                      ? "Create account"
                      : "Sign in"
                    : "Continue"}
              </Button>

              {/* Back button */}
              {step !== "email" && (
                <Button
                  aria-label="Go back to previous step"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-md text-sm"
                  disabled={loading}
                  onClick={back}
                  type="button"
                  variant="ghost"
                >
                  Back
                </Button>
              )}

              {/* Forgot password */}
              {step === "password" && !isSignUp && (
                <div className="text-center">
                  <Button
                    aria-label="Forgot your password? Reset it"
                    className="h-auto p-0 text-muted-foreground text-sm"
                    disabled={loading}
                    onClick={handleForgot}
                    type="button"
                    variant="link"
                  >
                    Forgot your password?
                  </Button>
                </div>
              )}
            </form>

            {/* Switch between sign up/sign in */}
            {step === "email" && (
              <div className="text-center">
                <Button
                  aria-label={
                    isSignUp ? "Switch to sign in" : "Switch to sign up"
                  }
                  className="h-auto p-0 text-sm"
                  disabled={loading}
                  onClick={() => {
                    setIsSignUp((v) => !v);
                    reset();
                  }}
                  type="button"
                  variant="link"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign up"}
                </Button>
              </div>
            )}

            {/* OAuth */}
            {step === "email" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator aria-hidden="true" className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span
                      aria-hidden="true"
                      className="bg-background px-2 text-muted-foreground"
                    >
                      Or
                    </span>
                  </div>
                </div>
                <div className="flex w-full flex-col items-start justify-center gap-2">
                  <div className="relative w-full">
                    <Button
                      aria-label="Continue with Google"
                      className="flex h-12 w-full items-center gap-2 rounded-md bg-card font-medium text-sm"
                      disabled={loading}
                      onClick={() => handleOAuth("google")}
                      type="button"
                      variant="outline"
                    >
                      <FcGoogle size={22} />
                      Continue with Google
                    </Button>
                    {lastLoginMethod === "google" && (
                      <Badge
                        aria-label="Last used login method"
                        className="-right-1 -top-1 absolute rounded-full bg-background"
                        variant="outline"
                      >
                        Last used
                      </Badge>
                    )}
                  </div>
                  <div className="relative w-full">
                    <Button
                      aria-label="Continue with GitHub"
                      className="flex h-12 w-full items-center gap-2 rounded-md bg-card font-medium text-sm"
                      disabled={loading}
                      onClick={() => handleOAuth("github")}
                      type="button"
                      variant="outline"
                    >
                      <FaGithub size={22} />
                      Continue with GitHub
                    </Button>
                    {lastLoginMethod === "github" && (
                      <Badge
                        aria-label="Last used login method"
                        className="-right-1 -bottom-1 absolute rounded-full bg-background"
                        variant="outline"
                      >
                        Last used
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </AnimatedCard>

      <div className="text-center text-muted-foreground text-sm">
        <p>
          By signing {isSignUp ? "up" : "in"}, you agree to our{" "}
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
  );
}
