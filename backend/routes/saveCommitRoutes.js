import express from "express";
import { saveCommit } from "../controllers/saveCommit.js";
const router = express.Router();

router.post("/save-commit", saveCommit);

export default router;
