import normalizeTextForComparison from "./normalize-for-comparison.js";

const extractWords = (text: string): string[] => {
  const lines = text.split(/\r\n|[\n\r\u2028\u2029]/u);
  const seenWords = new Set<string>();
  const uniqueWords: string[] = [];

  lines.forEach((line) => {
    const word = line.trim();
    const normalizedWord = normalizeTextForComparison(word);

    if (normalizedWord && !seenWords.has(normalizedWord)) {
      seenWords.add(normalizedWord);
      uniqueWords.push(word);
    }
  });

  return uniqueWords;
};

export default extractWords;
