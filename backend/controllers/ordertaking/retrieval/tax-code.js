import sqlConn2 from "../../../config/db2.js";

const getTaxCode = async (req, res) => {
  const { cardCode, warehouseCode } = req.params;
  try {
    const result = await sqlConn2.query(
      `SELECT [BCD_TEST_DB].dbo.fn_GetTaxCode ('${cardCode}','${warehouseCode}') AS TaxCode`
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Unable to find Tax-Code",
      });
    }

    const data = result.recordset;
    res.status(200).json({
      success: true,
      message: "Tax-Code Found",
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

export { getTaxCode };
