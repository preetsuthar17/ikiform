"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Share,
  Copy,
  BarChart3,
  Sparkle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationModal } from "./form-delete-confirmation-modal";
import { useAuth } from "@/hooks/use-auth";
import { formsDb } from "@/lib/database";
import { toast } from "@/hooks/use-toast";
import type { Form } from "@/lib/database";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
  ModalTrigger,
} from "@/components/ui/modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function FormsManagement() {
  const router = useRouter();
  const { user } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    formId: string;
    formTitle: string;
  }>({
    open: false,
    formId: "",
    formTitle: "",
  });
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadForms();
    }
  }, [user]);

  const loadForms = async () => {
    if (!user) return;

    try {
      const userForms = await formsDb.getUserForms(user.id);
      setForms(userForms);
    } catch (error) {
      console.error("Error loading forms:", error);
      toast.error("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  const createNewForm = () => {
    setShowChoiceModal(true);
  };

  const editForm = (formId: string) => {
    router.push(`/form-builder/${formId}`);
  };

  const viewForm = (formId: string) => {
    window.open(`/forms/${formId}`, "_blank");
  };

  const previewForm = (formId: string) => {
    window.open(`/forms/${formId}/preview`, "_blank");
  };

  const viewAnalytics = (formId: string) => {
    router.push(`/dashboard/forms/${formId}/analytics`);
  };

  const shareForm = async (form: Form) => {
    try {
      if (!form.is_published) {
        await formsDb.togglePublishForm(form.id, true);
        await loadForms(); // Refresh the forms list
      }

      const shareUrl = `${window.location.origin}/forms/${form.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Form link copied to clipboard!");
    } catch (error) {
      console.error("Error sharing form:", error);
      toast.error("Failed to share form");
    }
  };

  const deleteForm = async (formId: string, formTitle: string) => {
    setDeleteModal({
      open: true,
      formId,
      formTitle,
    });
  };

  const confirmDeleteForm = async () => {
    try {
      await formsDb.deleteForm(deleteModal.formId);
      await loadForms(); // Refresh the forms list
      toast.success("Form deleted successfully");
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error("Failed to delete form");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card border border-border rounded-card">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-72" />
          </div>
          <Skeleton className="h-11 w-full sm:w-40" />
        </div>

        {/* Stats Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 bg-card border-border rounded-ele">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-7 w-8" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Forms Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 bg-card border-border rounded-card">
              {/* Card Header Skeleton */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-6 w-16  rounded-full" />
              </div>

              {/* Metadata Skeleton */}
              <div className="flex items-center justify-between text-sm mb-6 pt-2 border-t border-border/50">
                <div className="flex items-center gap-1">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, btnIndex) => (
                  <Skeleton key={btnIndex} className="h-9 w-9 rounded-md" />
                ))}
                <div className="flex-1"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card border border-border rounded-card">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">
              Your Forms
            </h2>
            <p className="text-muted-foreground">
              Create, manage, and analyze your forms with ease
            </p>
          </div>
          <Modal>
            <ModalTrigger asChild>
              <Button onClick={createNewForm}>
                <Plus className="w-5 h-5" />
                Create New Form
              </Button>
            </ModalTrigger>
            <ModalContent className="flex flex-col items-start justify-start text-left gap-4">
              <ModalHeader className="text-left flex flex-col gap-2">
                <ModalTitle>How would you like to create your form?</ModalTitle>
                <ModalDescription asChild>
                  <span>
                    Choose to build your form manually or let Kiko AI generate
                    it for you.
                  </span>
                </ModalDescription>
              </ModalHeader>
              <div className="flex flex-wrap gap-2 w-full items-left justify-left">
                <Button
                  size="lg"
                  variant="default"
                  onClick={() => {
                    setShowChoiceModal(false);
                    router.push("/ai-builder");
                  }}
                  className="max-sm:grow"
                >
                  <Sparkles /> Use Kiko AI
                </Button>{" "}
                <Button
                  size="lg"
                  variant={"secondary"}
                  onClick={() => {
                    setShowChoiceModal(false);
                    router.push("/form-builder");
                  }}
                  className="max-sm:grow"
                >
                  Create Manually
                </Button>
              </div>
            </ModalContent>
          </Modal>
        </div>

        {/* Quick Stats */}
        {forms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 bg-card border-border rounded-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {forms.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Forms</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-card border-border rounded-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {forms.filter((f) => f.is_published).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Published</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-card border-border rounded-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <Edit className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {forms.filter((f) => !f.is_published).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Drafts</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* AI Form Suggestions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Kiko AI
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              {
                title: "Contact Form",
                prompt:
                  "Create a contact form with name, email, phone number, and message fields",
              },
              {
                title: "Customer Feedback",
                prompt:
                  "Create a customer feedback form with rating stars, satisfaction level, and comments",
              },
              {
                title: "Event Registration",
                prompt:
                  "Create an event registration form with participant name, email, phone, dietary preferences, and emergency contact",
              },
              {
                title: "Job Application",
                prompt:
                  "Create a job application form with personal details, work experience, education, skills, and resume upload",
              },
              {
                title: "Survey Form",
                prompt:
                  "Create a survey form with multiple choice questions, rating scales, and text responses",
              },
              {
                title: "Order Form",
                prompt:
                  "Create an order form with product selection, quantity, customer details, and payment information",
              },
            ].map((suggestion, index) => (
              <Card
                key={index}
                className="p-4 bg-card border-border rounded-card "
              >
                <div className="space-y-3 flex flex-col items-start text-left">
                  <p className="font-medium text-muted-foreground">
                    {suggestion.prompt}
                  </p>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-fit "
                    onClick={() => {
                      const encodedPrompt = encodeURIComponent(
                        suggestion.prompt
                      );
                      router.push(
                        `/ai-builder?prompt=${encodedPrompt}&sent=true`
                      );
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Create Form
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Forms Grid */}
        {forms.length === 0 ? (
          <Card className="p-16 text-center rounded-card ">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto">
                <Plus className="w-10 h-10 text-accent-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  No forms yet
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get started by creating your first form. It's quick and easy!
                </p>
              </div>{" "}
              <Modal>
                <ModalTrigger asChild>
                  <Button onClick={createNewForm}>
                    <Plus className="w-5 h-5" />
                    Create Your First Form
                  </Button>
                </ModalTrigger>
                <ModalContent className="flex flex-col items-start justify-start text-left gap-4">
                  <ModalHeader className="text-left flex flex-col gap-2">
                    <ModalTitle>
                      How would you like to create your form?
                    </ModalTitle>
                    <ModalDescription asChild>
                      <span>
                        Choose to build your form manually or let Kiko AI
                        generate it for you.
                      </span>
                    </ModalDescription>
                  </ModalHeader>
                  <div className="flex flex-wrap gap-2 w-full items-left justify-left">
                    <Button
                      size="lg"
                      variant="default"
                      onClick={() => {
                        setShowChoiceModal(false);
                        router.push("/ai-builder");
                      }}
                      className="max-sm:grow"
                    >
                      <Sparkles /> Use Kiko AI
                    </Button>{" "}
                    <Button
                      size="lg"
                      variant={"secondary"}
                      onClick={() => {
                        setShowChoiceModal(false);
                        router.push("/form-builder");
                      }}
                      className="max-sm:grow"
                    >
                      Create Manually
                    </Button>
                  </div>
                </ModalContent>
              </Modal>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card
                key={form.id}
                className="group p-6 bg-card border-border rounded-card "
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-lg leading-tight">
                      {form.title}
                    </h3>
                    {form.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                        {form.description}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={form.is_published ? "default" : "secondary"}
                    className=" flex-shrink-0 font-medium"
                  >
                    {form.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>

                {/* Card Metadata */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-6 pt-2 border-t border-border/50">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    {form.schema.fields.length} field
                    {form.schema.fields.length !== 1 ? "s" : ""}
                  </span>
                  <span>Updated {formatDate(form.updated_at)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => editForm(form.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent size={"sm"}>Edit form</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => previewForm(form.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent size={"sm"}>Preview form</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => viewAnalytics(form.id)}
                        >
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent size={"sm"}>
                        View analytics
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => shareForm(form)}
                        >
                          <Share className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent size={"sm"}>Share form</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="flex-1"></div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => deleteForm(form.id, form.title)}
                          className="h-9 w-9 p-0 hov"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent size={"sm"}>Delete form</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
          title="Delete Form"
          description={`Are you sure you want to delete "${deleteModal.formTitle}"? This action cannot be undone and all form data will be permanently lost.`}
          confirmText="Delete Form"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={confirmDeleteForm}
        />
      </div>
    </>
  );
}
