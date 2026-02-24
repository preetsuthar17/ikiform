"use client";

import {
	Crown,
	Shield,
	ShieldOff,
	Trash2,
	UserCheck,
	UserX,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ConfirmationModal } from "@/components/dashboard/modals/form-delete-confirmation-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminControlsProps {
	userId: string;
	userName: string;
	hasFreeTrial: boolean;
	hasPremium: boolean;
	assignTrial: (userId: string) => void;
	removeTrial: (userId: string) => void;
	assignPremium: (userId: string) => void;
	removePremium: (userId: string) => void;
	deleteUser: (userId: string) => void;
}

export function AdminControls({
	userId,
	userName,
	hasFreeTrial,
	hasPremium,
	assignTrial,
	removeTrial,
	assignPremium,
	removePremium,
	deleteUser,
}: AdminControlsProps) {
	const t = useTranslations("dashboard.admin.userControls");
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const handleDeleteClick = () => {
		setShowDeleteConfirm(true);
	};

	const handleConfirmDelete = () => {
		deleteUser(userId);
		setShowDeleteConfirm(false);
	};

	return (
		<Card className="gap-0 border-orange-200 bg-orange-50/50 p-4 shadow-none md:p-6">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-orange-700">
					<Shield className="size-5" />
					{t("title")}
				</CardTitle>
				<p className="text-muted-foreground text-sm">
					{t("description")}
				</p>
			</CardHeader>
			<CardContent className="p-0">
				<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					<div className="flex flex-col gap-2">
						<div className="font-medium text-muted-foreground text-sm">
							{t("sections.freeTrial")}
						</div>
						<div className="flex gap-2">
							{hasFreeTrial ? (
								<form action={removeTrial.bind(null, userId)}>
									<Button
										className="border-red-300 text-red-600 hover:bg-red-50"
										size="sm"
										type="submit"
										variant="outline"
									>
										<UserX className="size-4" />
										{t("actions.removeTrial")}
									</Button>
								</form>
							) : (
								<form action={assignTrial.bind(null, userId)}>
									<Button
										className="border-green-300 text-green-600 hover:bg-green-50"
										size="sm"
										type="submit"
										variant="outline"
									>
										<UserCheck className="size-4" />
										{t("actions.assignTrial")}
									</Button>
								</form>
							)}
						</div>
					</div>

					{}
					<div className="flex flex-col gap-2">
						<div className="font-medium text-muted-foreground text-sm">
							{t("sections.premiumStatus")}
						</div>
						<div className="flex gap-2">
							{hasPremium ? (
								<form action={removePremium.bind(null, userId)}>
									<Button
										className="border-red-300 text-red-600 hover:bg-red-50"
										size="sm"
										type="submit"
										variant="outline"
									>
										<ShieldOff className="size-4" />
										{t("actions.removePremium")}
									</Button>
								</form>
							) : (
								<form action={assignPremium.bind(null, userId)}>
									<Button
										className="border-blue-300 text-blue-600 hover:bg-blue-50"
										size="sm"
										type="submit"
										variant="outline"
									>
										<Crown className="size-4" />
										{t("actions.assignPremium")}
									</Button>
								</form>
							)}
						</div>
					</div>

					{}
					<div className="flex flex-col gap-2">
						<div className="font-medium text-muted-foreground text-sm">
							{t("sections.dangerZone")}
						</div>
						<div className="flex gap-2">
							<Button
								className="bg-red-600 hover:bg-red-700"
								onClick={handleDeleteClick}
								size="sm"
								type="button"
								variant="destructive"
							>
								<Trash2 className="size-4" />
								{t("actions.deleteUser")}
							</Button>
						</div>
					</div>
				</div>

				<div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-3">
					<p className="text-xs text-yellow-800">
						<strong>{t("warning.label")}</strong> {t("warning.message")}
					</p>
				</div>
			</CardContent>

			<ConfirmationModal
				cancelText={t("confirm.cancel")}
				confirmText={t("confirm.confirm")}
				description={t("confirm.description", { userName })}
				onConfirm={handleConfirmDelete}
				onOpenChange={setShowDeleteConfirm}
				open={showDeleteConfirm}
				title={t("confirm.title")}
				variant="destructive"
			/>
		</Card>
	);
}
