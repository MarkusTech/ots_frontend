import sqlConn2 from "../../../config/db2.js";

const employee = async (req, res) => {
  try {
    const result =
      await sqlConn2.query(`SELECT CONCAT(lastName, ', ', firstName) AS EmpName,
              T1.name AS Position,
              T4.BPLId,
              T4.BPLName,
              T4.DflWhs,
              (SELECT ListNum FROM [BCD_TEST_DB].dbo.OPLN WHERE ListName= CONCAT(T4.BPLName,'-Retail Price')) AS PriceListNum
       FROM [BCD_TEST_DB].dbo.OHEM T0
       INNER JOIN [BCD_TEST_DB].dbo.OHPS T1 ON T0.position=T1.posID
       INNER JOIN [BCD_TEST_DB].dbo.OUSR T2 ON T0.userId=T2.USERID
       INNER JOIN [BCD_TEST_DB].dbo.USR6 T3 ON T2.USER_CODE=T3.UserCode
       INNER JOIN [BCD_TEST_DB].dbo.OBPL T4 ON T3.BPLId=T4.BPLId 
       WHERE salesPrson > 0 AND T4.U_isDC ='N'`);

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Unable to find employee",
      });
    }

    const data = result.recordset;

    res.status(200).json({
      success: true,
      message: "Employee fetched",
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

export { employee };
