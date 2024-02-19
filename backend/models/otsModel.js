import mongoose from "mongoose";

const otsSchema = new mongoose.Schema(
  {
    EntryNum: {
      type: Number,
    },
    DocNum: {
      type: String,
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
      type: String,
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
      type: String,
    },
    TotalTax: {
      type: String,
    },
    TotalAmtAftTax: {
      type: String,
    },

    SCPWDDiscTotal: {
      type: String,
    },
    TotalAmtDue: {
      type: String,
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
