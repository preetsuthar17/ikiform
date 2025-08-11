import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import type { BaseFieldProps } from "../types";
import { getBaseClasses } from "../utils";

export function SchedulerField({ field, error, disabled }: BaseFieldProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const provider = field.settings?.schedulerProvider;
  const link = provider ? field.settings?.schedulerLinks?.[provider] : "";
  const buttonText = field.settings?.schedulerButtonText || "Open Scheduler";
  const baseClasses = getBaseClasses(field, error);

  return (
    <div className="flex flex-col gap-2">
      <Button
        className={`${baseClasses} flex h-9 w-fit items-center justify-center bg-foreground/80 px-4 text-background text-sm hover:bg-foreground`}
        disabled={disabled || !provider}
        onClick={() => setModalOpen(true)}
        type="button"
      >
        {buttonText}
      </Button>
      <Modal onOpenChange={setModalOpen} open={modalOpen}>
        <ModalContent className="flex h-[95%] w-full max-w-[95%] flex-col gap-4">
          <ModalHeader>
            <ModalTitle>Scheduler</ModalTitle>
          </ModalHeader>
          <div className="h-full">
            {provider && link ? (
              <iframe
                allow="camera; microphone; fullscreen"
                className="h-full w-full rounded-ele border-none"
                src={link}
                title="Scheduler Embed"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No scheduler link configured.
              </div>
            )}
          </div>
          <ModalFooter>
            <Button onClick={() => setModalOpen(false)} variant="outline">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
