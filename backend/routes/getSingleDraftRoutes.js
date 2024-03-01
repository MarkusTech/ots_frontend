import express from "express";
import { getSingleDataFromDraft } from "../controllers/getSingleDraftData.js";
const router = express.Router();

router.get("/get-draft/:id", getSingleDataFromDraft);

export default router;
