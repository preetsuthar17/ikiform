import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { ClientAnnouncementForm } from "./client-announcement-form";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user || user.email !== "preetsutharxd@gmail.com") {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <Card className="p-4 shadow-none md:p-6">
        <CardHeader className="p-0">
          <CardTitle>Send Announcements</CardTitle>
          <p className="text-muted-foreground text-sm">
            Signed in as {user.email}
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div>
            <ClientAnnouncementForm />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
