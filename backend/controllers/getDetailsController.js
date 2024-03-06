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

export { getDetails };
