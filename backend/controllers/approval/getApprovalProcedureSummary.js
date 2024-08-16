import sqlConn from "../../config/db.js";

const getBelowStandarDiscounting = async (req, res) => {
  try {
    const result = await sqlConn.query(
      `SELECT AppTypeID FROM [OTS_DB].[dbo].[AppType] WHERE AppType LIKE '%Below Standard Discounting%'`
    );

    const appTypeID = result.recordset[0]?.AppTypeID;

    if (appTypeID !== undefined) {
      const approvalProcedureID = await sqlConn.query(`
        SELECT m.AppProcID FROM [OTS_DB].[dbo].[AppProc_Main] m
        INNER JOIN [OTS_DB].[dbo].[AppType] t
        ON m.AppTypeID = t.AppTypeID
        WHERE t.AppTypeID = ${appTypeID};`);

      const appProcID = approvalProcedureID.recordset[0]?.AppProcID;

      if (appProcID !== undefined) {
        const approverList = await sqlConn.query(
          `SELECT * from [OTS_DB].[dbo].[AppProc_DetApp] Where AppProcID = ${appProcID}`
        );
        res.status(200).json({
          data: approverList,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Approval Procedure ID not found!",
        });
      }
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

export { getBelowStandarDiscounting };
