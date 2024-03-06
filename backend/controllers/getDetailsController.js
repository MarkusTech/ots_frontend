import sqlConn from "../config/db.js";

const getDetails = async (req, res) => {
  try {
    const data = await sqlConn.query("Select * FROM SO_Details");
    res.status(200).json({
      success: true,
      message: "Data Fetched Successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSingleDetails = async (req, res) => {
  try {
    const { DraftNum } = req.params;
    const result = await sqlConn.query(
      `Select * from SO_Details where DraftNum = ${DraftNum}`
    );

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getDetails, getSingleDetails };
