import sqlConn from "../../config/db.js";

const saveHeader = async (req, res) => {
  const {
    EntryNum,
    DraftNum,
    DocNum,
    PostingDate,
    DocDate,
    DeliveryDate,
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
    ApprovalStat,
    Synced,
  } = req.body;

  try {
    const isoPostingDate = new Date(PostingDate).toISOString();
    const isoDocDate = new Date(DocDate).toISOString();
    const isDeliveryDate = new Date(DeliveryDate).toISOString();
    // validating the last number of draftNumber
    const draftNumResult =
      await sqlConn.query`SELECT MAX(DraftNum) AS maxDraftNum FROM SO_Header`;
    const maxDraftNum = parseInt(draftNumResult.recordset[0].maxDraftNum);
    const incrementedDraftNum = maxDraftNum + 1;
    // res.send(incrementedDraftNum.toString());
    const saveDraftNum = incrementedDraftNum.toString();

    // inserting value to the header
    const saveHeaderValues = await sqlConn.query`INSERT INTO SO_Header
    ([EntryNum], [DraftNum], [DocNum], [PostingDate], [DocDate], [DeliveryDate], [CustomerCode], [CustomerName],
    [WalkInName], [ShippingAdd], [TIN], [Reference], [SCPWDIdNo], [Branch], [DocStat], [BaseDoc],
    [Cash], [DebitCard], [CreditCard], [ODC], [PDC], [OnlineTransfer], [OnAccount], [COD],
    [TotalAmtBefTax], [TotalTax], [TotalAmtAftTax], [SCPWDDiscTotal], [TotalAmtDue], [Remarks],
    [CreatedBy], [DateCreated], [UpdatedBy], [DateUpdated], [SalesCrew], [ForeignName], [ApprovalStat], [Synced])
    VALUES
    (${EntryNum}, ${saveDraftNum},${DocNum}, ${isoPostingDate}, ${isoDocDate}, ${isDeliveryDate}, ${CustomerCode}, ${CustomerName},
    ${WalkInName}, ${ShippingAdd}, ${TIN}, ${Reference}, ${SCPWDIdNo}, ${Branch}, ${DocStat}, ${BaseDoc},
    ${Cash}, ${DebitCard}, ${CreditCard}, ${ODC}, ${PDC}, ${OnlineTransfer}, ${OnAccount}, ${COD},
    ${TotalAmtBefTax}, ${TotalTax}, ${TotalAmtAftTax}, ${SCPWDDiscTotal}, ${TotalAmtDue}, ${Remarks},
    ${CreatedBy}, ${DateCreated}, ${UpdatedBy}, ${DateUpdated}, ${SalesCrew}, ${ForeignName}, ${ApprovalStat}, 'N')`;

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

const updateHeader = async (req, res) => {
  const {
    EntryNum,
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
    ApprovalStat,
    UpdatedBy,
    DateUpdated,
    SalesCrew,
    ForeignName,
  } = req.body;

  const { DraftNum } = req.params;

  try {
    const isoPostingDate = new Date(PostingDate).toISOString();
    const isoDocDate = new Date(DocDate).toISOString();

    // Construct the SQL query with parameterized values
    const result = await sqlConn.query(`UPDATE [dbo].[SO_Header]
   SET [EntryNum] = '${EntryNum}'
      ,[DocNum] = ${DocNum}
      ,[PostingDate] = '${isoPostingDate}'
      ,[DocDate] = '${isoDocDate}'
      ,[CustomerCode] = '${CustomerCode}'
      ,[CustomerName] = '${CustomerName}'
      ,[WalkInName] = '${WalkInName}'
      ,[ShippingAdd] = '${ShippingAdd}'
      ,[TIN] = '${TIN}'
      ,[Reference] = '${Reference}'
      ,[SCPWDIdNo] = '${SCPWDIdNo}'
      ,[Branch] = '${Branch}'
      ,[DocStat] = '${DocStat}'
      ,[BaseDoc] = ${BaseDoc}
      ,[Cash] = '${Cash}'
      ,[CreditCard] = '${CreditCard}'
      ,[DebitCard] = '${DebitCard}'
      ,[ODC] = '${ODC}'
      ,[PDC] = '${PDC}'
      ,[OnlineTransfer] = '${OnlineTransfer}'
      ,[OnAccount] = '${OnAccount}'
      ,[COD] = '${COD}'
      ,[TotalAmtBefTax] = ${TotalAmtBefTax}
      ,[TotalTax] =  ${TotalTax}
      ,[TotalAmtAftTax] =  ${TotalAmtAftTax}
      ,[SCPWDDiscTotal] =  ${SCPWDDiscTotal}
      ,[TotalAmtDue] =  ${TotalAmtDue}
      ,[Remarks] = '${Remarks}'
      ,[SalesCrew] = '${SalesCrew}'
      ,[ForeignName] = '${ForeignName}'
      ,[ApprovalStat] = ${ApprovalStat}
      ,[CreatedBy] = '${CreatedBy}'
      ,[DateCreated] = '${DateCreated}'
      ,[UpdatedBy] = ${UpdatedBy}
      ,[DateUpdated] = '${DateUpdated}'
 WHERE DraftNum = ${DraftNum}`);
    // Check if any rows were affected
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Header not found" });
    }

    res.status(200).json({
      success: true,
      message: "Header Successfully Updated",
    });
  } catch (error) {
    console.error("Error updating SO Header:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { saveHeader, updateHeader };
