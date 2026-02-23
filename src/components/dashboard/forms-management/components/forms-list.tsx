import {
  BarChart3,
  Code2,
  Copy,
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Share,
  Trash2,
} from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { ShareFormModal } from "@/components/form-builder/modals/share-form-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Form } from "@/lib/database";
import { formatDate } from "../utils";

interface FormsListProps {
  forms: Form[];
  onDelete: (formId: string, formTitle: string) => void;
  onDuplicate: (formId: string) => void;
  onEdit: (formId: string) => void;
  onExportSecure: (form: Form) => void;
  onShare: (form: Form) => void;
  onViewAnalytics: (formId: string) => void;
  onViewForm: (form: Form) => void;
}

export const FormsList = memo(function FormsList({
  forms,
  onEdit,
  onDuplicate,
  onViewForm,
  onViewAnalytics,
  onShare,
  onExportSecure,
  onDelete,
}: FormsListProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const [modalJustClosed, setModalJustClosed] = useState<{
    [key: string]: boolean;
  }>({});

  const handleCardClick = useCallback(
    (e: React.MouseEvent, formId: string) => {
      if (
        shareModalOpen[formId] ||
        modalJustClosed[formId] ||
        (e.target as HTMLElement).closest('[role="dialog"]')
      ) {
        return;
      }
      onViewAnalytics(formId);
    },
    [shareModalOpen, modalJustClosed, onViewAnalytics],
  );

  const handleEdit = useCallback(
    (e: React.MouseEvent, formId: string) => {
      e.stopPropagation();
      onEdit(formId);
    },
    [onEdit],
  );

  const handleShare = useCallback(
    (e: React.MouseEvent, form: Form) => {
      e.stopPropagation();
      setShareModalOpen((prev) => ({
        ...prev,
        [form.id]: true,
      }));
      if (onShare) {
        onShare(form);
      }
    },
    [onShare],
  );

  const handleDuplicate = useCallback(
    (e: React.MouseEvent, formId: string) => {
      e.stopPropagation();
      onDuplicate(formId);
    },
    [onDuplicate],
  );

  const handleViewForm = useCallback(
    (e: React.MouseEvent, form: Form) => {
      e.stopPropagation();
      onViewForm(form);
    },
    [onViewForm],
  );

  const handleViewAnalytics = useCallback(
    (e: React.MouseEvent, formId: string) => {
      e.stopPropagation();
      onViewAnalytics(formId);
    },
    [onViewAnalytics],
  );

  const handleEmbed = useCallback((e: React.MouseEvent, formId: string) => {
    e.stopPropagation();
    window.open(`/embed?formid=${formId}`, "_blank");
  }, []);

  const handleExportSecure = useCallback(
    (e: React.MouseEvent, form: Form) => {
      e.stopPropagation();
      onExportSecure(form);
    },
    [onExportSecure],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent, formId: string, formTitle: string) => {
      e.stopPropagation();
      onDelete(formId, formTitle);
    },
    [onDelete],
  );

  const handleModalClose = useCallback((formId: string) => {
    setShareModalOpen((prev) => ({ ...prev, [formId]: false }));
    setModalJustClosed((prev) => ({ ...prev, [formId]: true }));
    setTimeout(
      () => setModalJustClosed((prev) => ({ ...prev, [formId]: false })),
      100,
    );
  }, []);

  const handleModalPublish = useCallback(
    (form: Form): Promise<void> => {
      if (onShare) {
        onShare(form);
      }
      return Promise.resolve();
    },
    [onShare],
  );

  const formCards = useMemo(
    () =>
      forms.map((form, idx) => {
        const internalTitle =
          form.schema?.settings?.title || form.title || "Untitled Form";
        const hasPublicTitle =
          form.schema?.settings?.publicTitle &&
          form.schema.settings.publicTitle !== form.schema?.settings?.title;

        let cardClass =
          "group flex cursor-pointer flex-col gap-4 shadow-none p-6 hover:bg-accent/50 relative";

        if (forms.length === 1) {
          cardClass += " rounded-lg";
        } else if (idx === 0) {
          cardClass += " rounded-t-lg rounded-b-none border-b-0";
        } else if (idx === forms.length - 1) {
          cardClass += " rounded-b-lg rounded-t-none border-b";
        } else {
          cardClass += " rounded-none border-b-0";
        }

        let dynamicClasses = "";

        const nextCardShouldRemoveBorderT =
          hoveredIdx !== null && idx > 0 && hoveredIdx === idx - 1;

        const isHovered = hoveredIdx === idx;

        if (forms.length > 1 && idx === forms.length - 1 && isHovered) {
          dynamicClasses +=
            " border border-primary/30 z-10 rounded-b-xl rounded-t-none";
        } else if (isHovered && idx !== forms.length - 1) {
          dynamicClasses += " border-b border-primary/30 z-10";
        }

        if (
          hoveredIdx !== null &&
          idx === forms.length - 2 &&
          hoveredIdx === forms.length - 1
        ) {
          dynamicClasses += " !border-b-0";
        }

        if (nextCardShouldRemoveBorderT) {
          dynamicClasses += " !border-t-0";
        }

        return (
          <Card
            aria-label={`View analytics for ${internalTitle}`}
            className={`${cardClass}${dynamicClasses ? " " + dynamicClasses : ""}`}
            key={form.id}
            onBlur={() => setHoveredIdx(null)}
            onClick={(e) => handleCardClick(e, form.id)}
            onFocus={() => setHoveredIdx(idx)}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold text-foreground">
                      {internalTitle}
                    </h3>
                    <Badge
                      aria-label={`Form status: ${form.is_published ? "Published" : "Draft"}`}
                      variant={form.is_published ? "outline" : "pending"}
                    >
                      {form.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  {hasPublicTitle && (
                    <p className="truncate text-muted-foreground text-sm">
                      Public: "{form.schema?.settings?.publicTitle}"
                    </p>
                  )}
                  {form.description && (
                    <p className="truncate text-muted-foreground text-sm">
                      {form.description}
                    </p>
                  )}
                  <p className="mt-1 text-muted-foreground text-xs">
                    Updated {formatDate(form.updated_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider delayDuration={200}>
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-label={`Actions for ${internalTitle}`}
                            className="size-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                            size="sm"
                            variant="outline"
                          >
                            <MoreHorizontal
                              aria-hidden="true"
                              className="size-4"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={8}>
                        <p>Form actions</p>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="end" className="w-48 shadow-xs">
                      <DropdownMenuItem
                        className="h-9 cursor-pointer font-medium opacity-80 hover:opacity-100"
                        onClick={(e) => handleEdit(e, form.id)}
                      >
                        <Edit aria-hidden="true" className="size-4" />
                        Edit form
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="h-9 cursor-pointer font-medium opacity-80 hover:opacity-100"
                        onClick={(e) => handleShare(e, form)}
                      >
                        <Share aria-hidden="true" className="size-4" />
                        Share form
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="h-9 cursor-pointer font-medium opacity-80 hover:opacity-100"
                        onClick={(e) => handleDuplicate(e, form.id)}
                      >
                        <Copy aria-hidden="true" className="size-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="h-9 cursor-pointer font-medium opacity-80 hover:opacity-100"
                        onClick={(e) => handleViewForm(e, form)}
                      >
                        <Eye aria-hidden="true" className="size-4" />
                        View form
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="h-9 cursor-pointer font-medium opacity-80 hover:opacity-100"
                        onClick={(e) => handleViewAnalytics(e, form.id)}
                      >
                        <BarChart3 aria-hidden="true" className="size-4" />
                        View analytics
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="h-9 cursor-pointer font-medium opacity-80 hover:opacity-100"
                        onClick={(e) => handleEmbed(e, form.id)}
                      >
                        <Code2 aria-hidden="true" className="size-4" />
                        Embed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="h-9 cursor-pointer font-medium opacity-80 hover:opacity-100"
                        onClick={(e) => handleExportSecure(e, form)}
                      >
                        <Download aria-hidden="true" className="size-4" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="h-9 cursor-pointer font-medium opacity-80 hover:opacity-100"
                        onClick={(e) => handleDelete(e, form.id, form.title)}
                        variant="destructive"
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                        Delete form
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipProvider>
              </div>
            </div>
          </Card>
        );
      }),
    [
      forms,
      hoveredIdx,
      shareModalOpen,
      modalJustClosed,
      handleCardClick,
      handleEdit,
      handleShare,
      handleDuplicate,
      handleViewForm,
      handleViewAnalytics,
      handleEmbed,
      handleExportSecure,
      handleDelete,
    ],
  );

  const shareModals = useMemo(
    () =>
      forms.map((form) => (
        <ShareFormModal
          formId={form.id}
          formSlug={form.slug}
          isOpen={shareModalOpen[form.id]}
          isPublished={!!form.is_published}
          key={`share-${form.id}`}
          onClose={() => handleModalClose(form.id)}
          onPublish={() => handleModalPublish(form)}
        />
      )),
    [forms, shareModalOpen, handleModalClose, handleModalPublish],
  );

  return (
    <>
      <div
        aria-label="Forms list"
        className="relative flex flex-col"
        role="list"
      >
        {formCards}
      </div>

      {shareModals}
    </>
  );
});
