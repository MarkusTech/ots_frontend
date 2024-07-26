import sqlConn2 from "../../config/db2.js";

const testconnection = async (req, res) => {
  try {
    // Verify connection and context
    const pool = await sqlConn2;
    const result = await pool.request().query(`SELECT name FROM sys.databases`);
    console.log("Databases:", result.recordset);
    res.status(200).json({
      success: true,
      databases: result.recordset,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { testconnection };
