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
router.get("/approval/type/:AppTypeID", getSingleApprovalType);
router.put("/approval/type/:AppTypeID", updateApprovalType);
router.delete("/approval/type/:AppTypeID", deleteApprovalType);

export default router;
