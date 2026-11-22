import { body } from "express-validator";
import { wordValidators } from "./word.validator.js";

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
    .isLength({ min: 3, max: 25 })
    .withMessage("Name must be between 3 and 25 characters"),
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
    .isLength({ min: 3, max: 25 })
    .withMessage("Name must be between 3 and 25 characters"),
  body("isPinned")
    .optional()
    .isBoolean({ strict: true })
    .withMessage("isPinned must be a boolean"),
];
