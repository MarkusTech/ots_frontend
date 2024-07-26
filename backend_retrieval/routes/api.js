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
router.get("/customer", RetrievalController.getCustomers);

// get OUM
router.get("/uom/:itemCode", RetrievalController.getOum);

// tax-rate
router.get("/tax-rate/:taxCode", RetrievalController.getTaxRate);

// item list = line 1216
router.get(
  "/item/:priceListNum/:warehouseCode/:cardCode",
  RetrievalController.getItemList
);

// tax-code
router.get(
  "/tax-code/:cardCode/:warehouseCode",
  RetrievalController.getTaxCode
);

// lowerbound
router.get(
  "/lowerbound/:PriceListNum/:taxCode/:itemCode/:warehouseCode/:UoMQty",
  RetrievalController.getLowerBound
);

// sc-discount
router.get(
  "/sc-discount/:cardCode/:itemCode",
  RetrievalController.getScDiscount
);

// stocks availability
router.get(
  "/stocks-availability/:docNum/:itemCode/:warehouseCode/:ordrQty/:ExcludeBO",
  RetrievalController.stockAvailability
);

// srp
router.get(
  "/srp/:itemCode/:ItemsPerUnit/:UoM/:taxCode/:lowerbound/:vendorCode/:PriceListNum",
  RetrievalController.srp
);

// employee
router.get("/employee", RetrievalController.employee);

// pick-up location
router.get(
  "/pickup-location/:ItemCode/:Qty/:Whs",
  RetrievalController.pickUpLocation
);

// salescrew
router.get("/salescrew", RetrievalController.salescrew);

// warehouse-soh
router.get(
  "/warehouse-soh/:itemCode/:UoM/:branchID",
  RetrievalController.warehouseSoh
);

export default router;
