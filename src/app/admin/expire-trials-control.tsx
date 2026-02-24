"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ExpireTrialsResult, expireTrialsAction } from "./actions";

export function ExpireTrialsControl() {
	const t = useTranslations("dashboard.admin.expireTrialsControl");
	const [isRunning, setIsRunning] = useState(false);
	const [result, setResult] = useState<ExpireTrialsResult | null>(null);

	const handleRun = async () => {
		setIsRunning(true);
		setResult(null);

		try {
			const res = await expireTrialsAction();
			setResult(res);

			if (res.ok) {
				toast.success(
					t("toasts.updatedSuccess", { count: res.updatedCount })
				);
			} else {
				toast.error(t("toasts.failedWithError", { error: res.error }));
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : t("unknownError");
			toast.error(t("toasts.errorWithMessage", { message }));
			setResult({
				ok: false,
				error: message,
				logs: [`[${new Date().toISOString()}] Error: ${message}`],
			});
		} finally {
			setIsRunning(false);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="font-semibold">{t("title")}</h3>
					<p className="text-muted-foreground text-sm">
						{t("description")}
					</p>
				</div>
				<Button disabled={isRunning} onClick={handleRun}>
					{isRunning ? t("actions.running") : t("actions.run")}
				</Button>
			</div>

			{result && (
				<Card>
					<CardHeader>
						<CardTitle>
							{result.ok ? t("result.success") : t("result.error")} -{" "}
							{result.ok
								? t("result.updatedUsersCount", { count: result.updatedCount })
								: result.error}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-2">
							<div className="rounded-md bg-muted p-4">
								<pre className="overflow-auto text-muted-foreground text-xs">
									{result.logs.join("\n")}
								</pre>
							</div>
							{result.ok && result.updatedUsers.length > 0 && (
								<div className="mt-4">
									<p className="mb-2 font-medium">{t("result.updatedUsers")}</p>
									<div className="rounded-md bg-muted p-4">
										<pre className="overflow-auto text-muted-foreground text-xs">
											{JSON.stringify(result.updatedUsers, null, 2)}
										</pre>
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
