// External imports
import React from "react";
import Link from "next/link";

// Icon imports
import {
  Save,
  Eye,
  Share,
  Settings as SettingsIcon,
  Globe,
  EyeOff,
  BarChart3,
  Code,
  Layers,
  FileText,
  Sparkles,
} from "lucide-react";

// Component imports
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Type imports
import type { FormBuilderHeaderProps } from "../types";

// Constant imports
import { FORM_BUILDER_CONSTANTS } from "../constants";

export const FormBuilderHeader: React.FC<FormBuilderHeaderProps> = ({
  formSchema,
  autoSaving,
  saving,
  publishing,
  isPublished,
  formId,
  onModeToggle,
  onJsonView,
  onAnalytics,
  onShare,
  onSettings,
  onPublish,
  onSave,
}) => {
  const fieldCount = formSchema.fields.length;

  return (
    <div
      className="bg-card border-b border-border px-6 py-4 flex-shrink-0 z-20"
      style={{ height: FORM_BUILDER_CONSTANTS.HEADER_HEIGHT }}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          <h1
            className="text-xl font-semibold text-foreground opacity-0 absolute"
            aria-hidden="true"
          >
            Form Builder
          </h1>
          <div className="flex items-center gap-3">
            <Button asChild variant="secondary" className="font-medium">
              <Link href="/dashboard" className="flex items-center z-1">
                Go to Dashboard
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              {fieldCount} field{fieldCount !== 1 ? "s" : ""}
            </div>
            {autoSaving && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                <span>Saving</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={formSchema.settings.multiStep ? "default" : "secondary"}
            size="sm"
            onClick={onModeToggle}
            className="gap-2"
          >
            {formSchema.settings.multiStep ? (
              <Layers className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            {formSchema.settings.multiStep ? "Multi-Step" : "Single Page"}
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="default" size="sm" asChild>
                  <Link href="/ai-builder">
                    <Sparkles className="w-4 h-4 shrink-0" /> Use Kiko
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent size="sm">AI Form builder</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon" onClick={onJsonView}>
                  <Code className="w-4 h-4 shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent size="sm">View JSON</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onAnalytics}
                  disabled={!formId}
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent size="sm">Analytics</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onShare}
                  disabled={!formId}
                >
                  <Share className="w-4 h-4 shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent size="sm">Share</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon" onClick={onSettings}>
                  <SettingsIcon className="w-4 h-4 shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent size="sm">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            onClick={onPublish}
            variant="secondary"
            loading={publishing}
            disabled={!formId || publishing}
          >
            {isPublished ? (
              <>
                {!publishing && <Globe className="w-4 h-4 shrink-0" />}
                {publishing ? "Unpublishing" : "Published"}
              </>
            ) : (
              <>
                {!publishing && <EyeOff className="w-4 h-4 shrink-0" />}
                {publishing ? "Publishing" : "Publish"}
              </>
            )}
          </Button>

          <Button onClick={onSave} disabled={saving} loading={saving}>
            {!saving && <Save className="w-4 h-4" />}
            {saving ? "Saving" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};
