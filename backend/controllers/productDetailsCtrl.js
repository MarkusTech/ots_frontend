import detailModel from "../models/detailModel.js";

const productDetailsSave = async (req, res) => {
  req.send("Save Product Details Successfully");
};

const getProductDetails = async (req, res) => {
  res.send("Get Product Details in an Array");
};

export { productDetailsSave, getProductDetails };
