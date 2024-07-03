import sqlConn2 from "../../../config/db2.js";

const getItemList = async (req, res) => {
  const { priceListNum, warehouseCode, cardCode } = req.params;
  try {
    const result = await sqlConn2.query(
      `SELECT * FROM [BCD_TEST_DB].[dbo].[TVF_ITEM_DETAILS] (${priceListNum},'${warehouseCode}','${cardCode}') ORDER BY ItemName`
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Unable to find Items",
      });
    }

    const data = result.recordset;
    res.status(200).json({
      success: true,
      message: "Item Feched",
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

export { getItemList };
