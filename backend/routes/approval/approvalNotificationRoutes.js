import express from "express";
import {
  approvalNotification,
  originatorList,
  orignatorNotificationCount,
} from "../../controllers/approval/approvalNotification.js";
const router = express.Router();

router.get("/approval-notification", approvalNotification);
router.get("/originator-list", originatorList);
router.get("/originator-notification", orignatorNotificationCount);

export default router;
