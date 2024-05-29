import express from "express";
import { saveApprovalType } from "../../controllers/approval/approvalTypeController.js";
const router = express.Router();

router.post("/approval/type", saveApprovalType);

export default router;
