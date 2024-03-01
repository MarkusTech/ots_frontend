import sqlConn from "../config/db.js";

const getSingleDataFromDraft = async (req, res) => {
  try {
    const data = await sqlConn.query("Select * From SO_Header");
    res.status(200).json(data.recordset);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export { getSingleDataFromDraft };
