import sqlConn2 from "../../../config/db2.js";

const salescrew = async (req, res) => {
  try {
    const result = await sqlConn2.query(
      `SELECT DISTINCT T2.SlpName
      FROM [BCD_TEST_DB].dbo.OUSR T0
      INNER JOIN [BCD_TEST_DB].dbo.OUDG T1 ON T0.DfltsGroup = T1.Code
      INNER JOIN [BCD_TEST_DB].dbo.OSLP T2 ON T2.Memo = T1.Warehouse
      WHERE T0.INTERNAL_K =  29
      ORDER BY T2.SLPNAME ASC`
    );

    if (!result) {
      res.status(400).json({
        success: "Unable to find Sales Crew",
      });
    }

    const data = result.recordset;
    res.status(200).json({
      success: true,
      message: "Sales Crew Fetched",
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

export { salescrew };
