import express from "express";
import { saveCommit } from "../controllers/saveFinalCommit.js";
const router = express.Router();

router.put("/final-commit", saveCommit);

export default router;
