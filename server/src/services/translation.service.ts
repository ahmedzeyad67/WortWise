import type { IWord } from "../types/vocabulary.types.js";
import AppError from "../utils/app-error.js";
import getWordFromVocabularyFile from "../utils/get-word-from-vocabulary-file.js";
import getUniqueTranslations from "../utils/get-unique-translations.js";
import normalizeTextForComparison from "../utils/normalize-for-comparison.js";

const addTranslationToWord = async (
  fileId: string,
  wordId: string,
  newTranslation: string,
): Promise<IWord> => {
  const { vocabularyFile, word } = await getWordFromVocabularyFile(
    fileId,
    wordId,
  );

  const uniqueTranslations = getUniqueTranslations(word.translations, [
    newTranslation,
  ]);

  word.translations.push(...uniqueTranslations);

  if (uniqueTranslations.length > 0) {
    await vocabularyFile.save();
  }

  return word;
};

const editTranslationInWord = async (
  fileId: string,
  wordId: string,
  translationIndex: number,
  newTranslation: string,
): Promise<IWord> => {
  const { vocabularyFile, word } = await getWordFromVocabularyFile(
    fileId,
    wordId,
  );

  if (
    !Number.isInteger(translationIndex) ||
    translationIndex < 0 ||
    translationIndex >= word.translations.length
  ) {
    throw new AppError("Translation not found", 404);
  }

  const currentTranslation = word.translations[translationIndex]!;
  if (
    normalizeTextForComparison(currentTranslation) ===
    normalizeTextForComparison(newTranslation)
  ) {
    return word;
  }

  const existingTranslations = word.translations.filter(
    (_translation, index) => index !== translationIndex,
  );
  const uniqueTranslations = getUniqueTranslations(existingTranslations, [
    newTranslation,
  ]);

  if (uniqueTranslations.length === 0) {
    word.translations.splice(translationIndex, 1);
  } else {
    word.translations[translationIndex] = uniqueTranslations[0]!;
  }

  await vocabularyFile.save();

  return word;
};

const removeTranslationFromWord = async (
  fileId: string,
  wordId: string,
  translationIndex: number,
): Promise<IWord> => {
  const { vocabularyFile, word } = await getWordFromVocabularyFile(
    fileId,
    wordId,
  );

  if (
    !Number.isInteger(translationIndex) ||
    translationIndex < 0 ||
    translationIndex >= word.translations.length
  ) {
    throw new AppError("Translation not found", 404);
  }

  if (word.translations.length === 1) {
    throw new AppError("Cannot remove the last translation", 400);
  }

  word.translations.splice(translationIndex, 1);

  await vocabularyFile.save();

  return word;
};

export default {
  addTranslationToWord,
  editTranslationInWord,
  removeTranslationFromWord,
};
