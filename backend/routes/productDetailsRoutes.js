import express from "express";
import {
  productDetailsSave,
  getProductDetails,
} from "../controllers/productDetailsCtrl.js";
const router = express.Router();

router.post("/product-detail", productDetailsSave);
router.get("/product-detail", getProductDetails);

export default router;
