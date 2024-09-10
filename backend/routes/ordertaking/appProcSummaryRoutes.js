import express from "express";
import {
  saveApprovalSummary,
  getApprovalProcedureSummary,
  updateApprovalSummaryStatus,
} from "../../controllers/ordertaking/approvalProcSummary.js";
const router = express.Router();

router.post("/approval-summary", saveApprovalSummary);
router.get("/approval-summary", getApprovalProcedureSummary);
router.put("/approval-summary/:AppSummID", updateApprovalSummaryStatus);

export default router;
