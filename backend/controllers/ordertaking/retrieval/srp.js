import sqlConn2 from "../../../config/db2.js";

const srp = async (req, res) => {
  const {
    itemCode,
    ItemsPerUnit,
    UoM,
    taxCode,
    lowerbound,
    vendorCode,
    PriceListNum,
  } = req.params;
  try {
    const result = await sqlConn2.query(
      `SELECT [BCD_TEST_DB].dbo.fn_GetSRP ('${itemCode}', ${ItemsPerUnit}, '${UoM}','${taxCode}', ${lowerbound}, '${vendorCode}',${PriceListNum}) AS SRP`
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Unable to find SRP",
      });
    }

    const data = result.recordset;

    res.status(200).json({
      success: true,
      message: "SRP found",
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

export { srp };
