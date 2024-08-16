import sqlConn from "../../config/db.js";

const getApprovalProcedureSummaryDetails = async (req, res) => {
  console.log("Approval Procedure Summary Details");
};

const getBelowStandarDiscounting = async (req, res) => {
  try {
    const result = await sqlConn.query(
      `SELECT AppTypeID from [OTS_DB].[dbo].[AppType] where  AppType like '%Below Standard Discounting%'`
    );

    const data = result.recordset;

    res.status(200).json({
      success: true,
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

export { getApprovalProcedureSummaryDetails, getBelowStandarDiscounting };
