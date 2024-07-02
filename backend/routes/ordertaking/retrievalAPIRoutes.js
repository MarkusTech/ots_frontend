import express from "express";
import { getCustomers } from "../../controllers/ordertaking/retrieval/listOfCustomer.js";
import { getOum } from "../../controllers/ordertaking/retrieval/uom.js";
const router = express.Router();

// get list of customers
router.get("/customer", getCustomers);

// get OUM
router.get("/oum/:itemCode", getOum);

export default router;
