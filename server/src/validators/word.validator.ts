import { body, type ValidationChain } from "express-validator";
import { translationValidators } from "./translation.validator.js";

export const wordValidators = (fieldPath: string): ValidationChain[] => [
  body(fieldPath).custom((word) => {
    if (word === null || typeof word !== "object" || Array.isArray(word)) {
      throw new Error("Each word must be an object");
    }

    if (
      Object.keys(word).some(
        (key) => !["germanWord", "translations"].includes(key),
      )
    ) {
      throw new Error("Each word may only contain germanWord and translations");
    }

    return true;
  }),
  body(`${fieldPath}.germanWord`)
    .isString()
    .withMessage("Word must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Word is required"),
  body(`${fieldPath}.translations`)
    .optional()
    .isArray()
    .withMessage("Translations must be an array"),
  ...translationValidators(`${fieldPath}.translations.*`),
];
