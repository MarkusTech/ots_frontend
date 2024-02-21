import mongoose from "mongoose";

const productDetailsSchema = new mongoose.Schema({
  LineID: {
    type: Number,
  },
  EntryNum: {
    type: String,
  },
  ItemCode: {
    type: String,
  },
  ItemName: {
    type: String,
  },
  Quantity: {
    type: Number,
  },
  UoM: {
    type: String,
  },
  UoMConv: {
    type: Number,
  },
  Whse: {
    type: String,
  },
  InvStat: {
    type: String,
  },
  SellPriceBefDisc: {
    type: Number,
  },
  DiscRate: {
    type: Number,
  },
  SellPriceAftDisc: {
    type: Number,
  },
  LowerBound: {
    type: Number,
  },
  TaxCode: {
    type: String,
  },
  TaxCodePerc: {
    type: Number,
  },
  TaxAmt: {
    type: Number,
  },
  BelPriceDisc: {
    type: Number,
  },
  Cost: {
    type: Number,
  },
  BelCost: {
    type: String,
  },
  ModeReleasing: {
    type: String,
  },
  SCPWDdisc: {
    type: String,
    maxlength: 1,
  },
  GrossTotal: {
    type: Number,
  },
});

export default mongoose.model("ProductDetails", productDetailsSchema);
