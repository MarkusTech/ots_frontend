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

    res.status(200).json({
      success: true,
      message: "Successfully Save to Header",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { saveCommitHeader };
