import express from "express";
import {
  approvalNotification,
  originatorList,
  orignatorNotificationCount,
  approverList,
  approverListV2,
  approverListV3,
  approverNotification,
} from "../../controllers/approval/approvalNotification.js";
const router = express.Router();

// Originator Notification
router.get("/originator-list/:originatorID", originatorList);
router.get(
  "/originator-notification/:originatorID",
  orignatorNotificationCount
);

// Approver Notification
router.get("/approval-notification", approvalNotification);
router.get("/approver-list/:approverID", approverList);
router.get("/approver-list/v2/:approverID", approverListV2);
router.get("/approver-list/v3/:approverID", approverListV3);
router.get("/approver-notification/:approverID", approverNotification);

export default router;
