"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ExpireTrialsResult, expireTrialsAction } from "./actions";

export function ExpireTrialsControl() {
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
					`Successfully updated ${res.updatedCount} user(s) from trial to free`
				);
			} else {
				toast.error(`Failed: ${res.error}`);
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown error";
			toast.error(`Error: ${message}`);
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
					<h3 className="font-semibold">Expire Trials</h3>
					<p className="text-muted-foreground text-sm">
						Manually run the cron job to expire free trials older than 14 days
					</p>
				</div>
				<Button disabled={isRunning} onClick={handleRun}>
					{isRunning ? "Running..." : "Run Expire Trials"}
				</Button>
			</div>

			{result && (
				<Card>
					<CardHeader>
						<CardTitle>
							{result.ok ? "Success" : "Error"} -{" "}
							{result.ok
								? `${result.updatedCount} user(s) updated`
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
									<p className="mb-2 font-medium">Updated Users:</p>
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
