import { Types, type HydratedDocument } from "mongoose";

export interface ITranslation {
  englishText: string;
}

export interface IWord {
  _id: Types.ObjectId;
  germanWord: string;
  isBookmarked: boolean;
  translations: ITranslation[];
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
  translations?: ITranslation[];
}

export interface ICreateVocabularyFileInput {
  name: string;
  words?: IWordInput[];
}

export type IVocabularyFileDocument = HydratedDocument<IVocabularyFile>;
