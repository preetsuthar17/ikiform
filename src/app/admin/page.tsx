import { redirect } from "next/navigation";
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
		const supabase = await createClient();
		const { data } = await supabase.auth.getUser();
		const user = data.user;

		if (!user || user.email !== "preetsutharxd@gmail.com") {
			redirect("/");
		}

		const users = await getUsers();

		return (
			<main
				aria-label="Admin dashboard"
				className="mx-auto flex w-full max-w-7xl flex-col gap-6"
				role="main"
			>
				{}
				<Card
					aria-label="Announcements management"
					className="p-4 shadow-none md:p-6"
					role="region"
				>
					<CardHeader className="p-0">
						<CardTitle>Send Announcements</CardTitle>
						<p
							aria-label={`Signed in as ${user.email}`}
							className="text-muted-foreground text-sm"
						>
							Signed in as {user.email}
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
					aria-label="Expire trials management"
					className="p-4 shadow-none md:p-6"
					role="region"
				>
					<CardHeader className="p-0">
						<CardTitle>Expire Trials</CardTitle>
						<p className="text-muted-foreground text-sm">
							Manually run the cron job to expire free trials
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
					aria-label="Users management"
					className="p-4 shadow-none md:p-6"
					role="region"
				>
					<CardHeader className="p-0">
						<CardTitle>All Users ({users.length})</CardTitle>
						<p className="text-muted-foreground text-sm">
							Manage and view all registered users
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
