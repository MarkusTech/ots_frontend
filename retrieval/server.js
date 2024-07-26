import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import morgan from "morgan";
import colors from "colors";
import cors from "cors";
import helmet from "helmet";

// dotenv config
dotenv.config();

const port = process.env.PORT;

// routes
import api from "./routes/api.js";

// rest obj
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

// API
app.use("/api/v2", api);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`.bgCyan);
});
