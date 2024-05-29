import express from "express";
import { saveCommit } from "../../controllers/ordertaking/saveFinalCommit.js";
const router = express.Router();

router.put("/final-commit", saveCommit);

export default router;
