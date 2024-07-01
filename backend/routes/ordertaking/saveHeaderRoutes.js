import express from "express";
import {
  saveHeader,
  updateHeader,
} from "../../controllers/ordertaking/saveHeader.js";
const router = express.Router();

router.post("/header", saveHeader);
router.put("/header/:DraftNum", updateHeader);

export default router;
