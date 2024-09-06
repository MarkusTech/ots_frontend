import express from "express";
import {
  saveApprovalSummary,
  getApprovalProcedureSummary,
} from "../../controllers/ordertaking/approvalProcSummary.js";
const router = express.Router();

router.post("/approval-summary", saveApprovalSummary);
router.get("/approval-summary", getApprovalProcedureSummary);

export default router;
