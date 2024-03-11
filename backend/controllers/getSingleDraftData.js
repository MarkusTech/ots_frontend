import sqlConn from "../config/db.js";

// const getDataFromDraft = async (req, res) => {
//   try {
//     const data = await sqlConn.query("Select * From SO_Header");
//     res.status(200).json(data.recordset);
//   } catch (error) {
//     console.log(error);
//     throw new Error(error);
//   }
// };

const getDataFromDraft = async (req, res) => {
  try {
    const data = await sqlConn.query(
      "SELECT * FROM SO_Header ORDER BY DraftNum DESC"
    );
    res.status(200).json(data.recordset);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getSingleDataFromDraft = async (req, res) => {
  const { DraftNum } = req.params;
  try {
    const result =
      await sqlConn.query`SELECT * FROM SO_Header WHERE DraftNum = ${DraftNum}`;

    if (result.recordset.length > 0) {
      // If a matching record is found, send it in the response
      res.json(result.recordset[0]);
    } else {
      // If no matching record is found, send an appropriate response
      res.status(404).json({ message: "Record not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getSingleDataFromDraft, getDataFromDraft };
