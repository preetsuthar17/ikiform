import { Plus, Sparkles } from "lucide-react";
import { Card } from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { FormHeaderProps } from "../types";

interface FormsHeaderProps extends FormHeaderProps {
  onCreateWithAI: () => void;
  onCreateManually: () => void;
}

export function FormsHeader({
  onCreateWithAI,
  onCreateManually,
}: FormsHeaderProps) {
  return (
    <Card className="flex flex-col justify-between gap-4 p-6 shadow-none sm:flex-row sm:items-center md:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-2xl text-foreground tracking-tight">
          Your Forms
        </h2>
        <p className="text-muted-foreground">
          Create, manage, and analyze your forms with ease
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            aria-label="Create new form"
            className="flex h-10 w-fit items-center gap-2 whitespace-nowrap font-medium"
            variant="default"
          >
            <Plus aria-hidden="true" className="size-5" />
            Create New Form
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How would you like to create your form?</DialogTitle>
            <DialogDescription>
              Choose to build your form manually or let Kiko AI generate it for
              you.
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button
              className="flex-1"
              onClick={onCreateWithAI}
              size="lg"
              variant="default"
            >
              <Sparkles aria-hidden="true" className="mr-2 size-4" />
              Use Kiko AI
            </Button>
            <Button
              className="flex-1"
              onClick={onCreateManually}
              size="lg"
              variant="secondary"
            >
              Create Manually
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
