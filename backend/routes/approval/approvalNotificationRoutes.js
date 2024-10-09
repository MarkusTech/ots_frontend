import express from "express";
import {
  approvalNotification,
  originatorList,
  orignatorNotificationCount,
  approverList,
} from "../../controllers/approval/approvalNotification.js";
const router = express.Router();

router.get("/approval-notification", approvalNotification);
router.get("/originator-list", originatorList);
router.get("/originator-notification", orignatorNotificationCount);

router.get("/approver-list/:approverID", approverList);

export default router;
