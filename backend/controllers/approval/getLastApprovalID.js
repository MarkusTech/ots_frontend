import sqlConn from "../../config/db.js";

const getLastApprovalID = async (req, res) => {
  try {
    const result = await sqlConn.query(`SELECT MAX(AppProcID) AS LastAppProcID
    FROM [dbo].[AppProc_Main]`);

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Last Approval ID cannot be found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Last Approval ID found",
      data: result.recordset[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getLastApprovalID };
