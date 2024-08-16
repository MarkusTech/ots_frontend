import express from "express";
import { getBelowStandarDiscounting } from "../../controllers/approval/getApprovalProcedureSummary.js";
const router = express.Router();

router.get("/", getBelowStandarDiscounting);

export default router;
