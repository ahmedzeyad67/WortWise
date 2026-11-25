import { body } from "express-validator";
import { wordValidators } from "./word.validator.js";
import normalizeTextForComparison from "../utils/normalize-for-comparison.js";

const validateFileNameIsNotReserved = (name: string) => {
  if (normalizeTextForComparison(name) === "bookmarked") {
    throw new Error('"Bookmarked" is a reserved vocabulary file name');
  }

  return true;
};

export const createVocabularyFileValidators = [
  body().custom((value) => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Request body must be an object");
    }

    if (Object.keys(value).some((key) => !["name", "words"].includes(key))) {
      throw new Error("Only name and words fields are allowed");
    }

    return true;
  }),
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: 3, max: 25 })
    .withMessage("Name must be between 3 and 25 characters")
    .bail()
    .custom(validateFileNameIsNotReserved),
  body("words").optional().isArray().withMessage("Words must be an array"),
  ...wordValidators("words.*"),
];

export const updateVocabularyFileValidators = [
  body().custom((value) => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Request body must be an object");
    }

    const allowedFields = ["name", "isPinned"];
    if (Object.keys(value).some((key) => !allowedFields.includes(key))) {
      throw new Error("Only name and isPinned fields are allowed");
    }

    if (Object.keys(value).length === 0) {
      throw new Error("At least one field must be provided");
    }

    return true;
  }),
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .bail()
    .isLength({ min: 3, max: 25 })
    .withMessage("Name must be between 3 and 25 characters")
    .bail()
    .custom(validateFileNameIsNotReserved),
  body("isPinned")
    .optional()
    .isBoolean({ strict: true })
    .withMessage("isPinned must be a boolean"),
];
