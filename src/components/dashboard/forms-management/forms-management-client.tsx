"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import type { Form } from "@/lib/database";
import { formsDb } from "@/lib/database";
import type { NormalizedImportedFormData } from "@/lib/forms/import-normalize";
import { ConfirmationModal } from "../modals/form-delete-confirmation-modal";
import { EmptyState, FormsHeader, FormsSearch, FormsView } from "./components";
import { DEFAULT_DELETE_MODAL_STATE } from "./constants";
import { SecureExportModal } from "./modals/secure-export-modal";
import { SecureImportModal } from "./modals/secure-import-modal";
import type { DeleteModalState, FormsManagementProps } from "./types";
import { copyToClipboard, generateShareUrl } from "./utils";

interface FormsManagementClientProps extends FormsManagementProps {
	initialForms: Form[];
	user: User;
}

function filterAndSortForms(
	forms: Form[],
	searchQuery: string,
	statusFilter: string,
	sortBy: string
): Form[] {
	let filtered = forms;

	if (searchQuery) {
		const query = searchQuery.toLowerCase();
		filtered = filtered.filter((form) => {
			const title = (
				form.schema?.settings?.title ||
				form.title ||
				""
			).toLowerCase();
			const description = (form.description || "").toLowerCase();
			const id = form.id.toLowerCase();
			return (
				title.includes(query) ||
				description.includes(query) ||
				id.includes(query)
			);
		});
	}

	if (statusFilter !== "all") {
		filtered = filtered.filter((form) => {
			if (statusFilter === "published") {
				return form.is_published;
			}
			if (statusFilter === "draft") {
				return !form.is_published;
			}
			return true;
		});
	}

	const sorted = [...filtered];
	sorted.sort((a, b) => {
		switch (sortBy) {
			case "title": {
				const aTitle = (a.schema?.settings?.title || a.title || "").toLowerCase();
				const bTitle = (b.schema?.settings?.title || b.title || "").toLowerCase();
				return aTitle.localeCompare(bTitle);
			}
			case "created": {
				const aCreated = new Date(a.created_at).getTime();
				const bCreated = new Date(b.created_at).getTime();
				if (isNaN(aCreated) && isNaN(bCreated)) {
					return 0;
				}
				if (isNaN(aCreated)) {
					return 1;
				}
				if (isNaN(bCreated)) {
					return -1;
				}
				return bCreated - aCreated;
			}
			case "updated":
			default: {
				const aUpdated = new Date(a.updated_at).getTime();
				const bUpdated = new Date(b.updated_at).getTime();
				if (isNaN(aUpdated) && isNaN(bUpdated)) {
					return 0;
				}
				if (isNaN(aUpdated)) {
					return 1;
				}
				if (isNaN(bUpdated)) {
					return -1;
				}
				return bUpdated - aUpdated;
			}
		}
	});

	return sorted;
}

function useFormsManagementController(initialForms: Form[], user: User) {
	const router = useRouter();
	const [formsOverride, setFormsOverride] = useState<Form[] | null>(null);
	const [deleteModal, setDeleteModal] = useState<DeleteModalState>(
		DEFAULT_DELETE_MODAL_STATE
	);
	const [showImportModal, setShowImportModal] = useState(false);
	const [showExportModal, setShowExportModal] = useState(false);
	const [exportTargetForm, setExportTargetForm] = useState<Form | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortBy, setSortBy] = useState("updated");
	const forms = formsOverride ?? initialForms;

	const loadForms = useCallback(async () => {
		try {
			const userForms = await formsDb.getUserForms(user.id);
			setFormsOverride(userForms);
		} catch (error) {
			console.error("Error loading forms:", error);
			toast.error("Failed to load forms");
		}
	}, [user.id]);

	const createNewForm = useCallback(() => {
		router.push("/ai-builder");
	}, [router]);

	const editForm = useCallback(
		(formId: string) => {
			router.push(`/form-builder/${formId}`);
		},
		[router]
	);

	const viewForm = useCallback((form: Form) => {
		const identifier = form.slug || form.id;
		window.open(`/f/${identifier}`, "_blank");
	}, []);

	const viewAnalytics = useCallback(
		(formId: string) => {
			router.push(`/dashboard/forms/${formId}/submissions`);
		},
		[router]
	);

	const shareForm = useCallback(
		async (form: Form) => {
			try {
				if (!form.is_published) {
					await formsDb.togglePublishForm(form.id, user.id, true);
					await loadForms();
				}

				const shareUrl = generateShareUrl(form);
				await copyToClipboard(shareUrl);
			} catch (error) {
				console.error("Error sharing form:", error);
				toast.error("Failed to share form");
			}
		},
		[user.id, loadForms]
	);

	const duplicateForm = useCallback(
		async (formId: string) => {
			try {
				const duplicated = await formsDb.duplicateForm(formId, user.id);
				toast.success("Form duplicated");
				router.push(`/form-builder/${duplicated.id}`);
			} catch (error) {
				console.error("Error duplicating form:", error);
				toast.error("Failed to duplicate form");
			}
		},
		[user.id, router]
	);

	const openSecureImportModal = useCallback(() => {
		setShowImportModal(true);
	}, []);

	const openSecureExportModal = useCallback((form: Form) => {
		setExportTargetForm(form);
		setShowExportModal(true);
	}, []);

	const closeSecureExportModal = useCallback(() => {
		setShowExportModal(false);
		setExportTargetForm(null);
	}, []);

	const closeSecureImportModal = useCallback(() => {
		setShowImportModal(false);
	}, []);

	const handleSecureImport = useCallback(
		async (importData: NormalizedImportedFormData) => {
			try {
				const createdForm = await formsDb.createForm(
					user.id,
					importData.title,
					importData.schema
				);

				if (importData.description) {
					await formsDb.updateForm(createdForm.id, user.id, {
						description: importData.description,
					});
				}

				toast.success("Form imported successfully.");
				router.push(`/form-builder/${createdForm.id}`);
			} catch (error) {
				console.error("Error importing form:", error);
				toast.error("Failed to import form.");
				throw error;
			}
		},
		[user.id, router]
	);

	const deleteForm = useCallback((formId: string, formTitle: string) => {
		setDeleteModal({
			open: true,
			formId,
			formTitle,
		});
	}, []);

	const confirmDeleteForm = useCallback(async () => {
		try {
			await formsDb.deleteForm(deleteModal.formId, user.id);
			setFormsOverride((prev) => {
				const source = prev ?? initialForms;
				return source.filter((f) => f.id !== deleteModal.formId);
			});
			toast.success("Form deleted successfully");
		} catch (error) {
			console.error("Error deleting form:", error);
			toast.error("Failed to delete form");
			await loadForms();
		}
	}, [deleteModal.formId, initialForms, user.id, loadForms]);

	const handleCreateWithAI = useCallback(() => {
		router.push("/ai-builder");
	}, [router]);

	const handleCreateManually = useCallback(() => {
		router.push("/form-builder");
	}, [router]);

	const filteredForms = useMemo(
		() => filterAndSortForms(forms, searchQuery, statusFilter, sortBy),
		[forms, searchQuery, statusFilter, sortBy]
	);

	const handleClearFilters = useCallback(() => {
		setSearchQuery("");
		setStatusFilter("all");
		setSortBy("updated");
	}, []);

	const handleDeleteModalChange = useCallback((open: boolean) => {
		setDeleteModal((prev) => ({ ...prev, open }));
	}, []);

	return {
		confirmDeleteForm,
		createNewForm,
		deleteForm,
		deleteModal,
		editForm,
		exportTargetForm,
		filteredForms,
		forms,
		handleClearFilters,
		handleCreateManually,
		handleCreateWithAI,
		handleDeleteModalChange,
		handleSecureImport,
		openSecureExportModal,
		openSecureImportModal,
		searchQuery,
		setSearchQuery,
		setSortBy,
		setStatusFilter,
		shareForm,
		showExportModal,
		showImportModal,
		sortBy,
		statusFilter,
		viewAnalytics,
		viewForm,
		duplicateForm,
		closeSecureExportModal,
		closeSecureImportModal,
	};
}

export function FormsManagementClient({
	className,
	initialForms,
	user,
}: FormsManagementClientProps) {
	const {
		confirmDeleteForm,
		createNewForm,
		deleteForm,
		deleteModal,
		editForm,
		exportTargetForm,
		filteredForms,
		forms,
		handleClearFilters,
		handleCreateManually,
		handleCreateWithAI,
		handleDeleteModalChange,
		handleSecureImport,
		openSecureExportModal,
		openSecureImportModal,
		searchQuery,
		setSearchQuery,
		setSortBy,
		setStatusFilter,
		shareForm,
		showExportModal,
		showImportModal,
		sortBy,
		statusFilter,
		viewAnalytics,
		viewForm,
		duplicateForm,
		closeSecureExportModal,
		closeSecureImportModal,
	} = useFormsManagementController(initialForms, user);

	const containerClassName = `flex flex-col gap-8 ${className || ""}`;

	return (
		<div
			aria-label="Forms management"
			className={containerClassName}
			role="main"
		>
			<FormsHeader
				onCreateForm={createNewForm}
				onCreateManually={handleCreateManually}
				onCreateWithAI={handleCreateWithAI}
				onImportSecure={openSecureImportModal}
			/>

			{forms.length === 0 ? (
				<EmptyState
					onCreateForm={createNewForm}
					onCreateManually={handleCreateManually}
					onCreateWithAI={handleCreateWithAI}
				/>
			) : (
				<>
					<FormsSearch
						onClearFilters={handleClearFilters}
						onSearchChange={setSearchQuery}
						onSortByChange={setSortBy}
						onStatusFilterChange={setStatusFilter}
						searchQuery={searchQuery}
						sortBy={sortBy}
						statusFilter={statusFilter}
					/>

					{filteredForms.length === 0 ? (
						<div aria-live="polite" className="py-12 text-center" role="status">
							<p className="text-muted-foreground">
								No forms match your search criteria.
							</p>
							<button
								aria-label="Clear all search filters"
								className="mt-2 text-primary hover:underline"
								onClick={handleClearFilters}
							>
								Clear filters
							</button>
						</div>
					) : (
						<FormsView
							forms={filteredForms}
							onDelete={deleteForm}
							onDuplicate={duplicateForm}
							onEdit={editForm}
							onExportSecure={openSecureExportModal}
							onShare={shareForm}
							onViewAnalytics={viewAnalytics}
							onViewForm={viewForm}
						/>
					)}
				</>
			)}

			<ConfirmationModal
				cancelText="Cancel"
				confirmText="Delete Form"
				description={`Are you sure you want to delete "${deleteModal.formTitle}"? This action cannot be undone and all form data will be permanently lost.`}
				onConfirm={confirmDeleteForm}
				onOpenChange={handleDeleteModalChange}
				open={deleteModal.open}
				title="Delete Form"
				variant="destructive"
			/>

			<SecureExportModal
				form={exportTargetForm}
				isOpen={showExportModal}
				onClose={closeSecureExportModal}
			/>

			<SecureImportModal
				isOpen={showImportModal}
				onClose={closeSecureImportModal}
				onImport={handleSecureImport}
			/>
		</div>
	);
}
