import { Types, type HydratedDocument } from "mongoose";

export interface IWord {
  _id: Types.ObjectId;
  germanWord: string;
  isBookmarked: boolean;
  translations: string[];
}

export interface IVocabularyFile {
  _id: Types.ObjectId;
  name: string;
  words: IWord[];
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWordInput {
  germanWord: string;
  translations: string[];
}

export interface IBookmarkedWord extends IWord {
  vocabularyFileId: Types.ObjectId;
  vocabularyFileName: string;
}

export interface IBookmarkedFile {
  name: string;
  words: IBookmarkedWord[];
}

export type IWordUpdateInput = Partial<
  Pick<IWord, "germanWord" | "isBookmarked">
>;

export interface ICreateVocabularyFileInput {
  name: string;
  words?: IWordInput[];
}

export type IVocabularyImportDestination =
  | { type: "existing"; fileId: string }
  | { type: "new"; name: string };

export interface IVocabularyImportInput {
  destination: IVocabularyImportDestination;
  words: IWordInput[];
}

export interface IVocabularyImportResult {
  vocabularyFile: IVocabularyFile;
  addedWords: number;
  updatedWords: number;
}

export type IVocabularyFileDocument = HydratedDocument<IVocabularyFile>;
