import sqlConn from "../config/db.js";

const connection = async (req, res) => {
  try {
    // Verify connection and context
    const contextCheck = await sqlConn.query(`SELECT name FROM sys.databases`);
    console.log("Databases:", contextCheck.recordset);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { connection };
