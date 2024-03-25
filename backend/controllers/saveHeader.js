import sqlConn from "../config/db.js";

const saveHeader = async (req, res) => {
  const {
    EntryNum,
    DraftNum,
    DocNum,
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
    TotalAmtAftTax,
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
    // validating the last number of draftNumber
    const draftNumResult =
      await sqlConn.query`SELECT MAX(DraftNum) AS maxDraftNum FROM SO_Header`;
    const maxDraftNum = parseInt(draftNumResult.recordset[0].maxDraftNum);
    const incrementedDraftNum = maxDraftNum + 1;
    // res.send(incrementedDraftNum.toString());
    const saveDraftNum = incrementedDraftNum.toString();

    // inserting value to the header
    const saveHeaderValues = await sqlConn.query`INSERT INTO SO_Header
    ([EntryNum], [DraftNum], [DocNum], [PostingDate], [DocDate], [CustomerCode], [CustomerName],
    [WalkInName], [ShippingAdd], [TIN], [Reference], [SCPWDIdNo], [Branch], [DocStat], [BaseDoc],
    [Cash], [DebitCard], [CreditCard], [ODC], [PDC], [OnlineTransfer], [OnAccount], [COD],
    [TotalAmtBefTax], [TotalTax], [TotalAmtAftTax], [SCPWDDiscTotal], [TotalAmtDue], [Remarks],
    [CreatedBy], [DateCreated], [UpdatedBy], [DateUpdated], [SalesCrew], [ForeignName])
    VALUES
    (${EntryNum}, ${saveDraftNum},${DocNum}, ${isoPostingDate}, ${isoDocDate}, ${CustomerCode}, ${CustomerName},
    ${WalkInName}, ${ShippingAdd}, ${TIN}, ${Reference}, ${SCPWDIdNo}, ${Branch}, ${DocStat}, ${BaseDoc},
    ${Cash}, ${DebitCard}, ${CreditCard}, ${ODC}, ${PDC}, ${OnlineTransfer}, ${OnAccount}, ${COD},
    ${TotalAmtBefTax}, ${TotalTax}, ${TotalAmtAftTax}, ${SCPWDDiscTotal}, ${TotalAmtDue}, ${Remarks},
    ${CreatedBy}, ${DateCreated}, ${UpdatedBy}, ${DateUpdated}, ${SalesCrew}, ${ForeignName})`;

    res.status(200).json({
      success: true,
      message: "Header Successfully Save",
      saveDraftNum,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { saveHeader };
