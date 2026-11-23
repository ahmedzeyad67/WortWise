import wordService from "../services/word.service.js";
import asyncWrapper from "../middlewares/async-wrapper.js";
import type {
  IWordInput,
  IWordUpdateInput,
} from "../types/vocabulary.types.js";

const addWordToVocabularyFile = asyncWrapper(async (req, res) => {
  const data = await wordService.addWordToVocabularyFile(
    req.params.fileId as string,
    req.body as IWordInput,
  );

  res.status(200).json({
    status: "success",
    data,
  });
});

const updateWordInVocabularyFile = asyncWrapper(async (req, res) => {
  const data = await wordService.updateWordInVocabularyFile(
    req.params.fileId as string,
    req.params.wordId as string,
    req.body as IWordUpdateInput,
  );

  res.status(200).json({
    status: "success",
    data,
  });
});

const removeWordFromVocabularyFile = asyncWrapper(async (req, res) => {
  await wordService.removeWordFromVocabularyFile(
    req.params.fileId as string,
    req.params.wordId as string,
  );

  res.status(204).send();
});

export default {
  addWordToVocabularyFile,
  updateWordInVocabularyFile,
  removeWordFromVocabularyFile,
};
