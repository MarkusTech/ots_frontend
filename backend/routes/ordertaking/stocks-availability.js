import sqlConn2 from "../../config/db2.js";

const stockAvailability = async (req, res) => {
  try {
    const result = await sqlConn2.query(
      `SELECT dbo.fn_GetAvailability (${docNum}, '${itemCode}', '${warehouseCode}', ${ordrQty}, '${ExcludeBO}') AS StockAvailable`
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Unable to find stocks",
      });
    }

    const data = result.recordset;

    res.status(200).json({
      success: true,
      message: "Stocks Availability fetched",
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

export { stockAvailability };
