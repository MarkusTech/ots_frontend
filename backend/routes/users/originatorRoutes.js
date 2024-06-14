import express from "express";
import { getOriginator } from "../../controllers/users/originator.js";
const router = express.Router();

router.get("/originator", getOriginator);

export default router;
