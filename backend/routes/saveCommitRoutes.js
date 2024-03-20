import express from "express";
import {
  saveCommitHeader,
  saveCommitDetails,
  getAllCommitedHeader,
  getAllCommitedDetails,
} from "../controllers/saveCommit.js";
const router = express.Router();

router.post("/save-commit-header", saveCommitHeader);
router.post("/save-commit-details", saveCommitDetails);
router.get("/get-commit-header", getAllCommitedHeader);
router.get("/get-commit-details", getAllCommitedDetails);

export default router;
