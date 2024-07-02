import sqlConn2 from "../../../config/db2.js";

const getOum = async (req, res) => {
  const { itemCode } = req.params;
  try {
    const result = await sqlConn2.query(
      `SELECT * FROM [BCD_TEST_DB].[dbo].[TVF_GET_UOM] ('${itemCode}')`
    );

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Unable to find Uom",
      });
    }

    const data = result.recordset;

    res.status(200).json({
      success: true,
      message: "UOM Found",
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

export { getOum };
