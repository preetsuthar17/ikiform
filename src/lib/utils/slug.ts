export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60);
}

export function generateUniqueSlug(title: string, length = 6): string {
  const baseSlug = generateSlug(title);
  const randomSuffix = Math.random()
    .toString(36)
    .substring(2, 2 + length);

  if (baseSlug.length < 3) {
    return `form-${randomSuffix}`;
  }

  return `${baseSlug}-${randomSuffix}`;
}

export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length < 3 || slug.length > 60) {
    return false;
  }

  if (!/^[a-z0-9]/.test(slug)) {
    return false;
  }

  if (!/[a-z0-9]$/.test(slug)) {
    return false;
  }

  return /^[a-z0-9-]+$/.test(slug) && !/--/.test(slug);
}

export function isUUID(str: string): boolean {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str);
}

export function sanitizeSlugInput(input: string): string {
  return input.trim().substring(0, 100).replace(/[<>]/g, "");
}
