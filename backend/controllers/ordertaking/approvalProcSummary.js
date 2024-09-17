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
      `SELECT APS.AppSummID,AT.AppType, APS.ReqDate, APS.DraftNum, SH.DocDate, APS.DocType, SH.CustomerName, SH.TotalAmtDue, APS.Remarks, APS.Status
        from [OTS_DB].[dbo].[AppProc_Summary] APS
        INNER JOIN [OTS_DB].[dbo].[AppProc_Main] AM
        ON APS.AppProcID = AM.AppProcID
        INNER JOIN [OTS_DB].[dbo].[AppType] AT
        ON AT.AppTypeID = AM.AppTypeID
        INNER JOIN [OTS_DB].[dbo].[SO_Header] SH
        ON APS.DraftNum = SH.DraftNum`
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

// Update Approval Summary Status and invalidate cache
const updateApprovalSummaryStatus = async (req, res) => {
  const { Status } = req.body;
  const { AppSummID } = req.params;

  if (!AppSummID || !Status) {
    return res.status(400).json({
      success: false,
      message: "AppSummID and Status are required",
    });
  }

  try {
    const updateSummary = await sqlConn.query`
      UPDATE [dbo].[AppProc_Summary]
      SET [Status] = ${Status}
      WHERE [AppSummID] = ${AppSummID}`;

    // Invalidate the cache after updating the status
    cache.del(cacheKey);

    res.status(200).json({
      success: true,
      message: "Approval Procedure Status successfully updated",
      updateSummary,
    });
  } catch (error) {
    console.error("Error updating Approval Procedure Status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSalesOrderBasedOnApprovalDraftNum = async (req, res) => {
  const { DraftNum } = req.params;
  const cacheKey = `salesOrder_${DraftNum}`; // Define a cache key

  try {
    // Check if the sales order data is in the cache
    let cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        message: `Sales Order Data based on ${DraftNum} (from cache)`,
        headerResult: cachedData.headerResult,
        detailsResult: cachedData.detailsResult,
      });
    }

    // Query database if cache is not available
    const headerResult = await sqlConn.query(
      `SELECT * FROM [OTS_DB].[dbo].[SO_Header] WHERE DraftNum = ${DraftNum}`
    );
    const detailsResult = await sqlConn.query(
      `SELECT * FROM [OTS_DB].[dbo].[SO_Details] WHERE DraftNum = '${DraftNum}'`
    );

    if (!headerResult) {
      return res.status(400).json({
        success: false,
        message: `Unable to find header based on ${DraftNum}`,
      });
    }

    if (!detailsResult) {
      return res.status(400).json({
        success: false,
        message: `Unable to find details based on ${DraftNum}`,
      });
    }

    // Save the result to the cache for future requests
    cache.set(cacheKey, { headerResult, detailsResult });

    return res.status(200).json({
      success: true,
      message: `Sales Order Data based on ${DraftNum}`,
      headerResult,
      detailsResult,
    });
  } catch (error) {
    console.error("Error fetching Sales Order data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  saveApprovalSummary,
  getApprovalProcedureSummary,
  updateApprovalSummaryStatus,
  getSalesOrderBasedOnApprovalDraftNum,
};
