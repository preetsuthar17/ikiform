import React from 'react';
import { ShareFormModal } from '@/components/form-builder/share-form-modal';
import { Badge } from '@/components/ui/badge';

import { Card } from '@/components/ui/card';

import type { FormCardProps } from '../types';

import { formatDate, getTotalFields } from '../utils';

import { FormActions } from './FormActions';

export function FormCard({
  form,
  onEdit,
  onViewAnalytics,
  onShare,
  onDelete,
}: FormCardProps) {
  const formattedDate = formatDate(form.updated_at);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  const handleShare = () => {
    setIsShareModalOpen(true);
    if (onShare) onShare(form);
  };

  return (
    <Card className="group cursor-pointer rounded-card border-border bg-card p-6">
      {}
      <div className="mb-4 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="mb-2 line-clamp-2 font-semibold text-foreground text-lg leading-tight">
            {form.title}
          </h3>
          {form.description && (
            <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
              {form.description}
            </p>
          )}
        </div>
        <Badge
          className="flex-shrink-0 font-medium"
          variant={form.is_published ? 'default' : 'secondary'}
        >
          {form.is_published ? 'Published' : 'Draft'}
        </Badge>
      </div>

      {}
      <div className="mb-6 flex items-center justify-between border-border/50 border-t pt-2 text-muted-foreground text-sm">
        <span>Updated {formattedDate}</span>
      </div>

      {}
      <FormActions
        form={form}
        onDelete={onDelete}
        onEdit={onEdit}
        onShare={handleShare}
        onViewAnalytics={onViewAnalytics}
      />
      <ShareFormModal
        formId={form?.id || null}
        isOpen={isShareModalOpen}
        isPublished={!!form?.is_published}
        onClose={() => setIsShareModalOpen(false)}
        onPublish={async () => {
          if (onShare) onShare(form);
        }}
      />
    </Card>
  );
}
