import express from "express";
import { getListOfWarehouse } from "../../controllers/warehouse/getListWarehouse.js";
const router = express.Router();

router.get("/list-warehouse", getListOfWarehouse);

export default router;
