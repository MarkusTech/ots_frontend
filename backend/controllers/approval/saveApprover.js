import sqlConn from "../../config/db.js";

const saveApprover = async (req, res) => {
  const { AppProcID, UserID, AppLevel } = req.body;

  try {
    const data = await sqlConn.query(`INSERT INTO [dbo].[AppProc_DetApp]
    ([AppProcID]
    ,[UserID]
    ,[AppLevel])
      VALUES
    (${AppProcID},${UserID},${AppLevel})`);

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Unable to save data",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data Save Successfully",
      data: data.recordset,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getApprovers = async (req, res) => {
  try {
    const result = await sqlConn.query(
      `SELECT * FROM [OTS_DB].[dbo].[AppProc_DetApp]`
    );

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Approvers Not Found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Approvers List Fetched!",
      data: result.recordset,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { saveApprover, getApprovers };
