import express from "express";
import {
  getSingleDataFromDraft,
  getDataFromDraft,
} from "../../controllers/ordertaking/getSingleDraftData.js";
const router = express.Router();

router.get("/get-draft", getDataFromDraft);
router.get("/get-draft/:DraftNum", getSingleDataFromDraft);

export default router;
