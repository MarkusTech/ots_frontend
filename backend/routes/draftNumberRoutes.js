import express from "express";
import {
  draftNumber,
  getDraftNumber,
} from "../controllers/draftNumberController.js";

const router = express.Router();

router.post("/draftNumber", draftNumber);
router.get("/draftNumber", getDraftNumber);

export default router;
