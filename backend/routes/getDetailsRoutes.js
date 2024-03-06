import express from "express";
import {
  getDetails,
  getSingleDetails,
} from "../controllers/getDetailsController.js";
const router = express.Router();

router.get("/get-details", getDetails);
router.get("/get-detail/:DraftNum", getSingleDetails);

export default router;
