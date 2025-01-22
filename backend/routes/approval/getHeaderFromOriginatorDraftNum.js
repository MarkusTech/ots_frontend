import express from "express";
import { orignatorToSalesOrder } from "../../controllers/approval/orignatorToSalesOrder.js";

const router = express.Router();

router.get(
  "/get-header-from-originator-draft-num/:DraftNum",
  orignatorToSalesOrder
);

export default router;
