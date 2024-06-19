import express from "express";
import {
  saveApprovalHeader,
  getApprovalHeader,
  getSelectedApprovalMain,
} from "../../controllers/approval/saveApprovalHeader.js";
import {
  saveORiginator,
  getOriginator,
  getSelectedOriginatorID,
} from "../../controllers/approval/saveOriginator.js";
import {
  saveApprover,
  getApprovers,
  getApproversByApprovalID,
} from "../../controllers/approval/saveApprover.js";
import { getApprovalMain } from "../../controllers/approval/getApprovalMain.js";

const router = express.Router();

// Approval Header
router.post("/save-approval-header", saveApprovalHeader);
router.post("/save-originator", saveORiginator);
router.post("/save-approver", saveApprover);

// Originator
router.get("/get-approval-header", getApprovalHeader);
router.get("/get-originator", getOriginator);
router.get("/get-originator/:AppProcID", getSelectedOriginatorID);

// Approvert
router.get("/get-approver", getApprovers);
router.get("/get-approver/:AppProcID", getApproversByApprovalID);
router.get("/get-approval-main", getApprovalMain);

// Get Main Approval Procedure
router.get("/get-selected-approval-main/:AppProcID", getSelectedApprovalMain);

export default router;
