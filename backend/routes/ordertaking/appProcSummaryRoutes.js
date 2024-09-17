import express from "express";
import {
  saveApprovalSummary,
  getApprovalProcedureSummary,
  updateApprovalSummaryStatus,
  getSalesOrderBasedOnApprovalDraftNum,
} from "../../controllers/ordertaking/approvalProcSummary.js";
const router = express.Router();

router.post("/approval-summary", saveApprovalSummary);
router.get("/approval-summary", getApprovalProcedureSummary);
router.put("/approval-summary/:AppSummID", updateApprovalSummaryStatus);
// to get the data for sales order
router.get(
  "/approval-summary/sales-order/:DraftNum",
  getSalesOrderBasedOnApprovalDraftNum
);

export default router;
