// External imports
import React from "react";

// Component imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { JsonViewModal } from "../../json-view-modal";
import { FormCreationWizard } from "../../form-creation-wizard";
import { FormSettingsModal } from "../../form-settings-modal";
import { ShareFormModal } from "../../share-form-modal";

// Type imports
import type { FormBuilderModalsProps } from "../types";

export const FormBuilderModals: React.FC<FormBuilderModalsProps> = ({
  showSettings,
  showFormSettings,
  showJsonView,
  showCreationWizard,
  showShareModal,
  formSchema,
  formId,
  isPublished,
  onCloseSettings,
  onCloseFormSettings,
  onCloseJsonView,
  onCloseCreationWizard,
  onCloseShareModal,
  onFormTypeSelect,
  onFormSettingsUpdate,
  onSchemaUpdate,
  onPublish,
}) => {
  return (
    <>
      {/* Form Settings Modal */}
      <Modal open={showSettings} onOpenChange={onCloseSettings}>
        <ModalContent className="bg-card text-card-foreground flex flex-col gap-6 max-sm:p-4">
          <ModalHeader>
            <ModalTitle>Form Settings</ModalTitle>
          </ModalHeader>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="form-title">Form Title</Label>
                <Input
                  id="form-title"
                  value={formSchema.settings.title}
                  onChange={(e) =>
                    onFormSettingsUpdate({ title: e.target.value })
                  }
                  placeholder="Enter form title"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="form-description">Description</Label>
                <Textarea
                  id="form-description"
                  value={formSchema.settings.description || ""}
                  onChange={(e) =>
                    onFormSettingsUpdate({ description: e.target.value })
                  }
                  placeholder="Enter form description"
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="submit-text">Submit Button Text</Label>
                <Input
                  id="submit-text"
                  value={formSchema.settings.submitText || "Submit"}
                  onChange={(e) =>
                    onFormSettingsUpdate({ submitText: e.target.value })
                  }
                  placeholder="Submit button text"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="success-message">Success Message</Label>
                <Textarea
                  id="success-message"
                  value={formSchema.settings.successMessage || ""}
                  onChange={(e) =>
                    onFormSettingsUpdate({ successMessage: e.target.value })
                  }
                  placeholder="Message shown after successful submission"
                  rows={2}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="redirect-url">Redirect URL (optional)</Label>
                <Input
                  id="redirect-url"
                  value={formSchema.settings.redirectUrl || ""}
                  onChange={(e) =>
                    onFormSettingsUpdate({ redirectUrl: e.target.value })
                  }
                  placeholder="https://example.com/thank-you"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={onCloseSettings}>
                Cancel
              </Button>
              <Button onClick={onCloseSettings}>Save Settings</Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Form Creation Wizard */}
      <FormCreationWizard
        isOpen={showCreationWizard}
        onClose={onCloseCreationWizard}
        onFormTypeSelect={onFormTypeSelect}
      />

      {/* JSON View Modal */}
      <JsonViewModal
        schema={formSchema}
        isOpen={showJsonView}
        onClose={onCloseJsonView}
      />

      {/* Form Settings Modal */}
      <FormSettingsModal
        isOpen={showFormSettings}
        onClose={onCloseFormSettings}
        schema={formSchema}
        onSchemaUpdate={onSchemaUpdate}
      />

      {/* Share Form Modal */}
      <ShareFormModal
        isOpen={showShareModal}
        onClose={onCloseShareModal}
        formId={formId ?? null}
        isPublished={isPublished}
        onPublish={onPublish}
      />
    </>
  );
};
