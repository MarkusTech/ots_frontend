import express from "express";
import {
  saveApprovalHeader,
  getApprovalHeader,
} from "../../controllers/approval/saveApprovalHeader.js";
import { saveORiginator } from "../../controllers/approval/saveOriginator.js";
import { saveApprover } from "../../controllers/approval/saveApprover.js";

const router = express.Router();

router.post("/save-approval-header", saveApprovalHeader);
router.post("/save-originator", saveORiginator);
router.post("/save-approver", saveApprover);

router.get("/save-approval-header", getApprovalHeader);

export default router;
