import express from "express";
import { getCustomers } from "../../controllers/ordertaking/retrieval/listOfCustomer.js";
import { cost } from "../../controllers/ordertaking/retrieval/cost.js";
import { getOum } from "../../controllers/ordertaking/retrieval/uom.js";
import { getTaxRate } from "../../controllers/ordertaking/retrieval/tax-rate.js";
import { getItemList } from "../../controllers/ordertaking/retrieval/item.js";
import { getTaxCode } from "../../controllers/ordertaking/retrieval/tax-code.js";
import { getLowerBound } from "../../controllers/ordertaking/retrieval/lowerbound.js";
import { getScDiscount } from "../../controllers/ordertaking/retrieval/sc-discount.js";
import { discountPrice } from "../../controllers/ordertaking/retrieval/discount-price.js";
import { stockAvailability } from "../../controllers/ordertaking/retrieval/stocks-availability.js";
import { srp } from "../../controllers/ordertaking/retrieval/srp.js";
import { pickUpLocation } from "../../controllers/ordertaking/retrieval/pickup-location.js";
import { salescrew } from "../../controllers/ordertaking/retrieval/salescrew.js";
import { warehouseSoh } from "../../controllers/ordertaking/retrieval/warehouse-soh.js";
import { employee } from "../../controllers/ordertaking/retrieval/employee.js";

const router = express.Router();

// cost
router.get("/cost/:itemCode/:warehouseCode", cost);

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

// discount-price
router.get(
  "/discount-price/:brachID/:beforeDiscount/:cardCode/:itemCode/:Qty/:UoM/:lowerBound/:creditCard/:debitCard/:PDC/:PO/:taxCode",
  discountPrice
);

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
