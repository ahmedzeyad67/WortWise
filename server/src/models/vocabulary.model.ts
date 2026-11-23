import mongoose, { Schema } from "mongoose";
import type { IVocabularyFile } from "../types/vocabulary.types.js";

const wordSchema = new Schema({
  germanWord: { type: String, required: true, trim: true },
  isBookmarked: { type: Boolean, default: false },
  translations: {
    type: [{ type: String, trim: true }],
    required: true,
    default: [],
    validate: {
      validator: (translations: string[]) => translations.length > 0,
      message: "A word must have at least one translation",
    },
  },
});

const vocabularyFileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
      trim: true,
    },
    words: { type: [wordSchema], default: [] },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

vocabularyFileSchema.index(
  { name: 1 },
  {
    unique: true,
    collation: { locale: "en", strength: 2 },
  },
);

const VocabularyFile = mongoose.model<IVocabularyFile>(
  "VocabularyFile",
  vocabularyFileSchema,
);

export default VocabularyFile;
