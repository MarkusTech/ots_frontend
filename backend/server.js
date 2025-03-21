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
import getSingleDraftRoutes from "./routes/ordertaking/getSingleDraftRoutes.js";
import getDetailsRoutes from "./routes/ordertaking/getDetailsRoutes.js";
import saveCommitRoutes from "./routes/ordertaking/saveCommitRoutes.js";
import saveHeaderRoutes from "./routes/ordertaking/saveHeaderRoutes.js";
import saveFinalCommit from "./routes/ordertaking/saveFinalCommitRoutes.js";
import receiptRoutes from "./routes/ordertaking/receiptRoutes.js";
import loginRoutes from "./routes/auth/loginRoutes.js";
import approvalProcedureRoutes from "./routes/approval/approvalProcedureRoutes.js";
import originatorRoutes from "./routes/users/originatorRoutes.js";
import saveDetailsRoutes from "./routes/ordertaking/saveDetails.js";
import salesCrewRoutes from "./routes/ordertaking/getSalesCrewRoutes.js";
import approvalSummaryRoutes from "./routes/ordertaking/appProcSummaryRoutes.js";
import getApprovalProcedureSummaryRoutes from "./routes/approval/getApprovalProcedureSummaryRoutes.js";
import approvalNotificationRoutes from "./routes/approval/approvalNotificationRoutes.js";
import getHeaderFromOriginatorDraftNumRoutes from "./routes/approval/getHeaderFromOriginatorDraftNum.js";

// Routes v2
import db2_paylocRoutes from "./routes/location/db2_paylocRoutes.js";
import db2_UserRoutes from "./routes/users/db2_UsersRoutes.js";
import arpprovalTypeRoutes from "./routes/approval/approvalTypeRoutes.js";
import getLastApprovalIDRoutes from "./routes/approval/getLastApprovalIDRoutes.js";
import getListWarehouseRoutes from "./routes/warehouse/gitListWarehouseRoutes.js";
import retrievalAPIRoutes from "./routes/ordertaking/retrievalAPIRoutes.js";

// dotenv config
dotenv.config();
const port = process.env.PORT || 5000;
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
app.use("/api/v1", saveFinalCommit);
app.use("/api/v1", receiptRoutes);
app.use("/api/v1", loginRoutes);
app.use("/api/v1", approvalProcedureRoutes);
app.use("/api/v1", originatorRoutes);
app.use("/api/v1", saveDetailsRoutes);
app.use("/api/v1", salesCrewRoutes);
app.use("/api/v1", approvalSummaryRoutes);
app.use("/api/v1", getApprovalProcedureSummaryRoutes);
app.use("/api/v1", approvalNotificationRoutes);
app.use("/api/v1", getHeaderFromOriginatorDraftNumRoutes);

// API V2
app.use("/api/v2", db2_paylocRoutes);
app.use("/api/v2", db2_UserRoutes);
app.use("/api/v2", arpprovalTypeRoutes);
app.use("/api/v2", getLastApprovalIDRoutes);
app.use("/api/v2", getListWarehouseRoutes);
app.use("/api/v2", retrievalAPIRoutes);

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
      console.log(`Server2 is running on http://localhost:${port2}`.bgCyan);
    });
  }
});
