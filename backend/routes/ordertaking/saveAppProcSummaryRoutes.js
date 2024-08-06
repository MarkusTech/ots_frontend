import express from "express";
import { saveApprovalSummary } from "../../controllers/ordertaking/saveApprovalProcSummary.js";
const router = express.Router();

router.post("/approval-summary", saveApprovalSummary);

export default router;
