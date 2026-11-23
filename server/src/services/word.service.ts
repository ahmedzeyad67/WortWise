import { Types } from "mongoose";
import vocabularyModel from "../models/vocabulary.model.js";
import AppError from "../utils/app-error.js";
import type {
  IWord,
  IWordInput,
  IWordUpdateInput,
} from "../types/vocabulary.types.js";
import getUniqueTranslations from "../utils/translation.utils.js";

const normalizeTextForComparison = (text: string): string => {
  return text.normalize("NFC").trim().toLowerCase();
};

const addWordToVocabularyFile = async (
  fileId: string,
  wordInput: IWordInput,
): Promise<IWord> => {
  const vocabularyFile = await vocabularyModel.findById(fileId);

  if (!vocabularyFile) {
    throw new AppError("Vocabulary file not found", 404);
  }

  const normalizedGermanWord = normalizeTextForComparison(wordInput.germanWord);
  let existingWord = vocabularyFile.words.find(
    (word) =>
      normalizeTextForComparison(word.germanWord) === normalizedGermanWord,
  );

  if (existingWord) {
    existingWord.translations.push(
      ...getUniqueTranslations(
        existingWord.translations,
        wordInput.translations,
      ),
    );
  } else {
    existingWord = {
      _id: new Types.ObjectId(),
      germanWord: wordInput.germanWord.trim(),
      isBookmarked: false,
      translations: getUniqueTranslations([], wordInput.translations),
    };
    vocabularyFile.words.push(existingWord);
  }

  await vocabularyFile.save();

  return existingWord;
};

const updateWordInVocabularyFile = async (
  fileId: string,
  wordId: string,
  updates: IWordUpdateInput,
): Promise<IWord> => {
  if (updates.germanWord === undefined && updates.isBookmarked === undefined) {
    throw new AppError("At least one word field must be provided", 400);
  }

  const vocabularyFile = await vocabularyModel.findById(fileId);

  if (!vocabularyFile) {
    throw new AppError("Vocabulary file not found", 404);
  }

  const word = vocabularyFile.words.find(
    (existingWord) => existingWord._id.toString() === wordId,
  );

  if (!word) {
    throw new AppError("Word not found", 404);
  }

  if (updates.germanWord !== undefined) {
    const germanWord = updates.germanWord.trim();
    const normalizedGermanWord = normalizeTextForComparison(germanWord);

    if (!normalizedGermanWord) {
      throw new AppError("German word cannot be empty", 400);
    }

    const duplicateWord = vocabularyFile.words.find(
      (existingWord) =>
        existingWord._id.toString() !== wordId &&
        normalizeTextForComparison(existingWord.germanWord) ===
          normalizedGermanWord,
    );

    if (duplicateWord) {
      throw new AppError(
        "German word already exists in the vocabulary file",
        409,
      );
    }

    word.germanWord = germanWord;
  }

  if (updates.isBookmarked !== undefined) {
    word.isBookmarked = updates.isBookmarked;
  }

  await vocabularyFile.save();

  return word;
};

const removeWordFromVocabularyFile = async (
  fileId: string,
  wordId: string,
): Promise<void> => {
  const vocabularyFile = await vocabularyModel.findById(fileId);

  if (!vocabularyFile) {
    throw new AppError("Vocabulary file not found", 404);
  }

  const wordIndex = vocabularyFile.words.findIndex(
    (word) => word._id.toString() === wordId,
  );

  if (wordIndex === -1) {
    throw new AppError("Word not found", 404);
  }

  vocabularyFile.words.splice(wordIndex, 1);
  await vocabularyFile.save();
};

export default {
  addWordToVocabularyFile,
  updateWordInVocabularyFile,
  removeWordFromVocabularyFile,
};
