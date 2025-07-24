import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
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
        type="button"
        onClick={() => setModalOpen(true)}
        disabled={disabled || !provider}
        className={`${baseClasses} bg-foreground/80 text-background hover:bg-foreground flex items-center justify-center w-fit text-sm h-8 px-4`}
      >
        {buttonText}
      </Button>
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent className="max-w-[95%] h-[95%] w-full flex flex-col gap-4">
          <ModalHeader>
            <ModalTitle>Scheduler</ModalTitle>
          </ModalHeader>
          <div className="h-full">
            {provider && link ? (
              <iframe
                src={link}
                title="Scheduler Embed"
                className="w-full h-full border-none rounded-ele"
                allow="camera; microphone; fullscreen"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
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
