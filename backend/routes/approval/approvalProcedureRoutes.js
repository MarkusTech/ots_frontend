import express from "express";
import { saveApprovalHeader } from "../../controllers/approval/saveApprovalHeader.js";
import { saveORiginator } from "../../controllers/approval/saveOriginator.js";
import { saveApprover } from "../../controllers/approval/saveApprover.js";

const router = express.Router();

router.post("/save-approval-header", saveApprovalHeader);
router.post("/save-originator", saveORiginator);
router.post("/save-approver", saveApprover);

export default router;
