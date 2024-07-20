import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app: Express = express();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.json()); // Parse incoming JSON data
app.use(cookieParser()); // Parse cookies

const uri: string = process.env.MONGODB_URI || "";

(async () => {
  try {
    await mongoose.connect(uri); // Connect to MongoDB
    console.log("Connected to the database");
  } catch (error) {
    console.error(error);
  }
})();

const PORT: number = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
