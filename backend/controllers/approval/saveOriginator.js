import sqlConn from "../../config/db.js";

const saveORiginator = async (req, res) => {
  const { AppProcID, UserID } = req.body;

  try {
    const data = await sqlConn.query(`INSERT INTO [dbo].[AppProc_DetOrig]
    ([AppProcID]
    ,[UserID])
    VALUES
    (${AppProcID}, ${UserID})`);

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Unable to save Data",
      });
    }

    res.status(200).json({
      success: true,
      message: "Originator Successfully Save",
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

export { saveORiginator, getOriginator };
