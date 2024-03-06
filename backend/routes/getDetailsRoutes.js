import express from "express";
import {
  getDetails,
  getSelectedDetails,
} from "../controllers/getDetailsController.js";
const router = express.Router();

router.get("/get-details", getDetails);
router.get("/get-detail/:DraftNum", getSelectedDetails);

export default router;
