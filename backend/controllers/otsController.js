import otsModel from "../models/otsModel.js";

const getAllOtsProd = async (req, res) => {
  try {
    const data = await otsModel.find();
    res.status(200).json({
      success: true,
      message: "Ots Header Fetched!",
      data,
    });
  } catch (error) {
    console.log(error);
    new Error(error);
  }
};

const saveOtsProd = async (req, res) => {
  const {
    EntryNum,
    DocNum,
    DraftNum,
    PostingDate,
    DocDate,
    CustomerCode,
    CustomerName,
    WalkInName,
    ShippingAdd,
    ForeignName,
    TIN,
    Reference,
    SCPWDIdNo,
    Branch,
    DocStat,
    BaseDoc,
    Cash,
    CreditCard,
    DebitCard,
    ODC,
    PDC,
    OnlineTransfer,
    OnAccount,
    COD,
    TotalAmtBefTax,
    SCPWDDiscTotal,
    TotalAmtDue,
    Remarks,
    CreatedBy,
    DateCreated,
    UpdatedBy,
    DateUpdated,
  } = req.body;
  try {
    const data = await otsModel.create(req.body);
    res.status(200).json({
      success: true,
      message: "ots save successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    new Error(error);
  }
};

export { getAllOtsProd, saveOtsProd };
