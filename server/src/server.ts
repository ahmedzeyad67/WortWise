import "dotenv/config";
import { connect } from "mongoose";
import app from "./app.js";

const uri = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

async function startServer(): Promise<void> {
  try {
    if (!uri) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables",
      );
    }

    await connect(uri);

    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`WortWise server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
