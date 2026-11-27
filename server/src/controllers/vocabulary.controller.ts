import vocabularyService from "../services/vocabulary.service.js";
import vocabularyImportService from "../services/vocabulary-import.service.js";
import asyncWrapper from "../middlewares/async-wrapper.js";
import AppError from "../utils/app-error.js";
import type {
  ICreateVocabularyFileInput,
  IVocabularyImportInput,
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

const previewVocabularyImport = asyncWrapper(async (req, res) => {
  res.status(200).set({
    "Content-Type": "application/x-ndjson; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
  });
  res.flushHeaders();

  const sendEvent = (event: Record<string, unknown>) => {
    if (!res.destroyed) {
      res.write(`${JSON.stringify(event)}\n`);
    }
  };

  try {
    const data = await vocabularyImportService.getVocabularyImportPreview(
      req.file,
      (progress) => {
        sendEvent({ type: "progress", ...progress });
      },
    );

    sendEvent({ type: "result", status: "success", data });
  } catch (error: unknown) {
    const appError = error instanceof AppError ? error : undefined;

    sendEvent({
      type: "error",
      status: appError?.status ?? "error",
      statusCode: appError?.statusCode ?? 500,
      message: appError?.message ?? "Failed to process import preview",
    });
  } finally {
    if (!res.destroyed) {
      res.end();
    }
  }
});

const importReviewedWords = asyncWrapper(async (req, res) => {
  const data = await vocabularyImportService.importReviewedWords(
    req.body as IVocabularyImportInput,
  );

  res.status(201).json({
    status: "success",
    data,
  });
});

export default {
  getAllVocabularyFiles,
  getBookmarkedFile,
  getVocabularyFileById,
  createVocabularyFile,
  updateVocabularyFile,
  deleteVocabularyFile,
  previewVocabularyImport,
  importReviewedWords,
};
