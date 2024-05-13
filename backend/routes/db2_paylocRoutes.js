import express from "express";
import { getLocation } from "../controllers/db2_payloc.js";
const router = express.Router();

router.get("/getlocation", getLocation);

export default router;
