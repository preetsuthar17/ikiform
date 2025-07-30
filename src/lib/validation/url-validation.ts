// URL validation utility
export interface UrlValidationResult {
  isValid: boolean;
  message?: string;
}

export function validateUrl(url: string): UrlValidationResult {
  // Basic URL validation
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, message: 'Please enter a valid URL' };
  }
}
