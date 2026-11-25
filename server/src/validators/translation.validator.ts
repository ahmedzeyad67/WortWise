import { body, param, type ValidationChain } from "express-validator";

export const translationValidators = (fieldPath: string): ValidationChain[] => [
  body(fieldPath)
    .isString()
    .withMessage("Translation must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Translation cannot be empty"),
];

export const translationInputValidators: ValidationChain[] = [
  body().custom((value) => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Request body must be an object");
    }

    if (Object.keys(value).some((key) => key !== "translation")) {
      throw new Error("Only the translation field is allowed");
    }

    return true;
  }),
  ...translationValidators("translation"),
];

export const translationIndexValidator = param("translationIndex")
  .isInt({ min: 0 })
  .withMessage("translationIndex must be a nonnegative integer")
  .bail()
  .toInt();
