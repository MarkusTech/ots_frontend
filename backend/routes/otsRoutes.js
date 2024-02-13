import express from "express";
import { getAllOtsProd, saveOtsProd } from "../controllers/otsController.js";

const router = express.Router();

router.get("/ots", getAllOtsProd);
router.post("/ots", saveOtsProd);

export default router;
