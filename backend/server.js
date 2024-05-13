import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import colors from "colors";

// Database
import sqlConn from "./config/db.js";
import sqlConn2 from "./config/db2.js";

// UUID
import { v4 as uuidv4 } from "uuid";

// Routes
import getSingleDraftRoutes from "./routes/getSingleDraftRoutes.js";
import getDetailsRoutes from "./routes/getDetailsRoutes.js";
import saveCommitRoutes from "./routes/saveCommitRoutes.js";
import saveHeaderRoutes from "./routes/saveHeaderRoutes.js";
import saveDetailsRoutes from "./routes/saveDetailsRoutes.js";
import saveFinalCommit from "./routes/saveFinalCommitRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";

// Routes v2
import db2_paylocRoutes from "./routes/db2_paylocRoutes.js";

// dotenv config
dotenv.config();
const port = process.env.PORT;
const port2 = process.env.PORT2 || 5001;

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

// uuid API
app.get("/api/v1/generateUniqueId", (req, res) => {
  const uniqueId = uuidv4();
  res.json({ uniqueId });
});

// Rest API
app.use("/api/v1", getSingleDraftRoutes);
app.use("/api/v1", getDetailsRoutes);
app.use("/api/v1", saveCommitRoutes);
app.use("/api/v1", saveHeaderRoutes);
app.use("/api/v1", saveDetailsRoutes);
app.use("/api/v1", saveFinalCommit);
app.use("/api/v1", receiptRoutes);
app.use("/api/v2", db2_paylocRoutes);

sqlConn.connect((err) => {
  if (err) {
    console.error("Error connecting to MSSQL:", err);
  } else {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`.bgCyan);
    });
  }
});

sqlConn2.connect((err) => {
  if (err) {
    console.error("Error connecting to MSSQL:", err);
  } else {
    app.listen(port2, () => {
      console.log(`Server is running on http://localhost:${port2}`.bgCyan);
    });
  }
});
