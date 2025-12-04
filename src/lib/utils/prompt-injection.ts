const PROMPT_INJECTION_PATTERNS = [
	/ignore\s+(all\s+)?(previous|prior|earlier)\s+(instructions?|prompts?|directives?|rules?)/i,
	/forget\s+(all\s+)?(previous|prior|earlier)\s+(instructions?|prompts?|directives?|rules?)/i,
	/you\s+are\s+now/i,
	/you\s+were\s+previously/i,
	/act\s+as\s+(if\s+)?(you\s+are\s+)?/i,
	/pretend\s+(to\s+be|that\s+you\s+are)/i,
	/simulate\s+(that\s+)?(you\s+are\s+)?/i,
	/override\s+(system|previous|prior)\s+(instructions?|prompts?|directives?|rules?)/i,
	/system\s*:?\s*(prompt|instruction|directive|rule)/i,
	/\[SYSTEM\]/i,
	/\[INST\]/i,
	/\[INST\s+SYSTEM\]/i,
	/###\s*(system|instructions?|prompt)/i,
	/---\s*(system|instructions?|prompt)/i,
	/begin\s+(new|newer)\s+(system|instructions?|prompt)/i,
	/start\s+(new|newer)\s+(system|instructions?|prompt)/i,
	/execute\s+(the\s+)?(following|below)\s+(instructions?|commands?|code)/i,
	/run\s+(the\s+)?(following|below)\s+(instructions?|commands?|code)/i,
	/print\s+(the\s+)?(system|internal|hidden)\s+(prompt|instructions?)/i,
	/reveal\s+(the\s+)?(system|internal|hidden)\s+(prompt|instructions?)/i,
	/show\s+(me\s+)?(the\s+)?(system|internal|hidden)\s+(prompt|instructions?)/i,
	/leak\s+(the\s+)?(system|internal|hidden)\s+(prompt|instructions?)/i,
	/disclose\s+(the\s+)?(system|internal|hidden)\s+(prompt|instructions?)/i,
	/output\s+(the\s+)?(system|internal|hidden)\s+(prompt|instructions?)/i,
	/what\s+(are\s+)?(your\s+)?(system|initial|original)\s+(instructions?|prompts?|directives?)/i,
	/tell\s+me\s+(your\s+)?(system|initial|original)\s+(instructions?|prompts?|directives?)/i,
	/repeat\s+(your\s+)?(system|initial|original)\s+(instructions?|prompts?|directives?)/i,
	/echo\s+(your\s+)?(system|initial|original)\s+(instructions?|prompts?|directives?)/i,
	/role\s*:?\s*(system|admin|developer|assistant)/i,
	/you\s+must\s+(always|never)/i,
	/you\s+should\s+(always|never)/i,
	/you\s+can\s+(now|always)/i,
	/from\s+now\s+on/i,
	/starting\s+now/i,
	/here\s+are\s+(the\s+)?(new|updated|revised)\s+(instructions?|prompts?|directives?|rules?)/i,
	/new\s+(instructions?|prompts?|directives?|rules?)\s*:?/i,
	/updated\s+(instructions?|prompts?|directives?|rules?)\s*:?/i,
	/revised\s+(instructions?|prompts?|directives?|rules?)\s*:?/i,
	/change\s+(your|the)\s+(instructions?|prompts?|directives?|rules?|behavior)/i,
	/modify\s+(your|the)\s+(instructions?|prompts?|directives?|rules?|behavior)/i,
	/update\s+(your|the)\s+(instructions?|prompts?|directives?|rules?|behavior)/i,
	/alter\s+(your|the)\s+(instructions?|prompts?|directives?|rules?|behavior)/i,
	/switch\s+(to|mode|persona)/i,
	/change\s+(to|mode|persona)/i,
	/enter\s+(developer|debug|admin|system)\s+mode/i,
	/enable\s+(developer|debug|admin|system)\s+mode/i,
	/disable\s+(safety|security|filtering|restrictions)/i,
	/bypass\s+(safety|security|filtering|restrictions)/i,
	/remove\s+(safety|security|filtering|restrictions)/i,
	/jailbreak/i,
	/dan\s+mode/i,
	/developer\s+mode/i,
	/debug\s+mode/i,
	/admin\s+mode/i,
	/system\s+mode/i,
];

export function detectPromptInjection(input: string): boolean {
	if (!input || typeof input !== "string") {
		return false;
	}

	const normalizedInput = input.trim().toLowerCase();

	for (const pattern of PROMPT_INJECTION_PATTERNS) {
		if (pattern.test(input)) {
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

	if (detected) {
		return {
			sanitized: input.replace(
				/ignore\s+(all\s+)?(previous|prior|earlier)\s+(instructions?|prompts?|directives?|rules?)/gi,
				"[filtered]",
			),
			detected: true,
		};
	}

	return { sanitized: input, detected: false };
}

export function validateMessageRole(role: string): boolean {
	return role === "user" || role === "assistant";
}

export function filterSystemMessages(
	messages: { role: string; content: string }[],
): { role: string; content: string }[] {
	return messages
		.filter((msg) => {
			if (msg.role === "system") {
				return false;
			}
			return validateMessageRole(msg.role);
		})
		.map((msg) => ({
			role: msg.role === "assistant" ? "assistant" : "user",
			content: msg.content,
		}));
}
