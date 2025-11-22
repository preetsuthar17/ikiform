"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TrialBannerProps {
	userCreatedAt: string;
	onDismiss?: () => void;
}

export function TrialBanner({ userCreatedAt, onDismiss }: TrialBannerProps) {
	const [timeLeft, setTimeLeft] = useState<string>("");
	const [isExpired, setIsExpired] = useState(false);

	useEffect(() => {
		const calculateTimeLeft = () => {
			const createdAt = new Date(userCreatedAt);
			const now = new Date();
			const trialEnd = new Date(createdAt.getTime() + 14 * 24 * 60 * 60 * 1000);
			const timeDiff = trialEnd.getTime() - now.getTime();

			if (timeDiff <= 0) {
				setIsExpired(true);
				setTimeLeft("Trial expired");
				return;
			}

			const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
			);
			const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

			if (days > 0) {
				setTimeLeft(`${days}d ${hours}h ${minutes}m`);
			} else if (hours > 0) {
				setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
			} else {
				setTimeLeft(`${minutes}m ${seconds}s`);
			}
		};

		calculateTimeLeft();
		const interval = setInterval(calculateTimeLeft, 1000);

		return () => clearInterval(interval);
	}, [userCreatedAt]);

	if (isExpired) {
		return null;
	}

	return (
		<Card className="mx-4 mt-4 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
			<div className="flex items-center justify-between p-4">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
						<span className="font-medium text-blue-900 text-sm">
							Free Trial Active
						</span>
					</div>
					<div className="text-blue-700 text-sm">
						<span className="font-mono font-semibold">{timeLeft}</span>{" "}
						remaining
					</div>
				</div>
				<div className="flex items-center gap-3">
					<Button
						className="border-blue-300 text-blue-700 hover:bg-blue-100"
						size="sm"
						variant="outline"
					>
						Upgrade Now
					</Button>
					{onDismiss && (
						<Button
							className="text-blue-600 hover:text-blue-800"
							onClick={onDismiss}
							size="sm"
							variant="ghost"
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</Card>
	);
}
