import vocabularyService from "../services/vocabulary.service.js";
import asyncWrapper from "../middlewares/async-wrapper.js";
import type {
  ICreateVocabularyFileInput,
  IVocabularyFile,
} from "../types/vocabulary.types.js";

const getAllVocabularyFiles = asyncWrapper(async (_req, res) => {
  const data = await vocabularyService.getAllVocabularyFiles();

  res.json({
    status: "success",
    data,
  });
});

const getBookmarkedFile = asyncWrapper(async (_req, res) => {
  const data = await vocabularyService.getBookmarkedFile();

  res.json({
    status: "success",
    data,
  });
});

const getVocabularyFileById = asyncWrapper(async (req, res) => {
  const data = await vocabularyService.getVocabularyFileById(
    req.params.fileId as string,
  );

  res.json({
    status: "success",
    data,
  });
});

const createVocabularyFile = asyncWrapper(async (req, res) => {
  const data = await vocabularyService.createVocabularyFile(
    req.body as ICreateVocabularyFileInput,
  );

  res.status(201).json({
    status: "success",
    data,
  });
});

const updateVocabularyFile = asyncWrapper(async (req, res) => {
  const data = await vocabularyService.updateVocabularyFile(
    req.params.fileId as string,
    req.body as Partial<Pick<IVocabularyFile, "name" | "isPinned">>,
  );

  res.json({
    status: "success",
    data,
  });
});

const deleteVocabularyFile = asyncWrapper(async (req, res) => {
  await vocabularyService.deleteVocabularyFile(req.params.fileId as string);

  res.status(204).send();
});

export default {
  getAllVocabularyFiles,
  getBookmarkedFile,
  getVocabularyFileById,
  createVocabularyFile,
  updateVocabularyFile,
  deleteVocabularyFile,
};
