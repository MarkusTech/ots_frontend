import sqlConn2 from "../../../config/db2.js";

const getCustomers = async (req, res) => {
  try {
    const result = await sqlConn2.query(
      `SELECT CardCode,CardName,CardFName, LicTradNum,Address FROM [BCD_TEST_DB].[dbo].[OCRD] WHERE frozenFor='N' AND CardType='C' ORDER BY CardName`
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Unable to find Customers",
      });
    }

    const data = result.recordset;

    res.status(200).json({
      success: true,
      message: "Customers Found!",
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

export { getCustomers };
