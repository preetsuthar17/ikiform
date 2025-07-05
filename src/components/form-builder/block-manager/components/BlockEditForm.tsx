// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Icons
import { Check, X } from "lucide-react";

// Types
import type { BlockEditFormProps } from "../types";

export function BlockEditForm({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSave,
  onCancel,
}: BlockEditFormProps) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Step title"
        className="font-medium"
      />
      <Textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Step description (optional)"
        rows={2}
      />
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={onSave}>
          <Check className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
