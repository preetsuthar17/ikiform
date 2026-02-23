import type { Form } from "@/lib/database";

export interface FormsManagementProps {
	className?: string;
}

export interface DeleteModalState {
	formId: string;
	formTitle: string;
	open: boolean;
}

export interface FormStatsProps {
	forms: Form[];
	loading?: boolean;
}

export interface FormsSidebarProps {
	forms: Form[];
	loading?: boolean;
}

export interface FormCardProps {
	form: Form;
	onDelete: (formId: string, formTitle: string) => void;
	onDuplicate: (formId: string) => void;
	onEdit: (formId: string) => void;
	onExportSecure: (form: Form) => void;
	onShare: (form: Form) => void;
	onViewAnalytics: (formId: string) => void;
	onViewForm: (form: Form) => void;
}

export interface FormHeaderProps {
	onCreateForm: () => void;
	onImportSecure?: () => void;
}

export interface EmptyStateProps {
	onCreateForm: () => void;
}

export interface AIFormSuggestionsProps {
	onCreateForm: (prompt: string) => void;
}

export interface FormActionsProps {
	form: Form;
	onDelete: (formId: string, formTitle: string) => void;
	onDuplicate: (formId: string) => void;
	onEdit: (formId: string) => void;
	onExportSecure: (form: Form) => void;
	onShare: (form: Form) => void;
	onViewAnalytics: (formId: string) => void;
	onViewForm: (form: Form) => void;
}

export interface CreateFormModalProps {
	isOpen: boolean;
	onAICreate: () => void;
	onClose: () => void;
	onManualCreate: () => void;
}

export interface LoadingSkeletonProps {
	className?: string;
}

export interface AISuggestion {
	prompt: string;
	summary: string;
	title: string;
}
