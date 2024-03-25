import express from "express";
import { saveHeader } from "../controllers/saveHeader.js";
const router = express.Router();

router.get("/header", saveHeader);

export default router;
