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
    console.log(error);
    throw new Error(error);
  }
};

const getSingleDetails = async (req, res) => {
  try {
    const { DraftNum } = req.params;
    const result = await sqlConn.query(
      `Select * from SO_Details where DraftNum = ${DraftNum}`
    );

    if (result.recordset.length > 0) {
      // If a matching record is found, send it in the response
      res.json(result.recordset[0]);
    } else {
      // If no matching record is found, send an appropriate response
      res.status(404).json({ message: "Record not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getDetails, getSingleDetails };
