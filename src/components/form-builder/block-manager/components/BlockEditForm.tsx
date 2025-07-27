// Components

// Icons
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Types
import type { BlockEditFormProps } from '../types';

export function BlockEditForm({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSave,
  onCancel,
}: BlockEditFormProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <Input
        className="font-medium"
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Step title"
        value={title}
      />
      <Textarea
        className="w-full"
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Step description (optional)"
        rows={2}
        value={description}
      />
      <div className="flex items-center gap-2">
        <Button onClick={onSave} size="icon">
          <Check className="h-4 w-4" />
        </Button>
        <Button onClick={onCancel} size="icon" variant="secondary">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
