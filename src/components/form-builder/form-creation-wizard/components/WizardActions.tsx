import { ArrowRight } from "lucide-react";
import type React from "react";

import { Button } from "@/components/ui/button";

interface WizardActionsProps {
  onCancel: () => void;
  onContinue: () => void;
  canContinue: boolean;
}

export const WizardActions: React.FC<WizardActionsProps> = ({
  onCancel,
  onContinue,
  canContinue,
}) => (
  <div className="flex flex-wrap justify-end">
    <Button className="flex-grow" onClick={onCancel} variant="outline">
      Cancel
    </Button>
    <Button
      className="flex flex-grow items-center gap-2"
      disabled={!canContinue}
      onClick={onContinue}
    >
      Continue
      <ArrowRight className="h-4 w-4" />
    </Button>
  </div>
);
