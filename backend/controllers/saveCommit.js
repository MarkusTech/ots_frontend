import sqlConn from "../config/db.js";

const saveCommitHeader = async (req, res) => {
  res.send("Save Commit Header");
};

const saveCommitDetails = async (req, res) => {
  res.send("Save Commit Details");
};

export { saveCommitHeader };
