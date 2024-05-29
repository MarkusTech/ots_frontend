import sqlConn from "../../config/db.js";

const saveApprovalType = async (req, res) => {
  const { AppTypeID, AppType } = req.body;
  try {
    // Execute the query
    const result = await sqlConn.query`
        INSERT INTO [dbo].[AppType]
               ([AppType])
        VALUES
               (${AppType});
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
  const { AppTypeID } = req.params;
  try {
    const result = await sqlConn.query(
      `SELECT * FROM [dbo].[AppType] WHERE AppTypeID = ${AppTypeID}`
    );
    const recordset = result.recordset;
    if (!result) {
      res.status(404).json({
        success: false,
        message: "Unable to find",
      });
    }
    res.status(200).json({
      success: true,
      message: "Approval Type Found",
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

const updateApprovalType = async (req, res) => {
  const { AppTypeID } = req.params;
  const { AppType } = req.body;
  try {
    // Execute the query with parameterized inputs
    const result = await sqlConn.query`
        UPDATE [dbo].[AppType]
        SET [AppType] = ${AppType}
        WHERE [AppTypeID] = ${AppTypeID}
      `;

    // Check if any row was affected
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: "Unable to find and update",
      });
    }

    res.status(200).json({
      success: true,
      message: "Updated Successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteApprovalType = async (req, res) => {
  const { AppTypeID } = req.params;
  try {
    const result = await sqlConn.query(
      `DELETE FROM [dbo].[AppType] WHERE AppTypeID = ${AppTypeID}`
    );

    if (!result) {
      res.status(404).json({
        success: false,
        message: `Unable to find and delete ${AppTypeID}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted Successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  saveApprovalType,
  getApprovalType,
  getSingleApprovalType,
  updateApprovalType,
  deleteApprovalType,
};
