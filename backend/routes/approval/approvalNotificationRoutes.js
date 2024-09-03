import express from "express";
import { approvalNotification } from "../../controllers/approval/approvalNotification.js";
const router = express.Router();

router.get("/approval-notification", approvalNotification);

export default router;
