import sqlConn from "../../config/db.js";

const approvalNotification = async (req, res) => {
  try {
    const result = await sqlConn.query(
      `select count(AppProcID) from [OTS_DB].[dbo].[AppProc_Summary] Where AppProcID = 1038`
    );

    const notificationCount = result.recordset[0];

    res.status(200).json({
      success: true,
      data: notificationCount,
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
