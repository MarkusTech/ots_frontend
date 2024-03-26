import express from "express";
import { saveCommit } from "../controllers/saveFinalCommit.js";
const router = express.Router();

router.get("/final-commit", saveCommit);

export default router;
