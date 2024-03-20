import express from "express";
import { saveCommitHeader } from "../controllers/saveCommit.js";
const router = express.Router();

router.post("/save-commit", saveCommitHeader);

export default router;
