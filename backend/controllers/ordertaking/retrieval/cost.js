import sqlConn2 from "../../../config/db2.js";

const cost = async (req, res) => {
  const { itemCode, warehouseCode } = req.params;
  try {
    const result = await sqlConn2.query(
      `SELECT [BCD_TEST_DB].dbo.fn_GetCost ('${itemCode}', '${warehouseCode}') AS Cost`
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Unable to find cost",
      });
    }

    const data = result.recordset;

    res.status(200).json({
      success: true,
      message: "Cost found",
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

export { cost };
