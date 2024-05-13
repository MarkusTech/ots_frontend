import sqlConn2 from "../config/db2.js";

const saveUsers = async (req, res) => {
  res.send("Save Users");
};

const getUsers = async (req, res) => {
  res.send("Get Users");
};

const getSingleUsers = async (req, res) => {
  res.send("Get Single Users");
};

const updateUser = async (req, res) => {
  res.send("Update Users");
};

export { saveUsers, getUsers, getSingleUsers, updateUser };
