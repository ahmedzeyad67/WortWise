import express from "express";
import wordController from "../controllers/word.controller.js";
import validate from "../middlewares/validate.js";
import {
  wordIdValidator,
  wordUpdateValidators,
  wordValidators,
} from "../validators/word.validator.js";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  wordValidators(),
  validate,
  wordController.addWordToVocabularyFile,
);

router
  .route("/:wordId")
  .patch(
    wordIdValidator,
    wordUpdateValidators,
    validate,
    wordController.updateWordInVocabularyFile,
  )
  .delete(
    wordIdValidator,
    validate,
    wordController.removeWordFromVocabularyFile,
  );

export default router;
