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

    const result = await sqlConn.query`
      INSERT INTO [OTS_DB].[dbo].[SO_Header_Commit]
      ([EntryNum], [DraftNum], [PostingDate], [DocDate], [CustomerCode], [CustomerName],
      [WalkInName], [ShippingAdd], [TIN], [Reference], [SCPWDIdNo], [Branch], [DocStat], [BaseDoc],
      [Cash], [DebitCard], [CreditCard], [ODC], [PDC], [OnlineTransfer], [OnAccount], [COD],
      [TotalAmtBefTax], [TotalTax], [TotalAmtTax], [SCPWDDiscTotal], [TotalAmtDue], [Remarks],
      [CreatedBy], [DateCreated], [UpdatedBy], [DateUpdated], [SalesCrew], [ForeignName])
      VALUES
      (${EntryNum}, ${DraftNum}, ${isoPostingDate}, ${isoDocDate}, ${CustomerCode}, ${CustomerName},
      ${WalkInName}, ${ShippingAdd}, ${TIN}, ${Reference}, ${SCPWDIdNo}, ${Branch}, ${DocStat}, ${BaseDoc},
      ${Cash}, ${DebitCard}, ${CreditCard}, ${ODC}, ${PDC}, ${OnlineTransfer}, ${OnAccount}, ${COD},
      ${TotalAmtBefTax}, ${TotalTax}, ${TotalAmtTax}, ${SCPWDDiscTotal}, ${TotalAmtDue}, ${Remarks},
      ${CreatedBy}, ${DateCreated}, ${UpdatedBy}, ${DateUpdated}, ${SalesCrew}, ${ForeignName})`;

    const docNumResult = await sqlConn.query`
      SELECT DocNum From SO_Header_Commit Where DraftNum = ${DraftNum}`;

    const DocNumber = docNumResult.recordset[0].DocNum;

    res.status(200).json({
      DocNumber,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCommitedHeader = async (req, res) => {
  try {
    const result =
      await sqlConn.query`Select * FROM [OTS_DB].[dbo].[SO_Header_Commit]`;

    const data = result.recordset;
    res.status(200).json({
      success: true,
      message: "Commit Header Fetched!",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const saveCommitDetails = async (req, res) => {
  const {} = req.body;
};

export { saveCommitHeader, saveCommitDetails, getAllCommitedHeader };
