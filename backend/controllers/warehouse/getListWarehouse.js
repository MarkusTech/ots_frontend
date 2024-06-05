import sqlConn2 from "../../config/db2.js";

const getListOfWarehouse = async (req, res) => {
  try {
    const result = await sqlConn2.query(`
    SELECT [WhsCode], [WhsName]
    FROM [BCD_TEST_DB].[dbo].[OWHS]
    WHERE [Inactive] = 'N' and WhsName is not null;
    `);

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Warehouse not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Warehouses fetched!",
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

export { getListOfWarehouse };
