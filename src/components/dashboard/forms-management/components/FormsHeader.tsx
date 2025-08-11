import { Plus, Sparkles } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";

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
    <div className="flex flex-col justify-between gap-4 rounded-card border border-border bg-card p-6 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-2xl text-foreground tracking-tight">
          Your Forms
        </h2>
        <p className="text-muted-foreground">
          Create, manage, and analyze your forms with ease
        </p>
      </div>
      <Modal>
        <ModalTrigger asChild>
          <Button onClick={onCreateForm}>
            <Plus className="h-5 w-5" />
            Create New Form
          </Button>
        </ModalTrigger>
        <ModalContent className="flex flex-col items-start justify-start gap-4 text-left">
          <ModalHeader className="flex flex-col gap-2 text-left">
            <ModalTitle>How would you like to create your form?</ModalTitle>
            <ModalDescription asChild>
              <span>
                Choose to build your form manually or let Kiko AI generate it
                for you.
              </span>
            </ModalDescription>
          </ModalHeader>
          <div className="items-left justify-left flex w-full flex-wrap gap-2">
            <Button
              className="max-sm:grow"
              onClick={onCreateWithAI}
              size="lg"
              variant="default"
            >
              <Sparkles /> Use Kiko AI
            </Button>
            <Button
              className="max-sm:grow"
              onClick={onCreateManually}
              size="lg"
              variant="secondary"
            >
              Create Manually
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
