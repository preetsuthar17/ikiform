"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Eye,
  Share,
  Settings as SettingsIcon,
  Globe,
  EyeOff,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { FieldPalette } from "./field-palette";
import { FormPreview } from "./form-preview";
import { FieldSettingsPanel } from "./field-settings-panel";
import { formsDb } from "@/lib/database";
import type { FormField, FormSchema } from "@/lib/database.types";
import { Loader } from "../ui/loader";

interface FormBuilderProps {
  formId?: string;
}

export function FormBuilder({ formId }: FormBuilderProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [formSchema, setFormSchema] = useState<FormSchema>({
    fields: [],
    settings: {
      title: "Untitled Form",
      description: "",
      submitText: "Submit",
      successMessage: "Thank you for your submission!",
      redirectUrl: "",
    },
  });

  const draftKey = formId ? `form-draft-${formId}` : "form-draft-new";
  const isRestored = useRef(false);
  const isFormLoaded = useRef(false);

  // Restore draft on mount (only once)
  useEffect(() => {
    if (isRestored.current) return;
    isRestored.current = true;
    const draft =
      typeof window !== "undefined" ? localStorage.getItem(draftKey) : null;
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (
          parsed &&
          typeof parsed === "object" &&
          parsed.fields &&
          parsed.settings
        ) {
          setFormSchema(parsed);
        }
      } catch {}
    }
  }, [draftKey]);

  // Save draft on formSchema change
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(draftKey, JSON.stringify(formSchema));
  }, [formSchema, draftKey]);

  // Load existing form if formId is provided (only once)
  useEffect(() => {
    if (formId && user && !isFormLoaded.current) {
      loadForm();
    }
  }, [formId, user]);

  // Reset form loaded flag when formId changes
  useEffect(() => {
    isFormLoaded.current = false;
  }, [formId]);

  const loadForm = async () => {
    if (!formId || !user || isFormLoaded.current) return;

    setLoading(true);
    try {
      const form = await formsDb.getForm(formId);
      if (form.user_id !== user.id) {
        toast.error("You do not have permission to edit this form.");
        router.push("/dashboard");
        return;
      }
      setFormSchema(form.schema);
      setIsPublished(form.is_published);
      isFormLoaded.current = true; // Mark as loaded

      // Clear any existing draft for this form since we loaded from database
      if (typeof window !== "undefined") {
        localStorage.removeItem(draftKey);
      }
    } catch (error) {
      console.error("Error loading form:", error);
      toast.error("Failed to load form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateFieldId = () => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addField = (fieldType: FormField["type"]) => {
    const newField: FormField = {
      id: generateFieldId(),
      type: fieldType,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: "",
      required: false,
      options: ["select", "radio", "checkbox"].includes(fieldType)
        ? ["Option 1", "Option 2"]
        : undefined,
      validation: {},
      settings: fieldType === "slider" 
        ? { min: 0, max: 100, step: 1, defaultValue: 50 }
        : fieldType === "tags"
        ? { maxTags: 10, allowDuplicates: false }
        : {},
    };

    setFormSchema((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));

    setSelectedFieldId(newField.id);
  };

  const updateField = (updatedField: FormField) => {
    setFormSchema((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      ),
    }));
  };

  const deleteField = (fieldId: string) => {
    setFormSchema((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== fieldId),
    }));

    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const reorderFields = (fields: FormField[]) => {
    setFormSchema((prev) => ({
      ...prev,
      fields,
    }));
  };

  const updateFormSettings = (settings: Partial<FormSchema["settings"]>) => {
    setFormSchema((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  };

  const saveForm = async () => {
    if (!user) {
      toast.error("Please log in to save your form.");
      return;
    }
    setSaving(true);
    try {
      if (formId) {
        await formsDb.updateForm(formId, { schema: formSchema });
        toast.success("Form saved successfully!");
      } else {
        const newForm = await formsDb.createForm(
          user.id,
          formSchema.settings.title,
          formSchema
        );
        // Reset the form loaded flag since we're navigating to a new form
        isFormLoaded.current = false;
        router.push(`/form-builder/${newForm.id}`);
        toast.success("Form created successfully!");
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem(draftKey);
      }
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("Failed to save form. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const previewForm = () => {
    if (!formId) {
      toast.error("Please save your form before previewing.");
      return;
    }
    window.open(`/forms/${formId}/preview`, "_blank");
  };

  const shareForm = async () => {
    if (!formId) {
      toast.error("Please save your form before sharing.");
      return;
    }

    try {
      await formsDb.togglePublishForm(formId, true);
      setIsPublished(true);
      const shareUrl = `${window.location.origin}/forms/${formId}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Form published and link copied to clipboard!");
    } catch (error) {
      console.error("Error sharing form:", error);
      toast.error("Failed to publish form. Please try again.");
    }
  };

  const viewAnalytics = () => {
    if (!formId) {
      toast.error("Please save your form before viewing analytics.");
      return;
    }
    router.push(`/dashboard/forms/${formId}/analytics`);
  };

  const togglePublish = async () => {
    if (!formId) {
      toast.error("Please save your form before publishing.");
      return;
    }

    setPublishing(true);
    try {
      const newPublishState = !isPublished;
      await formsDb.togglePublishForm(formId, newPublishState);
      setIsPublished(newPublishState);

      if (newPublishState) {
        toast.success("Form published successfully!");
      } else {
        toast.success("Form unpublished successfully!");
      }
    } catch (error) {
      console.error("Error toggling publish state:", error);
      toast.error("Failed to update form status. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center ">
        <div className="text-center space-y-3">
          <Loader />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to use the form builder.
          </p>
          <Button onClick={() => router.push("/auth")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const selectedField =
    formSchema.fields.find((field) => field.id === selectedFieldId) || null;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="bg-card border-b border-border px-6 py-4 flex-shrink-0 z-20"
        style={{ height: "81px" }}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <h1
              className="text-xl font-semibold text-foreground opacity-0 absolute"
              aria-hidden="true"
            >
              Form Builder
            </h1>
            <div className="text-sm text-muted-foreground">
              {formSchema.fields.length} field
              {formSchema.fields.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="secondary" onClick={() => setShowSettings(true)}>
              <SettingsIcon className="w-4 h-4 " />
              Settings
            </Button>

            <Button
              variant="secondary"
              onClick={previewForm}
              disabled={!formId}
            >
              <Eye className="w-4 h-4 " />
              Preview
            </Button>

            <Button
              variant="secondary"
              onClick={viewAnalytics}
              disabled={!formId}
            >
              <BarChart3 className="w-4 h-4 " />
              Analytics
            </Button>

            <Button
              variant={isPublished ? "default" : "outline"}
              onClick={togglePublish}
              disabled={!formId || publishing}
            >
              {isPublished ? (
                <>
                  <Globe className="w-4 h-4 " />
                  {publishing ? "Unpublishing..." : "Published"}
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 " />
                  {publishing ? "Publishing..." : "Publish"}
                </>
              )}
            </Button>

            <Button variant="secondary" onClick={shareForm} disabled={!formId}>
              <Share className="w-4 h-4 " />
              Share
            </Button>

            <Button onClick={saveForm} disabled={saving}>
              <Save className="w-4 h-4 " />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Field Palette - Resizable */}
          <ResizablePanel defaultSize={15} minSize={15} maxSize={35}>
            <FieldPalette onAddField={addField} />
          </ResizablePanel>

          <ResizableHandle />

          {/* Center Panel - Form Preview - Resizable */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <ScrollArea className="h-full">
              <FormPreview
                schema={formSchema}
                selectedFieldId={selectedFieldId}
                onFieldSelect={setSelectedFieldId}
                onFieldsReorder={reorderFields}
                onFieldDelete={deleteField}
              />
            </ScrollArea>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel - Field Settings - Resizable */}
          <ResizablePanel defaultSize={15} minSize={15} maxSize={35}>
            <FieldSettingsPanel
              field={selectedField}
              onFieldUpdate={updateField}
              onClose={() => setSelectedFieldId(null)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Form Settings Modal */}
      <Modal open={showSettings} onOpenChange={setShowSettings}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Form Settings</ModalTitle>
          </ModalHeader>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="form-title">Form Title</Label>
                <Input
                  id="form-title"
                  value={formSchema.settings.title}
                  onChange={(e) =>
                    updateFormSettings({ title: e.target.value })
                  }
                  placeholder="Enter form title"
                />
              </div>

              <div>
                <Label htmlFor="form-description">Description</Label>
                <Textarea
                  id="form-description"
                  value={formSchema.settings.description || ""}
                  onChange={(e) =>
                    updateFormSettings({ description: e.target.value })
                  }
                  placeholder="Enter form description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="submit-text">Submit Button Text</Label>
                <Input
                  id="submit-text"
                  value={formSchema.settings.submitText || "Submit"}
                  onChange={(e) =>
                    updateFormSettings({ submitText: e.target.value })
                  }
                  placeholder="Submit button text"
                />
              </div>

              <div>
                <Label htmlFor="success-message">Success Message</Label>
                <Textarea
                  id="success-message"
                  value={formSchema.settings.successMessage || ""}
                  onChange={(e) =>
                    updateFormSettings({ successMessage: e.target.value })
                  }
                  placeholder="Message shown after successful submission"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="redirect-url">Redirect URL (optional)</Label>
                <Input
                  id="redirect-url"
                  value={formSchema.settings.redirectUrl || ""}
                  onChange={(e) =>
                    updateFormSettings({ redirectUrl: e.target.value })
                  }
                  placeholder="https://example.com/thank-you"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setShowSettings(false)}>
                Save Settings
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
