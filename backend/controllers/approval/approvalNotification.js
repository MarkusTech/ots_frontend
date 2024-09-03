import sqlConn from "../../config/db.js";

const approvalNotification = async (req, res) => {
  try {
    const result = await sqlConn.query(
      `select count(AppProcID) as approverCount from [OTS_DB].[dbo].[AppProc_Summary] Where status = 'pending'`
    );

    const notificationCount = result.recordset[0].approverCount;

    res.status(200).json({
      success: true,
      approverCount: notificationCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { approvalNotification };
