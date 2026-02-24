"use client";

import { Download, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { SecureExportModal } from "@/components/dashboard/forms-management/modals/secure-export-modal";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { formsDb, type Form } from "@/lib/database";
import {
  FormSettingsDesktopLayout,
  FormSettingsMobileLayout,
} from "./components";
import { useFormSettings } from "./hooks";
import type { FormSettingsModalProps, FormSettingsSection } from "./types";

export function FormSettingsModal({
  isOpen,
  onClose,
  schema,
  onSchemaUpdate,
  userEmail,
  formId,
}: FormSettingsModalProps) {
  const t = useTranslations("product.formBuilder.formSettings");
  const {
    localSettings,
    updateSettings,
    updateRateLimit,
    updateDuplicatePrevention,
    updateProfanityFilter,
    updateBotProtection,
    updateResponseLimit,
    updatePasswordProtection,
    updateSocialMedia,
    updateNotifications,
    updateApi,
    resetSettings,
  } = useFormSettings(schema, userEmail);

  const [activeSection, setActiveSection] =
    useState<FormSettingsSection>("basic");
  const [showSecureExportModal, setShowSecureExportModal] = useState(false);
  const [secureExportForm, setSecureExportForm] = useState<Form | null>(null);
  const [loadingExportForm, setLoadingExportForm] = useState(false);
  const { user } = useAuth();

  const handleOpenSecureExport = useCallback(async () => {
    if (!(formId && user)) {
      toast.error(t("saveFormFirstExport"));
      return;
    }

    setLoadingExportForm(true);
    try {
      const form = await formsDb.getForm(formId, user.id);
      setSecureExportForm(form);
      setShowSecureExportModal(true);
    } catch (error) {
      console.error("Failed to prepare secure export:", error);
      toast.error(t("exportPrepareFailed"));
    } finally {
      setLoadingExportForm(false);
    }
  }, [formId, user, t]);

  const sectionProps = {
    localSettings,
    updateSettings,
    updateRateLimit,
    updateDuplicatePrevention,
    updateProfanityFilter,
    updateBotProtection,
    updateResponseLimit,
    updatePasswordProtection,
    updateSocialMedia,
    updateNotifications,
    updateApi,
    formId,
    schema,
    onSchemaUpdate,
  };

  return (
    <>
      <Dialog onOpenChange={onClose} open={isOpen}>
        <DialogContent className="b-5 flex h-[90vh] w-full grow flex-col gap-0 overflow-hidden p-0 sm:max-w-6xl">
          <DialogHeader className="flex shrink-0 flex-row items-center justify-between gap-6 p-4">
            <div className="flex items-center gap-3">
              <Settings className="size-5 text-primary" />
              <DialogTitle className="font-semibold text-xl">
                {t("title")}
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="mb-12 min-h-0 p-4 md:mb-0">
            {formId || (onSchemaUpdate && onSchemaUpdate !== undefined) ? (
              <>
                <FormSettingsDesktopLayout
                  activeSection={activeSection}
                  onClose={onClose}
                  onSectionChange={setActiveSection}
                  sectionProps={sectionProps}
                />
                <FormSettingsMobileLayout
                  activeSection={activeSection}
                  onClose={onClose}
                  onSectionChange={setActiveSection}
                  sectionProps={sectionProps}
                />
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <p className="text-muted-foreground">
                  {t("saveFormFirstAccess")}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <SecureExportModal
        form={secureExportForm}
        isOpen={showSecureExportModal}
        onClose={() => {
          setShowSecureExportModal(false);
          setSecureExportForm(null);
        }}
      />
    </>
  );
}
