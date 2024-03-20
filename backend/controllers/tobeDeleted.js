// Import necessary modules
import sql from "mssql";
import express from "express";

// Create an Express app
const app = express();
app.use(express.json());

// Import MSSQL connection configuration
import sqlConn from "../config/db.js";

// Route to handle the API request
app.post("/saveCommitHeader", async (req, res) => {
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
    Remark,
    CreatedBy,
    DateCreated,
    UpdatedBy,
    DateUpdated,
    SalesCrew,
    ForeignName,
  } = req.body;

  try {
    // Connect to MSSQL database
    await sql.connect(sqlConn);

    // Define your SQL query to insert commit header data
    const query = `
            INSERT INTO [OTS_DB].[dbo].[SO_Header_Commit]
            ([EntryNum], [DraftNum], [PostingDate], [DocDate], [CustomerCode], [CustomerName],
            [WalkInName], [ShippingAdd], [TIN], [Reference], [SCPWDIdNo], [Branch], [DocStat], [BaseDoc],
            [Cash], [DebitCard], [CreditCard], [ODC], [PDC], [OnlineTransfer], [OnAccount], [COD],
            [TotalAmtBefTax], [TotalTax], [TotalAmtTax], [SCPWDDiscTotal], [TotalAmtDue], [Remarks],
            [CreatedBy], [DateCreated], [UpdatedBy], [DateUpdated], [SalesCrew], [ForeignName])
            VALUES
            (${EntryNum}, ${DraftNum}, '${PostingDate}', '${DocDate}', '${CustomerCode}', '${CustomerName}',
            '${WalkInName}', '${ShippingAdd}', '${TIN}', '${Reference}', '${SCPWDIdNo}', '${Branch}', '${DocStat}', ${BaseDoc},
            '${Cash}', '${DebitCard}', '${CreditCard}', '${ODC}', '${PDC}', '${OnlineTransfer}', '${OnAccount}', '${COD}',
            ${TotalAmtBefTax}, ${TotalTax}, ${TotalAmtTax}, ${SCPWDDiscTotal}, ${TotalAmtDue}, '${Remark}',
            '${CreatedBy}', '${DateCreated}', '${UpdatedBy}', '${DateUpdated}', '${SalesCrew}', '${ForeignName}')
        `;

    // Execute the query
    await sql.query(query);

    // Return success response
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Close the MSSQL connection
    await sql.close();
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
