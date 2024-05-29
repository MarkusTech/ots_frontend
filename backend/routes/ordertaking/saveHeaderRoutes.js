import express from "express";
import { saveHeader } from "../../controllers/ordertaking/saveHeader.js";
const router = express.Router();

router.post("/header", saveHeader);

export default router;
