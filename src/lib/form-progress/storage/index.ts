import type {
	FormProgress,
	FormProgressConfig,
	ProgressStorageAdapter,
} from "../types";
import {
	LocalStorageAdapter,
	ServerStorageAdapter,
	SessionStorageAdapter,
} from "./adapters";

export class FormProgressStorage {
	private adapter: ProgressStorageAdapter;
	private config: FormProgressConfig;

	constructor(config: FormProgressConfig) {
		this.config = config;
		this.adapter = this.createAdapter(config.storage);
	}

	private createAdapter(
		storageType: FormProgressConfig["storage"],
	): ProgressStorageAdapter {
		switch (storageType) {
			case "localStorage":
				return new LocalStorageAdapter();
			case "sessionStorage":
				return new SessionStorageAdapter();
			case "server":
				return new ServerStorageAdapter();
			case "indexedDB":
				throw new Error("IndexedDB adapter not yet implemented");
			default:
				return new LocalStorageAdapter();
		}
	}

	private generateKey(formId: string, sessionId: string): string {
		return `${formId}_${sessionId}`;
	}

	public generateSessionId(): string {
		return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	public calculateCompletionPercentage(
		formData: Record<string, any>,
		totalFields: number,
	): number {
		if (totalFields === 0) return 0;

		const filledFields = Object.values(formData).filter((value) => {
			if (value === null || value === undefined || value === "") return false;
			if (Array.isArray(value) && value.length === 0) return false;
			return true;
		}).length;

		return Math.round((filledFields / totalFields) * 100);
	}

	public createProgress(
		formId: string,
		sessionId: string,
		formData: Record<string, any>,
		currentStep = 0,
		totalSteps = 1,
		userId?: string,
	): FormProgress {
		const now = new Date();
		const expiresAt = new Date(
			now.getTime() + this.config.retentionDays * 24 * 60 * 60 * 1000,
		);

		const totalFields = Object.keys(formData).length;
		const completionPercentage = this.calculateCompletionPercentage(
			formData,
			totalFields,
		);

		return {
			id: this.generateKey(formId, sessionId),
			formId,
			userId,
			sessionId,
			formData,
			currentStep,
			totalSteps,
			completionPercentage,
			lastUpdated: now,
			expiresAt,
		};
	}

	async saveProgress(progress: FormProgress): Promise<void> {
		if (!this.config.enabled) return;

		try {
			const key = this.generateKey(progress.formId, progress.sessionId);
			await this.adapter.save(key, progress);
		} catch (error) {
			console.error("Failed to save form progress:", error);
			throw error;
		}
	}

	async loadProgress(
		formId: string,
		sessionId: string,
	): Promise<FormProgress | null> {
		if (!this.config.enabled) return null;

		try {
			const key = this.generateKey(formId, sessionId);
			return await this.adapter.load(key);
		} catch (error) {
			console.error("Failed to load form progress:", error);
			return null;
		}
	}

	async deleteProgress(formId: string, sessionId: string): Promise<void> {
		try {
			const key = this.generateKey(formId, sessionId);
			await this.adapter.delete(key);
		} catch (error) {
			console.error("Failed to delete form progress:", error);
			throw error;
		}
	}

	async clearAllProgress(): Promise<void> {
		try {
			await this.adapter.clear();
		} catch (error) {
			console.error("Failed to clear all form progress:", error);
			throw error;
		}
	}

	updateConfig(newConfig: Partial<FormProgressConfig>): void {
		this.config = { ...this.config, ...newConfig };
		if (newConfig.storage) {
			this.adapter = this.createAdapter(newConfig.storage);
		}
	}
}
