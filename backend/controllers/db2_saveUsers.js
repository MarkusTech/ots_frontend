import sqlConn2 from "../config/db2.js";

const saveUsers = async (req, res) => {
  const {
    EmpName,
    Position,
    BranchID,
    BranchName,
    WhsCode,
    PriceListNum,
    userName,
    Password,
  } = req.body;

  // Trim string values if they exceed column sizes
  const trimmedEmpName = EmpName.substring(0, 50); // Adjust 50 to match column size
  const trimmedBranchName = BranchName.substring(0, 50); // Adjust 50 to match column size
  const trimmedUserName = userName.substring(0, 50); // Adjust 50 to match column size
  const trimmedPassword = Password.substring(0, 50); // Adjust 50 to match column size

  const data = await sqlConn2.query`INSERT INTO [dbo].[User]
    (EmpName, Position, UserName, Password, BranchID, BranchName, WhsCode, PriceListNum)
    VALUES
    (
      ${trimmedEmpName},
      ${Position},
      ${trimmedUserName},
      ${trimmedPassword},
      ${BranchID},
      ${trimmedBranchName},
      ${WhsCode},
      ${PriceListNum}
    )`;

  res.status(200).json({
    success: true,
    message: "User Save Successfully",
    data,
  });
};

const getUsers = async (req, res) => {
  try {
    const result = await sqlConn2.query`SELECT * FROM [dbo].[User]`;
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

const getSingleUsers = async (req, res) => {
  res.send("Get Single Users");
};

const updateUser = async (req, res) => {
  res.send("Update Users");
};

export { saveUsers, getUsers, getSingleUsers, updateUser };
