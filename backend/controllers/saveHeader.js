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
    const draftNumResult =
      await sqlConn.query`SELECT MAX(DraftNum) AS maxDraftNum FROM SO_Header`;
    const maxDraftNum = parseInt(draftNumResult.recordset[0].maxDraftNum);
    const incrementedDraftNum = maxDraftNum + 1;
    res.send(incrementedDraftNum.toString());
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { saveHeader };
