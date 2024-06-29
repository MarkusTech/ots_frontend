import express from "express";
import { saveDetails } from "../../controllers/ordertaking/saveDetails.js";

const router = express.Router();

// Save Details
router.post("/details", saveDetails);

export default router;
