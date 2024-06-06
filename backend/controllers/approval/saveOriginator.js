import sqlConn from "../../config/db.js";

const saveORiginator = async (req, res) => {
  const { AppProcID, UserID } = req.body;

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

export { saveORiginator };
