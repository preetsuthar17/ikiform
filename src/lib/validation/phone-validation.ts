export interface PhoneValidationResult {
	isValid: boolean;
	message?: string;
}

export function validatePhoneNumber(phone: string): PhoneValidationResult {
	if (!phone) {
		return { isValid: false, message: "Phone number is required" };
	}

	const cleaned = phone.replace(/[\s-]/g, "");

	if (cleaned.startsWith("+")) {
		const withoutPlus = cleaned.slice(1);
		if (!/^\d{1,3}\d{10,15}$/.test(withoutPlus)) {
			return { isValid: false, message: "Please enter a valid phone number" };
		}
	} else {
		if (!/^\d{10,15}$/.test(cleaned)) {
			return { isValid: false, message: "Please enter a valid phone number" };
		}
	}

	return { isValid: true };
}
