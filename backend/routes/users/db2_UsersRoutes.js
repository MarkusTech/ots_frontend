import express from "express";
import {
  saveUsers,
  getSingleUsers,
  getUsers,
  updateUser,
  getTheLastUserId,
  deleteUser,
} from "../../controllers/users/db2_saveUsers.js";
const router = express.Router();

router.post("/users", saveUsers);
router.get("/users", getUsers);
router.get("/user/:UserId", getSingleUsers);
router.put("/user/:UserId", updateUser);
router.get("/userId", getTheLastUserId);
router.delete("/user/:UserId", deleteUser);

export default router;
