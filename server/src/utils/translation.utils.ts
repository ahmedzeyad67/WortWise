const normalizeTextForComparison = (text: string): string => {
  return text.normalize("NFC").trim().toLowerCase();
};

const getUniqueTranslations = (
  existingTranslations: string[],
  newTranslations: string[],
): string[] => {
  const seen = new Set(
    existingTranslations.map(normalizeTextForComparison),
  );
  const uniqueTranslations: string[] = [];

  newTranslations.forEach((translation) => {
    const trimmedText = translation.trim();
    const normalizedText = normalizeTextForComparison(trimmedText);

    if (normalizedText && !seen.has(normalizedText)) {
      seen.add(normalizedText);
      uniqueTranslations.push(trimmedText);
    }
  });

  return uniqueTranslations;
};

export default getUniqueTranslations;
