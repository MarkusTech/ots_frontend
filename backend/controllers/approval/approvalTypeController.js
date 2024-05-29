import sqlConn from "../../config/db.js";

const saveApprovalType = async (req, res) => {
  res.send("Save Approval");
};

const getApprovalType = async (req, res) => {
  res.send("Get all approval type");
};

const getSingleApprovalType = async (req, res) => {
  res.send("Get Selected Approval Type");
};

const updateApprovalType = async (req, res) => {
  res.send("Update selected Approval Tyope");
};

const deleteApprovalType = async (req, res) => {
  res.send("Delete Approval Type");
};

export {
  saveApprovalType,
  getApprovalType,
  getSingleApprovalType,
  updateApprovalType,
  deleteApprovalType,
};
