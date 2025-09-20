import React from "react";
import { ShareFormModal } from "@/components/form-builder/share-form-modal";
import { Separator } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getInternalFormTitle } from "@/lib/utils/form-utils";
import type { FormCardProps } from "../types";
import { formatDate, getTotalFields } from "../utils";
import { FormActions } from "./FormActions";

export function FormCard({
  form,
  onEdit,
  onDuplicate,
  onViewForm,
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

  const handleCardClick = () => {
    onViewAnalytics(form.id);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const internalTitle =
    form.schema?.settings?.title || form.title || "Untitled Form";
  const hasPublicTitle =
    form.schema?.settings?.publicTitle &&
    form.schema.settings.publicTitle !== form.schema?.settings?.title;

  return (
    <Card
      className="group flex cursor-pointer flex-col gap-4 rounded-4xl border-none bg-card p-6 md:p-8"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h3 className="line-clamp-2 font-semibold text-foreground text-lg leading-tight">
              {internalTitle}
            </h3>
            {hasPublicTitle && (
              <p className="line-clamp-1 text-muted-foreground text-sm">
                Public: "{form.schema?.settings?.publicTitle}"
              </p>
            )}
            {form.description && (
              <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
                {form.description}
              </p>
            )}
          </div>
          <Badge
            className="flex-shrink-0 rounded-lg font-medium"
            variant={form.is_published ? "default" : "secondary"}
          >
            {form.is_published ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>
      <Separator />
      <div className="flex items-center justify-between text-muted-foreground text-sm">
        <span>Updated {formattedDate}</span>
      </div>
      <div onClick={handleButtonClick}>
        <FormActions
          form={form}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onEdit={onEdit}
          onShare={handleShare}
          onViewAnalytics={onViewAnalytics}
          onViewForm={onViewForm}
        />
      </div>
      <ShareFormModal
        formId={form?.id || null}
        formSlug={form?.slug || null}
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
