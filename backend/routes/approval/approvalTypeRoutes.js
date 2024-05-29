import express from "express";
import {
  saveApprovalType,
  getApprovalType,
  getSingleApprovalType,
  updateApprovalType,
  deleteApprovalType,
} from "../../controllers/approval/approvalTypeController.js";
const router = express.Router();

router.post("/approval/type", saveApprovalType);
router.get("/approval/type", getApprovalType);
router.get("/approval/type/:id", getSingleApprovalType);
router.put("/approval/type/:id", updateApprovalType);
router.delete("/approval/type", deleteApprovalType);

export default router;
