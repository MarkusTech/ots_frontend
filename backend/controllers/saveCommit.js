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

const saveCommitDetails = async (req, res) => {
  const {
    LineID,
    DraftNum,
    ItemCode,
    ItemName,
    Quantity,
    UoM,
    UoMConv,
    Whse,
    InvStat,
    SellPriceBefDisc,
    DiscRate,
    SellPriceAftDisc,
    LowerBound,
    TaxCode,
    TaxCodePerc,
    TaxAmt,
    BelPriceDisc,
    Cost,
    BelCost,
    ModeReleasing,
    SCPWDdisc,
    GrossTotal,
  } = req.body;

  try {
    const result = await sqlConn.query`
    INSERT INTO [dbo].[SO_Details_Commit]
           ([LineID]
           ,[DraftNum]
           ,[ItemCode]
           ,[ItemName]
           ,[Quantity]
           ,[UoM]
           ,[UoMConv]
           ,[Whse]
           ,[InvStat]
           ,[SellPriceBefDisc]
           ,[DiscRate]
           ,[SellPriceAftDisc]
           ,[LowerBound]
           ,[TaxCode]
           ,[TaxCodePerc]
           ,[TaxAmt]
           ,[BelPriceDisc]
           ,[Cost]
           ,[BelCost]
           ,[ModeReleasing]
           ,[SCPWDdisc]
           ,[GrossTotal])
     VALUES
            (${LineID},${DraftNum},${ItemCode},${ItemName},${Quantity},${UoM},${UoMConv},${Whse},${InvStat},${SellPriceBefDisc},${DiscRate},${SellPriceAftDisc},${LowerBound},${TaxCode},${TaxCodePerc},${TaxAmt},${BelPriceDisc},${Cost},${BelCost},${ModeReleasing},${SCPWDdisc},${GrossTotal})`;

    res.status(200).json({
      success: true,
      message: "Details Commited Successfully",
      result,
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

const getAllCommitedDetails = async (req, res) => {
  try {
    const result = await sqlConn.query`Select * FROM [dbo].[SO_Details_Commit]`;

    const data = result.recordset;
    res.status(200).json({
      success: true,
      message: "Commit Details Fetched!",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const commit = async (req, res) => {
  const { DraftNum } = req.body;
  try {
    const result = await sqlConn.query`EXEC dbo.SP_COMMIT_SO ${DraftNum}`;
    const DocNumber =
      await sqlConn.query`SELECT DocNum FROM SO_Header WHERE DraftNum= ${DraftNum}`;

    const data = DocNumber.recordset[0];
    res.status(200).json({
      success: true,
      message: "Successfully Commited!",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "Internal Server Error" });
  }
};

export {
  saveCommitHeader,
  saveCommitDetails,
  getAllCommitedHeader,
  getAllCommitedDetails,
  commit,
};
