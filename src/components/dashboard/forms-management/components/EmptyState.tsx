import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
    <Card className="p-16 text-center shadow-none">
      <div className="mx-auto flex max-w-md flex-col gap-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-accent">
          <Plus
            aria-hidden="true"
            className="h-10 w-10 text-accent-foreground"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-foreground text-xl">
            No forms yet
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Get started by creating your first form. It's quick and easy!
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              aria-label="Create your first form"
              className="w-full sm:w-auto"
              onClick={onCreateForm}
            >
              <Plus aria-hidden="true" className="mr-2 h-5 w-5" />
              Create Your First Form
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>How would you like to create your form?</DialogTitle>
              <DialogDescription>
                Choose to build your form manually or let Kiko AI generate it
                for you.
              </DialogDescription>
            </DialogHeader>
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                onClick={onCreateWithAI}
                size="lg"
                variant="default"
              >
                <Sparkles aria-hidden="true" className="mr-2 h-4 w-4" />
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
      </div>
    </Card>
  );
}
