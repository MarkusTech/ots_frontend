import sqlConn from "../../config/db.js";

const saveApprovalHeader = async (req, res) => {
  const { AppTypeID, WhseCode, DocType, Type, NumApprover } = req.body;

  try {
    // Check if a record with the same combination already exists
    const existingData = await sqlConn.query(`
      SELECT * FROM [dbo].[AppProc_Main]
      WHERE [AppTypeID] = ${AppTypeID} AND [WhseCode] = '${WhseCode}' AND [DocType] = '${DocType}' AND [Type] = '${Type}'
    `);

    if (existingData.recordset.length > 0) {
      // Record already exists
      res.status(409).json({
        success: false,
        message: "Approval Header already exists",
      });
      return;
    }

    // Insert new record
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

const getSelectedApprovalMain = async (req, res) => {
  try {
    const { AppProcID } = req.params;

    const resultMain = await sqlConn.query(
      `SELECT * FROM [OTS_DB].[dbo].[AppProc_Main] WHERE AppProcID = ${AppProcID}`
    );
    const resultOriginator = await sqlConn.query(
      `SELECT * FROM [OTS_DB].[dbo].[AppProc_DetOrig] WHERE AppProcID = ${AppProcID}`
    );
    const resultApprover = await sqlConn.query(
      `SELECT * FROM [OTS_DB].[dbo].[AppProc_DetApp] WHERE AppProcID = ${AppProcID}`
    );

    if (!resultMain) {
      res.status(404).json({
        success: false,
        message: "Unable to find data based on Approval Procedure ID given",
      });
    }
    if (!resultOriginator) {
      res.status(404).json({
        success: false,
        message: "Unable to find data based on Approval Procedure ID given",
      });
    }
    if (!resultApprover) {
      res.status(404).json({
        success: false,
        message: "Unable to find data based on Approval Procedure ID given",
      });
    }

    const main = resultMain.recordset;
    const originator = resultOriginator.recordset;
    const approver = resultApprover.recordset;

    res.status(200).json({
      success: true,
      message: "Selected Approval found!",
      main: main,
      originator: originator,
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

const updateApprovalHeader = async (req, res) => {
  const { AppProcID } = req.params;
  const { AppTypeID, WhseCode, DocType, Type, NumApprover } = req.body;

  try {
    const result = await sqlConn.query`UPDATE [OTS_DB].[dbo].[AppProc_Main]
        SET [AppTypeID] = ${AppTypeID}
            ,[WhseCode] = ${WhseCode}
            ,[DocType] = ${DocType}
            ,[Type] = ${Type}
            ,[NumApprover] = ${NumApprover}
        Where AppProcID = ${AppProcID}`;

    // Check if any rows were affected
    if (!result) {
      res.status(404).json({
        success: false,
        message: "Record not found or no rows affected.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: result.recordset,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  saveApprovalHeader,
  getApprovalHeader,
  getSelectedApprovalMain,
  updateApprovalHeader,
};
