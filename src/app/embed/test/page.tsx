import {
  Code2,
  ExternalLink,
  Eye,
  Monitor,
  Settings,
  Smartphone,
  Tablet,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button-base";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Embed Test - IkiForm",
  description: "Test page to demonstrate form embedding capabilities",
};

export default function EmbedTestPage() {
  // This would be replaced with actual form IDs from your forms
  const sampleFormId = "182fa915-7656-4489-bf51-5145984d4094";

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="gradient-bg mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-card">
              <Code2 className="h-8 w-8 text-accent-foreground" />
            </div>
            <h1 className="mb-4 font-semibold text-3xl text-foreground">
              Form Embedding Test Page
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-muted-foreground">
              This page demonstrates how forms can be embedded using different
              configurations. Visit{" "}
              <code className="rounded-ele bg-muted px-2 py-1 text-foreground">
                /embed?formid=YOUR_FORM_ID
              </code>{" "}
              to customize your own embed.
            </p>
            <Button asChild className="gap-2" variant="default">
              <Link href={`/embed?formid=${sampleFormId}`}>
                <Settings className="h-4 w-4" />
                Try Embed Customizer
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-8">
            {/* Standard Embed */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Standard Embed
                    </CardTitle>
                    <CardDescription>
                      600px height - perfect for desktop viewing
                    </CardDescription>
                  </div>
                  <Badge variant="outline">Responsive</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-ele border-2 border-border/50 border-dashed bg-accent/5 p-4">
                  <iframe
                    allow="clipboard-write; camera; microphone"
                    height="600px"
                    loading="lazy"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                    src={`/forms/${sampleFormId}`}
                    style={{
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    title="Standard Form Embed"
                    width="100%"
                  />
                </div>
                <Card className="mt-4 bg-muted/50">
                  <CardContent className="p-3">
                    <pre className="overflow-x-auto font-mono text-muted-foreground text-sm">
                      {`<iframe src="/forms/${sampleFormId}" width="100%" height="600px" frameborder="0"></iframe>`}
                    </pre>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Compact Embed */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Tablet className="h-5 w-5" />
                      Compact Embed
                    </CardTitle>
                    <CardDescription>
                      400px height - ideal for sidebars and smaller spaces
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Minimal</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-ele border-2 border-border/50 border-dashed bg-accent/5 p-4">
                  <iframe
                    allow="clipboard-write; camera; microphone"
                    height="400px"
                    loading="lazy"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                    src={`/forms/${sampleFormId}`}
                    style={{ border: "none", borderRadius: "12px" }}
                    title="Compact Form Embed"
                    width="100%"
                  />
                </div>
                <Card className="mt-4 bg-muted/50">
                  <CardContent className="p-3">
                    <pre className="overflow-x-auto font-mono text-muted-foreground text-sm">
                      {`<iframe src="/forms/${sampleFormId}" width="100%" height="400px" style="border: none; border-radius: 12px;"></iframe>`}
                    </pre>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Fixed Width Embed */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Fixed Width Embed
                    </CardTitle>
                    <CardDescription>
                      800px width, centered - perfect for specific layouts
                    </CardDescription>
                  </div>
                  <Badge variant="outline">Custom Style</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center rounded-ele border-2 border-border/50 border-dashed bg-accent/5 p-4">
                  <iframe
                    allow="clipboard-write; camera; microphone"
                    height="500px"
                    loading="lazy"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                    src={`/forms/${sampleFormId}`}
                    style={{
                      border: "2px solid hsl(var(--primary))",
                      borderRadius: "16px",
                      backgroundColor: "hsl(var(--background))",
                    }}
                    title="Fixed Width Form Embed"
                    width="800px"
                  />
                </div>
                <Card className="mt-4 bg-muted/50">
                  <CardContent className="p-3">
                    <pre className="overflow-x-auto font-mono text-muted-foreground text-sm">
                      {`<iframe src="/forms/${sampleFormId}" width="800px" height="500px" style="border: 2px solid #3b82f6; border-radius: 16px;"></iframe>`}
                    </pre>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* React Component Example */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  React Component Example
                </CardTitle>
                <CardDescription>
                  TypeScript React component with proper typing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <pre className="overflow-x-auto font-mono text-foreground text-sm">
                      {`import React from 'react';

export default function EmbeddedForm() {
  const iframeStyle = {
    width: '100%',
    height: '600px',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
  };

  return (
    <iframe
      src="/forms/${sampleFormId}"
      style={iframeStyle}
      title="Form"
      loading="lazy"
      allow="clipboard-write; camera; microphone"
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      frameBorder="0"
    />
  );
}`}
                    </pre>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Integration Instructions */}
            <Card className="bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  How to Use the Embed Feature
                </CardTitle>
                <CardDescription>
                  Step-by-step guide to embedding your forms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline">1</Badge>
                      <h3 className="font-semibold">
                        Access the Embed Customizer
                      </h3>
                    </div>
                    <p className="text-muted-foreground">
                      Go to{" "}
                      <code className="rounded-ele bg-muted px-2 py-1 text-foreground">
                        /embed?formid=YOUR_FORM_ID
                      </code>{" "}
                      or click the embed button in your form dashboard.
                    </p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline">2</Badge>
                      <h3 className="font-semibold">Customize Your Embed</h3>
                    </div>
                    <ul className="flex flex-col gap-1 text-muted-foreground">
                      <li>• Adjust width and height dimensions</li>
                      <li>• Choose theme (light, dark, auto)</li>
                      <li>• Configure borders and styling</li>
                      <li>• Set loading behavior</li>
                    </ul>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline">3</Badge>
                      <h3 className="font-semibold">Get Your Code</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Copy the generated code for HTML, React, Next.js, Vue, or
                      WordPress and paste it into your website.
                    </p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline">4</Badge>
                      <h3 className="font-semibold">Dashboard Integration</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Access embed options directly from your form dashboard
                      using the embed button in the form actions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
