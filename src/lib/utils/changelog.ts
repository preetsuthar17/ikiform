import { readdir, readFile } from "fs/promises";
import { join } from "path";

export interface ChangelogEntry {
	title: string;
	description?: string;
	release_date: string;
	content: string;
}

export async function getChangelogEntries(): Promise<ChangelogEntry[]> {
	const changelogDir = join(process.cwd(), "content", "changelog");

	let files: string[] = [];
	try {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		files = await readdir(changelogDir);
	} catch (error) {
		console.error("Error reading changelog directory:", error);
		return [];
	}

	const mdFiles = files.filter((file) => file.endsWith(".md"));
	const entries: ChangelogEntry[] = [];

	for (const file of mdFiles) {
		const filePath = join(changelogDir, file);
		let content: string;
		try {
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			content = await readFile(filePath, "utf-8");
		} catch (error) {
			console.error(`Error reading changelog file "${file}":`, error);
			continue;
		}
		entries.push(parseChangelogFile(content, file));
	}

	return entries.sort((a, b) => {
		const aDate = a.release_date?.trim();
		const bDate = b.release_date?.trim();
		if (!aDate) return -1;
		if (!bDate) return 1;
		return bDate.localeCompare(aDate);
	});
}

function parseChangelogFile(content: string, filename: string): ChangelogEntry {
	const lines = content.split("\n");

	let title = filename.replace(/\.md$/, "");
	let description: string | undefined;
	let release_date = "";

	if (lines[0]?.trim() === "---") {
		let frontmatterEnd = -1;

		for (let i = 1; i < lines.length; i++) {
			if (lines[i]?.trim() === "---") {
				frontmatterEnd = i;
				break;
			}
		}

		if (frontmatterEnd > 0) {
			const frontmatterLines = lines.slice(1, frontmatterEnd);

			for (const line of frontmatterLines) {
				const trimmed = line.trim();
				if (trimmed.startsWith("title:")) {
					title = trimmed.replace(/^title:\s*/, "").trim();
				} else if (trimmed.startsWith("description:")) {
					description =
						trimmed.replace(/^description:\s*/, "").trim() || undefined;
				} else if (trimmed.startsWith("release_date:")) {
					release_date = trimmed.replace(/^release_date:\s*/, "").trim();
				}
			}

			const contentLines = lines.slice(frontmatterEnd + 1);
			const entryContent = contentLines.join("\n").trim();

			return {
				title: title || filename.replace(/\.md$/, ""),
				description,
				release_date,
				content: entryContent,
			};
		}
	}

	const filenameDateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})\.md$/);
	if (filenameDateMatch) {
		release_date = filenameDateMatch[1];
		title = release_date;
	}

	const entryContent = lines.join("\n").trim();

	return {
		title,
		description,
		release_date,
		content: entryContent,
	};
}
