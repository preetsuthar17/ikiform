import { memo } from "react";
import type { Form } from "@/lib/database";
import { FormsList } from "./forms-list";

interface FormsViewProps {
	forms: Form[];
	onDelete: (formId: string, formTitle: string) => void;
	onDuplicate: (formId: string) => void;
	onEdit: (formId: string) => void;
	onExportSecure: (form: Form) => void;
	onShare: (form: Form) => void;
	onViewAnalytics: (formId: string) => void;
	onViewForm: (form: Form) => void;
}

export const FormsView = memo(function FormsView({
	forms,
	onEdit,
	onDuplicate,
	onViewForm,
	onViewAnalytics,
	onShare,
	onExportSecure,
	onDelete,
}: FormsViewProps) {
	return (
		<section aria-label="Forms list">
			<FormsList
				forms={forms}
				onDelete={onDelete}
				onDuplicate={onDuplicate}
				onEdit={onEdit}
				onExportSecure={onExportSecure}
				onShare={onShare}
				onViewAnalytics={onViewAnalytics}
				onViewForm={onViewForm}
			/>
		</section>
	);
});
