import sqlConn from "../../config/db.js";

const saveApprovalType = async (req, res) => {
  const { AppTypeID, appType } = req.body;
  try {
    // Execute the query
    const result = await sqlConn.query`
        INSERT INTO [dbo].[AppType]
               ([AppTypeID], [AppType])
        VALUES
               (${AppTypeID}, ${appType});
      `;

    // Send a success response
    res.status(200).json({
      success: true,
      message: "Data inserted successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    // Close the connection
    sql.close();
  }
};

const getApprovalType = async (req, res) => {
  res.send("Get all approval type");
};

const getSingleApprovalType = async (req, res) => {
  res.send("Get Selected Approval Type");
};

const updateApprovalType = async (req, res) => {
  res.send("Update selected Approval Tyope");
};

const deleteApprovalType = async (req, res) => {
  res.send("Delete Approval Type");
};

export {
  saveApprovalType,
  getApprovalType,
  getSingleApprovalType,
  updateApprovalType,
  deleteApprovalType,
};
