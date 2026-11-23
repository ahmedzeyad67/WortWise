import { body, type ValidationChain } from "express-validator";

export const translationValidators = (fieldPath: string): ValidationChain[] => [
  body(fieldPath)
    .isString()
    .withMessage("Translation must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Translation cannot be empty"),
];
