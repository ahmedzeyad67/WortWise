import type { RequestHandler } from "express";
import multer from "multer";
import AppError from "../utils/app-error.js";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const acceptedExtensions = new Set([".txt", ".docx"]);

const getFileExtension = (fileName: string): string => {
  const extensionIndex = fileName.lastIndexOf(".");

  return extensionIndex === -1
    ? ""
    : fileName.slice(extensionIndex).toLowerCase();
};

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const extension = getFileExtension(file.originalname);

    if (!acceptedExtensions.has(extension)) {
      callback(new AppError("Only .txt and .docx files are allowed", 400));
      return;
    }

    callback(null, true);
  },
});

const uploadFile: RequestHandler = (req, res, next) => {
  multerUpload.single("file")(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        next(new AppError("File size cannot exceed 5 MB", 413));
        return;
      }

      next(new AppError(error.message, 400));
      return;
    }

    if (error) {
      next(error);
      return;
    }

    if (!req.file) {
      next(new AppError("A .txt or .docx file is required", 400));
      return;
    }

    if (req.file.size === 0) {
      next(new AppError("The uploaded file is empty", 400));
      return;
    }

    next();
  });
};

export default uploadFile;
