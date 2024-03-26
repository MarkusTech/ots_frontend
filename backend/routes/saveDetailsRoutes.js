import express from "express";
import { saveDetails } from "../controllers/saveDetails.js";
const router = express.Router();

router.post("/details", saveDetails);

export default router;
