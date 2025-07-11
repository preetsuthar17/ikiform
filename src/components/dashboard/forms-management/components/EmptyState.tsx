// Empty state component for forms management
import React from "react";

// UI Components
import { Card } from "@/components/ui/card";
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
import type { EmptyStateProps } from "../types";

interface EmptyStateExtendedProps extends EmptyStateProps {
  onCreateWithAI: () => void;
  onCreateManually: () => void;
}

export function EmptyState({
  onCreateForm,
  onCreateWithAI,
  onCreateManually,
}: EmptyStateExtendedProps) {
  return (
    <Card className="p-16 text-center rounded-card">
      <div className="max-w-md mx-auto flex flex-col gap-6">
        <div className="w-20 h-20 bg-accent rounded-card flex items-center justify-center mx-auto">
          <Plus className="w-10 h-10 text-accent-foreground" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-foreground">
            No forms yet
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Get started by creating your first form. It's quick and easy!
          </p>
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button onClick={onCreateForm}>
              <Plus className="w-5 h-5" />
              Create Your First Form
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
    </Card>
  );
}
