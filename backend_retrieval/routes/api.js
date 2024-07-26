import express from "express";
import { connection } from "../controller/connection.js";
import RetrievalController from "../controller/retrievalController.js";

const router = express.Router();

// test Connection
router.get("/con", connection);

// ----------------------------- Retrieval API ROUTES -----------------------------
// cost
router.get("/cost/:itemCode/:warehouseCode", RetrievalController.cost);
// discount price

router.get(
  "/discount-price/:brachID/:beforeDiscount/:cardCode/:itemCode/:Qty/:UoM/:lowerBound/:creditCard/:debitCard/:PDC/:PO/:taxCode",
  RetrievalController.discountPrice
);

// get list of customers
router.get("/customer", getCustomers);

// get OUM
router.get("/uom/:itemCode", getOum);

// tax-rate
router.get("/tax-rate/:taxCode", getTaxRate);

// item list = line 1216
router.get("/item/:priceListNum/:warehouseCode/:cardCode", getItemList);

// tax-code
router.get("/tax-code/:cardCode/:warehouseCode", getTaxCode);

// lowerbound
router.get(
  "/lowerbound/:PriceListNum/:taxCode/:itemCode/:warehouseCode/:UoMQty",
  getLowerBound
);

// sc-discount
router.get("/sc-discount/:cardCode/:itemCode", getScDiscount);

// stocks availability
router.get(
  "/stocks-availability/:docNum/:itemCode/:warehouseCode/:ordrQty/:ExcludeBO",
  stockAvailability
);

// srp
router.get(
  "/srp/:itemCode/:ItemsPerUnit/:UoM/:taxCode/:lowerbound/:vendorCode/:PriceListNum",
  srp
);

// employee
router.get("/employee", employee);

// pick-up location
router.get("/pickup-location/:ItemCode/:Qty/:Whs", pickUpLocation);

// salescrew
router.get("/salescrew", salescrew);

// warehouse-soh
router.get("/warehouse-soh/:itemCode/:UoM/:branchID", warehouseSoh);

export default router;
