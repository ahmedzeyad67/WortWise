import express from "express";
import vocabularyController from "../controllers/vocabulary.controller.js";
import {
  createVocabularyFileValidators,
  updateVocabularyFileValidators,
} from "../validators/vocabulary.validator.js";
import validate from "../middlewares/validate.js";
import wordRouter from "./word.router.js";

const router = express.Router();

router
  .route("/")
  .get(vocabularyController.getAllVocabularyFiles)
  .post(
    createVocabularyFileValidators,
    validate,
    vocabularyController.createVocabularyFile,
  );

router.get("/bookmarked", vocabularyController.getBookmarkedFile);

router
  .route("/:fileId")
  .get(vocabularyController.getVocabularyFileById)
  .patch(
    updateVocabularyFileValidators,
    validate,
    vocabularyController.updateVocabularyFile,
  )
  .delete(vocabularyController.deleteVocabularyFile);

router.use("/:fileId/words", wordRouter);

export default router;
