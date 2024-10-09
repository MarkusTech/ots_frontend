import express from "express";
import {
  approvalNotification,
  originatorList,
  orignatorNotificationCount,
  approverList,
} from "../../controllers/approval/approvalNotification.js";
const router = express.Router();

// Originator Notification
router.get("/originator-list", originatorList);
router.get("/originator-notification", orignatorNotificationCount);

// Approver Notification
router.get("/approver-list/:approverID", approverList);
router.get("/approval-notification", approvalNotification);

export default router;
