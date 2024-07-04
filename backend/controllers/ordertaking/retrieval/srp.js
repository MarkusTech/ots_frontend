import sqlConn2 from "../../../config/db2.js";

const srp = async (req, res) => {
  try {
    req.send("srp");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { srp };
