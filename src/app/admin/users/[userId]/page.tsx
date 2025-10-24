import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Users,
} from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { AdminControls } from "./admin-controls";

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

interface Form {
  id: string;
  title: string;
  description: string | null;
  slug: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  submission_count: number;
}

async function getUser(userId: string): Promise<User | null> {
  if (!userId) {
    console.error("No userId provided");
    return null;
  }

  const supabase = createAdminClient();

  console.log("Looking for user with ID:", userId);

  // First try to find by UID
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("uid", userId)
    .single();

  if (error) {
    console.error("Error fetching user by UID:", error);

    // If UID lookup fails, try by email (in case the userId is actually an email)
    if (userId && typeof userId === "string" && userId.includes("@")) {
      console.log("Trying to find user by email:", userId);
      const { data: userByEmail, error: emailError } = await supabase
        .from("users")
        .select("*")
        .eq("email", userId)
        .single();

      if (emailError) {
        console.error("Error fetching user by email:", emailError);
        return null;
      }

      console.log("Found user by email:", userByEmail);
      return userByEmail;
    }

    console.error("Error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return null;
  }

  console.log("Found user:", user);
  return user;
}

async function getUserForms(userId: string): Promise<Form[]> {
  const supabase = createAdminClient();

  // Fetch user's forms
  const { data: forms, error: formsError } = await supabase
    .from("forms")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (formsError) {
    console.error("Error fetching user forms:", formsError);
    return [];
  }

  // Fetch form submission counts for each form
  const formIds = forms?.map((form) => form.id) || [];
  let submissionCounts: Record<string, number> = {};

  if (formIds.length > 0) {
    const { data: submissions, error: submissionsError } = await supabase
      .from("form_submissions")
      .select("form_id")
      .in("form_id", formIds);

    if (!submissionsError && submissions) {
      submissionCounts = submissions.reduce(
        (acc, submission) => {
          acc[submission.form_id] = (acc[submission.form_id] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );
    }
  }

  // Add submission counts to forms
  const formsWithCounts =
    forms?.map((form) => ({
      ...form,
      submission_count: submissionCounts[form.id] || 0,
    })) || [];

  return formsWithCounts;
}

function calculateTrialDaysLeft(createdAt: string): {
  daysLeft: number;
  isExpired: boolean;
  isExpiringSoon: boolean;
} {
  const createdDate = new Date(createdAt);
  const trialEndDate = new Date(
    createdDate.getTime() + 14 * 24 * 60 * 60 * 1000
  ); // 14 days from creation
  const now = new Date();

  const diffTime = trialEndDate.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isExpired = daysLeft <= 0;
  const isExpiringSoon = daysLeft <= 3 && daysLeft > 0;

  return { daysLeft, isExpired, isExpiringSoon };
}

async function updateUserStatus(userId: string, updates: Partial<User>) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("uid", userId);

  if (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}

async function deleteUser(userId: string) {
  const supabase = createAdminClient();

  // First delete all user's forms and submissions
  const { error: formsError } = await supabase
    .from("forms")
    .delete()
    .eq("user_id", userId);

  if (formsError) {
    console.error("Error deleting user forms:", formsError);
    throw new Error("Failed to delete user forms");
  }

  // Then delete the user
  const { error: userError } = await supabase
    .from("users")
    .delete()
    .eq("uid", userId);

  if (userError) {
    console.error("Error deleting user:", userError);
    throw new Error("Failed to delete user");
  }
}

// Server Actions
async function assignTrial(userId: string) {
  "use server";
  try {
    await updateUserStatus(userId, { has_free_trial: true });
    revalidatePath(`/admin/users/${userId}`);
  } catch (error) {
    console.error("Failed to assign free trial:", error);
  }
}

async function removeTrial(userId: string) {
  "use server";
  try {
    await updateUserStatus(userId, { has_free_trial: false });
    revalidatePath(`/admin/users/${userId}`);
  } catch (error) {
    console.error("Failed to remove free trial:", error);
  }
}

async function assignPremium(userId: string) {
  "use server";
  try {
    await updateUserStatus(userId, { has_premium: true });
    revalidatePath(`/admin/users/${userId}`);
  } catch (error) {
    console.error("Failed to assign premium status:", error);
  }
}

async function removePremium(userId: string) {
  "use server";
  try {
    await updateUserStatus(userId, { has_premium: false });
    revalidatePath(`/admin/users/${userId}`);
  } catch (error) {
    console.error("Failed to remove premium status:", error);
  }
}

async function deleteUserAction(userId: string) {
  "use server";
  try {
    await deleteUser(userId);
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to delete user:", error);
  }
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  // Await the params Promise
  const { userId } = await params;

  console.log("UserProfilePage userId:", userId);

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user || user.email !== "preetsutharxd@gmail.com") {
    redirect("/");
  }

  // Validate userId parameter
  if (!userId) {
    console.error("No userId provided");
    return (
      <main className="mx-auto w-full max-w-7xl p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h1 className="font-bold text-2xl">Invalid User ID</h1>
              <p className="mt-2 text-muted-foreground">
                No user ID provided in the URL.
              </p>
              <Link href="/admin">
                <Button className="">
                  <ArrowLeft className="size-4" />
                  Back to Admin
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  console.log("Looking up user with userId:", userId);

  const [userData, forms] = await Promise.all([
    getUser(userId),
    getUserForms(userId),
  ]);

  if (!userData) {
    return (
      <main className="mx-auto w-full max-w-7xl p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h1 className="font-bold text-2xl">User Not Found</h1>
              <p className="mt-2 text-muted-foreground">
                The user you're looking for doesn't exist.
              </p>
              <Link href="/admin">
                <Button className="">
                  <ArrowLeft className="size-4" />
                  Back to Admin
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Link href="/admin">
            <Button size="sm" variant="outline">
              <ArrowLeft className="size-4" />
              Back to Admin
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-3xl">{userData.name}</h1>
            <p className="text-muted-foreground">{userData.email}</p>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <Card className="p-4 shadow-none md:p-6">
        <CardHeader className="p-0">
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="font-medium text-muted-foreground text-sm">
                UID
              </label>
              <p className="font-mono text-sm">{userData.uid}</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground text-sm">
                Premium Status
              </label>
              <div className="mt-1">
                <Badge variant={userData.has_premium ? "default" : "secondary"}>
                  {userData.has_premium ? "Premium" : "Free"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="font-medium text-muted-foreground text-sm">
                Trial Status
              </label>
              <div className="mt-1">
                <Badge
                  variant={userData.has_free_trial ? "default" : "secondary"}
                >
                  {userData.has_free_trial ? "Free Trial" : "No Trial"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="font-medium text-muted-foreground text-sm">
                Customer Name
              </label>
              <p className="text-sm">{userData.customer_name || "-"}</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground text-sm">
                Polar Customer ID
              </label>
              <p className="font-mono text-sm">
                {userData.polar_customer_id || "-"}
              </p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground text-sm">
                Member Since
              </label>
              <p className="text-sm">
                {new Date(userData.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trial Expiration Card - Only show for users with premium and free trial */}
      {userData.has_premium &&
        userData.has_free_trial &&
        (() => {
          const trialInfo = calculateTrialDaysLeft(userData.created_at);
          return (
            <Card
              className={`gap-0 p-4 shadow-none md:p-6 ${
                trialInfo.isExpired
                  ? "border-destructive/20 bg-destructive/5"
                  : trialInfo.isExpiringSoon
                    ? "border-yellow-500/20 bg-yellow-500/5"
                    : "border-blue-500/20 bg-blue-500/5"
              }`}
            >
              <CardHeader className="p-0">
                <CardTitle
                  className={`flex items-center gap-2 ${
                    trialInfo.isExpired
                      ? "text-destructive"
                      : trialInfo.isExpiringSoon
                        ? "text-yellow-600"
                        : "text-blue-600"
                  }`}
                >
                  {trialInfo.isExpired ? (
                    <AlertTriangle className="size-5" />
                  ) : (
                    <Clock className="size-5" />
                  )}
                  Free Trial Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="">
                  {trialInfo.isExpired ? (
                    <div className="flex items-center gap-2">
                      <Badge className="text-sm" variant="destructive">
                        Trial Expired
                      </Badge>
                      <span className="text-muted-foreground text-sm">
                        Free trial ended {Math.abs(trialInfo.daysLeft)} days ago
                      </span>
                    </div>
                  ) : trialInfo.isExpiringSoon ? (
                    <div className="flex items-center gap-2">
                      <Badge
                        className="border-yellow-300 bg-yellow-100 text-sm text-yellow-800"
                        variant="secondary"
                      >
                        Expiring Soon
                      </Badge>
                      <span className="text-muted-foreground text-sm">
                        {trialInfo.daysLeft}{" "}
                        {trialInfo.daysLeft === 1 ? "day" : "days"} left in free
                        trial
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge
                        className="border-blue-300 bg-blue-100 text-blue-800 text-sm"
                        variant="secondary"
                      >
                        Active Trial
                      </Badge>
                      <span className="text-muted-foreground text-sm">
                        {trialInfo.daysLeft}{" "}
                        {trialInfo.daysLeft === 1 ? "day" : "days"} left in free
                        trial
                      </span>
                    </div>
                  )}

                  <div className="mt-3 text-muted-foreground text-xs">
                    Trial started:{" "}
                    {new Date(userData.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}

      {/* Admin Controls */}
      <AdminControls
        assignPremium={assignPremium}
        assignTrial={assignTrial}
        deleteUser={deleteUserAction}
        hasFreeTrial={userData.has_free_trial}
        hasPremium={userData.has_premium}
        removePremium={removePremium}
        removeTrial={removeTrial}
        userId={userData.uid}
        userName={userData.name}
      />

      {/* Forms Card */}
      <Card className="p-4 shadow-none md:p-6">
        <CardHeader className="p-0">
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Forms ({forms.length})
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            All forms created by this user
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {forms.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <FileText className="mx-auto mb-4 size-12 opacity-50" />
              <p>This user hasn't created any forms yet.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms.map((form) => (
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      key={form.id}
                    >
                      <TableCell className="font-medium">
                        <Link
                          className="flex items-center gap-2 hover:text-primary"
                          href={`/admin/forms/${form.id}`}
                        >
                          {form.title}
                          <ExternalLink className="size-3 opacity-50" />
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {form.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={form.is_published ? "default" : "secondary"}
                        >
                          {form.is_published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="size-3" />
                          {form.submission_count}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(form.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/f/${form.slug || form.id}`}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <Button size="sm" variant="outline">
                              <ExternalLink className="size-3" />
                              View
                            </Button>
                          </Link>
                          <Link href={`/admin/forms/${form.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="size-3" />
                              Details
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
