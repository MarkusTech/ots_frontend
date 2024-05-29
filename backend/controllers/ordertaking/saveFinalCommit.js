import sqlConn from "../../config/db.js";

const saveCommit = async (req, res) => {
  try {
    const docNumberResult =
      await sqlConn.query`SELECT MAX(DocNum) AS maxDocNum FROM SO_Header`;

    const maxDocNum = parseInt(docNumberResult.recordset[0].maxDocNum);
    const incrementedDraftNum = maxDocNum + 1;

    const { DraftNum } = req.body;
    const result =
      await sqlConn.query`update So_Header set DocNum = ${incrementedDraftNum} where DraftNum = ${DraftNum}`;
    res.status(200).json({
      success: true,
      message: "Commited Successfully",
      incrementedDraftNum,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { saveCommit };
