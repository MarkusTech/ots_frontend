import sqlConn from "../../config/db.js";
import { cache } from "../../utils/cache.js";

const approvalNotification = async (req, res) => {
  try {
    const cacheKey = "approvalNotification:pendingCount";
    const cachedCount = cache.get(cacheKey);

    if (cachedCount !== undefined) {
      return res.status(200).json({
        success: true,
        approverCount: cachedCount,
      });
    }

    const query = `
      SELECT COUNT(AppProcID) AS approverCount 
      FROM [OTS_DB].[dbo].[AppProc_Summary] 
      WHERE status = 'pending'
    `;
    const { recordset } = await sqlConn.query(query);

    const approverCount = recordset[0]?.approverCount || 0;

    cache.set(cacheKey, approverCount);

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
        AND [Approver] = ${approverID}
    `;

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

    const cacheKey = `approverList_${approverID}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        data: cachedData,
        message: "Approval Procedure Summary fetched from cache",
      });
    }

    const result =
      await sqlConn.query`EXEC [OTS_DB].[dbo].[GetAppProcSummary] @Approver = ${approverID}`;

    if (!result.recordset.length) {
      return res.status(404).json({
        success: false,
        message: "Unable to find List of Approval Summary",
      });
    }

    const data = result.recordset;

    cache.set(cacheKey, data);

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
      await sqlConn.query`SELECT APS.AppSummID, APS.Approver, AT.AppType, APS.ReqDate, APS.DraftNum, SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, APS.Status
      FROM [OTS_DB].[dbo].[AppProc_Summary] APS
      INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
      INNER JOIN [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
      INNER JOIN [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
      WHERE APS.Approver = ${approverID}
      ORDER BY APS.AppSummID DESC`;

    if (!result.recordset.length) {
      return res.status(404).json({
        success: false,
        message: "Unable to find List of Approval Summary",
      });
    }

    const data = result.recordset;

    cache.set(cacheKey, data);

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

    const query = `WITH SummaryData AS (
                    SELECT
                        MIN(APS.AppSummID) AS AppSummID,
                        AT.AppType,
                        MAX(APS.ReqDate) AS ReqDate,    
                        APS.DraftNum, 
                        MAX(SH.DocDate) AS DocDate,
                        APS.DocType,
                        MAX(SH.CustomerName) AS CustomerName,
                        MAX(SH.TotalAmtDue) AS TotalAmtDue,
                        MIN(APS.Remarks) AS Remarks,
                        MAX(APS.Status) AS Status,
                        APS.Originator
                    FROM 
                        [OTS_DB].[dbo].[AppProc_Summary] APS
                    INNER JOIN 
                        [OTS_DB].[dbo].[AppProc_Main] AM ON APS.AppProcID = AM.AppProcID
                    INNER JOIN 
                        [OTS_DB].[dbo].[AppType] AT ON AT.AppTypeID = AM.AppTypeID
                    INNER JOIN 
                        [OTS_DB].[dbo].[SO_Header] SH ON APS.DraftNum = SH.DraftNum
                    GROUP BY 
                        AT.AppType,
                        APS.DraftNum,
                        APS.DocType,
                        APS.Originator
                )

                SELECT 
                    * 
                FROM 
                    SummaryData
                WHERE 
                    Originator = ${originatorID}
                ORDER BY 
                    DraftNum DESC;
                `;

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

export {
  approvalNotification,
  orignatorNotificationCount,
  originatorList,
  approverList,
  approverListV2,
  approverNotification,
};
