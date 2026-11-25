import vocabularyModel from "../models/vocabulary.model.js";
import AppError from "./app-error.js";
import type {
  IWord,
  IVocabularyFileDocument,
} from "../types/vocabulary.types.js";

const getWordFromVocabularyFile = async (
  fileId: string,
  wordId: string,
): Promise<{ vocabularyFile: IVocabularyFileDocument; word: IWord }> => {
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

  return { vocabularyFile, word };
};

export default getWordFromVocabularyFile;
