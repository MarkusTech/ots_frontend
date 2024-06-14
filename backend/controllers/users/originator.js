import sqlConn from "../../config/db.js";

const getOriginator = async (req, res) => {
  try {
    const result = await sqlConn.query(
      `Select UserID as UserID, EmpName as EmployeeName, Position as Position from [OTS_DB].[dbo].[User]`
    );

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Originator List not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Originator list fetched successfully",
      data: result.recordset,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export { getOriginator };
