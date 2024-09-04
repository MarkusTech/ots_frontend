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

export { approvalNotification };
