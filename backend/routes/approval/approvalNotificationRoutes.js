import express from "express";
import {
  approvalNotification,
  originatorList,
  orignatorNotificationCount,
  approverList,
  approverNotification,
} from "../../controllers/approval/approvalNotification.js";
const router = express.Router();

// Originator Notification
router.get("/originator-list", originatorList);
router.get(
  "/originator-notification/:originatorID",
  orignatorNotificationCount
);

// Approver Notification
router.get("/approver-list/:approverID", approverList);
router.get("/approval-notification", approvalNotification);
router.get("/approver-notification/:approverID", approverNotification);

export default router;
