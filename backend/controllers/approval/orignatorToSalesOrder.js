import sqlConn from "../../config/db.js";

const orignatorToSalesOrder = async (req, res) => {
  try {
    const { DraftNum } = req.params;

    const query = `
      SELECT * FROM [OTS_DB].[dbo].[SO_Header] WHERE DraftNum = ${DraftNum}
    `;

    const result = await sqlConn.query(query);

    res.status(200).json({
      success: true,
      message: "Sales Order Header Found Where DraftNum = " + DraftNum,
      data: result.recordset,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { orignatorToSalesOrder };
