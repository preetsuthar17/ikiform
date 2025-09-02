"use client";

import { Code2, Eye, Monitor, Settings, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button-base";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Form } from "@/lib/database/database";
import {
  getInternalFormTitle,
  getPublicFormTitle,
} from "@/lib/utils/form-utils";
import EmbedCodeModal from "./EmbedCodeModal";
import EmbedPreview from "./EmbedPreview";
import EmbedSettings from "./EmbedSettings";

export interface EmbedConfig {
  width: string;
  height: string;
  borderRadius: number;
  padding: number;
  backgroundColor: string;
  showBorder: boolean;
  borderColor: string;
  borderWidth: number;
  responsive: boolean;
  loadingMode: "eager" | "lazy";
  allowTransparency: boolean;
}

interface EmbedCustomizerProps {
  form: Form;
  formId: string;
}

const defaultConfig: EmbedConfig = {
  width: "100%",
  height: "600px",
  borderRadius: 8,
  padding: 0,
  backgroundColor: "#ffffff",
  showBorder: true,
  borderColor: "#e5e7eb",
  borderWidth: 1,
  responsive: true,
  loadingMode: "lazy",
  allowTransparency: false,
};

export default function EmbedCustomizer({
  form,
  formId,
}: EmbedCustomizerProps) {
  const [config, setConfig] = useState<EmbedConfig>(defaultConfig);
  const [activeView, setActiveView] = useState<"desktop" | "mobile">("desktop");
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const updateConfig = (updates: Partial<EmbedConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const embedUrl = `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://www.ikiform.com"}/forms/${formId}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Simple Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-2xl">
            {getInternalFormTitle(form.schema)}
          </h1>
          <p className="text-muted-foreground">
            Customize and generate embed code for your form
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsCodeModalOpen(true)}
        >
          <Code2 className="h-4 w-4" />
          Show Code
        </Button>
      </div>

      {/* Simple Split Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <EmbedSettings config={config} updateConfig={updateConfig} />
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="flex flex-col gap-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Preview</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  className={`h-8 px-3 text-xs ${
                    activeView === "desktop"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                  onClick={() => setActiveView("desktop")}
                  size="sm"
                  variant="ghost"
                >
                  Desktop
                </Button>
                <Button
                  className={`h-8 px-3 text-xs ${
                    activeView === "mobile"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                  onClick={() => setActiveView("mobile")}
                  size="sm"
                  variant="ghost"
                >
                  Mobile
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <EmbedPreview
              config={config}
              embedUrl={embedUrl}
              formTitle={getPublicFormTitle(form.schema)}
              viewMode={activeView}
            />
          </CardContent>
        </Card>
      </div>

      {/* Code Modal */}
      <EmbedCodeModal
        config={config}
        embedUrl={embedUrl}
        formId={formId}
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
