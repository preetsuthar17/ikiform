"use client";

import type { Session } from "@supabase/supabase-js";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
import { getLocaleFromPathname, withLocaleHref } from "@/lib/i18n/pathname";
import { createClient } from "@/utils/supabase/client";

const baseInputClass =
	"linear h-12 rounded-md px-4 py-3 text-sm transition-all duration-300 border-border";

export default function LoginForm() {
	const t = useTranslations("auth.login");
	const pathname = usePathname();
	const router = useRouter();
	const { user, loading: authLoading } = useAuth();
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
	const locale = getLocaleFromPathname(pathname);
	const toLocalePath = useCallback(
		(path: string) => (locale ? withLocaleHref(path, locale) : path),
		[locale]
	);
	const getPostLoginPath = useCallback(() => {
		const nextParam = new URLSearchParams(window.location.search).get("next");
		if (nextParam?.startsWith("/")) {
			return toLocalePath(nextParam);
		}
		return toLocalePath("/dashboard");
	}, [toLocalePath]);
	const ensureServerSession = useCallback(
		async (session: null | Session) => {
			if (!(session?.access_token && session.refresh_token)) {
				return false;
			}

			const syncResponse = await fetch("/api/auth/sync-session", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					accessToken: session.access_token,
					refreshToken: session.refresh_token,
				}),
			});
			if (!syncResponse.ok) {
				return false;
			}

			const verifyResponse = await fetch("/api/user", {
				cache: "no-store",
				method: "GET",
			});
			return verifyResponse.ok;
		},
		[]
	);

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
		if (authLoading || !user) {
			return;
		}

		let ignore = false;
		const syncAndRedirect = async () => {
			const supabase = createClient();
			const {
				data: { session },
			} = await supabase.auth.getSession();
			const isSessionReady = await ensureServerSession(session);
			if (ignore || !isSessionReady) {
				return;
			}
			router.replace(getPostLoginPath());
			router.refresh();
		};

		void syncAndRedirect();
		return () => {
			ignore = true;
		};
	}, [authLoading, ensureServerSession, getPostLoginPath, router, user]);

	const handleInput = useCallback((field: string, value: string) => {
		setForm((f) => ({ ...f, [field]: value }));
		setErrors((e) => ({ ...e, [field]: undefined }));
	}, []);

	const validateEmail = useCallback(() => {
		if (!form.email) {
			setErrors((e) => ({ ...e, email: t("errors.emailRequired") }));
			return false;
		}
		if (!form.email.includes("@")) {
			setErrors((e) => ({ ...e, email: t("errors.emailInvalid") }));
			return false;
		}
		return true;
	}, [form.email, t]);

	const validatePassword = useCallback(() => {
		if (!form.password) {
			setErrors((e) => ({ ...e, password: t("errors.passwordRequired") }));
			return false;
		}
		if (form.password.length < 6) {
			setErrors((e) => ({
				...e,
				password: t("errors.passwordMin"),
			}));
			return false;
		}
		return true;
	}, [form.password, t]);

	const validateName = useCallback(() => {
		if (!form.name.trim()) {
			setErrors((e) => ({ ...e, name: t("errors.nameRequired") }));
			return false;
		}
		return true;
	}, [form.name, t]);

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
		if (!form.email) return toast.error(t("errors.enterEmailFirst"));
		if (!form.email.includes("@")) return toast.error(t("errors.emailInvalid"));
		setLoading(true);
		const supabase = createClient();
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
				redirectTo: `${window.location.origin}${toLocalePath("/reset-password")}`,
			});
			if (error) toast.error(error.message);
			else toast.success(t("toasts.resetSent"));
		} catch {
			toast.error(t("toasts.unexpectedError"));
		} finally {
			setLoading(false);
		}
	}, [form.email, t, toLocalePath]);

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
						toast.error(t("toasts.emailAlreadyRegistered"));
					else toast.error(error.message);
				} else {
					try {
						await fetch("/api/user", { method: "POST" });
					} catch {}
					if (data.user?.email_confirmed_at)
						toast.success(t("toasts.accountCreatedVerified"));
					else
						toast.success(t("toasts.accountCreatedCheckEmail"));
				}
			} else {
				const { data, error } = await supabase.auth.signInWithPassword({
					email: form.email,
					password: form.password,
				});
				if (error) {
					if (error.message.includes("Invalid login credentials")) {
						setErrors((e) => ({ ...e, password: t("errors.invalidCredentials") }));
						passwordRef.current?.focus();
					} else if (error.message.includes("Email not confirmed")) {
						toast.error(t("toasts.emailNotConfirmed"));
					} else toast.error(error.message);
				} else {
					try {
						await fetch("/api/user", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ ensureOnly: true }),
						});
					} catch {}
					toast.success(t("toasts.signInSuccess"));
					const isSessionReady = await ensureServerSession(data.session);
					if (!isSessionReady) {
						toast.error(t("toasts.unexpectedError"));
						return;
					}
					router.replace(getPostLoginPath());
				}
			}
		} catch {
			toast.error(t("toasts.unexpectedError"));
		} finally {
			setLoading(false);
		}
	}, [
		ensureServerSession,
		form.email,
		form.name,
		form.password,
		getPostLoginPath,
		isSignUp,
		router,
		t,
	]);

	const handleOAuth = useCallback(async (provider: "github" | "google") => {
		localStorage.setItem("lastLoginMethod", provider);
		setLastLoginMethod(provider);
		toast(
			t("toasts.oauthLogin", {
				provider:
					provider === "google" ? t("providers.google") : t("providers.github"),
			})
		);
		const supabase = createClient();
		const redirectPath = encodeURIComponent(getPostLoginPath());
		await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${window.location.origin}/auth/callback?next=${redirectPath}`,
			},
		});
	}, [getPostLoginPath, t]);

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
						aria-label={
							showPassword
								? t("actions.hidePassword")
								: t("actions.showPassword")
						}
						aria-pressed={showPassword}
						className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
		[errors, form, focused, handleInput, loading, showPassword, t]
	);

	const currentTitle = useMemo(
		() => {
			if (isSignUp) {
				if (step === "email") return t("titles.signUp.email");
				if (step === "name") return t("titles.signUp.name");
				return t("titles.signUp.password");
			}
			if (step === "email") return t("titles.signIn.email");
			if (step === "name") return t("titles.signIn.name");
			return t("titles.signIn.password");
		},
		[isSignUp, step, t]
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
							{}
							{step === "email" &&
								renderInput(
									emailRef,
									"email",
									t("inputs.emailLabel"),
									"email",
									{
									autoComplete: "email",
									spellCheck: false,
									inputMode: "email",
									}
								)}

							{}
							{step === "name" &&
								isSignUp &&
								renderInput(nameRef, "name", t("inputs.nameLabel"), "text", {
									autoComplete: "name",
								})}

							{}
							{step === "password" &&
								renderInput(
									passwordRef,
									"password",
									t("inputs.passwordLabel"),
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
										? t("actions.processing")
										: step === "password"
											? isSignUp
												? t("actions.createAccount")
												: t("actions.signIn")
											: t("actions.continue")
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
											? t("actions.createAccount")
											: t("actions.signIn")
										: t("actions.continue")}
							</Button>

							{}
							{step !== "email" && (
								<Button
									aria-label={t("actions.goBackAria")}
									className="flex h-12 w-full items-center justify-center gap-2 rounded-md text-sm"
									disabled={loading}
									onClick={back}
									type="button"
									variant="ghost"
								>
									{t("actions.back")}
								</Button>
							)}

							{}
							{step === "password" && !isSignUp && (
								<div className="text-center">
									<Button
										aria-label={t("actions.forgotPasswordAria")}
										className="h-auto p-0 text-muted-foreground text-sm"
										disabled={loading}
										onClick={handleForgot}
										type="button"
										variant="link"
									>
										{t("actions.forgotPassword")}
									</Button>
								</div>
							)}
						</form>

						{}
						{step === "email" && (
							<div className="text-center">
								<Button
									aria-label={
										isSignUp
											? t("actions.switchToSignInAria")
											: t("actions.switchToSignUpAria")
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
										? t("actions.alreadyHaveAccount")
										: t("actions.noAccount")}
								</Button>
							</div>
						)}

						{}
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
											{t("actions.or")}
										</span>
									</div>
								</div>
								<div className="flex w-full flex-col items-start justify-center gap-2">
									<div className="relative w-full">
										<Button
											aria-label={t("actions.continueWithGoogleAria")}
											className="flex h-12 w-full items-center gap-2 rounded-md bg-card font-medium text-sm"
											disabled={loading}
											onClick={() => handleOAuth("google")}
											type="button"
											variant="outline"
										>
											<FcGoogle size={22} />
											{t("actions.continueWithGoogle")}
										</Button>
										{lastLoginMethod === "google" && (
											<Badge
												aria-label={t("badges.lastUsedAria")}
												className="absolute -top-1 -right-1 rounded-full bg-background"
												variant="outline"
											>
												{t("badges.lastUsed")}
											</Badge>
										)}
									</div>
									<div className="relative w-full">
										<Button
											aria-label={t("actions.continueWithGithubAria")}
											className="flex h-12 w-full items-center gap-2 rounded-md bg-card font-medium text-sm"
											disabled={loading}
											onClick={() => handleOAuth("github")}
											type="button"
											variant="outline"
										>
											<FaGithub size={22} />
											{t("actions.continueWithGithub")}
										</Button>
										{lastLoginMethod === "github" && (
											<Badge
												aria-label={t("badges.lastUsedAria")}
												className="absolute -right-1 -bottom-1 rounded-full bg-background"
												variant="outline"
											>
												{t("badges.lastUsed")}
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
					{t("legal.agree", {
						action: isSignUp
							? t("legal.actions.signUp")
							: t("legal.actions.signIn"),
					})}{" "}
					<Link
						className="text-muted-foreground underline"
						href={toLocalePath("/legal/terms")}
						target="_blank"
					>
						{t("legal.termsOfService")}
					</Link>
				</p>
			</div>
		</div>
	);
}
