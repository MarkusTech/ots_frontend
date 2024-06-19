import express from "express";
import {
  saveApprovalHeader,
  getApprovalHeader,
  getSelectedApprovalMain,
} from "../../controllers/approval/saveApprovalHeader.js";
import {
  saveORiginator,
  getOriginator,
} from "../../controllers/approval/saveOriginator.js";
import {
  saveApprover,
  getApprovers,
} from "../../controllers/approval/saveApprover.js";
import { getApprovalMain } from "../../controllers/approval/getApprovalMain.js";

const router = express.Router();

router.post("/save-approval-header", saveApprovalHeader);
router.post("/save-originator", saveORiginator);
router.post("/save-approver", saveApprover);

router.get("/get-approval-header", getApprovalHeader);
router.get("/get-originator", getOriginator);
router.get("/get-approver", getApprovers);
router.get("/get-approval-main", getApprovalMain);

router.get("/get-selected-approval-main/:AppProcID", getSelectedApprovalMain);

export default router;
