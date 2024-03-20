import express from "express";
import {
  saveCommitHeader,
  saveCommitDetails,
} from "../controllers/saveCommit.js";
const router = express.Router();

router.post("/save-commit-header", saveCommitHeader);
router.post("/save-commit-details", saveCommitDetails);

export default router;
