import express from "express";
import { getLastApprovalID } from "../../controllers/approval/getLastApprovalID.js";
const router = express.Router();

router.get("/last-approval-id", getLastApprovalID);

export default router;
