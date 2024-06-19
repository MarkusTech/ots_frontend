import sqlConn from "../../config/db.js";

const saveApprover = async (req, res) => {
  const approvers = req.body; // Expecting an array of { AppProcID, UserID, AppLevel }

  try {
    const transaction = sqlConn.transaction();
    await transaction.begin();

    try {
      for (let approver of approvers) {
        await transaction
          .request()
          .input("AppProcID", approver.AppProcID)
          .input("UserID", approver.UserID)
          .input("AppLevel", approver.AppLevel).query(`
            INSERT INTO [dbo].[AppProc_DetApp] ([AppProcID], [UserID], [AppLevel])
            VALUES (@AppProcID, @UserID, @AppLevel)
          `);
      }

      await transaction.commit();

      // Return success response
      res.status(200).json({
        success: true,
        message: "Approvers Successfully Saved",
        data: approvers,
      });
    } catch (error) {
      await transaction.rollback();
      throw error; // Throw error to be caught in outer catch block
    }
  } catch (error) {
    console.error("Error saving approvers:", error);
    res.status(500).json({
      success: false,
      message: "Unable to save approvers",
      error: error.message,
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

const getApproversByApprovalID = async (req, res) => {
  try {
    const { AppProcID } = req.params;

    const result =
      await sqlConn.query(`SELECT u.UserID, u.EmpName, u.Position, ap.AppLevel FROM [OTS_DB].[dbo].[User] u
                            INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] ap
                            ON u.UserID = ap.UserID WHERE ap.AppProcID = ${AppProcID}`);

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Unable to find Selected Approver",
      });
    }

    const approver = result.recordset;
    res.status(200).json({
      success: true,
      message: "Approvers found!",
      approver: approver,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { saveApprover, getApprovers, getApproversByApprovalID };
