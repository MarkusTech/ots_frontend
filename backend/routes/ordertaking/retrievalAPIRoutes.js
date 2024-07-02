import express from "express";
import { getCustomers } from "../../controllers/ordertaking/retrieval/listOfCustomer.js";
const router = express.Router();

router.get("/customer", getCustomers);

export default router;
