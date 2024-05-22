import express from "express";
import { login, connection } from "../controllers/login.js";
const router = express.Router();

router.get("/login", login);
router.get("/connection", connection);

export default router;
