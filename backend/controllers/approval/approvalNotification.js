import sqlConn from "../../config/db.js";
import { cache } from "../../utils/cache.js"; // Import the cache utility

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

    // Cache the result
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

const orignatorNotificationCount = async (req, res) => {
  try {
    const query = ``;
  } catch (error) {
    console.error("Error fetching approver count:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const originatorList = async (req, res) => {
  try {
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
                        MAX(APS.Status) AS Status
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
                        APS.DocType
                )

                SELECT 
                    * ,
                    (SELECT COUNT(*) FROM SummaryData) AS TotalRecordCount
                FROM 
                    SummaryData
                ORDER BY 
                    DraftNum;`;

    const result = await sqlConn.request().query(query);

    res.status(200).json({
      success: true,
      message: "Approver List",
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching approver count:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { approvalNotification, orignatorNotificationCount, originatorList };
