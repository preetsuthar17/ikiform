// Individual form card component
import React from "react";

// UI Components
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Local Components
import { FormActions } from "./FormActions";
import { ShareFormModal } from "@/components/form-builder/share-form-modal";

// Utils
import { getTotalFields, formatDate } from "../utils";

// Types
import type { FormCardProps } from "../types";

export function FormCard({
  form,
  onEdit,
  onViewAnalytics,
  onShare,
  onDelete,
}: FormCardProps) {
  const totalFields = getTotalFields(form);
  const formattedDate = formatDate(form.updated_at);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  const handleShare = () => {
    setIsShareModalOpen(true);
    if (onShare) onShare(form);
  };

  return (
    <Card className="group p-6 bg-card border-border rounded-card cursor-pointer">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-lg leading-tight">
            {form.title}
          </h3>
          {form.description && (
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {form.description}
            </p>
          )}
        </div>
        <Badge
          variant={form.is_published ? "default" : "secondary"}
          className="flex-shrink-0 font-medium"
        >
          {form.is_published ? "Published" : "Draft"}
        </Badge>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-6 pt-2 border-t border-border/50">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-accent rounded-card"></span>
          {totalFields} field{totalFields !== 1 ? "s" : ""}
        </span>
        <span>Updated {formattedDate}</span>
      </div>

      {/* Action Buttons */}
      <FormActions
        form={form}
        onEdit={onEdit}
        onViewAnalytics={onViewAnalytics}
        onShare={handleShare}
        onDelete={onDelete}
      />
      <ShareFormModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        formId={form?.id || null}
        isPublished={!!form?.is_published}
        onPublish={async () => {
          // You may want to refetch or update form state after publish
          if (onShare) onShare(form);
        }}
      />
    </Card>
  );
}
