import express from "express";
import {
  saveCommitHeader,
  saveCommitDetails,
  getAllCommitedHeader,
} from "../controllers/saveCommit.js";
const router = express.Router();

router.post("/save-commit-header", saveCommitHeader);
router.post("/save-commit-details", saveCommitDetails);
router.get("/get-commit-header", getAllCommitedHeader);

export default router;
