import express from "express";
import { testconnection } from "../../controllers/connection/connection.js";
const router = express.Router();

router.get("/", testconnection);

export default router;
