import sqlConn from "../config/db.js";

const receipt = async (req, res) => {
  try {
    const { DraftNumber } = req.params;
    const result = await sqlConn.query(
      `SELECT DISTINCT ModeReleasing,dbo.fn_GetSOModeOfRel(DraftNum,ModeReleasing) AS PickUpLocation FROM View_SOReleasing WHERE DraftNUm='${DraftNumber}'`
    );

    if (result.recordset.length > 0) {
      // res.json(result.recordset[0]);
      res.json(result.recordsets);
    } else {
      // If no matching record is found, send an appropriate response
      res.status(404).json({ message: "Record not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { receipt };
