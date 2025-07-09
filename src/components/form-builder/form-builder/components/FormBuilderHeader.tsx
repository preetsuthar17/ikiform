// External imports
import React from "react";
import Link from "next/link";

// Component imports
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Container,
} from "lucide-react";

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
      className="bg-card border-b border-border px-4 md:px-6 py-3 md:py-4 flex-shrink-0 z-20"
      style={{ minHeight: FORM_BUILDER_CONSTANTS.HEADER_HEIGHT }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 h-full">
        <div className="flex items-center gap-3 md:gap-4">
          <h1
            className="text-xl font-semibold text-foreground opacity-0 absolute"
            aria-hidden="true"
          >
            Form Builder
          </h1>
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              asChild
              variant="secondary"
              className="font-medium text-xs md:text-sm"
            >
              <Link href="/dashboard" className="flex items-center z-1">
                Go to Dashboard
              </Link>
            </Button>
            <div className="text-xs md:text-sm text-muted-foreground">
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

        <ScrollArea className="md:hidden w-full" orientation="horizontal">
          <div className="flex gap-2 pb-4">
            <Button
              variant={formSchema.settings.multiStep ? "default" : "secondary"}
              size="sm"
              onClick={onModeToggle}
              className="gap-1 text-xs"
            >
              {formSchema.settings.multiStep ? (
                <Layers className="w-3 h-3" />
              ) : (
                <FileText className="w-3 h-3" />
              )}
              {formSchema.settings.multiStep ? "Multi-Step" : "Single Page"}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              asChild
              disabled={!formId}
              className="text-xs"
            >
              <Link
                href={formId ? `/embed?formId=${formId}` : "/embed"}
                target="_blank"
              >
                <Container className="w-3 h-3 shrink-0" /> Embed
              </Link>
            </Button>

            <Button
              variant="secondary"
              size="icon"
              onClick={onJsonView}
              className="w-8 h-8"
            >
              <Code className="w-3 h-3 shrink-0" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              onClick={onAnalytics}
              disabled={!formId}
              className="w-8 h-8"
            >
              <BarChart3 className="w-3 h-3 shrink-0" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              onClick={onShare}
              disabled={!formId}
              className="w-8 h-8"
            >
              <Share className="w-3 h-3 shrink-0" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              onClick={onSettings}
              className="w-8 h-8"
            >
              <SettingsIcon className="w-3 h-3 shrink-0" />
            </Button>

            <Button variant="default" size="sm" asChild className="text-xs">
              <Link href="/ai-builder">
                <Sparkles className="w-3 h-3 shrink-0" /> Use Kiko
              </Link>
            </Button>

            <Button
              onClick={onPublish}
              variant="secondary"
              size="sm"
              loading={publishing}
              disabled={!formId || publishing}
              className="text-xs"
            >
              {isPublished ? (
                <>
                  {!publishing && <Globe className="w-3 h-3 shrink-0" />}
                  {publishing ? "Unpublishing" : "Published"}
                </>
              ) : (
                <>
                  {!publishing && <EyeOff className="w-3 h-3 shrink-0" />}
                  {publishing ? "Publishing" : "Publish"}
                </>
              )}
            </Button>

            <Button
              size="sm"
              onClick={onSave}
              disabled={saving}
              loading={saving}
              className="text-xs"
            >
              {!saving && <Save className="w-3 h-3" />}
              {saving ? "Saving" : "Save"}
            </Button>
          </div>
        </ScrollArea>

        <div className="hidden md:flex items-center gap-3">
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
                <Button
                  variant="secondary"
                  size="sm"
                  asChild
                  disabled={!formId}
                >
                  <Link
                    href={formId ? `/embed?formId=${formId}` : "/embed"}
                    target="_blank"
                  >
                    <Container className="w-4 h-4 shrink-0" /> Embed
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent size="sm">Embed</TooltipContent>
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
          </TooltipProvider>

          <Button
            onClick={onPublish}
            variant="secondary"
            size="sm"
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

          <Button size="sm" onClick={onSave} disabled={saving} loading={saving}>
            {!saving && <Save className="w-4 h-4" />}
            {saving ? "Saving" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};
