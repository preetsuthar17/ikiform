import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";

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
    <Card className="rounded-2xl p-16 text-center">
      <div className="mx-auto flex max-w-md flex-col gap-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-accent">
          <Plus className="h-10 w-10 text-accent-foreground" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-foreground text-xl">
            No forms yet
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Get started by creating your first form. It's quick and easy!
          </p>
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button onClick={onCreateForm}>
              <Plus className="h-5 w-5" />
              Create Your First Form
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
    </Card>
  );
}
