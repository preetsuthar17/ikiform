// External imports

// Icon imports
import { Check, Edit3, Eye, FileText, Layers } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// UI imports
import { Card } from '@/components/ui/card';
// Utility imports
import { createDefaultFormSchema } from '@/lib/forms';
// Component imports
import { FormPreview } from '../../form-preview';

// Type imports
import type { FormConfiguration } from '../types';

interface FormReviewStepProps {
  configuration: FormConfiguration;
  onEditStep: (step: 'type' | 'configure') => void;
}

export const FormReviewStep: React.FC<FormReviewStepProps> = ({
  configuration,
  onEditStep,
}) => {
  const isMultiStep = configuration.type === 'multi';
  const [showPreview, setShowPreview] = React.useState(false);

  const previewSchema = createDefaultFormSchema({
    title: configuration.title || 'Untitled Form',
    description: configuration.description || '',
    multiStep: isMultiStep,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {/* Form Type */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMultiStep ? (
                <Layers className="h-5 w-5 text-primary" />
              ) : (
                <FileText className="h-5 w-5 text-primary" />
              )}
              <div>
                <p className="font-medium">Form Type</p>
                <p className="text-muted-foreground text-sm">
                  {isMultiStep ? 'Multi-Step Form' : 'Single Page Form'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {isMultiStep ? 'Multi-Step' : 'Single Page'}
              </Badge>
              <Button
                onClick={() => onEditStep('type')}
                size={'icon'}
                title="Edit form type"
                variant={'secondary'}
              >
                <Edit3 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Form Configuration */}
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <p className="font-medium">Form Configuration</p>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <p className="font-medium text-sm">Title</p>
                  <p className="text-muted-foreground text-sm">
                    {configuration.title || 'Untitled Form'}
                  </p>
                </div>
                {configuration.description && (
                  <div>
                    <p className="font-medium text-sm">Description</p>
                    <p className="text-muted-foreground text-sm">
                      {configuration.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={() => onEditStep('configure')}
              size={'icon'}
              title="Edit form configuration"
              variant={'secondary'}
            >
              <Edit3 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Button>
          </div>
        </Card>

        {/* Preview Toggle */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Form Preview</p>
                <p className="text-muted-foreground text-sm">
                  See how your form will look
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowPreview(!showPreview)}
              size="sm"
              variant={showPreview ? 'secondary' : 'outline'}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Form Preview */}
      {showPreview && (
        <Card className="p-4">
          <div className="overflow-hidden rounded-card border">
            <FormPreview
              onFieldDelete={() => {}}
              onFieldSelect={() => {}}
              onFieldsReorder={() => {}}
              schema={previewSchema}
              selectedFieldId={null}
            />
          </div>
        </Card>
      )}
    </div>
  );
};
