import express from "express";
import {
  entryNumber,
  getEntryNumber,
} from "../controllers/entryNumberController.js";
const router = express.Router();

router.post("/entrynum", entryNumber);
router.get("/entrynum", getEntryNumber);

export default router;
