import sqlConn2 from "../../../config/db2.js";

const getOum = async (req, res) => {
  const { itemCode } = req.params;
  try {
    const result = await sqlConn2.query(
      `SELECT * FROM TVF_GET_UOM ('0006697HWFAN')`
    );

    if (!result) {
      res.status(400).json({
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
