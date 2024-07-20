import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import connectDb from "./utils/connectDB";

const app: Express = express();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.json()); // Parse incoming JSON data
app.use(cookieParser()); // Parse cookies

connectDb();

const PORT: number = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
