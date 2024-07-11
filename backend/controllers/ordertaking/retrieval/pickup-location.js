import sqlConn2 from "../../../config/db2.js";

const pickUpLocation = async (req, res) => {
  const { ItemCode, Qty, Whs } = req.params;
  try {
    const result = await sqlConn2.query(
      `SELECT [BCD_TEST_DB].dbo.fn_GetPickUpLocation('${ItemCode}', ${Qty}, '${Whs}') AS location`
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Unable to find pickup location",
      });
    }

    const data = result.recordset;

    res.status(200).json({
      success: true,
      message: "Pick-up location found",
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

export { pickUpLocation };
