import { ArrowLeft, Code2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button-base";
import { Card, CardContent } from "@/components/ui/card";
import { formsDbServer } from "@/lib/database";
import EmbedCustomizer from "./components/EmbedCustomizer";

interface EmbedPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata = {
  title: "Embed Form - IkiForm",
  description:
    "Customize and embed your form with custom dimensions and styling.",
};

export default async function EmbedPage({ searchParams }: EmbedPageProps) {
  const resolvedSearchParams = await searchParams;
  const formId = resolvedSearchParams.formid as string;

  if (!formId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="gradient-bg mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl">
              <Code2 className="size-8 text-accent-foreground" />
            </div>
            <h1 className="mb-4 font-semibold text-2xl text-foreground">
              Missing Form ID
            </h1>
            <p className="mb-6 text-muted-foreground">
              Please provide a form ID in the URL parameter. Example:
              /embed?formid=your-form-id
            </p>
            <Button asChild variant="default">
              <Link className="gap-2" href="/dashboard">
                <ArrowLeft className="size-4" />
                Go to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  try {
    const form = await formsDbServer.getPublicForm(formId);

    if (!form) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto px-4 py-8">
          <div className="mx-auto">
            <div className="mb-8">
              <div className="text-center">
                <h1 className="mb-2 font-semibold text-3xl text-foreground">
                  Embed Your Form
                </h1>
                <p className="mx-auto max-w-2xl text-muted-foreground">
                  Customize the appearance and dimensions of your form embed,
                  then copy the code to integrate it into your website.
                </p>
              </div>
            </div>

            <EmbedCustomizer form={form} formId={formId} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading form for embed:", error);
    notFound();
  }
}
