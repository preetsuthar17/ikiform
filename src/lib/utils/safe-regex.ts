export function safeRegexTest(
	pattern: string,
	value: string,
	timeoutMs = 100,
): boolean {
	try {
		const regex = new RegExp(pattern);
		const startTime = Date.now();

		const testResult = regex.test(value);

		const executionTime = Date.now() - startTime;
		if (executionTime > timeoutMs) {
			console.warn(
				`Regex pattern took ${executionTime}ms to execute, exceeding timeout of ${timeoutMs}ms`,
			);
			return false;
		}

		return testResult;
	} catch (error) {
		console.error("Invalid regex pattern:", pattern, error);
		return false;
	}
}
