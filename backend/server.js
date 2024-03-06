import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import colors from "colors";

// Database
import sqlConn from "./config/db.js";

// UUID
import { v4 as uuidv4 } from "uuid";

// Routes
import productRoutes from "./routes/productRoutes.js";
import otsRoutes from "./routes/otsRoutes.js";
import draftNumberRoutes from "./routes/draftNumberRoutes.js";
import entryNumberRoutes from "./routes/entryNumberRoutes.js";
import productDetailRoutes from "./routes/productDetailsRoutes.js";
import getSingleDraftRoutes from "./routes/getSingleDraftRoutes.js";

// dotenv config
dotenv.config();
const port = process.env.PORT || 5001;

// rest obj
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

// Test
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Rest API
app.use("/api/v1", productRoutes);
app.use("/api/v1", otsRoutes);
app.use("/api/v1", draftNumberRoutes);
app.use("/api/v1", entryNumberRoutes);
app.use("/api/v1", productDetailRoutes);

// uuid API
app.get("/api/v1/generateUniqueId", (req, res) => {
  const uniqueId = uuidv4();
  res.json({ uniqueId });
});

app.use("/api/v1", getSingleDraftRoutes);

// event listener
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`.bgCyan);
// });

sqlConn.connect((err) => {
  if (err) {
    console.error("Error connecting to MSSQL:", err);
  } else {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`.bgCyan);
    });
  }
});
