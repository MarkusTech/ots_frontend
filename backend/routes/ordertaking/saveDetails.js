import express from "express";
import {
  saveDetails,
  deleteDetails,
} from "../../controllers/ordertaking/saveDetails.js";

const router = express.Router();

// Save Details
router.post("/details", saveDetails);

// Delete Details
router.delete("/details/:DraftNum", deleteDetails);

export default router;
