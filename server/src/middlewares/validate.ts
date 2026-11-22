import { validationResult } from "express-validator";
import type { RequestHandler } from "express";
import AppError from "../utils/app-error.js";

const validate: RequestHandler = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((error) => error.msg)
      .join(", ");

    return next(new AppError(message, 400));
  }

  next();
};

export default validate;
