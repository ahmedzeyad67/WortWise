import { body, param, type ValidationChain } from "express-validator";
import { translationValidators } from "./translation.validator.js";

export const wordValidators = (fieldPath = ""): ValidationChain[] => {
  const getFieldPath = (field: string): string =>
    fieldPath ? `${fieldPath}.${field}` : field;

  return [
    (fieldPath ? body(fieldPath) : body()).custom((word) => {
      if (word === null || typeof word !== "object" || Array.isArray(word)) {
        throw new Error("Each word must be an object");
      }

      if (
        Object.keys(word).some(
          (key) => !["germanWord", "translations"].includes(key),
        )
      ) {
        throw new Error(
          "Each word may only contain germanWord and translations",
        );
      }

      return true;
    }),
    body(getFieldPath("germanWord"))
      .isString()
      .withMessage("Word must be a string")
      .bail()
      .trim()
      .notEmpty()
      .withMessage("Word is required"),
    body(getFieldPath("translations"))
      .isArray()
      .withMessage("Translations must be an array")
      .bail()
      .notEmpty()
      .withMessage("At least one translation is required"),
    ...translationValidators(`${getFieldPath("translations")}.*`),
  ];
};

export const wordIdValidator = param("wordId")
  .isMongoId()
  .withMessage("wordId must be a valid MongoDB ID");

export const wordUpdateValidators: ValidationChain[] = [
  body().custom((value) => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Request body must be an object");
    }

    const allowedFields = ["germanWord", "isBookmarked"];
    if (Object.keys(value).some((key) => !allowedFields.includes(key))) {
      throw new Error("Only germanWord and isBookmarked fields are allowed");
    }

    if (Object.keys(value).length === 0) {
      throw new Error("At least one field must be provided");
    }

    return true;
  }),
  body("germanWord")
    .optional()
    .isString()
    .withMessage("Word must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Word cannot be empty"),
  body("isBookmarked")
    .optional()
    .isBoolean()
    .withMessage("isBookmarked must be a boolean"),
];
