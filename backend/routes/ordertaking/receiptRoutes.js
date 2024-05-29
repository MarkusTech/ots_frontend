import express from "express";
import { receipt } from "../../controllers/ordertaking/receipt.js";
const router = express.Router();

router.get("/receipt/:DraftNumber", receipt);

export default router;
