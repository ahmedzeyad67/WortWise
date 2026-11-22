import vocabularyModel from "../models/vocabulary.model.js";
import AppError from "../utils/app-error.js";
import type {
  ICreateVocabularyFileInput,
  IVocabularyFile,
} from "../types/vocabulary.types.js";

const getAllVocabularyFiles = async (): Promise<IVocabularyFile[]> => {
  const vocabularyFiles = await vocabularyModel.find();

  return vocabularyFiles;
};

const getVocabularyFileById = async (
  fileId: string,
): Promise<IVocabularyFile> => {
  const vocabularyFile = await vocabularyModel.findById(fileId);

  if (!vocabularyFile) {
    throw new AppError("Vocabulary file not found", 404);
  }

  return vocabularyFile;
};

const createVocabularyFile = async (
  { name, words = [] }: ICreateVocabularyFileInput,
): Promise<IVocabularyFile> => {
  const newVocabularyFile = new vocabularyModel({ name, words });

  await newVocabularyFile.save();

  return newVocabularyFile;
};

const updateVocabularyFile = async (
  fileId: string,
  updatedData: Partial<Pick<IVocabularyFile, "name" | "isPinned">>,
): Promise<IVocabularyFile> => {
  const updatedVocabularyFile = await vocabularyModel.findByIdAndUpdate(
    fileId,
    updatedData,
    { returnDocument: "after", runValidators: true },
  );

  if (!updatedVocabularyFile) {
    throw new AppError("Vocabulary file not found", 404);
  }

  return updatedVocabularyFile;
};

const deleteVocabularyFile = async (fileId: string) => {
  const deletedVocabularyFile = await vocabularyModel.findByIdAndDelete(fileId);

  if (!deletedVocabularyFile) {
    throw new AppError("Vocabulary file not found", 404);
  }
};

export default {
  getAllVocabularyFiles,
  getVocabularyFileById,
  createVocabularyFile,
  updateVocabularyFile,
  deleteVocabularyFile,
};
