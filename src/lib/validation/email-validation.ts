const TEMPORARY_EMAIL_DOMAINS = [
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "tempmail.org",
  "throwaway.email",
  "yopmail.com",
  "mailnesia.com",
  "sharklasers.com",
  "getairmail.com",
  "maildrop.cc",
  "mailnesia.com",
  "mailinator.net",
  "guerrillamailblock.com",
  "pokemail.net",
  "spam4.me",
  "bccto.me",
  "chacuo.net",
  "dispostable.com",
  "mailmetrash.com",
  "trashmail.net",
  "mailnull.com",
  "getnada.com",
  "mailinator.com",
  "tempr.email",
  "mailnesia.com",
  "maildrop.cc",
  "mailnesia.com",
  "mailinator.net",
  "guerrillamailblock.com",
  "pokemail.net",
  "spam4.me",
  "bccto.me",
  "chacuo.net",
  "dispostable.com",
  "mailmetrash.com",
  "trashmail.net",
  "mailnull.com",
  "getnada.com",
  "mailinator.com",
  "tempr.email",
];

const PERSONAL_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "live.com",
  "msn.com",
  "me.com",
  "mac.com",
];

export interface EmailValidationResult {
  isValid: boolean;
  message?: string;
}

export interface EmailValidationSettings {
  allowedDomains?: string[];
  blockedDomains?: string[];
  autoCompleteDomain?: string;
  requireBusinessEmail?: boolean;
  customValidationMessage?: string;
}

export function validateEmail(
  email: string,
  settings?: EmailValidationSettings
): EmailValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message:
        settings?.customValidationMessage ||
        "Please enter a valid email address",
    };
  }

  const domain = email.split("@")[1]?.toLowerCase();

  const blockedDomains = [
    ...(settings?.blockedDomains || []),
    ...TEMPORARY_EMAIL_DOMAINS,
  ];

  if (blockedDomains.some((blocked) => domain === blocked.toLowerCase())) {
    return {
      isValid: false,
      message:
        settings?.customValidationMessage ||
        "Temporary email addresses are not allowed",
    };
  }

  if (
    settings?.allowedDomains?.length &&
    !settings.allowedDomains.some((allowed) => domain === allowed.toLowerCase())
  ) {
    return {
      isValid: false,
      message:
        settings?.customValidationMessage ||
        `Only emails from ${settings.allowedDomains.join(", ")} are allowed`,
    };
  }

  if (
    settings?.requireBusinessEmail &&
    PERSONAL_EMAIL_DOMAINS.includes(domain)
  ) {
    return {
      isValid: false,
      message:
        settings?.customValidationMessage ||
        "Please use a business email address",
    };
  }

  return { isValid: true };
}

export function autoCompleteEmail(username: string, domain: string): string {
  if (!(username && domain)) return username;
  return `${username}@${domain}`;
}

export function extractUsername(email: string): string {
  return email.split("@")[0] || "";
}

export function extractDomain(email: string): string {
  return email.split("@")[1] || "";
}
