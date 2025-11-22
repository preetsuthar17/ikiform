export interface FormProgress {
	id: string;
	formId: string;
	userId?: string;
	sessionId: string;
	formData: Record<string, any>;
	currentStep: number;
	totalSteps: number;
	completionPercentage: number;
	lastUpdated: Date;
	expiresAt: Date;
}

export interface FormProgressState {
	progress: FormProgress | null;
	loading: boolean;
	saving: boolean;
	error: string | null;
}

export interface FormProgressActions {
	saveProgress: (
		formData: Record<string, any>,
		currentStep?: number,
	) => Promise<void>;
	loadProgress: () => Promise<void>;
	clearProgress: () => Promise<void>;
	restoreProgress: () => void;
}

export interface SaveProgressOptions {
	debounceMs?: number;
	maxRetries?: number;
	skipFields?: string[];
	enableAutoSave?: boolean;
}

export interface ProgressStorageAdapter {
	save: (key: string, data: FormProgress) => Promise<void>;
	load: (key: string) => Promise<FormProgress | null>;
	delete: (key: string) => Promise<void>;
	clear: () => Promise<void>;
}

export interface FormProgressConfig {
	enabled: boolean;
	storage: "localStorage" | "sessionStorage" | "indexedDB" | "server";
	autoSaveInterval: number;
	retentionDays: number;
	compressionEnabled: boolean;
	encryptionEnabled: boolean;
}
