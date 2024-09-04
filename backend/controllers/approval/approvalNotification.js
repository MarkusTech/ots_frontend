import sqlConn from "../../config/db.js";

const approvalNotification = async (req, res) => {
  try {
    const query = `
      SELECT COUNT(AppProcID) AS approverCount 
      FROM [OTS_DB].[dbo].[AppProc_Summary] 
      WHERE status = 'pending'
    `;
    const { recordset } = await sqlConn.query(query);

    res.status(200).json({
      success: true,
      approverCount: recordset[0]?.approverCount || 0,
    });
  } catch (error) {
    console.error("Error fetching approver count:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { approvalNotification };
