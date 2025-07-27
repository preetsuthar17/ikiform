// External imports

// Icon imports
import { FileText, Info } from 'lucide-react';
import type React from 'react';
import { Card } from '@/components/ui/card';
// UI imports
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Type imports
import type { FormConfigurationStepProps } from '../types';

export const FormConfigurationStep: React.FC<FormConfigurationStepProps> = ({
  configuration,
  onConfigurationChange,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="form-title">Form Title *</Label>
            <Input
              className="w-full"
              id="form-title"
              onChange={(e) => onConfigurationChange({ title: e.target.value })}
              placeholder="Enter form title..."
              value={configuration.title}
            />
            <p className="text-muted-foreground text-xs">
              This will be displayed as the main heading of your form
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="form-description">Form Description</Label>
            <Textarea
              className="min-h-[100px] w-full"
              id="form-description"
              onChange={(e) =>
                onConfigurationChange({ description: e.target.value })
              }
              placeholder="Enter form description..."
              rows={4}
              value={configuration.description}
            />
            <p className="text-muted-foreground text-xs">
              Optional description to help users understand the form's purpose
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
