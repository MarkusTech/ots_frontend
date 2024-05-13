import express from "express";
import {
  saveUsers,
  getSingleUsers,
  getUsers,
  updateUser,
} from "../controllers/db2_saveUsers.js";
const router = express.Router();

router.post("/users", saveUsers);
router.get("/users", getUsers);
router.get("/user/:id", getSingleUsers);
router.put("/user/:id", updateUser);

export default router;
