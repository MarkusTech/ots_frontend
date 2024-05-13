import sqlConn2 from "../config/db2.js";

const getLocation = async (req, res) => {
  try {
    const data = await sqlConn2.query(`SELECT TOP (1000) [Code]
    ,[Name]
    ,[U_GroupNumber]
    ,[U_GroupName]
    FROM [BCD_TEST_DB].[dbo].[@CATEGORY]`);
    res.status(200).json({
      success: true,
      message: "Data Fetched Successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getLocation };
