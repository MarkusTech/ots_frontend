import sqlConn from "../../config/db.js";

const saveApprovalHeader = async (req, res) => {
  const { AppTypeID, WhseCode, DocType, Type, NumApprover } = req.body;

  try {
    const data = await sqlConn.query(`
    INSERT INTO [dbo].[AppProc_Main]
           ([AppTypeID]
           ,[WhseCode]
           ,[DocType]
           ,[Type]
           ,[NumApprover])
     VALUES
           (${AppTypeID}, '${WhseCode}', '${DocType}', '${Type}', ${NumApprover})
  `);

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Unable to save Approval Header",
      });
    }

    res.status(201).json({
      success: true,
      message: "Data inserted successfully",
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

const getApprovalHeader = async (req, res) => {
  try {
    const result = await sqlConn.query(`Select * from [dbo].[AppProc_Main]`);

    res.status(200).json({
      success: true,
      message: "Approval Headers Fetched!",
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

export { saveApprovalHeader, getApprovalHeader };
