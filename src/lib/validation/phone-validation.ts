// Phone number validation utility
export interface PhoneValidationResult {
  isValid: boolean;
  message?: string;
}

export function validatePhoneNumber(phone: string): PhoneValidationResult {
  // Accepts international and local formats, basic check
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,15}$/;
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' };
  }
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: 'Please enter a valid phone number' };
  }
  return { isValid: true };
}
