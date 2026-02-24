import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { ClientAnnouncementForm } from "./client-announcement-form";
import { ExpireTrialsControl } from "./expire-trials-control";
import { UsersTable } from "./users-table";

export const dynamic = "force-dynamic";

interface User {
	uid: string;
	name: string;
	email: string;
	has_premium: boolean;
	has_free_trial: boolean;
	customer_name: string | null;
	polar_customer_id: string | null;
	created_at: string;
	updated_at: string;
}

async function getUsers(): Promise<User[]> {
	try {
		const supabase = createAdminClient();

		const { data: users, error } = await supabase
			.from("users")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching users:", error);
			return [];
		}

		return users || [];
	} catch (error) {
		console.error("Unexpected error fetching users:", error);
		return [];
	}
}

const AdminPage = async function AdminPage() {
	try {
		const t = await getTranslations("dashboard.admin.page");
		const supabase = await createClient();
		const { data } = await supabase.auth.getUser();
		const user = data.user;

		if (!user || user.email !== "preetsutharxd@gmail.com") {
			redirect("/");
		}

		const users = await getUsers();

		return (
			<main
				aria-label={t("aria.dashboard")}
				className="mx-auto flex w-full max-w-7xl flex-col gap-6"
			>
				{}
				<Card
					aria-label={t("aria.announcements")}
					className="p-4 shadow-none md:p-6"
					role="region"
				>
					<CardHeader className="p-0">
						<CardTitle>{t("announcements.title")}</CardTitle>
						<p className="text-muted-foreground text-sm">
							{t("announcements.signedInAs", { email: user.email ?? "" })}
						</p>
					</CardHeader>
					<CardContent className="p-0">
						<div>
							<ClientAnnouncementForm />
						</div>
					</CardContent>
				</Card>

				{}
				<Card
					aria-label={t("aria.expireTrials")}
					className="p-4 shadow-none md:p-6"
					role="region"
				>
					<CardHeader className="p-0">
						<CardTitle>{t("expireTrials.title")}</CardTitle>
						<p className="text-muted-foreground text-sm">
							{t("expireTrials.description")}
						</p>
					</CardHeader>
					<CardContent className="p-0">
						<div className="mt-4">
							<ExpireTrialsControl />
						</div>
					</CardContent>
				</Card>

				{}
				<Card
					aria-label={t("aria.users")}
					className="p-4 shadow-none md:p-6"
					role="region"
				>
					<CardHeader className="p-0">
						<CardTitle>{t("users.title", { count: users.length })}</CardTitle>
						<p className="text-muted-foreground text-sm">
							{t("users.description")}
						</p>
					</CardHeader>
					<CardContent className="p-0">
						<div className="mt-4">
							<UsersTable users={users} />
						</div>
					</CardContent>
				</Card>
			</main>
		);
	} catch (error) {
		console.error("Error in AdminPage:", error);
		redirect("/");
	}
};

export default AdminPage;
