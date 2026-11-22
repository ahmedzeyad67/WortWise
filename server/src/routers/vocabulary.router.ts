import express from "express";
import vocabularyController from "../controllers/vocabulary.controller.js";
import {
  createVocabularyFileValidators,
  updateVocabularyFileValidators,
} from "../validators/vocabulary.validator.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

router
  .route("/")
  .get(vocabularyController.getAllVocabularyFiles)
  .post(
    createVocabularyFileValidators,
    validate,
    vocabularyController.createVocabularyFile,
  );
router
  .route("/:fileId")
  .get(vocabularyController.getVocabularyFileById)
  .patch(
    updateVocabularyFileValidators,
    validate,
    vocabularyController.updateVocabularyFile,
  )
  .delete(vocabularyController.deleteVocabularyFile);

export default router;
