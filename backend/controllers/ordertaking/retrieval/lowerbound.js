import sqlConn2 from "../../../config/db2.js";

const getLowerBound = async (req, res) => {
  const { PriceListNum, taxCode, itemCode, warehouseCode, UoMQty } = req.params;
  try {
    const result = await sqlConn2.query(
      `SELECT [BCD_TEST_DB].dbo.fn_GetLowerBound (${PriceListNum}, '${taxCode}', '${itemCode}','${warehouseCode}', ${UoMQty}) AS LowerBound`
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Unable to find Lowerbound Data",
      });
    }

    const data = result.recordset;
    res.status(200).json({
      success: true,
      message: "Lowerbound Found",
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

export { getLowerBound };
