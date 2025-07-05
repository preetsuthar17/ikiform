// External imports
import React from "react";

// Component imports
import { Button } from "@/components/ui/button";

// Icon imports
import { ArrowRight } from "lucide-react";

interface WizardActionsProps {
  onCancel: () => void;
  onContinue: () => void;
  canContinue: boolean;
}

export const WizardActions: React.FC<WizardActionsProps> = ({
  onCancel,
  onContinue,
  canContinue,
}) => {
  return (
    <div className="flex justify-end flex-wrap">
      <Button variant="outline" onClick={onCancel} className="flex-grow">
        Cancel
      </Button>
      <Button
        onClick={onContinue}
        disabled={!canContinue}
        className="flex-grow flex items-center gap-2"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
