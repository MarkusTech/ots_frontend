import sqlConn from "../config/db.js";

const saveHeader = async (req, res) => {
  const {
    EntryNum,
    DraftNum,
    PostingDate,
    DocDate,
    CustomerCode,
    CustomerName,
    WalkInName,
    ShippingAdd,
    TIN,
    Reference,
    SCPWDIdNo,
    Branch,
    DocStat,
    BaseDoc,
    Cash,
    DebitCard,
    CreditCard,
    ODC,
    PDC,
    OnlineTransfer,
    OnAccount,
    COD,
    TotalAmtBefTax,
    TotalTax,
    TotalAmtTax,
    SCPWDDiscTotal,
    TotalAmtDue,
    Remarks,
    CreatedBy,
    DateCreated,
    UpdatedBy,
    DateUpdated,
    SalesCrew,
    ForeignName,
  } = req.body;

  try {
    const isoPostingDate = new Date(PostingDate).toISOString();
    const isoDocDate = new Date(DocDate).toISOString();

    const result = await sqlConn.query``;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
