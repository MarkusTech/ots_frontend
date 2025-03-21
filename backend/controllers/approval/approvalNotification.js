import sqlConn from "../../config/db.js";
import { cache } from "../../utils/cache.js";

const approvalNotification = async (req, res) => {
  try {
    const query = `
      SELECT COUNT(AppProcID) AS approverCount 
      FROM [OTS_DB].[dbo].[AppProc_Summary] 
      WHERE status = 'pending'
    `;
    const { recordset } = await sqlConn.query(query);

    const approverCount = recordset[0]?.approverCount || 0;

    res.status(200).json({
      success: true,
      approverCount,
    });
  } catch (error) {
    console.error("Error fetching approver count:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const approverNotification = async (req, res) => {
  try {
    const { approverID } = req.params;

    const query = `
      SELECT COUNT(*) AS approverCount
      FROM [OTS_DB].[dbo].[AppProc_Summary]
      WHERE [Status] = 'pending'
        AND [Approver] = ${approverID}`;

    const { recordset } = await sqlConn.query(query, {
      approverID: 71,
      status: "Pending",
    });

    const approverCount = recordset[0]?.approverCount || 0;
    res.status(200).json({
      success: true,
      approverCount,
    });
  } catch (error) {
    console.error("Error fetching approver count:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const approverList = async (req, res) => {
  try {
    const { approverID } = req.params;

    const result =
      await sqlConn.query`EXEC [OTS_DB].[dbo].[GetAppProcSummary] @Approver = ${approverID}`;

    if (!result.recordset.length) {
      return res.status(404).json({
        success: false,
        message: "Unable to find List of Approval Summary",
      });
    }

    const data = result.recordset;

    res.status(200).json({
      success: true,
      data: data,
      message: "Approval Procedure Summary fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching approver list:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const approverListV2 = async (req, res) => {
  try {
    const { approverID } = req.params;

    const result =
      await sqlConn.query`SELECT  APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, 
                SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, 
                APS.Status, AM.Type, APD2.AppLevel, AM.NumApprover,
                (SELECT Status 
                 FROM [AppProc_Summary] T0 
                 WHERE T0.Approver <> ${approverID}
                 AND T0.DraftNum = APS.DraftNum) NextStatus
        FROM [OTS_DB].[dbo].[AppProc_Summary] APS
        INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
        INNER JOIN [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
        INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD ON AM.AppProcID = APD.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppProc_DetApp] APD2 ON AM.AppProcID = APD2.AppProcID
        WHERE APS.Approver = ${approverID}
        AND APD2.UserID = ${approverID}
        AND (
            (AM.Type = 'sequential' AND APD.AppLevel = (
                SELECT MIN(APD3.AppLevel)
                FROM [OTS_DB].[dbo].[AppProc_DetApp] APD3
                WHERE APD3.AppProcID = AM.AppProcID
            ))
            OR AM.Type != 'sequential'
        )
        ORDER BY APS.AppSummID DESC`;

    if (!result.recordset.length) {
      return res.status(404).json({
        success: false,
        message: "Unable to find List of Approval Summary",
      });
    }

    const data = result.recordset;

    res.status(200).json({
      success: true,
      data: data,
      message: "Approval Procedure Summary fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching approver list:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const approverListV3 = async (req, res) => {
  try {
    const { approverID } = req.params;

    const result =
      await sqlConn.query`EXEC [OTS_DB].[dbo].[GetAppProcSummaryBaseOnApprover] @Approver = ${approverID}`;

    if (!result.recordset.length) {
      return res.status(404).json({
        success: false,
        message: "Unable to find List of Approval Summary",
      });
    }

    const data = result.recordset;

    res.status(200).json({
      success: true,
      data: data,
      message: "Approval Procedure Summary fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching approver list:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const orignatorNotificationCount = async (req, res) => {
  try {
    const { originatorID } = req.params;

    const query = `EXEC GetPendingRecordsCount @Originator = ${originatorID}`;

    const { recordset } = await sqlConn.query(query, {
      approverID: 71,
      status: "Pending",
    });

    const totalRecordCount = recordset[0]?.totalRecordCount || 0;

    res.status(200).json({
      success: true,
      totalRecordCount,
    });
  } catch (error) {
    console.error("Error fetching total record count:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const originatorList = async (req, res) => {
  try {
    const { originatorID } = req.params;

    const query = `EXEC GetSummaryDataByOriginator @Originator = ${originatorID}`;

    const result = await sqlConn.request().query(query);

    res.status(200).json({
      success: true,
      message: "Originator List",
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching Originator list:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const originatorOTSStatus = async (req, res) => {
  try {
    const { DraftNum } = req.params;

    const result =
      await sqlConn.query`select DocStat FROM [OTS_DB].[dbo].[SO_Header] WHERE DraftNum = ${DraftNum}`;

    const data = result.recordset[0];
    res.status(200).json({
      success: true,
      message: "Originator Status Found",
      data,
    });
  } catch (error) {
    console.error("Error fetching Originator Status:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const setHeaderStatusToPendingInBelowDiscountPrice = async (req, res) => {
  try {
    const { DraftNum } = req.params;

    await sqlConn.query`UPDATE [OTS_DB].[dbo].[SO_Header] SET DocStat = 'Pending' WHERE DraftNum = ${DraftNum}`;

    res.status(200).json({
      success: true,
      message: "Header Status Set To Pending",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export {
  approvalNotification,
  orignatorNotificationCount,
  originatorList,
  approverList,
  approverListV2,
  approverListV3,
  approverNotification,
  originatorOTSStatus,
  setHeaderStatusToPendingInBelowDiscountPrice,
};
