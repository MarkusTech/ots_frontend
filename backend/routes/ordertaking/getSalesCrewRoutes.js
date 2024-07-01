import express from "express";
import { getSalesCrew } from "../../controllers/ordertaking/getSalesCrew.js";
const router = express.Router();

router.get("/salescrew", getSalesCrew);

export default router;
