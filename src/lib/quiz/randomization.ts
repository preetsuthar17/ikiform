/**
 * Shuffles an array using the Fisher-Yates algorithm with optional seed
 */
export function shuffleArray<T>(array: T[], seed?: string): T[] {
  const shuffled = [...array];

  const random = seed ? createSeededRandom(seed) : Math.random;

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Create a seeded random number generator for consistent shuffling
 */
function createSeededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return () => {
    hash = (hash * 9301 + 49_297) % 233_280;
    return hash / 233_280;
  };
}

/**
 * Shuffles options for a form field if shuffling is enabled
 * Uses field ID as seed to ensure consistent shuffling per user session
 */
export function shuffleFieldOptions(
  options: Array<string | { value: string; label?: string }>,
  shuffleEnabled?: boolean,
  fieldId?: string,
): Array<string | { value: string; label?: string }> {
  if (!(shuffleEnabled && options) || options.length <= 1) {
    return options;
  }

  const seed = fieldId ? `${fieldId}_${getSessionSeed()}` : undefined;
  return shuffleArray(options, seed);
}

/**
 * Shuffles form fields if question randomization is enabled
 * Uses form ID as seed to ensure consistent shuffling per user session
 */
export function shuffleQuizFields(
  fields: any[],
  randomizeEnabled?: boolean,
  shuffleQuizOnly = true,
  formId?: string,
): any[] {
  if (!(randomizeEnabled && fields) || fields.length <= 1) {
    return fields;
  }

  const seed = formId ? `${formId}_${getSessionSeed()}` : undefined;

  if (shuffleQuizOnly) {
    const quizFields = fields.filter((field) => field.settings?.isQuizField);
    const nonQuizFields = fields.filter(
      (field) => !field.settings?.isQuizField,
    );

    const shuffledQuizFields = shuffleArray(quizFields, seed);

    const result = [...fields];
    let quizIndex = 0;

    for (let i = 0; i < result.length; i++) {
      if (result[i].settings?.isQuizField) {
        result[i] = shuffledQuizFields[quizIndex++];
      }
    }

    return result;
  }

  return shuffleArray(fields, seed);
}

/**
 * Get or create a session-based seed for consistent randomization
 * This ensures the same user gets the same shuffle order during their session
 */
function getSessionSeed(): string {
  if (typeof window === "undefined") return "server";

  let sessionSeed = sessionStorage.getItem("quiz_shuffle_seed");
  if (!sessionSeed) {
    sessionSeed = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("quiz_shuffle_seed", sessionSeed);
  }
  return sessionSeed;
}
