import sqlConn from "../../config/db.js";

const saveORiginator = async (req, res) => {
  const originators = req.body; // Expecting an array of { AppProcID, UserID }

  try {
    // Using parameterized query to prevent SQL injection
    const query = `
      INSERT INTO [dbo].[AppProc_DetOrig] ([AppProcID], [UserID])
      VALUES (@AppProcID, @UserID)
    `;

    // Using transactions for atomicity if needed
    const transaction = sqlConn.transaction();
    await transaction.begin();

    try {
      for (let originator of originators) {
        await transaction
          .request()
          .input("AppProcID", originator.AppProcID)
          .input("UserID", originator.UserID)
          .query(query);
      }

      await transaction.commit();

      // Return success response
      res.status(200).json({
        success: true,
        message: "Originators Successfully Saved",
        data: originators,
      });
    } catch (error) {
      await transaction.rollback();
      throw error; // Throw error to be caught in outer catch block
    }
  } catch (error) {
    console.error("Error saving originators:", error);
    res.status(500).json({
      success: false,
      message: "Unable to save originators",
      error: error.message,
    });
  }
};

const getOriginator = async (req, res) => {
  try {
    const result = await sqlConn.query(
      `SELECT * FROM [OTS_DB].[dbo].[AppProc_DetOrig]`
    );

    const data = result.recordset;
    if (!result) {
      res.status(404).json({
        success: false,
        message: "Originators not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Originators list fetched",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSelectedOriginatorID = async (req, res) => {
  try {
    const { AppProcID } = req.params;

    const result =
      await sqlConn.query(`SELECT u.UserID, u.EmpName, u.Position, ap.AppProcID
                                        FROM [OTS_DB].[dbo].[User] u
                                        INNER JOIN [OTS_DB].[dbo].[AppProc_DetOrig] ap
                                        ON u.UserID = ap.UserID WHERE ap.AppProcID = ${AppProcID}`);

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Unable to find Selected Originators",
      });
    }

    const originator = result.recordset;
    res.status(200).json({
      success: true,
      message: "Originator found",
      originator: originator,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { saveORiginator, getOriginator, getSelectedOriginatorID };
