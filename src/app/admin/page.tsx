import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
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
      <Card>
        <CardHeader>
          <CardTitle>Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Signed in as {user.email}
          </p>

          <div className="mt-6">
            <Tabs
              items={[
                { id: "announcements", label: "Announcements" },
                { id: "updates", label: "Updates" },
              ]}
            />
            <TabsContent
              activeValue="announcements"
              className="mt-4"
              value="announcements"
            >
              <ClientAnnouncementForm />
            </TabsContent>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
