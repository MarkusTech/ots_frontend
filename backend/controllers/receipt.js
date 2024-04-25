import sqlConn from "../config/db.js";

const receipt = async (req, res) => {
  try {
    const { DraftNumber } = req.params;
    const result = await sqlConn.query(
      `SELECT DISTINCT ModeReleasing,dbo.fn_GetSOModeOfRel(DraftNum,ModeReleasing) AS PickUpLocation FROM View_SOReleasing WHERE DraftNUm=${DraftNumber}`
    );
    res.status(200).json({
      success: true,
      message: "Receipt Record Fetched",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { receipt };
