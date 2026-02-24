"use client";

import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { getLocaleFromPathname, withLocaleHref } from "@/lib/i18n/pathname";
import { constantTimeCompare } from "@/lib/utils/constant-time-compare";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordClient() {
	const t = useTranslations("auth.resetPassword");
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [sessionReady, setSessionReady] = useState(false);
	const [passwords, setPasswords] = useState({
		password: "",
		confirmPassword: "",
	});
	const locale = getLocaleFromPathname(pathname);
	const toLocalePath = useCallback(
		(path: string) => (locale ? withLocaleHref(path, locale) : path),
		[locale]
	);

	useEffect(() => {
		const handleRecoverySession = async () => {
			const supabase = createClient();

			const accessToken = searchParams.get("access_token");
			const refreshToken = searchParams.get("refresh_token");

			if (accessToken && refreshToken) {
				try {
					const { data, error } = await supabase.auth.setSession({
						access_token: accessToken,
						refresh_token: refreshToken,
					});

					if (error) {
						console.error("Session error:", error);
						toast.error(t("toasts.invalidOrExpiredLink"));
						router.push(toLocalePath("/login"));
					} else if (data.session) {
						setSessionReady(true);
						toast.success(t("toasts.readyToReset"));
						window.history.replaceState(
							{},
							"",
							toLocalePath("/reset-password")
						);
					}
				} catch (error) {
					console.error("Recovery session error:", error);
					toast.error(t("toasts.somethingWentWrong"));
					router.push(toLocalePath("/login"));
				}
			} else {
				toast.error(t("toasts.noResetToken"));
				router.push(toLocalePath("/login"));
			}
		};

		handleRecoverySession();
	}, [router, searchParams, t, toLocalePath]);

	const handlePasswordChange = (field: string, value: string) => {
		setPasswords((prev) => ({ ...prev, [field]: value }));
	};

	const validatePasswords = () => {
		const { password, confirmPassword } = passwords;

		if (!(password && confirmPassword)) {
			toast.error(t("errors.fillBothFields"));
			return false;
		}

		if (password.length < 6) {
			toast.error(t("errors.passwordMin"));
			return false;
		}

		if (!constantTimeCompare(password, confirmPassword)) {
			toast.error(t("errors.passwordMismatch"));
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
				toast.success(t("toasts.passwordUpdated"));
				router.push(toLocalePath("/dashboard"));
			}
		} catch (error) {
			console.error("Password reset error:", error);
			toast.error(t("toasts.unexpectedError"));
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
							<div className="size-8 animate-spin rounded-full border-primary border-b-2" />
							<p className="text-muted-foreground text-sm">
								{t("loading.verifyingToken")}
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
					<div className="shrink-0">
						<Link href={toLocalePath("/")}>
							<span className="flex items-center justify-center gap-2 font-semibold text-3xl tracking-tight">
								<Image
									alt={t("brand.logoAlt")}
									height={40}
									src="/favicon.ico"
									width={40}
								/>
								<span className="text-black">Ikiform</span>
							</span>
						</Link>
					</div>
					<div className="mt-4">
						<h2 className="font-semibold text-2xl">{t("title")}</h2>
						<p className="text-muted-foreground text-sm">
							{t("subtitle")}
						</p>
					</div>
				</CardHeader>

				<CardContent className="flex w-full flex-col gap-4">
					<form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
						<div className="flex flex-col gap-2">
							<Label htmlFor="password">{t("labels.newPassword")}</Label>
							<div className="relative">
								<Input
									className="pr-10"
									disabled={loading || !sessionReady}
									id="password"
									onChange={(e) =>
										handlePasswordChange("password", e.target.value)
									}
									placeholder={t("placeholders.newPassword")}
									required
									type={showPassword ? "text" : "password"}
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
										<EyeOff className="size-4" />
									) : (
										<Eye className="size-4" />
									)}
								</Button>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="confirmPassword">
								{t("labels.confirmPassword")}
							</Label>
							<div className="relative">
								<Input
									className="pr-10"
									disabled={loading || !sessionReady}
									id="confirmPassword"
									onChange={(e) =>
										handlePasswordChange("confirmPassword", e.target.value)
									}
									placeholder={t("placeholders.confirmPassword")}
									required
									type={showConfirmPassword ? "text" : "password"}
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
										<EyeOff className="size-4" />
									) : (
										<Eye className="size-4" />
									)}
								</Button>
							</div>
							<p className="text-muted-foreground text-xs">
								{t("passwordHint")}
							</p>
						</div>

						<Button
							className="w-full"
							disabled={loading || !sessionReady}
							size="lg"
							type="submit"
						>
							{loading ? t("actions.updating") : t("actions.updatePassword")}
						</Button>
					</form>

					<div className="text-center">
						<Button asChild className="text-sm" type="button" variant="link">
							<Link href={toLocalePath("/login")}>{t("actions.backToSignIn")}</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
