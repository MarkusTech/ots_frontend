import express from "express";
import { getCustomers } from "../../controllers/ordertaking/retrieval/listOfCustomer.js";
import { getOum } from "../../controllers/ordertaking/retrieval/uom.js";
import { getTaxRate } from "../../controllers/ordertaking/retrieval/tax-rate.js";
const router = express.Router();

// get list of customers
router.get("/customer", getCustomers);

// get OUM
router.get("/uom/:itemCode", getOum);

// tax-rate
router.get("/tax-rate/:taxCode", getTaxRate);

export default router;
