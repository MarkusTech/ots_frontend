import sqlConn2 from "../../../config/db2.js";

const getCustomers = async (req, res) => {
  try {
    // Verify connection and context
    const contextCheck = await sqlConn2.query(`SELECT name FROM sys.databases`);
    console.log("Databases:", contextCheck.recordset);

    const result = await sqlConn2.query(
      `SELECT CardCode, CardName, CardFName, LicTradNum, Address FROM [BCD_TEST_DB].[dbo].[OCRD] WHERE frozenFor='N' AND CardType='C' ORDER BY CardName`
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Unable to find Customers",
      });
    }

    const data = result.recordset;

    res.status(200).json({
      success: true,
      message: "Customers Found!",
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

export { getCustomers };

// import sql from "mssql";
// import config from "../../../config/databaseCon.js";

// // Create connection pool using configuration
// const poolPromise1 = sql.connect(config.db2);

// export const getCustomers = async (req, res) => {
//   try {
//     // Verify connection and context
//     const pool = await poolPromise1;
//     const contextCheck = await pool
//       .request()
//       .query(
//         "SELECT CardCode, CardName, CardFName, LicTradNum, Address FROM [BCD_TEST_DB].[dbo].[OCRD] WHERE frozenFor='N' AND CardType='C' ORDER BY CardName"
//       );
//     console.log("Databasessss:", contextCheck.recordset);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };
