import sqlConn from "../config/db.js";

const saveCommitHeader = async (req, res) => {
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
    // Convert date strings to Date objects and then to ISO 8601 format
    const isoPostingDate = new Date(PostingDate).toISOString();
    const isoDocDate = new Date(DocDate).toISOString();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const saveCommitDetails = async (req, res) => {
  const {} = req.body;
};

export { saveCommitHeader, saveCommitDetails };
