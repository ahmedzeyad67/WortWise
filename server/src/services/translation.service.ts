import type { IWord } from "../types/vocabulary.types.js";
import AppError from "../utils/app-error.js";
import getWordFromVocabularyFile from "../utils/get-word-from-vocabulary-file.js";
import getUniqueTranslations from "../utils/get-unique-translations.js";

const addTranslationToWord = async (
  fileId: string,
  wordId: string,
  newTranslation: string,
): Promise<IWord> => {
  const { vocabularyFile, word } = await getWordFromVocabularyFile(
    fileId,
    wordId,
  );

  const updatedTranslations = getUniqueTranslations(word.translations, [
    newTranslation,
  ]);

  const hasChanged =
    JSON.stringify(updatedTranslations) !== JSON.stringify(word.translations);

  if (hasChanged) {
    word.translations = updatedTranslations;
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

  const translationsToEdit = [...word.translations];
  translationsToEdit[translationIndex] = newTranslation;
  const updatedTranslations = getUniqueTranslations([], translationsToEdit);
  word.translations = updatedTranslations;

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
