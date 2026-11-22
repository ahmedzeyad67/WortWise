import type { RequestHandler } from "express";

const asyncWrapper = (asyncfn: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(asyncfn(req, res, next)).catch((err) => next(err));
  };
};

export default asyncWrapper;
