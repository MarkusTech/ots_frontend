import productModel from "../models/productModel.js";

const saveProduct = async (req, res) => {
  try {
    const { itemCode, itemName, uom, category, price } = req.body;
    const data = await productModel.create({
      itemCode: itemCode,
      itemName: itemName,
      uom: uom,
      category: category,
      price: price,
    });

    res.status(200).json({
      success: true,
      message: "Product Save Successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getProducts = async (req, res) => {
  try {
    const data = await productModel.find();
    res.status(200).json({
      success: true,
      message: "Product fetched",
      data,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getProduct = async (req, res) => {
  const { _id } = req.params;
  try {
    const data = await productModel.findById({ _id });
    res.status(200).json({
      success: true,
      message: "Product Found!",
      data,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const updateProduct = async (req, res) => {
  const { itemCode, itemName, uom, category, price } = req.body;
  const { _id } = req.params;
  try {
    const data = await productModel.findByIdAndUpdate({ _id: _id }, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const deleteProduct = async (req, res) => {
  const { _id } = req.params;
  try {
    const data = await productModel.findByIdAndDelete({ _id });
    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully!",
      data,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export { saveProduct, getProduct, getProducts, updateProduct, deleteProduct };
