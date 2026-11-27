import { body } from "express-validator";
import { wordValidators } from "./word.validator.js";
import normalizeTextForComparison from "../utils/normalize-for-comparison.js";

export const vocabularyImportValidators = [
  body().custom((value) => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Request body must be an object");
    }

    if (!("destination" in value) || !("words" in value)) {
      throw new Error("Request body must contain destination and words");
    }

    if (
      Object.keys(value).some((key) => !["destination", "words"].includes(key))
    ) {
      throw new Error("Only destination and words fields are allowed");
    }

    return true;
  }),
  body("destination").custom((destination) => {
    if (
      destination === null ||
      typeof destination !== "object" ||
      Array.isArray(destination)
    ) {
      throw new Error("Destination must be an object");
    }

    if (destination.type === "existing") {
      if (
        Object.keys(destination).length !== 2 ||
        !Object.hasOwn(destination, "fileId")
      ) {
        throw new Error(
          'Existing destination must contain only type "existing" and a fileId',
        );
      }

      if (typeof destination.fileId !== "string") {
        throw new Error("File ID must be a string");
      }

      return true;
    }

    if (destination.type === "new") {
      if (
        Object.keys(destination).length !== 2 ||
        !Object.hasOwn(destination, "name")
      ) {
        throw new Error(
          'New destination must contain only type "new" and a name',
        );
      }

      if (typeof destination.name !== "string") {
        throw new Error("Name must be a string");
      }

      return true;
    }

    throw new Error('Destination type must be "existing" or "new"');
  }),
  body("destination.name")
    .if(body("destination.type").equals("new"))
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
    .custom((name: string) => {
      if (normalizeTextForComparison(name) === "bookmarked") {
        throw new Error('"Bookmarked" is a reserved vocabulary file name');
      }

      return true;
    }),
  body("destination.fileId")
    .if(body("destination.type").equals("existing"))
    .isString()
    .withMessage("File ID must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("File ID is required")
    .bail()
    .isMongoId()
    .withMessage("File ID must be a valid MongoDB ID"),
  body("words")
    .isArray({ min: 1 })
    .withMessage("At least one word is required"),
  ...wordValidators("words.*"),
];
