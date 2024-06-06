import sqlConn from "../../config/db.js";

const saveApprovalHeader = async (req, res) => {
  const { AppTypeID, WhseCode, DocType, Type, NumApprover } = req.body;

  try {
    const data = await sqlConn.query(``);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { saveApprovalHeader };
