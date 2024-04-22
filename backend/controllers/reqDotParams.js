import sqlConn from "../config/db.js";

const pickUpLocation = async (req, res) => {
  try {
    const { ItemCode, Qty, Whse } = req.params;
    const result = await sqlConn.query(
      `SELECT dbo.fn_GetPickUpLocation('${ItemCode}',${Qty},'${Whse}')`
    );
    res.status(200).json({
      success: true,
      message: "Data Fetched Successfully",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
