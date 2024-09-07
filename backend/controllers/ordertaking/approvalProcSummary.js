import sqlConn from "../../config/db.js";
import { cache } from "../../utils/cache.js"; // Import the cache utility

const cacheKey = "approvalProcedureSummary"; // Set a common cache key

// Save Approval Summary and update the cache
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
    const saveSummary = await sqlConn.query`
      INSERT INTO [dbo].[AppProc_Summary]
           ([AppProcID], [ReqDate], [DocType], [DraftNum], [Approver], [Originator], [Remarks], [Status])
     VALUES
           (${AppProcID}, ${ReqDate}, ${DocType}, ${DraftNum}, ${Approver}, ${Originator}, ${Remarks}, ${Status})`;

    // Invalidate the cache after saving new data
    cache.del(cacheKey);

    res.status(200).json({
      success: true,
      message: "Approval Procedure Summary successfully saved",
      saveSummary,
    });
  } catch (error) {
    console.error("Error saving Approval Procedure Summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Approval Procedure Summary with caching
const getApprovalProcedureSummary = async (req, res) => {
  try {
    // Check if data is in cache
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        success: true,
        data: cachedData,
        message: "Data fetched from cache",
      });
    }

    // If cache is empty, fetch from the database
    const result = await sqlConn.query(
      `SELECT APS.AppSummID,AT.AppType, APS.ReqDate, APS.DraftNum, APS.DocType, APS.Remarks, APS.Status, AM.AppProcID, AM.AppTypeID from [OTS_DB].[dbo].[AppProc_Summary] APS
        INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM
        ON APS.AppProcID = AM.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppType] AT
        ON AT.AppTypeID = AM.AppTypeID`
    );

    if (!result.recordset.length) {
      return res.status(404).json({
        success: false,
        message: "Unable to find List of Approval Summary",
      });
    }

    const data = result.recordset;

    // Store the fetched data in the cache
    cache.set(cacheKey, data);

    res.status(200).json({
      success: true,
      data: data,
      message: "Approval Procedure Summary fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching Approval Procedure Summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { saveApprovalSummary, getApprovalProcedureSummary };
