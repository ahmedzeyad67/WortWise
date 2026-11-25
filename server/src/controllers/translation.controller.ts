import translationService from "../services/translation.service.js";
import asyncWrapper from "../middlewares/async-wrapper.js";

const addTranslationToWord = asyncWrapper(async (req, res) => {
  const data = await translationService.addTranslationToWord(
    req.params.fileId as string,
    req.params.wordId as string,
    req.body.translation as string,
  );

  res.status(200).json({ status: "success", data });
});

const editTranslationInWord = asyncWrapper(async (req, res) => {
  const data = await translationService.editTranslationInWord(
    req.params.fileId as string,
    req.params.wordId as string,
    Number(req.params.translationIndex),
    req.body.translation as string,
  );

  res.status(200).json({ status: "success", data });
});

const removeTranslationFromWord = asyncWrapper(async (req, res) => {
  const data = await translationService.removeTranslationFromWord(
    req.params.fileId as string,
    req.params.wordId as string,
    Number(req.params.translationIndex),
  );

  res.status(200).json({ status: "success", data });
});

export default {
  addTranslationToWord,
  editTranslationInWord,
  removeTranslationFromWord,
};
