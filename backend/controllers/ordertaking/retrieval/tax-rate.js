import sqlConn2 from "../../../config/db2.js";

const getTaxRate = async (req, res) => {
  try {
    const { taxCode } = req.params;

    const result = await sqlConn2.query(
      `SELECT Rate FROM [BCD_TEST_DB].[dbo].[OVTG] WHERE Code= '${taxCode}'`
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Unable to find tax rate",
      });
    }

    const data = result.recordset;

    res.status(200).json({
      success: true,
      message: "Tax Rate Found",
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

export { getTaxRate };
