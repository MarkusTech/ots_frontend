import sqlConn2 from "../../../config/db2.js";

const getScDiscount = async (req, res) => {
  const { cardCode, itemCode } = req.params;
  try {
    const result = await sqlConn2.query(
      `SELECT [BCD_TEST_DB].dbo.[fn_CheckIfSCPWD] ('${cardCode}','${itemCode}') AS SCDiscount`
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Unable to find SC-Discount",
      });
    }

    const data = result.recordset;

    res.status(200).json({
      success: true,
      message: "Sc-discount found",
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

export { getScDiscount };
