export function sanitizeOptions(options: Array<any>): Array<any> {
	return options.map((opt) => {
		if (typeof opt === "string") {
			return escapeHtml(opt);
		}

		if (opt && typeof opt === "object") {
			return {
				...opt,
				value:
					typeof opt.value === "string" ? escapeHtml(opt.value) : opt.value,
				label:
					typeof opt.label === "string" ? escapeHtml(opt.label) : opt.label,
			};
		}
		return opt;
	});
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}
