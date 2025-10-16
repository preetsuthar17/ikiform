import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { formsDb } from "@/lib/database";
import type { BasicInfoSectionProps } from "../types";

export function BasicInfoSection({
  localSettings,
  updateSettings,
  formId,
  schema,
}: BasicInfoSectionProps) {
  const [basicInfo, setBasicInfo] = useState({
    title: localSettings.title || "",
    publicTitle: localSettings.publicTitle || "",
    description: localSettings.description || "",
    submitText: localSettings.submitText || "Submit",
    successMessage: localSettings.successMessage || "",
    redirectUrl: localSettings.redirectUrl || "",
  });

  const [behaviorSettings, setBehaviorSettings] = useState({
    hideHeader: localSettings.hideHeader,
    rtl: localSettings.rtl,
    autoFocusFirstField: localSettings.behavior?.autoFocusFirstField,
  });

  const [savingBasic, setSavingBasic] = useState(false);
  const [savingBehavior, setSavingBehavior] = useState(false);
  const [savedBasic, setSavedBasic] = useState(false);
  const [savedBehavior, setSavedBehavior] = useState(false);
  const [hasBasicChanges, setHasBasicChanges] = useState(false);
  const [hasBehaviorChanges, setHasBehaviorChanges] = useState(false);

  const basicInfoRef = useRef<HTMLDivElement>(null);
  const behaviorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasBasicChanges || hasBehaviorChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () =>
      window.removeEventListener(
        "beforeunload",
        onBeforeUnload as unknown as EventListener
      );
  }, [hasBasicChanges, hasBehaviorChanges]);

  const handleBasicInfoChange = (field: string, value: string) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
    setSavedBasic(false);
    setHasBasicChanges(true);
  };

  const handleBehaviorChange = (field: string, value: boolean) => {
    setBehaviorSettings((prev) => ({ ...prev, [field]: value }));
    setSavedBehavior(false);
    setHasBehaviorChanges(true);
  };

  const resetBasicInfo = () => {
    setBasicInfo({
      title: localSettings.title || "",
      publicTitle: localSettings.publicTitle || "",
      description: localSettings.description || "",
      submitText: localSettings.submitText || "Submit",
      successMessage: localSettings.successMessage || "",
      redirectUrl: localSettings.redirectUrl || "",
    });
    setHasBasicChanges(false);
  };

  const resetBehavior = () => {
    setBehaviorSettings({
      hideHeader: localSettings.hideHeader,
      rtl: localSettings.rtl,
      autoFocusFirstField: localSettings.behavior?.autoFocusFirstField,
    });
    setHasBehaviorChanges(false);
  };

  const saveBasicInfo = async () => {
    if (!formId) {
      toast.error("Form ID is required to save settings");
      return;
    }
    const titleMissing = !basicInfo.title?.trim();
    if (titleMissing) {
      setHasBasicChanges(true);
      const target = document.getElementById(
        "form-title-field"
      ) as HTMLElement | null;
      target?.focus();
      toast.error("Please fill out required fields");
      return;
    }
    const trimmed = {
      title: basicInfo.title.trim(),
      publicTitle: basicInfo.publicTitle.trim(),
      description: basicInfo.description.trim(),
      submitText: basicInfo.submitText.trim(),
      successMessage: basicInfo.successMessage.trim(),
      redirectUrl: basicInfo.redirectUrl.trim(),
    };
    setSavingBasic(true);
    try {
      const newSchema = {
        ...schema,
        settings: {
          ...schema.settings,
          ...trimmed,
        },
      };
      await formsDb.updateForm(formId, { schema: newSchema as any });
      updateSettings(trimmed);
      setSavedBasic(true);
      setHasBasicChanges(false);
      toast.success("Basic information saved successfully");

      setTimeout(() => setSavedBasic(false), 2000);
    } catch (error) {
      console.error("Error saving basic info:", error);
      toast.error("Failed to save basic information");
    } finally {
      setSavingBasic(false);
    }
  };

  const saveBehavior = async () => {
    if (!formId) {
      toast.error("Form ID is required to save settings");
      return;
    }

    setSavingBehavior(true);
    try {
      const newSchema = {
        ...schema,
        settings: {
          ...schema.settings,
          hideHeader: behaviorSettings.hideHeader,
          rtl: behaviorSettings.rtl,
          behavior: {
            ...schema.settings.behavior,
            autoFocusFirstField: behaviorSettings.autoFocusFirstField,
          },
        },
      };
      await formsDb.updateForm(formId, { schema: newSchema as any });
      updateSettings({
        hideHeader: behaviorSettings.hideHeader,
        rtl: behaviorSettings.rtl,
        behavior: {
          ...localSettings.behavior,
          autoFocusFirstField: behaviorSettings.autoFocusFirstField,
        },
      });
      setSavedBehavior(true);
      setHasBehaviorChanges(false);
      toast.success("Form behavior saved successfully");

      setTimeout(() => setSavedBehavior(false), 2000);
    } catch (error) {
      console.error("Error saving behavior:", error);
      toast.error("Failed to save form behavior");
    } finally {
      setSavingBehavior(false);
    }
  };

  useEffect(() => {
    if (basicInfoRef.current) {
      const firstInput = basicInfoRef.current.querySelector(
        "input, textarea"
      ) as HTMLElement;
      firstInput?.focus();
    }
  }, []);

  useEffect(() => {
    if (savedBasic) {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = "Basic information saved successfully";
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [savedBasic]);

  useEffect(() => {
    if (savedBehavior) {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = "Form behavior saved successfully";
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [savedBehavior]);

  return (
    <ScrollArea
      className="h-full w-full"
      style={{
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        overscrollBehavior: "contain",
      }}
    >
      <div
        aria-label="Basic form settings"
        className="flex flex-col gap-4"
        onKeyDown={(e) => {
          const target = e.target as HTMLElement;
          const isTextInput =
            target.tagName === "INPUT" &&
            !(target as HTMLInputElement).readOnly &&
            (target as HTMLInputElement).type !== "checkbox";
          const isTextarea = target.tagName === "TEXTAREA";
          if (
            isTextInput &&
            e.key === "Enter" &&
            !e.metaKey &&
            !e.ctrlKey &&
            !e.altKey &&
            !e.shiftKey
          ) {
            e.preventDefault();
            saveBasicInfo();
          } else if (
            isTextarea &&
            e.key === "Enter" &&
            (e.metaKey || e.ctrlKey)
          ) {
            e.preventDefault();
            saveBasicInfo();
          }
        }}
        role="main"
      >
        <Card
          aria-labelledby="basic-info-title"
          className="shadow-none"
          ref={basicInfoRef}
          role="region"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle
                  className="flex items-center gap-2 text-lg tracking-tight"
                  id="basic-info-title"
                >
                  Basic Information
                </CardTitle>
                <CardDescription id="basic-info-description">
                  Configure the basic details of your form
                </CardDescription>
              </div>
              {hasBasicChanges && (
                <Badge className="gap-2" variant="secondary">
                  <div className="size-2 rounded-full bg-orange-500" />
                  Unsaved changes
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <BasicInfoField
              description="This title is only visible to you in the dashboard and form builder"
              id="form-title"
              label="Internal Title"
              onChange={(value) => handleBasicInfoChange("title", value)}
              placeholder="Enter internal title for your reference..."
              required
              value={basicInfo.title}
            />

            <BasicInfoField
              description="This title will be displayed to users on the actual form. Leave empty to use the internal title."
              id="form-public-title"
              label="Public Title"
              onChange={(value) => handleBasicInfoChange("publicTitle", value)}
              placeholder="Enter title to display to users..."
              value={basicInfo.publicTitle}
            />

            <BasicInfoField
              id="form-description"
              isTextarea
              label="Form Description"
              onChange={(value) => handleBasicInfoChange("description", value)}
              placeholder="Enter form description"
              rows={3}
              value={basicInfo.description}
            />

            <BasicInfoField
              id="submit-text"
              label="Submit Button Text"
              onChange={(value) => handleBasicInfoChange("submitText", value)}
              placeholder="Submit"
              value={basicInfo.submitText}
            />

            <BasicInfoField
              id="success-message"
              isTextarea
              label="Success Message"
              onChange={(value) =>
                handleBasicInfoChange("successMessage", value)
              }
              placeholder="Thank you for your submission!"
              rows={2}
              value={basicInfo.successMessage}
            />

            <BasicInfoField
              description="URL to redirect users after successful submission"
              id="redirect-url"
              label="Redirect URL (Optional)"
              onChange={(value) => handleBasicInfoChange("redirectUrl", value)}
              placeholder="https://example.com/thank-you"
              value={basicInfo.redirectUrl}
            />

            <div
              aria-label="Basic information actions"
              className="flex items-center justify-between"
              role="group"
            >
              <div className="flex items-center gap-2">
                {hasBasicChanges && (
                  <Button
                    className="min-h-10 gap-2 text-muted-foreground hover:text-foreground"
                    onClick={resetBasicInfo}
                    size="sm"
                    variant="ghost"
                  >
                    Reset
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  aria-describedby="basic-info-description"
                  aria-label="Save basic information"
                  className="min-h-10"
                  disabled={savingBasic || !hasBasicChanges}
                  loading={savingBasic}
                  onClick={saveBasicInfo}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      saveBasicInfo();
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          aria-labelledby="behavior-title"
          className="shadow-none"
          ref={behaviorRef}
          role="region"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle
                  className="flex items-center gap-2 text-lg tracking-tight"
                  id="behavior-title"
                >
                  Form Behavior
                </CardTitle>
                <CardDescription id="behavior-description">
                  Configure how your form behaves and appears to users
                </CardDescription>
              </div>
              {hasBehaviorChanges && (
                <Badge className="gap-2" variant="secondary">
                  <div className="size-2 rounded-full bg-orange-500" />
                  Unsaved changes
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label
                    className="font-medium text-sm"
                    htmlFor="hide-header-toggle"
                  >
                    Hide Header
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Hides public title and description in embeds
                  </p>
                </div>
                <Switch
                  aria-describedby="hide-header-description"
                  checked={behaviorSettings.hideHeader}
                  id="hide-header-toggle"
                  onCheckedChange={(checked) =>
                    handleBehaviorChange("hideHeader", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label className="font-medium text-sm" htmlFor="rtl-toggle">
                    Right-to-Left Mode
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Display form in RTL (Right-to-Left) mode
                  </p>
                </div>
                <Switch
                  aria-describedby="rtl-description"
                  checked={behaviorSettings.rtl}
                  id="rtl-toggle"
                  onCheckedChange={(checked) =>
                    handleBehaviorChange("rtl", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label
                    className="font-medium text-sm"
                    htmlFor="auto-focus-toggle"
                  >
                    Auto Focus First Field
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Automatically focus on the first field when form loads
                  </p>
                </div>
                <Switch
                  aria-describedby="auto-focus-description"
                  checked={behaviorSettings.autoFocusFirstField}
                  id="auto-focus-toggle"
                  onCheckedChange={(checked) =>
                    handleBehaviorChange("autoFocusFirstField", checked)
                  }
                />
              </div>
            </div>

            <div
              aria-label="Form behavior actions"
              className="flex items-center justify-between"
              role="group"
            >
              <div className="flex items-center gap-2">
                {hasBehaviorChanges && (
                  <Button
                    className="gap-2 text-muted-foreground hover:text-foreground"
                    onClick={resetBehavior}
                    size="sm"
                    variant="ghost"
                  >
                    Reset
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {savedBehavior && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <div className="size-2 rounded-full bg-green-500" />
                    Saved
                  </div>
                )}
                <Button
                  aria-describedby="behavior-description"
                  aria-label="Save form behavior settings"
                  className="min-h-10"
                  disabled={savingBehavior || !hasBehaviorChanges}
                  loading={savingBehavior}
                  onClick={saveBehavior}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      saveBehavior();
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

interface BasicInfoFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isTextarea?: boolean;
  rows?: number;
  description?: string;
  required?: boolean;
}

function BasicInfoField({
  id,
  label,
  value,
  onChange,
  placeholder,
  isTextarea = false,
  rows = 3,
  description,
  required = false,
}: BasicInfoFieldProps) {
  const fieldId = `${id}-field`;
  const descriptionId = description ? `${id}-description` : undefined;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <div
      aria-labelledby={`${fieldId}-label`}
      className="flex flex-col gap-2"
      role="group"
    >
      <Label
        className="font-medium text-sm"
        htmlFor={fieldId}
        id={`${fieldId}-label`}
      >
        {label}
        {required && (
          <span aria-label="required" className="ml-1 text-destructive">
            *
          </span>
        )}
      </Label>
      {isTextarea ? (
        <Textarea
          aria-describedby={descriptionId}
          aria-invalid={required && !value}
          aria-required={required}
          autoComplete="off"
          className="resize-none text-base shadow-none focus:ring-2 focus:ring-ring focus:ring-offset-1 md:text-sm"
          id={fieldId}
          name={id}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          rows={rows}
          value={value}
        />
      ) : (
        <Input
          aria-describedby={descriptionId}
          aria-invalid={required && !value}
          aria-required={required}
          autoComplete={id.includes("url") ? "url" : "off"}
          className="text-base shadow-none focus:ring-2 focus:ring-ring focus:ring-offset-1 md:text-sm"
          id={fieldId}
          inputMode={id.includes("url") ? "url" : undefined}
          name={id}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          type={id.includes("url") ? "url" : "text"}
          value={value}
        />
      )}
      {description && (
        <p className="text-muted-foreground text-xs" id={descriptionId}>
          {description}
        </p>
      )}
      {required && !value && (
        <p className="text-destructive text-xs" role="alert">
          This field is required
        </p>
      )}
    </div>
  );
}
