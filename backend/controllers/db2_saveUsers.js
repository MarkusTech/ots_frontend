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
    Status,
  } = req.body;

  // Trim string values if they exceed column sizes
  const trimmedEmpName = EmpName.substring(0, 50); // Adjust 50 to match column size
  const trimmedBranchName = BranchName.substring(0, 50); // Adjust 50 to match column size
  const trimmedUserName = userName.substring(0, 50); // Adjust 50 to match column size
  const trimmedPassword = Password.substring(0, 50); // Adjust 50 to match column size
  const trimmedStatus = Status.substring(0, 50);

  const data = await sqlConn2.query`INSERT INTO [dbo].[User]
    (EmpName, Position, UserName, Password, BranchID, BranchName, WhsCode, PriceListNum, Status)
    VALUES
    (
      ${trimmedEmpName},
      ${Position},
      ${trimmedUserName},
      ${trimmedPassword},
      ${BranchID},
      ${trimmedBranchName},
      ${WhsCode},
      ${PriceListNum},
      ${trimmedStatus}
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
  try {
    const { UserId } = req.params;

    const result =
      await sqlConn2.query`SELECT * FROM [dbo].[User] WHERE UserId = ${UserId}`;
    const record = result.recordset[0]; // Assuming UserId is unique and fetches only one record

    if (record) {
      res.status(200).json({
        success: true,
        message: "User Found",
        data: record,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const { UserId } = req.params;
  try {
    const data =
      await sqlConn2.query`DELETE FROM [dbo].[User] WHERE UserID = ${UserId}`;
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Deleting User",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { UserId } = req.params;
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

    // Execute SQL query to update user information
    const result = await sqlConn2.query`
        UPDATE [dbo].[User] 
        SET EmpName = ${EmpName},
            Position = ${Position},
            BranchID = ${BranchID},
            BranchName = ${BranchName},
            WhsCode = ${WhsCode},
            PriceListNum = ${PriceListNum},
            UserName = ${userName},
            Password = ${Password}
        WHERE UserId = ${UserId}
      `;

    // Check if any rows were affected by the update
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
      });
    } else {
      // If no rows were affected, it means the user with the given UserId was not found
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

const getTheLastUserId = async (req, res) => {
  try {
    const result = await sqlConn2.query(
      "SELECT MAX(UserId) AS LastUserId FROM [OTS_DB].[dbo].[User]"
    );

    const lastUserId = result.recordset[0].LastUserId;

    res.status(200).json({
      success: true,
      message: "Last User ID",
      data: lastUserId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error finding the last User ID",
      error: error.message,
    });
  }
};

export {
  saveUsers,
  getUsers,
  getSingleUsers,
  updateUser,
  getTheLastUserId,
  deleteUser,
};
