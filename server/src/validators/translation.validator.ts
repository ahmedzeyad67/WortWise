import { body, type ValidationChain } from "express-validator";

export const translationValidators = (fieldPath: string): ValidationChain[] => [
  body(fieldPath).custom((translation) => {
    if (
      translation === null ||
      typeof translation !== "object" ||
      Array.isArray(translation)
    ) {
      throw new Error("Each translation must be an object");
    }

    if (Object.keys(translation).some((key) => key !== "englishText")) {
      throw new Error("Each translation may only contain englishText");
    }

    return true;
  }),
  body(`${fieldPath}.englishText`)
    .isString()
    .withMessage("Translation must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Translation cannot be empty"),
];
