import sqlConn from "../../config/db.js";

const saveApprovalSummary = async (req, res) => {
  const {
    AppProcID,
    ReqDate,
    DocType,
    DraftNum,
    Approver,
    Originator,
    Remarks,
    Status,
  } = req.body;

  try {
    const saveSummary = await sqlConn.query`INSERT INTO [dbo].[AppProc_Summary]
           ([AppProcID]
           ,[ReqDate]
           ,[DocType]
           ,[DraftNum]
           ,[Approver]
           ,[Originator]
           ,[Remarks]
           ,[Status])
     VALUES
           (${AppProcID}
           ,${ReqDate}
           ,${DocType}
           ,${DraftNum}
           ,${Approver}
           ,${Originator}
           ,${Remarks}
           ,${Status})`;

    res.status(200).json({
      success: true,
      message: "Approval Procedure Summary Successfully Save",
      saveSummary,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getApprovalProcedureSummary = async (req, res) => {
  try {
    const result = await sqlConn.query(
      `SELECT * FROM [OTS_DB].[dbo].[AppProc_Summary] WHERE STATUS = 'pending'`
    );

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Unable to find List of Approval Summary",
      });
    }

    const data = result.recordset;
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { saveApprovalSummary, getApprovalProcedureSummary };
