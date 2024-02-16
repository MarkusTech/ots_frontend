import express from "express";
import {
  entryNumber,
  getEntryNumber,
} from "../controllers/entryNumberController.js";
const router = express.Router();

router.post("/entrynumber", entryNumber);
router.get("/entrynumber", getEntryNumber);

export default router;
