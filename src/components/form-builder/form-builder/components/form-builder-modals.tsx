import type React from "react";
import { useTranslations } from "next-intl";

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
import { JsonViewModal } from "../../modals/json-view-modal";
import { ShareFormModal } from "../../modals/share-form-modal";

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
}) => {
	const t = useTranslations("product.formBuilder.modals");

	return (
		<>
			{}
			<Modal onOpenChange={onCloseSettings} open={showSettings}>
				<ModalContent className="flex flex-col gap-6 bg-card text-card-foreground max-sm:p-4">
					<ModalHeader>
						<ModalTitle>{t("formSettings")}</ModalTitle>
					</ModalHeader>
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-1">
								<Label htmlFor="form-title">{t("internalTitle")}</Label>
								<Input
									id="form-title"
									onChange={(e) =>
										onFormSettingsUpdate({ title: e.target.value })
									}
									placeholder={t("internalTitlePlaceholder")}
									value={formSchema.settings?.title || ""}
								/>
								<p className="text-muted-foreground text-xs">
									{t("internalTitleDescription")}
								</p>
							</div>

							<div className="flex flex-col gap-1">
								<Label htmlFor="form-public-title">{t("publicTitle")}</Label>
								<Input
									id="form-public-title"
									onChange={(e) =>
										onFormSettingsUpdate({ publicTitle: e.target.value })
									}
									placeholder={t("publicTitlePlaceholder")}
									value={formSchema.settings?.publicTitle || ""}
								/>
								<p className="text-muted-foreground text-xs">
									{t("publicTitleDescription")}
								</p>
							</div>

							<div className="flex flex-col gap-1">
								<Label htmlFor="form-description">{t("description")}</Label>
								<Textarea
									id="form-description"
									onChange={(e) =>
										onFormSettingsUpdate({ description: e.target.value })
									}
									placeholder={t("descriptionPlaceholder")}
									rows={3}
									value={formSchema.settings?.description || ""}
								/>
							</div>

							<div className="flex flex-col gap-1">
								<Label htmlFor="submit-text">{t("submitButtonText")}</Label>
								<Input
									id="submit-text"
									onChange={(e) =>
										onFormSettingsUpdate({ submitText: e.target.value })
									}
									placeholder={t("submitButtonTextPlaceholder")}
									value={formSchema.settings?.submitText || t("submit")}
								/>
							</div>

							<div className="flex flex-col gap-1">
								<Label htmlFor="success-message">{t("successMessage")}</Label>
								<Textarea
									id="success-message"
									onChange={(e) =>
										onFormSettingsUpdate({ successMessage: e.target.value })
									}
									placeholder={t("successMessagePlaceholder")}
									rows={2}
									value={formSchema.settings?.successMessage || ""}
								/>
							</div>

							<div className="flex flex-col gap-1">
								<Label htmlFor="redirect-url">{t("redirectUrlOptional")}</Label>
								<Input
									id="redirect-url"
									onChange={(e) =>
										onFormSettingsUpdate({ redirectUrl: e.target.value })
									}
									placeholder={t("redirectUrlPlaceholder")}
									value={formSchema.settings?.redirectUrl || ""}
								/>
							</div>
						</div>

						<div className="flex justify-end gap-2">
							<Button onClick={onCloseSettings} variant="secondary">
								{t("cancel")}
							</Button>
							<Button onClick={onCloseSettings}>{t("saveSettings")}</Button>
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
};
