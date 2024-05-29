import sqlConn from "../../config/db.js";

const saveApprovalType = async (req, res) => {
  const { AppTypeID, AppType } = req.body;
  try {
    // Execute the query
    const result = await sqlConn.query`
        INSERT INTO [dbo].[AppType]
               ([AppTypeID], [AppType])
        VALUES
               (${AppTypeID}, ${AppType});
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
  }
};

const getApprovalType = async (req, res) => {
  try {
    const result = await sqlConn.query(`Select * From [dbo].[AppType]`);
    const recordset = result.recordset;
    if (!result) {
      res.status(404).json({
        success: false,
        message: "Unable to fetched Data",
        data: recordset,
      });
    }
    res.status(200).json({
      success: true,
      message: "Approval List Feched!",
      data: recordset,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
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
