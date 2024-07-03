import sqlConn2 from "../../../config/db2.js";

const getTaxCode = async (req, res) => {
  req.send("Tax Code");
};

export { getTaxCode };
