import sqlConn from "../config/db.js";

const login = async (req, res) => {
  res.send("Login");
};

const connection = async (req, res) => {
  try {
    const result = await sqlConn.query`SELECT * FROM [dbo].[User]`;
    const recordset = result.recordset;

    res.status(200).json({
      success: true,
      message: "Users Fetched",
      data: recordset,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

export { login, connection };
