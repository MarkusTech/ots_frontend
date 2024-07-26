import sqlConn2 from "../../../config/db2.js";

const discountPrice = async (req, res) => {
  const {
    brachID,
    beforeDiscount,
    cardCode,
    itemCode,
    Qty,
    UoM,
    lowerBound,
    creditCard,
    debitCard,
    PDC,
    PO,
    taxCode,
  } = req.params;
  try {
    const contextCheck = await sqlConn2.query(`SELECT name FROM sys.databases`);
    console.log("Databases:", contextCheck.recordset);

    const result =
      await sqlConn2.query(`SELECT [BCD_TEST_DB].dbo.fn_GetDiscPrice (${brachID}, ${beforeDiscount},'${cardCode}', '${itemCode}',${Qty}, '${UoM}', '${lowerBound}','${creditCard}','${debitCard}',
      '${PDC}', '${PO}','${taxCode}') AS DiscPrice`);

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Unable to find Discount Price",
      });
    }

    const data = result.recordset;

    res.status(200).json({
      success: true,
      message: "Discount Price Found",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { discountPrice };
