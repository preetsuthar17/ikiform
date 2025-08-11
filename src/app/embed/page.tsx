import { notFound } from "next/navigation";
import { formsDbServer } from "@/lib/database";
import EmbedCustomizer from "./components/EmbedCustomizer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button-base";
import Link from "next/link";
import { ArrowLeft, Code2 } from "lucide-react";

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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="gradient-bg flex h-16 w-16 items-center justify-center rounded-card mx-auto mb-4">
              <Code2 className="h-8 w-8 text-accent-foreground" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-4">
              Missing Form ID
            </h1>
            <p className="text-muted-foreground mb-6">
              Please provide a form ID in the URL parameter. Example:
              /embed?formid=your-form-id
            </p>
            <Button asChild variant="default">
              <Link href="/dashboard" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
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
        <div className=" mx-auto px-4 py-8">
          <div className="mx-auto">
            <div className="mb-8">
              <div className="text-center">
                <h1 className="text-3xl font-semibold text-foreground mb-2">
                  Embed Your Form
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
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
