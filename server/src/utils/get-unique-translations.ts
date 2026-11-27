import normalizeTextForComparison from "./normalize-for-comparison.js";

const getUniqueTranslations = (
  existingTranslations: string[],
  newTranslations: string[],
): string[] => {
  const seen = new Set<string>();
  const translationsWithArticles = new Set<string>();
  const uniqueTranslations: string[] = [];

  [...existingTranslations, ...newTranslations].forEach((translation) => {
    const trimmedText = translation.trim().toLowerCase();
    const normalizedText = normalizeTextForComparison(trimmedText);

    if (!normalizedText) {
      return;
    }

    const articleMatch = trimmedText.match(/^(a|an|the)\s+(.+)$/iu);

    if (!articleMatch) {
      if (
        !seen.has(normalizedText) &&
        !translationsWithArticles.has(normalizedText)
      ) {
        seen.add(normalizedText);
        uniqueTranslations.push(trimmedText);
      }

      return;
    }

    if (seen.has(normalizedText)) {
      return;
    }

    const wordWithoutArticle = articleMatch[2]!.trim();
    const normalizedWordWithoutArticle =
      normalizeTextForComparison(wordWithoutArticle);

    if (seen.has(normalizedWordWithoutArticle)) {
      seen.delete(normalizedWordWithoutArticle);

      const wordIndex = uniqueTranslations.findIndex(
        (uniqueTranslation) =>
          normalizeTextForComparison(uniqueTranslation) ===
          normalizedWordWithoutArticle,
      );

      if (wordIndex !== -1) {
        uniqueTranslations.splice(wordIndex, 1);
      }
    }

    translationsWithArticles.add(normalizedWordWithoutArticle);
    seen.add(normalizedText);
    uniqueTranslations.push(trimmedText);
  });

  return uniqueTranslations;
};

export default getUniqueTranslations;
