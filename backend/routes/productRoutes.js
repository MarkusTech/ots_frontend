import express from "express";
import {
  saveProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productCtrl.js";

const router = express.Router();

router.get("/product", getProducts);
router.get("/product/:_id", getProduct);
router.post("/product", saveProduct);
router.put("/product/:_id", updateProduct);
router.delete("/product/:_id", deleteProduct);

export default router;
