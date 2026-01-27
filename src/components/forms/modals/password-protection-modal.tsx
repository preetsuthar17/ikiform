"use client";

import { AlertCircle, Loader2, Lock } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen && passwordInputRef.current) {
			const timer = setTimeout(() => {
				passwordInputRef.current?.focus();
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;

			if (e.key === "Escape") {
				e.preventDefault();
				onCancel();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleKeyDown);

			const focusableElements = modalRef.current?.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			const firstElement = focusableElements?.[0] as HTMLElement;
			const lastElement = focusableElements?.[
				focusableElements.length - 1
			] as HTMLElement;

			const handleTabKey = (e: KeyboardEvent) => {
				if (e.key === "Tab") {
					if (e.shiftKey) {
						if (document.activeElement === firstElement) {
							e.preventDefault();
							lastElement?.focus();
						}
					} else if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement?.focus();
					}
				}
			};

			document.addEventListener("keydown", handleTabKey);
			return () => {
				document.removeEventListener("keydown", handleKeyDown);
				document.removeEventListener("keydown", handleTabKey);
			};
		}
	}, [isOpen, isSubmitting, onCancel]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!password.trim()) {
			setError("Please enter a password");
			passwordInputRef.current?.focus();
			return;
		}

		setIsSubmitting(true);
		setError("");

		try {
			await onPasswordSubmit(password);
		} catch (err) {
			setError("Incorrect password. Please try again.");
			passwordInputRef.current?.focus();
		} finally {
			setIsSubmitting(false);
		}
	};

	const handlePasswordChange = (value: string) => {
		setPassword(value);
		if (error) setError("");
	};

	const handleCancel = () => {
		if (!isSubmitting) {
			onCancel();
		}
	};

	if (!isOpen) return null;

	return (
		<div
			aria-describedby="password-modal-description"
			aria-labelledby="password-modal-title"
			aria-modal="true"
			className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
			role="dialog"
		>
			<div
				className="w-full max-w-md"
				onKeyDown={(e) => e.stopPropagation()}
				ref={modalRef}
			>
				<Card className="flex flex-col gap-4 p-4 shadow-none">
					<CardHeader className="flex flex-col gap-4 p-0 text-center">
						<div className="flex flex-col items-start gap-4 text-left">
							<CardTitle
								className="flex items-center justify-start gap-2 font-semibold text-xl tracking-tight"
								id="password-modal-title"
							>
								<div className="mx-auto flex size-10 items-center justify-center rounded-2xl bg-primary/10">
									<Lock aria-hidden="true" className="size-5 text-primary" />
								</div>
								Password Required
							</CardTitle>
							<p
								className="text-muted-foreground text-sm leading-relaxed"
								id="password-modal-description"
							>
								{message}
							</p>
						</div>
					</CardHeader>

					<CardContent className="flex flex-col gap-6 p-0">
						<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
							<div className="flex flex-col gap-2">
								<Label className="font-medium text-sm" htmlFor="password-input">
									Password
								</Label>
								<div className="relative">
									<Input
										aria-describedby={error ? "password-error" : undefined}
										aria-invalid={!!error}
										autoComplete="current-password"
										className="pr-10"
										disabled={isSubmitting}
										id="password-input"
										onChange={(e) => handlePasswordChange(e.target.value)}
										placeholder="Enter password"
										ref={passwordInputRef}
										type={showPassword ? "text" : "password"}
										value={password}
									/>
									<Button
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}
										className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
										disabled={isSubmitting}
										onClick={() => setShowPassword(!showPassword)}
										size="icon"
										type="button"
										variant="ghost"
									>
										{showPassword ? (
											<svg
												className="size-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
												/>
											</svg>
										) : (
											<svg
												className="size-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
												/>
												<path
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
												/>
											</svg>
										)}
									</Button>
								</div>

								{error && (
									<Alert className="py-2" variant="destructive">
										<AlertCircle className="size-4" />
										<AlertDescription id="password-error">
											{error}
										</AlertDescription>
									</Alert>
								)}
							</div>

							<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
								<Button
									className="w-full sm:w-auto"
									disabled={isSubmitting}
									onClick={handleCancel}
									type="button"
									variant="outline"
								>
									Cancel
								</Button>
								<Button
									className="w-full sm:w-auto"
									disabled={isSubmitting || !password.trim()}
									type="submit"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="size-4 animate-spin" />
											Verifying...
										</>
									) : (
										"Continue"
									)}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
