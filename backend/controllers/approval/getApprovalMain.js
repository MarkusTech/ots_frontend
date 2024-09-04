import sqlConn from "../../config/db.js";

const getApprovalMain = async (req, res) => {
  try {
    const query = `
      SELECT 
        AP.[AppProcID],
        AT.[AppType],
        AP.[WhseCode],
        AP.[DocType],
        AP.[Type],
        AP.[NumApprover],
        AP.[Status]
      FROM 
        [OTS_DB].[dbo].[AppProc_Main] AP
      INNER JOIN 
        [OTS_DB].[dbo].[AppType] AT
      ON 
        AP.[AppTypeID] = AT.[AppTypeID]
    `;

    const { recordset } = await sqlConn.query(query);

    if (recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Approval Main not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Approval Main fetched successfully!",
      data: recordset,
    });
  } catch (error) {
    console.error("Error fetching Approval Main:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { getApprovalMain };
