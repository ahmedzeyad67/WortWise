import { Types } from "mongoose";
import AppError from "../utils/app-error.js";
import extractText from "../utils/extract-text.js";
import extractWords from "../utils/extract-words.js";
import getUniqueTranslations from "../utils/get-unique-translations.js";
import normalizeTextForComparison from "../utils/normalize-for-comparison.js";
import vocabularyModel from "../models/vocabulary.model.js";
import type {
  IVocabularyImportInput,
  IVocabularyImportResult,
} from "../types/vocabulary.types.js";
import { getTranslationsBatch } from "./translation-provider.service.js";

const MAX_IMPORT_LINES = 650;
const MAX_TEXTS_PER_DEEPL_REQUEST = 50;

export interface IVocabularyImportPreviewWord {
  germanWord: string;
  translations: string[];
}

export interface IVocabularyImportPreview {
  words: IVocabularyImportPreviewWord[];
}

export type TVocabularyImportProgress =
  | { phase: "extracting" }
  | { phase: "translating"; completed: number; total: number }
  | { phase: "checking-translations" };

const getVocabularyImportPreview = async (
  file?: Express.Multer.File,
  onProgress?: (progress: TVocabularyImportProgress) => void,
): Promise<IVocabularyImportPreview> => {
  if (!file) {
    throw new AppError("A .txt or .docx file is required", 400);
  }

  onProgress?.({ phase: "extracting" });
  const text = await extractText(file);
  const nonEmptyLines = text
    .split(/\r\n|[\n\r\u2028\u2029]/u)
    .filter((line) => line.trim());

  if (nonEmptyLines.length > MAX_IMPORT_LINES) {
    throw new AppError(
      `Files cannot contain more than ${MAX_IMPORT_LINES} non-empty lines`,
      413,
    );
  }

  const germanWords = extractWords(text);
  let completed = 0;
  onProgress?.({
    phase: "translating",
    completed,
    total: germanWords.length,
  });

  const batches = Array.from(
    { length: Math.ceil(germanWords.length / MAX_TEXTS_PER_DEEPL_REQUEST) },
    (_, index) =>
      germanWords.slice(
        index * MAX_TEXTS_PER_DEEPL_REQUEST,
        (index + 1) * MAX_TEXTS_PER_DEEPL_REQUEST,
      ),
  );
  const words = await batches.reduce<Promise<IVocabularyImportPreviewWord[]>>(
    async (translatedWordsPromise, batch) => {
      const translatedWords = await translatedWordsPromise;
      const batchTranslations = await getTranslationsBatch(batch);
      const translatedBatch = batch.map((germanWord, index) => {
        completed += 1;
        onProgress?.({
          phase: "translating",
          completed,
          total: germanWords.length,
        });

        return { germanWord, translations: batchTranslations[index] ?? [] };
      });

      return [...translatedWords, ...translatedBatch];
    },
    Promise.resolve([]),
  );

  onProgress?.({ phase: "checking-translations" });

  if (words.every((word) => word.translations.length === 0)) {
    throw new AppError(
      "DeepL could not translate the extracted entries",
      502,
    );
  }

  return { words };
};

const importReviewedWords = async ({
  destination,
  words,
}: IVocabularyImportInput): Promise<IVocabularyImportResult> => {
  const vocabularyFile =
    destination.type === "existing"
      ? await vocabularyModel.findById(destination.fileId)
      : new vocabularyModel({ name: destination.name, words: [] });

  if (!vocabularyFile) {
    throw new AppError("Vocabulary file not found", 404);
  }

  let addedWords = 0;
  let updatedWords = 0;

  words.forEach((wordInput) => {
    const normalizedGermanWord = normalizeTextForComparison(
      wordInput.germanWord,
    );
    const existingWord = vocabularyFile.words.find(
      (word) =>
        normalizeTextForComparison(word.germanWord) === normalizedGermanWord,
    );

    if (existingWord) {
      const updatedTranslations = getUniqueTranslations(
        existingWord.translations,
        wordInput.translations,
      );

      if (
        JSON.stringify(updatedTranslations) !==
        JSON.stringify(existingWord.translations)
      ) {
        existingWord.translations = updatedTranslations;
        updatedWords += 1;
      }

      return;
    }

    vocabularyFile.words.push({
      _id: new Types.ObjectId(),
      germanWord: wordInput.germanWord.trim(),
      isBookmarked: false,
      translations: getUniqueTranslations([], wordInput.translations),
    });
    addedWords += 1;
  });

  await vocabularyFile.save();

  return { vocabularyFile, addedWords, updatedWords };
};

export default { getVocabularyImportPreview, importReviewedWords };
