import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      required: [true, "Item code is required"],
    },
    itemName: {
      type: String,
      required: [true, "Item name is required"],
    },
    uom: {
      type: String,
      required: [true, "Uom is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    price: {
      type: String,
      required: [true, "Price is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
