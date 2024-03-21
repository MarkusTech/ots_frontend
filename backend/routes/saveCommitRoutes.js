import express from "express";
import {
  saveCommitHeader,
  saveCommitDetails,
  getAllCommitedHeader,
  getAllCommitedDetails,
  commit,
} from "../controllers/saveCommit.js";
const router = express.Router();

router.post("/save-commit-header", saveCommitHeader);
router.post("/save-commit-details", saveCommitDetails);
router.get("/get-commit-header", getAllCommitedHeader);
router.get("/get-commit-details", getAllCommitedDetails);
router.put("/commit", commit);

export default router;
