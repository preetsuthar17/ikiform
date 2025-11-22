import { Filter } from "bad-words";

export interface ProfanityFilterOptions {
	enabled?: boolean;
	strictMode?: boolean;
	replaceWithAsterisks?: boolean;
	customWords?: string[];
	customMessage?: string;
	whitelistedWords?: string[];
}

export interface ProfanityCheckResult {
	hasBeenFiltered: boolean;
	cleanedText?: string;
	originalText: string;
	filteredWords: string[];
	message?: string;
}

export class ProfanityFilterService {
	private filter: Filter;
	private options: ProfanityFilterOptions;

	constructor(options: ProfanityFilterOptions = {}) {
		this.options = {
			enabled: false,
			strictMode: true,
			replaceWithAsterisks: false,
			customWords: [],
			customMessage:
				"Your submission contains inappropriate content. Please review and resubmit.",
			whitelistedWords: [],
			...options,
		};

		this.filter = new Filter();

		if (this.options.customWords && this.options.customWords.length > 0) {
			this.filter.addWords(...this.options.customWords);
		}

		if (
			this.options.whitelistedWords &&
			this.options.whitelistedWords.length > 0
		) {
			this.filter.removeWords(...this.options.whitelistedWords);
		}
	}

	isProfane(text: string): boolean {
		if (!(this.options.enabled && text)) return false;
		return this.filter.isProfane(text);
	}

	clean(text: string): string {
		if (!(this.options.enabled && text)) return text;
		return this.filter.clean(text);
	}

	filterSubmissionData(submissionData: Record<string, any>): {
		isValid: boolean;
		filteredData: Record<string, any>;
		violations: ProfanityCheckResult[];
		message?: string;
	} {
		if (!this.options.enabled) {
			return {
				isValid: true,
				filteredData: submissionData,
				violations: [],
			};
		}

		const violations: ProfanityCheckResult[] = [];
		const filteredData: Record<string, any> = {};

		for (const [key, value] of Object.entries(submissionData)) {
			const result = this.checkValue(value);

			if (result.hasBeenFiltered) {
				violations.push({
					...result,
					originalText: `Field "${key}": ${result.originalText}`,
				});

				if (this.options.strictMode) {
					return {
						isValid: false,
						filteredData: submissionData,
						violations,
						message: this.options.customMessage,
					};
				}
				if (this.options.replaceWithAsterisks) {
					filteredData[key] = result.cleanedText;
				} else {
					filteredData[key] = value;
				}
			} else {
				filteredData[key] = value;
			}
		}

		return {
			isValid: violations.length === 0 || !this.options.strictMode,
			filteredData,
			violations,
			message: violations.length > 0 ? this.options.customMessage : undefined,
		};
	}

	private checkValue(value: any): ProfanityCheckResult {
		if (typeof value === "string") {
			return this.checkText(value);
		}
		if (Array.isArray(value)) {
			const textValues = value.filter((v) => typeof v === "string").join(" ");
			return this.checkText(textValues);
		}
		if (typeof value === "object" && value !== null) {
			const textValues = Object.values(value)
				.filter((v) => typeof v === "string")
				.join(" ");
			return this.checkText(textValues);
		}

		return {
			hasBeenFiltered: false,
			originalText: String(value),
			filteredWords: [],
		};
	}

	private checkText(text: string): ProfanityCheckResult {
		if (!text || typeof text !== "string") {
			return {
				hasBeenFiltered: false,
				originalText: text || "",
				filteredWords: [],
			};
		}

		const isProfane = this.filter.isProfane(text);

		if (isProfane) {
			const cleanedText = this.filter.clean(text);
			const filteredWords = this.extractFilteredWords(text, cleanedText);

			return {
				hasBeenFiltered: true,
				cleanedText,
				originalText: text,
				filteredWords,
				message: this.options.customMessage,
			};
		}

		return {
			hasBeenFiltered: false,
			originalText: text,
			filteredWords: [],
		};
	}

	private extractFilteredWords(original: string, cleaned: string): string[] {
		const originalWords = original.toLowerCase().split(/\s+/);
		const cleanedWords = cleaned.toLowerCase().split(/\s+/);
		const filtered: string[] = [];

		for (let i = 0; i < originalWords.length; i++) {
			if (cleanedWords[i] && cleanedWords[i].includes("*")) {
				filtered.push(originalWords[i]);
			}
		}

		return filtered;
	}

	updateOptions(newOptions: Partial<ProfanityFilterOptions>) {
		this.options = { ...this.options, ...newOptions };

		this.filter = new Filter();

		if (this.options.customWords && this.options.customWords.length > 0) {
			this.filter.addWords(...this.options.customWords);
		}

		if (
			this.options.whitelistedWords &&
			this.options.whitelistedWords.length > 0
		) {
			this.filter.removeWords(...this.options.whitelistedWords);
		}
	}
}

export function createProfanityFilter(
	settings: ProfanityFilterOptions,
): ProfanityFilterService {
	return new ProfanityFilterService(settings);
}
