import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { FormCreationWizard } from "../../form-creation-wizard";
import { FormSettingsModal } from "../../form-settings-modal";
import { JsonViewModal } from "../../json-view-modal";
import { ShareFormModal } from "../../share-form-modal";

import type { FormBuilderModalsProps } from "../types";

export const FormBuilderModals: React.FC<FormBuilderModalsProps> = ({
  showSettings,
  showFormSettings,
  showJsonView,
  showCreationWizard,
  showShareModal,
  formSchema,
  formId,
  formSlug,
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
  userEmail,
}) => (
  <>
    {}
    <Modal onOpenChange={onCloseSettings} open={showSettings}>
      <ModalContent className="flex flex-col gap-6 bg-card text-card-foreground max-sm:p-4">
        <ModalHeader>
          <ModalTitle>Form Settings</ModalTitle>
        </ModalHeader>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="form-title">Internal Title</Label>
              <Input
                id="form-title"
                onChange={(e) =>
                  onFormSettingsUpdate({ title: e.target.value })
                }
                placeholder="Enter internal title for your reference..."
                value={formSchema.settings?.title || ""}
              />
              <p className="text-muted-foreground text-xs">
                This title is only visible to you in the dashboard and form
                builder
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="form-public-title">Public Title</Label>
              <Input
                id="form-public-title"
                onChange={(e) =>
                  onFormSettingsUpdate({ publicTitle: e.target.value })
                }
                placeholder="Enter title to display to users..."
                value={formSchema.settings?.publicTitle || ""}
              />
              <p className="text-muted-foreground text-xs">
                This title will be displayed to users on the actual form. Leave
                empty to use the internal title.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="form-description">Description</Label>
              <Textarea
                id="form-description"
                onChange={(e) =>
                  onFormSettingsUpdate({ description: e.target.value })
                }
                placeholder="Enter form description"
                rows={3}
                value={formSchema.settings?.description || ""}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="submit-text">Submit Button Text</Label>
              <Input
                id="submit-text"
                onChange={(e) =>
                  onFormSettingsUpdate({ submitText: e.target.value })
                }
                placeholder="Submit button text"
                value={formSchema.settings?.submitText || "Submit"}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="success-message">Success Message</Label>
              <Textarea
                id="success-message"
                onChange={(e) =>
                  onFormSettingsUpdate({ successMessage: e.target.value })
                }
                placeholder="Message shown after successful submission"
                rows={2}
                value={formSchema.settings?.successMessage || ""}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="redirect-url">Redirect URL (optional)</Label>
              <Input
                id="redirect-url"
                onChange={(e) =>
                  onFormSettingsUpdate({ redirectUrl: e.target.value })
                }
                placeholder="https://example.com/thank-you"
                value={formSchema.settings?.redirectUrl || ""}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={onCloseSettings} variant="secondary">
              Cancel
            </Button>
            <Button onClick={onCloseSettings}>Save Settings</Button>
          </div>
        </div>
      </ModalContent>
    </Modal>

    {}
    <FormCreationWizard
      isOpen={showCreationWizard}
      onClose={onCloseCreationWizard}
      onFormTypeSelect={onFormTypeSelect}
    />

    {}
    <JsonViewModal
      isOpen={showJsonView}
      onClose={onCloseJsonView}
      schema={formSchema}
    />

    {}
    <FormSettingsModal
      formId={formId}
      isOpen={showFormSettings}
      onClose={onCloseFormSettings}
      onSchemaUpdate={onSchemaUpdate}
      schema={formSchema}
      userEmail={userEmail}
    />

    {}
    <ShareFormModal
      formId={formId ?? null}
      formSlug={formSlug ?? null}
      isOpen={showShareModal}
      isPublished={isPublished}
      onClose={onCloseShareModal}
      onPublish={onPublish}
    />
  </>
);
