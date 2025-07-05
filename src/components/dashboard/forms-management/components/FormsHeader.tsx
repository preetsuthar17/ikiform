// Header component for forms management
import React from "react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalTrigger,
} from "@/components/ui/modal";

// Icons
import { Plus, Sparkles } from "lucide-react";

// Types
import type { FormHeaderProps } from "../types";

interface FormsHeaderProps extends FormHeaderProps {
  onCreateWithAI: () => void;
  onCreateManually: () => void;
}

export function FormsHeader({
  onCreateForm,
  onCreateWithAI,
  onCreateManually,
}: FormsHeaderProps) {
  return (
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
          <Button onClick={onCreateForm}>
            <Plus className="w-5 h-5" />
            Create New Form
          </Button>
        </ModalTrigger>
        <ModalContent className="flex flex-col items-start justify-start text-left gap-4">
          <ModalHeader className="text-left flex flex-col gap-2">
            <ModalTitle>How would you like to create your form?</ModalTitle>
            <ModalDescription asChild>
              <span>
                Choose to build your form manually or let Kiko AI generate it
                for you.
              </span>
            </ModalDescription>
          </ModalHeader>
          <div className="flex flex-wrap gap-2 w-full items-left justify-left">
            <Button
              size="lg"
              variant="default"
              onClick={onCreateWithAI}
              className="max-sm:grow"
            >
              <Sparkles /> Use Kiko AI
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={onCreateManually}
              className="max-sm:grow"
            >
              Create Manually
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
