import { readFile } from "fs/promises";
import { join } from "path";
import type { AppLocale } from "@/i18n/routing";

export type LegalDocumentKey = "privacy" | "terms" | "gdpr" | "dpa";

export interface LegalDocument {
	title: string;
	lastUpdated: string;
	content: string;
}

function parseFrontmatter(raw: string) {
	const lines = raw.split("\n");
	if (lines[0]?.trim() !== "---") {
		return null;
	}

	let end = -1;
	for (let i = 1; i < lines.length; i += 1) {
		if (lines[i]?.trim() === "---") {
			end = i;
			break;
		}
	}

	if (end === -1) {
		return null;
	}

	const frontmatter: Record<string, string> = {};
	for (const line of lines.slice(1, end)) {
		const separator = line.indexOf(":");
		if (separator === -1) continue;
		const key = line.slice(0, separator).trim();
		const value = line.slice(separator + 1).trim();
		frontmatter[key] = value;
	}

	return {
		frontmatter,
		content: lines.slice(end + 1).join("\n").trim(),
	};
}

async function readLocalizedFile(
	locale: AppLocale,
	document: LegalDocumentKey
): Promise<string> {
	const localizedPath = join(
		process.cwd(),
		"content",
		"legal",
		locale,
		`${document}.md`
	);
	try {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		return await readFile(localizedPath, "utf-8");
	} catch {
		const fallbackPath = join(
			process.cwd(),
			"content",
			"legal",
			"en",
			`${document}.md`
		);
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		return readFile(fallbackPath, "utf-8");
	}
}

export async function getLegalDocument(
	locale: AppLocale,
	document: LegalDocumentKey
): Promise<LegalDocument> {
	const raw = await readLocalizedFile(locale, document);
	const parsed = parseFrontmatter(raw);

	if (!parsed) {
		return {
			title: document.toUpperCase(),
			lastUpdated: "",
			content: raw,
		};
	}

	return {
		title: parsed.frontmatter.title || document.toUpperCase(),
		lastUpdated: parsed.frontmatter.lastUpdated || "",
		content: parsed.content,
	};
}
