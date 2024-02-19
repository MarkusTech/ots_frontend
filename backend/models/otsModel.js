import mongoose from "mongoose";

const otsSchema = new mongoose.Schema(
  {
    EntryNum: {
      type: String,
    },
    DocNum: {
      type: Number,
    },
    DraftNum: {
      type: Number,
      unique: true,
    },
    PostingDate: {
      type: String,
    },
    DocDate: {
      type: String,
    },
    CustomerCode: {
      type: String,
    },
    CustomerName: {
      type: String,
    },
    WalkInName: {
      type: String,
    },
    ShippingAdd: {
      type: String,
    },
    ForeignName: {
      type: String,
    },
    TIN: {
      type: String,
    },
    Reference: {
      type: String,
    },
    SCPWDIdNo: {
      type: String,
    },
    Branch: {
      type: String,
    },
    DocStat: {
      type: String,
    },
    BaseDoc: {
      type: Number,
    },
    Cash: {
      type: String,
    },
    CreditCard: {
      type: String,
    },
    DebitCard: {
      type: String,
    },
    ODC: {
      type: String,
    },
    PDC: {
      type: String,
    },
    OnlineTransfer: {
      type: String,
    },
    OnAccount: {
      type: String,
    },
    COD: {
      type: String,
    },
    TotalAmtBefTax: {
      type: Number,
    },
    TotalTax: {
      type: Number,
    },
    TotalAmtAftTax: {
      type: Number,
    },

    SCPWDDiscTotal: {
      type: Number,
    },
    TotalAmtDue: {
      type: Number,
    },
    Remarks: {
      type: String,
    },
    CreatedBy: {
      type: String,
    },
    DateCreated: {
      type: String,
    },
    UpdatedBy: {
      type: String,
    },
    DateUpdated: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ots", otsSchema);
