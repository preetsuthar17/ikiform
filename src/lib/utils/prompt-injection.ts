// Patterns simplified for safer regexes: remove nested groups, excessive alternations, backtracking-heavy quantifiers
const PROMPT_INJECTION_PATTERNS: RegExp[] = [
	/\bignore\b.*\b(previous|prior|earlier)\b.*\b(instruction|prompt|directive|rule)s?\b/i,
	/\bforget\b.*\b(previous|prior|earlier)\b.*\b(instruction|prompt|directive|rule)s?\b/i,
	/\byou\s+are\s+now\b/i,
	/\byou\s+were\s+previously\b/i,
	/\bact\s+as\b/i,
	/\bpretend\s+(to\s+be|that\s+you\s+are)\b/i,
	/\bsimulate\b.*\byou\s+are\b/i,
	/\boverride\b.*\b(system|previous|prior)\b.*\b(instruction|prompt|directive|rule)s?\b/i,
	/\bsystem\s*:?\s*(prompt|instruction|directive|rule)/i,
	/\[SYSTEM\]/i,
	/\[INST\]/i,
	/\[INST\s+SYSTEM\]/i,
	/###\s*(system|instruction|prompt)/i,
	/---\s*(system|instruction|prompt)/i,
	/\bbegin\b.*\b(new|newer)\b.*\b(system|instruction|prompt)s?\b/i,
	/\bstart\b.*\b(new|newer)\b.*\b(system|instruction|prompt)s?\b/i,
	/\bexecute\b.*\b(following|below)\b.*\b(instruction|command|code)s?\b/i,
	/\brun\b.*\b(following|below)\b.*\b(instruction|command|code)s?\b/i,
	/\bprint\b.*\b(system|internal|hidden)\b.*\b(prompt|instruction)s?\b/i,
	/\breveal\b.*\b(system|internal|hidden)\b.*\b(prompt|instruction)s?\b/i,
	/\b(show|leak|disclose|output)\b.*\b(system|internal|hidden)\b.*\b(prompt|instruction)s?\b/i,
	/\b(what|tell|repeat|echo)\b.*\b(system|initial|original)\b.*\b(instruction|prompt|directive)s?\b/i,
	/\brole\s*:?\s*(system|admin|developer|assistant)\b/i,
	/\byou\s+must\s+(always|never)\b/i,
	/\byou\s+should\s+(always|never)\b/i,
	/\byou\s+can\s+(now|always)\b/i,
	/\bfrom\s+now\s+on\b/i,
	/\bstarting\s+now\b/i,
	/\bhere\s+are\b.*\b(new|updated|revised)\b.*\b(instruction|prompt|directive|rule)s?\b/i,
	/\b(new|updated|revised)\s+(instruction|prompt|directive|rule)s?\s*:?\b/i,
	/\b(change|modify|update|alter)\b.*\b(your|the)\b.*\b(instruction|prompt|directive|rule|behavior)s?\b/i,
	/\b(switch|change)\b.*\b(to|mode|persona)\b/i,
	/\benter\b.*\b(developer|debug|admin|system)\s+mode\b/i,
	/\benable\b.*\b(developer|debug|admin|system)\s+mode\b/i,
	/\b(disable|bypass|remove)\b.*\b(safety|security|filtering|restriction)s?\b/i,
	/\bjailbreak\b/i,
	/\bdan\s+mode\b/i,
	/\b(developer|debug|admin|system)\s+mode\b/i,
];

// Avoid untrusted input in regex directly and avoid heavy backtracking
export function detectPromptInjection(input: string): boolean {
	if (typeof input !== "string" || !input.trim()) {
		return false;
	}
	const normalizedInput = input.trim().toLowerCase();
	for (const pattern of PROMPT_INJECTION_PATTERNS) {
		if (pattern.test(normalizedInput)) {
			return true;
		}
	}
	return false;
}

export function sanitizeForPromptInjection(input: string): {
	sanitized: string;
	detected: boolean;
} {
	const detected = detectPromptInjection(input);
	// Replace most dangerous known patterns only (use simple non-nested expressions)
	const DANGEROUS =
		/\b(ignore|forget)\b.*\b(previous|prior|earlier)\b.*\b(instruction|prompt|directive|rule)s?\b/gi;
	if (detected) {
		return {
			sanitized: input.replace(DANGEROUS, "[filtered]"),
			detected: true,
		};
	}
	return { sanitized: input, detected: false };
}

export function validateMessageRole(role: string): boolean {
	return role === "user" || role === "assistant";
}

export function filterSystemMessages(
	messages: { role: string; content: string }[]
): { role: string; content: string }[] {
	return messages
		.filter((msg) => msg.role !== "system" && validateMessageRole(msg.role))
		.map((msg) => ({
			role: msg.role === "assistant" ? "assistant" : "user",
			content: msg.content,
		}));
}
