import { memo } from "react";
import type { Form } from "@/lib/database";
import { FormsList } from "./forms-list";

interface FormsViewProps {
	forms: Form[];
	onEdit: (formId: string) => void;
	onDuplicate: (formId: string) => void;
	onViewForm: (form: Form) => void;
	onViewAnalytics: (formId: string) => void;
	onShare: (form: Form) => void;
	onDelete: (formId: string, formTitle: string) => void;
}

export const FormsView = memo(function FormsView({
	forms,
	onEdit,
	onDuplicate,
	onViewForm,
	onViewAnalytics,
	onShare,
	onDelete,
}: FormsViewProps) {
	return (
		<div aria-label="Forms list" role="region">
			<FormsList
				forms={forms}
				onDelete={onDelete}
				onDuplicate={onDuplicate}
				onEdit={onEdit}
				onShare={onShare}
				onViewAnalytics={onViewAnalytics}
				onViewForm={onViewForm}
			/>
		</div>
	);
});
