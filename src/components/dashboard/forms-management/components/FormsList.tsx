import {
  BarChart3,
  Code2,
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  Share,
  Trash2,
} from "lucide-react";
import React from "react";
import { ShareFormModal } from "@/components/form-builder/share-form-modal";
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
  onEdit: (formId: string) => void;
  onDuplicate: (formId: string) => void;
  onViewForm: (form: Form) => void;
  onViewAnalytics: (formId: string) => void;
  onShare: (form: Form) => void;
  onDelete: (formId: string, formTitle: string) => void;
}

export function FormsList({
  forms,
  onEdit,
  onDuplicate,
  onViewForm,
  onViewAnalytics,
  onShare,
  onDelete,
}: FormsListProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const [shareModalOpen, setShareModalOpen] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [modalJustClosed, setModalJustClosed] = React.useState<{
    [key: string]: boolean;
  }>({});

  return (
    <>
      <div className="relative flex flex-col">
        {forms.map((form, idx) => {
          const internalTitle =
            form.schema?.settings?.title || form.title || "Untitled Form";
          const hasPublicTitle =
            form.schema?.settings?.publicTitle &&
            form.schema.settings.publicTitle !== form.schema?.settings?.title;

          let cardClass =
            "group flex cursor-pointer flex-col gap-4 shadow-none p-6 hover:bg-accent/50 relative";

          // Border logic defaults
          if (forms.length === 1) {
            // Single card: keep full border radius and all borders
            cardClass += " rounded-xl";
          } else if (idx === 0) {
            cardClass += " rounded-t-xl rounded-b-none border-b-0";
          } else if (idx === forms.length - 1) {
            cardClass += " rounded-b-xl rounded-t-none border-b";
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
              className={`${cardClass}${dynamicClasses ? " " + dynamicClasses : ""}`}
              key={form.id}
              onBlur={() => setHoveredIdx(null)}
              onClick={(e) => {
                // Prevent card click if modal is open, just closed, or if click originated from modal
                if (
                  shareModalOpen[form.id] ||
                  modalJustClosed[form.id] ||
                  (e.target as HTMLElement).closest('[role="dialog"]')
                ) {
                  return;
                }
                onViewAnalytics(form.id);
              }}
              onFocus={() => setHoveredIdx(idx)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
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
                              aria-label="Form actions"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                              size="sm"
                              variant="outline"
                            >
                              <MoreHorizontal
                                aria-hidden="true"
                                className="h-4 w-4"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={8}>
                          <p>Form actions</p>
                        </TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 shadow-xs"
                      >
                        <DropdownMenuItem
                          className="h-9 cursor-pointer font-medium opacity-80 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(form.id);
                          }}
                        >
                          <Edit aria-hidden="true" className="size-4" />
                          Edit form
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="h-9 cursor-pointer font-medium opacity-80 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShareModalOpen((prev) => ({
                              ...prev,
                              [form.id]: true,
                            }));
                            if (onShare) onShare(form);
                          }}
                        >
                          <Share aria-hidden="true" className="size-4" />
                          Share form
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="h-9 cursor-pointer font-medium opacity-80 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate(form.id);
                          }}
                        >
                          <Copy aria-hidden="true" className="size-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="h-9 cursor-pointer font-medium opacity-80 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewForm(form);
                          }}
                        >
                          <Eye aria-hidden="true" className="size-4" />
                          View form
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="h-9 cursor-pointer font-medium opacity-80 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewAnalytics(form.id);
                          }}
                        >
                          <BarChart3 aria-hidden="true" className="size-4" />
                          View analytics
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="h-9 cursor-pointer font-medium opacity-80 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/embed?formid=${form.id}`, "_blank");
                          }}
                        >
                          <Code2 aria-hidden="true" className="size-4" />
                          Embed
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="h-9 cursor-pointer font-medium opacity-80 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(form.id, form.title);
                          }}
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
        })}
      </div>

      {forms.map((form) => (
        <ShareFormModal
          formId={form.id}
          formSlug={form.slug}
          isOpen={shareModalOpen[form.id]}
          isPublished={!!form.is_published}
          key={`share-${form.id}`}
          onClose={() => {
            setShareModalOpen((prev) => ({ ...prev, [form.id]: false }));
            setModalJustClosed((prev) => ({ ...prev, [form.id]: true }));
            setTimeout(
              () =>
                setModalJustClosed((prev) => ({ ...prev, [form.id]: false })),
              100
            );
          }}
          onPublish={async () => {
            if (onShare) onShare(form);
          }}
        />
      ))}
    </>
  );
}
