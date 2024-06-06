import express from "express";
import {
  saveApprovalHeader,
  getApprovalHeader,
} from "../../controllers/approval/saveApprovalHeader.js";
import {
  saveORiginator,
  getOriginator,
} from "../../controllers/approval/saveOriginator.js";
import {
  saveApprover,
  getApprovers,
} from "../../controllers/approval/saveApprover.js";

const router = express.Router();

router.post("/save-approval-header", saveApprovalHeader);
router.post("/save-originator", saveORiginator);
router.post("/save-approver", saveApprover);

router.get("/get-approval-header", getApprovalHeader);
router.get("/get-originator", getOriginator);
router.get("/get-approver", getApprovers);

export default router;
