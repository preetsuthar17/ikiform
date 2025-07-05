"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Save,
  Eye,
  Share,
  Settings as SettingsIcon,
  Globe,
  EyeOff,
  BarChart3,
  AlertTriangle,
  Code,
  Layers,
  FileText,
  Sparkles,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { JsonViewModal } from "./json-view-modal";
import { FormCreationWizard } from "./form-creation-wizard";
import { BlockManager } from "./block-manager";
import { FormSettingsModal } from "./form-settings-modal";
import { ShareFormModal } from "./share-form-modal";

import { formsDb } from "@/lib/database";
import type { FormField, FormSchema, FormBlock } from "@/lib/database";
import {
  createDefaultFormSchema,
  ensureDefaultRateLimitSettings,
} from "@/lib/forms";
import { Loader } from "../ui/loader";
import Link from "next/link";

interface FormBuilderProps {
  formId?: string;
}

export function FormBuilder({ formId }: FormBuilderProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showFormSettings, setShowFormSettings] = useState(false);
  const [showJsonView, setShowJsonView] = useState(false);
  const [showCreationWizard, setShowCreationWizard] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const [isNewForm, setIsNewForm] = useState(!formId);
  const [formSchema, setFormSchema] = useState<FormSchema>(() => {
    // For new forms, start with empty schema (wizard will populate it)
    if (!formId) {
      return createDefaultFormSchema({
        title: "Untitled Form",
        description: "",
        multiStep: false,
      });
    }

    // For existing forms, start with default schema until loaded
    return createDefaultFormSchema({
      title: "Untitled Form",
      description: "",
      multiStep: false,
    });
  });

  const draftKey = formId ? `form-draft-${formId}` : "form-draft-new";
  const isRestored = useRef(false);
  const isFormLoaded = useRef(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedSchemaRef = useRef<FormSchema | null>(null);
  const lastManuallySavedSchemaRef = useRef<FormSchema | null>(null);
  const importedFromAI = useRef(false);

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

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Show creation wizard for new forms (but NOT for AI-imported forms)
  useEffect(() => {
    if (isNewForm && !authLoading && user && !importedFromAI.current) {
      setShowCreationWizard(true);
    }
  }, [isNewForm, authLoading, user]);

  // Track unsaved changes
  useEffect(() => {
    if (!lastManuallySavedSchemaRef.current) {
      // No manually saved schema yet, check if we have changes from initial state
      const hasChanges =
        formSchema.fields.length > 0 ||
        (formSchema.blocks.length > 0 &&
          formSchema.blocks[0].fields.length > 0) ||
        formSchema.settings.title !== "Untitled Form" ||
        formSchema.settings.description !== "" ||
        formSchema.settings.submitText !== "Submit" ||
        formSchema.settings.successMessage !==
          "Thank you for your submission!" ||
        formSchema.settings.redirectUrl !== "";
      setHasUnsavedChanges(hasChanges);
      console.log("No manual save ref - hasChanges:", hasChanges);
    } else {
      // Compare with last manually saved schema
      const currentSchemaStr = JSON.stringify(formSchema);
      const savedSchemaStr = JSON.stringify(lastManuallySavedSchemaRef.current);
      const hasChanges = currentSchemaStr !== savedSchemaStr;
      setHasUnsavedChanges(hasChanges);
      console.log("Comparing schemas - hasChanges:", hasChanges, {
        currentLength: currentSchemaStr.length,
        savedLength: savedSchemaStr.length,
        equal: currentSchemaStr === savedSchemaStr,
      });
    }
  }, [formSchema]);

  useEffect(() => {
    const imported = localStorage.getItem("importedFormSchema");
    if (imported) {
      try {
        const schema = JSON.parse(imported);
        // Defensive: ensure all required fields exist and are correct type
        const normalizedSchema = {
          blocks: Array.isArray(schema.blocks) ? schema.blocks : [],
          fields: Array.isArray(schema.fields) ? schema.fields : [],
          settings:
            typeof schema.settings === "object" && schema.settings
              ? {
                  title: schema.settings.title || "Untitled Form",
                  description: schema.settings.description || "",
                  submitText: schema.settings.submitText || "Submit",
                  successMessage:
                    schema.settings.successMessage ||
                    "Thank you for your submission!",
                  redirectUrl: schema.settings.redirectUrl || "",
                  multiStep: !!schema.settings.multiStep,
                  showProgress:
                    "showProgress" in schema.settings
                      ? !!schema.settings.showProgress
                      : true,
                  // ...spread any other settings if needed
                  ...schema.settings,
                }
              : {
                  title: "Untitled Form",
                  description: "",
                  submitText: "Submit",
                  successMessage: "Thank you for your submission!",
                  redirectUrl: "",
                  multiStep: false,
                  showProgress: true,
                },
        };

        // Ensure default rate limiting settings are applied
        setFormSchema(ensureDefaultRateLimitSettings(normalizedSchema));
        setHasUnsavedChanges(true);
        importedFromAI.current = true;
      } catch {}
      localStorage.removeItem("importedFormSchema");
    }
  }, []);

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
      lastSavedSchemaRef.current = {
        ...form.schema,
        fields: [...form.schema.fields],
      }; // Track as saved with deep copy
      lastManuallySavedSchemaRef.current = {
        ...form.schema,
        fields: [...form.schema.fields],
      }; // Track as manually saved with deep copy
      console.log(
        "Loaded form, set manual save ref:",
        JSON.stringify(lastManuallySavedSchemaRef.current).length
      );
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

  const debouncedAutoSave = async (schema: FormSchema) => {
    if (!formId || !user || saving || autoSaving) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(async () => {
      setAutoSaving(true);
      try {
        await formsDb.updateForm(formId, { schema });
        lastSavedSchemaRef.current = schema; // Update saved schema reference
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setAutoSaving(false);
      }
    }, 1000); // Auto-save after 1 second of inactivity
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
      settings:
        fieldType === "slider"
          ? { min: 0, max: 100, step: 1, defaultValue: 50 }
          : fieldType === "tags"
          ? { maxTags: 10, allowDuplicates: false }
          : {},
    };

    setFormSchema((prev) => {
      // Find the target block (selected block or first block)
      const targetBlockId = selectedBlockId || prev.blocks[0]?.id;
      const updatedBlocks = prev.blocks.map((block) =>
        block.id === targetBlockId
          ? { ...block, fields: [...block.fields, newField] }
          : block
      );

      return {
        ...prev,
        blocks: updatedBlocks,
        // Also add to fields for backward compatibility
        fields: [...prev.fields, newField],
      };
    });

    setSelectedFieldId(newField.id);
  };

  const updateField = (updatedField: FormField) => {
    setFormSchema((prev) => {
      // Update in blocks
      const updatedBlocks = prev.blocks.map((block) => ({
        ...block,
        fields: block.fields.map((field) =>
          field.id === updatedField.id ? updatedField : field
        ),
      }));

      return {
        ...prev,
        blocks: updatedBlocks,
        // Also update in fields for backward compatibility
        fields: prev.fields.map((field) =>
          field.id === updatedField.id ? updatedField : field
        ),
      };
    });
  };

  const deleteField = (fieldId: string) => {
    setFormSchema((prev) => {
      // Remove from blocks
      const updatedBlocks = prev.blocks.map((block) => ({
        ...block,
        fields: block.fields.filter((field) => field.id !== fieldId),
      }));

      return {
        ...prev,
        blocks: updatedBlocks,
        // Also remove from fields for backward compatibility
        fields: prev.fields.filter((field) => field.id !== fieldId),
      };
    });

    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const reorderFields = (fields: FormField[]) => {
    setFormSchema((prev) => {
      // Update the first block with reordered fields
      const updatedBlocks = [...prev.blocks];
      if (updatedBlocks.length > 0) {
        updatedBlocks[0] = {
          ...updatedBlocks[0],
          fields,
        };
      }

      return {
        ...prev,
        blocks: updatedBlocks,
        // Also update fields for backward compatibility
        fields,
      };
    });
  };

  // Block management functions
  const addBlock = () => {
    const newBlock: FormBlock = {
      id: `step-${Date.now()}`,
      title: `Step ${formSchema.blocks.length + 1}`,
      description: "",
      fields: [],
    };

    setFormSchema((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
      settings: {
        ...prev.settings,
        multiStep: prev.blocks.length > 0, // Enable multi-step if adding to existing blocks
      },
    }));

    setSelectedBlockId(newBlock.id);
  };

  const updateBlocks = (blocks: FormBlock[]) => {
    setFormSchema((prev) => ({
      ...prev,
      blocks,
      // Update fields array with all fields from all blocks for backward compatibility
      fields: blocks.flatMap((block) => block.fields),
    }));
  };

  const updateBlock = (blockId: string, updates: Partial<FormBlock>) => {
    setFormSchema((prev) => {
      const updatedBlocks = prev.blocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      );

      return {
        ...prev,
        blocks: updatedBlocks,
        // Update fields array with all fields from all blocks for backward compatibility
        fields: updatedBlocks.flatMap((block) => block.fields),
      };
    });
  };

  const deleteBlock = (blockId: string) => {
    setFormSchema((prev) => {
      const updatedBlocks = prev.blocks.filter((block) => block.id !== blockId);

      return {
        ...prev,
        blocks: updatedBlocks,
        // Update fields array
        fields: updatedBlocks.flatMap((block) => block.fields),
        settings: {
          ...prev.settings,
          multiStep: updatedBlocks.length > 1,
        },
      };
    });

    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  const handleFormTypeSelect = (schema: FormSchema) => {
    setFormSchema(schema);
    setIsNewForm(false);
    if (schema.blocks.length > 0) {
      setSelectedBlockId(schema.blocks[0].id);
    }
  };

  const updateFormSettings = (settings: Partial<FormSchema["settings"]>) => {
    setFormSchema((prev) => {
      const newSchema = {
        ...prev,
        settings: { ...prev.settings, ...settings },
      };

      // Trigger auto-save for existing forms
      debouncedAutoSave(newSchema);

      return newSchema;
    });
  };

  const saveForm = async () => {
    if (!user) {
      toast.error("Please log in to save your form.");
      return;
    }
    setSaving(true);
    console.log(
      "Starting save, current schema:",
      JSON.stringify(formSchema).length
    );
    try {
      if (formId) {
        await formsDb.updateForm(formId, { schema: formSchema });
        lastSavedSchemaRef.current = formSchema; // Update saved schema reference
        lastManuallySavedSchemaRef.current = { ...formSchema }; // Update manually saved schema reference with deep copy
        console.log(
          "Updated manual save ref after save:",
          JSON.stringify(lastManuallySavedSchemaRef.current).length
        );
        toast.success("Form saved successfully!");
      } else {
        const newForm = await formsDb.createForm(
          user.id,
          formSchema.settings.title,
          formSchema
        );
        lastSavedSchemaRef.current = formSchema; // Update saved schema reference
        lastManuallySavedSchemaRef.current = { ...formSchema }; // Update manually saved schema reference with deep copy
        console.log(
          "Updated manual save ref after create:",
          JSON.stringify(lastManuallySavedSchemaRef.current).length
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

    const previewUrl = `/forms/${formId}/preview`;
    window.open(previewUrl, "_blank");

    // Show a helpful message
    toast.success("Opening form preview in new tab");
  };

  const shareForm = () => {
    if (!formId) {
      toast.error("Please save your form before sharing.");
      return;
    }
    setShowShareModal(true);
  };

  const handlePublishForm = async () => {
    if (!formId) return;

    try {
      await formsDb.togglePublishForm(formId, true);
      setIsPublished(true);
      toast.success("Form published successfully!");
    } catch (error) {
      console.error("Error publishing form:", error);
      toast.error("Failed to publish form. Please try again.");
      throw error;
    }
  };

  const viewAnalytics = () => {
    if (!formId) {
      toast.error("Please save your form before viewing analytics.");
      return;
    }
    toast.success("Redirecting to analytics page...");
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

  const handleStepSelection = (stepIndex: number) => {
    if (formSchema.blocks && formSchema.blocks[stepIndex]) {
      setSelectedBlockId(formSchema.blocks[stepIndex].id);
    }
  };

  const handleAIImport = (importedSchema: FormSchema) => {
    setFormSchema(importedSchema);
    setHasUnsavedChanges(true);

    // Select the first block if it exists
    if (importedSchema.blocks.length > 0) {
      setSelectedBlockId(importedSchema.blocks[0].id);
    }

    // Select the first field if it exists
    const firstField =
      importedSchema.blocks[0]?.fields[0] || importedSchema.fields[0];
    if (firstField) {
      setSelectedFieldId(firstField.id);
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
          <p className="text-muted-foreground mb-6">
            Please log in to use the form builder.
          </p>
          <Button onClick={() => router.push("/")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const selectedField = (() => {
    // Find field in blocks or fall back to fields array
    const allFields = formSchema.blocks?.length
      ? formSchema.blocks.flatMap((block) => block.fields)
      : formSchema.fields || [];
    return allFields.find((field) => field.id === selectedFieldId) || null;
  })();

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
            <div className="flex items-center space-x-3">
              <Button asChild variant={"secondary"} className="font-medium">
                <Link href="/dashboard" className="flex items-center z-1">
                  Go to Dashboard
                </Link>
              </Button>
              <div className="text-sm text-muted-foreground">
                {formSchema.fields.length} field
                {formSchema.fields.length !== 1 ? "s" : ""}
              </div>
              {autoSaving && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                  <span>Saving</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant={formSchema.settings.multiStep ? "default" : "secondary"}
              size="sm"
              onClick={() => {
                const newMultiStep = !formSchema.settings.multiStep;

                console.log("Mode toggle clicked:", {
                  currentMode: formSchema.settings.multiStep
                    ? "multi"
                    : "single",
                  newMode: newMultiStep ? "multi" : "single",
                  currentBlocks: formSchema.blocks.length,
                  currentSchemaFields: formSchema.fields.length,
                  blockFields: formSchema.blocks.map((b) => ({
                    id: b.id,
                    fieldCount: b.fields.length,
                  })),
                });

                if (newMultiStep) {
                  // Switching TO multi-step mode
                  if (
                    formSchema.blocks.length === 0 ||
                    (formSchema.blocks.length === 1 &&
                      formSchema.blocks[0].id === "default")
                  ) {
                    // Convert single-step to multi-step
                    // Get fields from the default block if it exists, otherwise from schema.fields
                    const defaultBlock = formSchema.blocks.find(
                      (b) => b.id === "default"
                    );
                    const currentFields =
                      defaultBlock?.fields || formSchema.fields || [];

                    console.log(
                      "Switching to multi-step mode. Current fields:",
                      currentFields
                    );

                    const newSchema = {
                      ...formSchema,
                      blocks: [
                        {
                          id: "step-1",
                          title: "Step 1",
                          description: "First step of your form",
                          fields: currentFields,
                        },
                      ],
                      fields: currentFields, // Keep schema-level fields in sync
                      settings: {
                        ...formSchema.settings,
                        multiStep: true,
                        showProgress: true,
                      },
                    };
                    setFormSchema(newSchema);
                    setSelectedBlockId("step-1");
                    setHasUnsavedChanges(true);
                  } else {
                    // Just enable multi-step mode
                    updateFormSettings({
                      multiStep: true,
                      showProgress: true,
                    });
                  }
                } else {
                  // Switching TO single-step mode
                  // Collect all fields from all blocks, preserving their current state
                  const allFields = formSchema.blocks.flatMap(
                    (block) => block.fields || []
                  );

                  console.log(
                    "Switching to single-step mode. Collected fields:",
                    allFields
                  );

                  const newSchema = {
                    ...formSchema,
                    blocks: [
                      {
                        id: "default",
                        title: "Form Fields",
                        description: "",
                        fields: allFields,
                      },
                    ],
                    fields: allFields, // Keep schema-level fields in sync
                    settings: {
                      ...formSchema.settings,
                      multiStep: false,
                      showProgress: false,
                    },
                  };
                  setFormSchema(newSchema);
                  setSelectedBlockId("default");
                  setHasUnsavedChanges(true);
                }
              }}
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
              {" "}
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="default" size={"sm"} asChild>
                    <Link href="/ai-builder">
                      <Sparkles className="w-4 h-4 shrink-0" /> Use Kiko
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent size="sm">AI Form builder</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="secondary"
                    size={"icon"}
                    onClick={() => setShowJsonView(true)}
                  >
                    <Code className="w-4 h-4 shrink-0 " />
                  </Button>
                </TooltipTrigger>
                <TooltipContent size="sm">View JSON</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="secondary"
                    size={"icon"}
                    onClick={previewForm}
                    disabled={!formId}
                  >
                    <Eye className="w-4 h-4 shrink-0 " />
                  </Button>
                </TooltipTrigger>
                <TooltipContent size="sm">Preview</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="secondary"
                    size={"icon"}
                    onClick={viewAnalytics}
                    disabled={!formId}
                  >
                    <BarChart3 className="w-4 h-4 shrink-0 " />
                  </Button>
                </TooltipTrigger>
                <TooltipContent size="sm">Analytics</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={shareForm}
                    disabled={!formId}
                  >
                    <Share className="w-4 h-4 shrink-0 " />
                  </Button>
                </TooltipTrigger>
                <TooltipContent size="sm">Share</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="secondary"
                    size={"icon"}
                    onClick={() => setShowFormSettings(true)}
                  >
                    <SettingsIcon className="w-4 h-4 shrink-0 " />
                  </Button>
                </TooltipTrigger>
                <TooltipContent size="sm">Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              onClick={togglePublish}
              variant="secondary"
              loading={publishing}
              disabled={!formId || publishing}
            >
              {isPublished ? (
                <>
                  {publishing ? <></> : <Globe className="w-4 h-4 shrink-0" />}
                  {publishing ? "Unpublishing" : "Published"}
                </>
              ) : (
                <>
                  {publishing ? <></> : <EyeOff className="w-4 h-4 shrink-0" />}
                  {publishing ? "Publishing" : "Publish"}
                </>
              )}
            </Button>

            <Button onClick={saveForm} disabled={saving} loading={saving}>
              {saving ? <></> : <Save className="w-4 h-4" />}
              {saving ? "Saving" : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Field Palette or Block Manager */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
            {formSchema.settings.multiStep ? (
              <BlockManager
                blocks={formSchema.blocks}
                selectedBlockId={selectedBlockId}
                selectedFieldId={selectedFieldId}
                onBlockSelect={setSelectedBlockId}
                onFieldSelect={setSelectedFieldId}
                onBlocksUpdate={updateBlocks}
                onBlockAdd={addBlock}
                onBlockDelete={deleteBlock}
                onFieldDelete={deleteField}
              />
            ) : (
              <FieldPalette onAddField={addField} />
            )}
          </ResizablePanel>

          <ResizableHandle />

          {/* Center Panel - Form Preview */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <ScrollArea className="h-full">
              <FormPreview
                schema={formSchema}
                selectedFieldId={selectedFieldId}
                selectedBlockId={selectedBlockId}
                onFieldSelect={setSelectedFieldId}
                onFieldsReorder={reorderFields}
                onFieldDelete={deleteField}
                onFormSettingsUpdate={updateFormSettings}
                onBlockUpdate={updateBlock}
                onStepSelect={handleStepSelection}
              />
            </ScrollArea>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel - Field Settings or Field Palette for multi-step */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
            {formSchema.settings.multiStep ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 min-h-0">
                  <FieldSettingsPanel
                    field={selectedField}
                    onFieldUpdate={updateField}
                    onClose={() => setSelectedFieldId(null)}
                  />
                </div>
                <div className="border-t bg-muted/30 flex-shrink-0">
                  <div className="p-2">
                    <h4 className="text-sm font-medium mb-2">Add Fields</h4>
                    <FieldPalette onAddField={addField} compact />
                  </div>
                </div>
              </div>
            ) : (
              <FieldSettingsPanel
                field={selectedField}
                onFieldUpdate={updateField}
                onClose={() => setSelectedFieldId(null)}
              />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Form Settings Modal */}
      <Modal open={showSettings} onOpenChange={setShowSettings}>
        <ModalContent className="bg-card text-card-foreground flex flex-col gap-6 max-sm:p-4">
          <ModalHeader>
            <ModalTitle>Form Settings</ModalTitle>
          </ModalHeader>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
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

              <div className="flex flex-col gap-1">
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

              <div className="flex flex-col gap-1">
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

              <div className="flex flex-col gap-1">
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

              <div className="flex flex-col gap-1">
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

            <div className="flex justify-end gap-2">
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

      {/* Unsaved Changes Indicator */}
      <AnimatePresence>
        {hasUnsavedChanges && !autoSaving && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.3,
            }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-accent border border-border text-accent-foreground px-4 py-2 shadow-lg flex items-center space-x-2 rounded-ele">
              <AlertTriangle className="w-4 h-4 text-accent-foreground/80" />
              <span className="text-sm font-medium">
                You have unsaved changes
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Creation Wizard */}
      <FormCreationWizard
        isOpen={showCreationWizard}
        onClose={() => setShowCreationWizard(false)}
        onFormTypeSelect={handleFormTypeSelect}
      />

      {/* JSON View Modal */}
      <JsonViewModal
        schema={formSchema}
        isOpen={showJsonView}
        onClose={() => setShowJsonView(false)}
      />

      {/* Form Settings Modal */}
      <FormSettingsModal
        isOpen={showFormSettings}
        onClose={() => setShowFormSettings(false)}
        schema={formSchema}
        onSchemaUpdate={(updates) => {
          setFormSchema((prev) => ({ ...prev, ...updates }));
          setHasUnsavedChanges(true);
        }}
      />

      {/* Share Form Modal */}
      <ShareFormModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        formId={formId ?? null}
        isPublished={isPublished}
        onPublish={handlePublishForm}
      />
    </div>
  );
}
