import sqlConn from "../../config/db.js";

const getApprovalMain = async (req, res) => {
  try {
    const result = await sqlConn.query(
      `SELECT * FROM [OTS_DB].[dbo].[AppProc_Main]`
    );

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Approval Main Not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Approval Main fetched!",
      data: result.recordset,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export { getApprovalMain };
