import express from "express";
import translationController from "../controllers/translation.controller.js";
import validate from "../middlewares/validate.js";
import {
  translationIndexValidator,
  translationInputValidators,
} from "../validators/translation.validator.js";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  translationInputValidators,
  validate,
  translationController.addTranslationToWord,
);

router
  .route("/:translationIndex")
  .patch(
    translationIndexValidator,
    translationInputValidators,
    validate,
    translationController.editTranslationInWord,
  )
  .delete(
    translationIndexValidator,
    validate,
    translationController.removeTranslationFromWord,
  );

export default router;
