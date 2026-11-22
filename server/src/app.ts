import express from "express";
import cors from "cors";
import helmet from "helmet";
import errorHandler from "./middlewares/error-handler.js";
import vocabularyRouter from "./routers/vocabulary.router.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Welcome to the WortWise API" });
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "Ok" });
});

app.use("/api/vocabulary", vocabularyRouter);

app.use((_req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

app.use(errorHandler);

export default app;
