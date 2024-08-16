import sqlConn from "../../config/db.js";

const getApprovalProcedureSummaryDetails = async (req, res) => {
  console.log("Approval Procedure Summary Details");
};

const getBelowStandarDiscounting = async (req, res) => {
  try {
    const result = await sqlConn.query(
      `SELECT AppTypeID FROM [OTS_DB].[dbo].[AppType] WHERE AppType LIKE '%Below Standard Discounting%'`
    );

    // Assuming there's always at least one result, get the first AppTypeID
    const appTypeID = result.recordset[0]?.AppTypeID;

    if (appTypeID !== undefined) {
      // You can now use the appTypeID variable in your backend
      console.log("AppTypeID:", appTypeID);

      res.status(200).json({
        success: true,
        data: appTypeID, // or send it as part of an object, e.g., { appTypeID }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No matching AppTypeID found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getApprovalProcedureSummaryDetails, getBelowStandarDiscounting };
