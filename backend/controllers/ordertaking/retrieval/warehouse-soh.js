import sqlConn2 from "../../../config/db2.js";

const warehouseSoh = async (req, res) => {
  const { itemCode, UoM, branchID } = req.params;
  try {
    const result = await sqlConn2.query(
      `SELECT * FROM dbo.TVF_WHSE_SOH ('${itemCode}','${UoM}',${branchID})`
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Unable to find Warehouse Soh",
      });
    }

    const data = result.recordset;
    res.status(200).json({
      success: true,
      message: "Warehouse Soh Fetched",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { warehouseSoh };
