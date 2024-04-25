import express from "express";
import { receipt } from "../controllers/receipt.js";
const router = express.Router();

router.get("/receipt", receipt);

export default router;
