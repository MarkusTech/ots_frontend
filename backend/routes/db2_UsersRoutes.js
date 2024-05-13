import express from "express";
import {
  saveUsers,
  getSingleUsers,
  getUsers,
  updateUser,
  getTheLastUserId,
} from "../controllers/db2_saveUsers.js";
const router = express.Router();

router.post("/users", saveUsers);
router.get("/users", getUsers);
router.get("/user/:UserId", getSingleUsers);
router.put("/user/:UserId", updateUser);
router.get("/userId", getTheLastUserId);

export default router;
