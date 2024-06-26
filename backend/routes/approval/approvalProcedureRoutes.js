import express from "express";
import {
  saveApprovalHeader,
  getApprovalHeader,
  getSelectedApprovalMain,
  updateApprovalHeader,
} from "../../controllers/approval/saveApprovalHeader.js";
import {
  saveORiginator,
  getOriginator,
  getSelectedOriginatorID,
  deleteOriginator,
} from "../../controllers/approval/saveOriginator.js";
import {
  saveApprover,
  getApprovers,
  getApproversByApprovalID,
  deleteApprover,
} from "../../controllers/approval/saveApprover.js";
import { getApprovalMain } from "../../controllers/approval/getApprovalMain.js";

const router = express.Router();

// Approval Header
router.post("/save-approval-header", saveApprovalHeader);
router.post("/save-originator", saveORiginator);
router.post("/save-approver", saveApprover);
router.put("/update-approver/:AppProcID", updateApprovalHeader);

// Originator
router.get("/get-approval-header", getApprovalHeader);
router.get("/get-originator", getOriginator);
router.get("/get-originator/:AppProcID", getSelectedOriginatorID);
router.delete("/delete-originator/:AppProcID", deleteOriginator);

// Approvert
router.get("/get-approver", getApprovers);
router.get("/get-approver/:AppProcID", getApproversByApprovalID);
router.get("/get-approval-main", getApprovalMain);
router.delete("/delete-approver/:AppProcID", deleteApprover);

// Get Main Approval Procedure
router.get("/get-selected-approval-main/:AppProcID", getSelectedApprovalMain);

export default router;
