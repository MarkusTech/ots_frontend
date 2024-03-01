import express from "express";
import { getSingleDataFromDraft } from "../controllers/getSingleDraftData.js";
const router = express.Router();

router.get("/get-draft", getSingleDataFromDraft);

export default router;

/*

import sqlConn from "./path/to/db"; // Adjust the path accordingly

// Controller to get all customers
const getAllCustomers = async (req, res) => {
  try {
    const result = await sqlConn.query("SELECT * FROM Customer");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAllCustomers };


*/
