import express from "express";
import {
  approvalNotification,
  originatorList,
} from "../../controllers/approval/approvalNotification.js";
const router = express.Router();

router.get("/approval-notification", approvalNotification);
router.get("/originator-list", originatorList);

export default router;
