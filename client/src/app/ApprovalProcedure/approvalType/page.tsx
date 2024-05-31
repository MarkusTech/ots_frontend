import React, { useState, useEffect, ChangeEvent, FormEvent, use } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Draggable from "react-draggable";
import { TextField, Button, Grid, Container } from "@mui/material";
import axios from "axios";

interface Approval {
  AppTypeID: number;
  AppType: string;
}

const ApprovalTypePage: React.FC = () => {
  const [showCreateApproval, setShowCreateApproval] = useState(false);
  const [showEditApproval, setShowEditApproval] = useState(false);
  const [approvalList, setApprovalList] = useState<Approval[]>([]);
  const [formData, setFormData] = useState({
    approvalType: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/v2/approval/type").then((response) => {
      const data = response.data.data;
      setApprovalList(data);
    });
  }, []);

  const createButton = () => {
    setShowCreateApproval(!showCreateApproval);
  };

  const editButton = () => {
    setShowEditApproval(!showEditApproval);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const payload = {
      AppType: formData.approvalType,
    };
    try {
      const response = await fetch(
        "http://localhost:5000/api/v2/approval/type",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setFormData({
          approvalType: "",
        });
        setShowCreateApproval(!showCreateApproval);
      }
    } catch (error) {
      console.error("Error creating approval type:", error);
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto">
      <div className="tableHeigthView overflow-y-auto">
        <table className="w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <thead className="bg-gray-50">
            <tr className="bg-blue-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Approval Type ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Approval Type
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {approvalList.map((approval: Approval) => (
              <tr
                key={approval.AppTypeID}
                className="hover:bg-blue-100 cursor-pointer transition-colors"
              >
                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {approval.AppTypeID}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {approval.AppType}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={editButton}
                  >
                    <EditIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mb-6 pt-2 px-4">
        <h2 className="text-lg font-semibold text-gray-800"></h2>
        <button
          className="flex items-center px-4 py-2 button-custom-bg-color text-white rounded-md focus:outline-none focus:bg-blue-600"
          onClick={createButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM9 9V5a1 1 0 0 1 2 0v4h4a1 1 0 0 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V9z"
              clipRule="evenodd"
            />
          </svg>
          Create
        </button>
      </div>

      {/* show edit approval */}
      {showEditApproval && (
        <Draggable>
          <div
            className="bg-white shadow-lg"
            style={{
              border: "1px solid #ccc",
              position: "absolute",
              top: "20%",
              left: "20%",
              maxHeight: "700px",
              overflowY: "auto",
              background: "white",
              zIndex: "9999", // Set a high z-index value to bring it to the front. HAHAHA
            }}
          >
            <div
              className="grid grid-cols-2 p-2 text-left windowheader"
              style={{ cursor: "move" }}
            >
              <div>Edit Approval Type</div>
              <div className="text-right">
                <span className="cursor-pointer" onClick={editButton}>
                  ❌
                </span>
              </div>
            </div>
            <div className="content">
              <div className="p-2">
                <Container component="main" maxWidth="md">
                  <br />
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={12}>
                        <TextField
                          fullWidth
                          id="approvalTypeId"
                          name="approvalTypeId"
                          label="Approval Type ID"
                          variant="outlined"
                          // value={formData.userID}
                          // onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <TextField
                          fullWidth
                          id="approvalTypeId"
                          name="approvalTypeId"
                          label="Approval Type"
                          variant="outlined"
                          // value={formData.userID}
                          // onChange={handleChange}
                        />
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      style={{
                        marginTop: 20,
                        backgroundColor: "#f69629",
                      }}
                    >
                      Save
                    </Button>
                    <br />
                    <br />
                  </form>
                </Container>
              </div>
            </div>
          </div>
        </Draggable>
      )}

      {/* show create approval */}
      {showCreateApproval && (
        <Draggable>
          <div
            className="bg-white shadow-lg"
            style={{
              border: "1px solid #ccc",
              position: "absolute",
              top: "20%",
              left: "20%",
              maxHeight: "700px",
              overflowY: "auto",
              background: "white",
              zIndex: "9999",
            }}
          >
            <div
              className="grid grid-cols-2 p-2 text-left windowheader"
              style={{ cursor: "move" }}
            >
              <div>Create Approval Type</div>
              <div className="text-right">
                <span className="cursor-pointer" onClick={createButton}>
                  ❌
                </span>
              </div>
            </div>
            <div className="content">
              <div className="p-2">
                <Container component="main" maxWidth="md">
                  <br />
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={1}>
                      {/* <Grid item xs={12} sm={12}>
                        <TextField
                          fullWidth
                          id="approvalTypeId"
                          name="approvalTypeId"
                          label="Approval Type ID"
                          variant="outlined"
                          // value={formData.approvalTypeId}
                          // onChange={handleChange}
                        />
                      </Grid> */}
                      <Grid item xs={12} sm={12}>
                        <TextField
                          fullWidth
                          id="approvalType"
                          name="approvalType"
                          label="Approval Type"
                          variant="outlined"
                          value={formData.approvalType}
                          onChange={handleChange}
                        />
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      style={{ marginTop: 20, backgroundColor: "#f69629" }}
                    >
                      Save
                    </Button>
                    <br />
                    <br />
                  </form>
                </Container>
              </div>
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default ApprovalTypePage;
