import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Container,
  Tabs,
  Tab,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";
import Draggable from "react-draggable";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

interface OriginatorData {
  UserID: number;
  EmployeeName: string;
  Position: string;
}

interface ApprovalType {
  AppTypeID: number;
  AppType: string;
}

interface WarehouseList {
  WhsCode: string;
  WhsName: string;
}

interface ApprovalData {
  AppProcID: number;
  AppType: string;
  WhseCode: string;
  DocType: string;
  Type: string;
  NumApprover: number;
}

interface SelectedOriginator {
  UserID: number;
  EmployeeName: string;
  Position: string;
}

interface SelectedApprover {
  UserID: number;
  EmployeeName: string;
  Position: string;
  Level: string;
}

const Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [type, setType] = useState<string>("");
  const [doctype, setDoctype] = useState<string>("");
  const [reload, setReload] = useState(false);
  const [selectedAppTypeID, setSelectedAppTypeID] = useState<number | null>(
    null
  );
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [lastApprovalID, setLastApprovalID] = useState<number>();
  const [approvalTypeArr, setApprovalTypeArr] = useState<ApprovalType[]>([]);
  const [warehouseList, setWarehouseList] = useState<WarehouseList[]>([]);
  const [showCreateApproval, setShowCreateApproval] = useState(false);
  const [originators, setOriginators] = useState<OriginatorData[]>([]);
  const [showOriginatorsList, setShowOriginatorsList] = useState(false);
  const [showApproversList, setShowApproversList] = useState(false);

  const [selectedOriginators, setSelectedOriginators] = useState<
    SelectedOriginator[]
  >([]);

  const [selectedApprovers, setSelectedApprovers] = useState<
    SelectedApprover[]
  >([]);

  const [approvalData, setApprovalData] = useState<ApprovalData[]>([]);

  // for tab changing
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const showApprovalButton = () => {
    setShowCreateApproval(!showCreateApproval);
  };

  const showApproversLists = () => {
    setShowApproversList(!showApproversList);
  };

  useEffect(() => {
    axios
      .get(`http://172.16.10.169:5000/api/v1/get-approval-main`)
      .then((response) => {
        setApprovalData(response.data.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://172.16.10.169:5001/api/v1/originator")
      .then((response: any) => {
        setOriginators(response.data.data);
      });
  }, []);

  const showOriginatorList = () => {
    setShowOriginatorsList(!showOriginatorsList);
  };

  const handleOriginatorChange = (originator: SelectedOriginator) => {
    setSelectedOriginators((prevSelectedOriginators) => [
      ...prevSelectedOriginators,
      {
        UserID: originator.UserID,
        EmployeeName: originator.EmployeeName,
        Position: originator.Position,
      },
    ]);
    setShowOriginatorsList(!showOriginatorsList);
  };

  const handleApproverChanges = (originator: SelectedApprover) => {
    setSelectedApprovers((prevApprovers) => [
      ...prevApprovers,
      {
        UserID: originator.UserID,
        EmployeeName: originator.EmployeeName,
        Position: originator.Position,
        Level: "1",
      },
    ]);
    setShowApproversList(!showApproversList);
  };

  const handleTypeChange = (event: any) => {
    setType(event.target.value);
  };

  const handleDocChange = (event: any) => {
    setDoctype(event.target.value);
  };

  const handleApprovalTypeChange = (event: any) => {
    const selectedType = approvalTypeArr.find(
      (type) => type.AppType === event.target.value
    );
    if (selectedType) {
      setSelectedAppTypeID(selectedType.AppTypeID);
      console.log("Selected AppTypeID:", selectedType.AppTypeID);
    }
  };

  // handle warehouse change
  const handleWarehouseChange = (event: any) => {
    const selectedWhsCode = event.target.value;

    warehouseList.map((warehouse) => {
      if (warehouse.WhsCode === selectedWhsCode) {
        setSelectedWarehouse(warehouse.WhsCode);
        console.log("Selected Warehouse:", warehouse.WhsCode);
      }
      return null;
    });
  };

  const handleSave = async () => {
    // fix this logic
    const payload = {
      AppTypeID: selectedAppTypeID,
      WhseCode: selectedWarehouse,
      DocType: doctype,
      Type: type,
      NumApprover: 5,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/save-approval-header",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        console.log("Success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v2/list-warehouse")
      .then((response) => {
        const data = response.data.data;
        setWarehouseList(data);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v2/last-approval-id`)
      .then((response) => {
        const data = response.data.data.LastAppProcID;
        let approvalID = data + 1;
        setLastApprovalID(approvalID);
      });
  }, [reload]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v2/approval/type")
      .then((response) => {
        const data = response.data.data;
        setApprovalTypeArr(data);
      })
      .catch((error) => {
        console.error("Error fetching approval types:", error);
      });
  }, []);

  const renderTabContent = (index: number) => {
    switch (index) {
      // Originator
      case 0:
        return (
          <div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User ID</TableCell>
                    <TableCell>User Name</TableCell>
                    <TableCell>Position</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOriginators.map((selectedOriginator) => (
                    <TableRow key={selectedOriginator.UserID}>
                      <TableCell>{selectedOriginator.UserID}</TableCell>
                      <TableCell>{selectedOriginator.EmployeeName}</TableCell>
                      <TableCell>{selectedOriginator.Position}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div
              className="pt-2"
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
              <Button
                variant="contained"
                onClick={showOriginatorList}
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: "#f69629 !important", // Ensures the background color is applied
                  "&:hover": {
                    backgroundColor: "#e0851e !important", // Ensures the hover background color is applied
                  },
                }}
              >
                Add
              </Button>
            </div>
          </div>
        );
      // approver
      case 1:
        return (
          <div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User ID</TableCell>
                    <TableCell>User Name</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Level</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedApprovers.map((approver) => (
                    <TableRow key={approver.UserID}>
                      <TableCell>{approver.UserID}</TableCell>
                      <TableCell>{approver.EmployeeName}</TableCell>
                      <TableCell>{approver.Position}</TableCell>
                      <TableCell>{approver.Level}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div
              className="pt-2"
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
              <Button
                variant="contained"
                onClick={showApproversLists}
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: "#f69629 !important", // Ensures the background color is applied
                  "&:hover": {
                    backgroundColor: "#e0851e !important", // Ensures the hover background color is applied
                  },
                }}
              >
                Add
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Main form
  return (
    <div className="container mx-auto">
      <div className="tableHeigthView overflow-y-auto">
        <table className="w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <thead className="bg-gray-50">
            <tr className="bg-blue-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Approval Procedure ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Approval Type
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Warehouse Code
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Document Type
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Type
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Number of Approver
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {approvalData.map((row) => (
              <tr
                key={row.AppProcID}
                className="hover:bg-blue-100 cursor-pointer transition-colors"
              >
                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.AppProcID}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {row.AppType}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {row.WhseCode}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {row.DocType}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {row.Type}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {row.NumApprover}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    // onClick={editButton}
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
          onClick={showApprovalButton}
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

      {showCreateApproval && (
        <Draggable>
          <div
            className="bg-white shadow-lg"
            style={{
              border: "1px solid #ccc",
              position: "absolute",
              top: "20%",
              left: "20%",
              maxHeight: "740px",
              overflowY: "auto",
              background: "white",
              zIndex: "9999",
            }}
          >
            <div
              className="grid grid-cols-2 p-2 text-left windowheader"
              style={{ cursor: "move" }}
            >
              <div>Create Approval Procedure</div>
              <div className="text-right">
                <span className="cursor-pointer" onClick={showApprovalButton}>
                  ❌
                </span>
              </div>
            </div>
            <div className="content">
              <div className="p-2">
                <div>
                  <br />
                </div>
                <form>
                  <Grid container spacing={3}>
                    {/* First Row */}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        id="AppProcID"
                        name="AppProcID"
                        label="Approval Procedure ID"
                        variant="outlined"
                        value={lastApprovalID}
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    {/* ------------------ Approval Type ------------------ */}
                    <Grid item xs={12} sm={4}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="Type-label">Approval Type</InputLabel>
                        <Select
                          labelId="Type-label"
                          id="AppTypeID"
                          value={
                            selectedAppTypeID
                              ? approvalTypeArr.find(
                                  (type) => type.AppTypeID === selectedAppTypeID
                                )?.AppType || ""
                              : ""
                          }
                          onChange={handleApprovalTypeChange}
                          label="Approval Type"
                        >
                          {approvalTypeArr.map((type) => (
                            <MenuItem key={type.AppTypeID} value={type.AppType}>
                              {type.AppType}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {/* ------------------ Warehouse Code ------------------ */}
                    <Grid item xs={12} sm={4}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="WhseCode">Warehouse Code</InputLabel>
                        <Select
                          labelId="WhseCode"
                          id="WhseCode"
                          value={selectedWarehouse || ""}
                          onChange={handleWarehouseChange}
                          label="Warehouse Code"
                        >
                          {warehouseList.map((warehouse) => (
                            <MenuItem
                              key={warehouse.WhsCode}
                              value={warehouse.WhsCode}
                            >
                              {warehouse.WhsName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Second Row */}
                    {/* ------------------ DocType Type ------------------ */}
                    <Grid item xs={12} sm={4}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="Doc-Type">Document Type</InputLabel>
                        <Select
                          labelId="Doc-Type"
                          id="Doc-Type"
                          value={doctype}
                          onChange={handleDocChange}
                          label="Document Type"
                        >
                          <MenuItem value="SalesOrder">Sales Order</MenuItem>
                          <MenuItem value="SalesQoutation">
                            Sales Quotation
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {/* ------------------ Type ------------------ */}
                    <Grid item xs={12} sm={4}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="Type-label">Type</InputLabel>
                        <Select
                          labelId="Type-label"
                          id="Type"
                          value={type}
                          onChange={handleTypeChange}
                          label="Type"
                        >
                          <MenuItem value="Sequential">Sequential</MenuItem>
                          <MenuItem value="Simultaneous">Simultaneous</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {/* ------------------ Number of Approver ------------------ */}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        id="NumApprover"
                        name="NumApprover"
                        label="Number of Approver"
                        variant="outlined"
                        type="number"
                      />
                    </Grid>
                  </Grid>
                </form>

                <div className="tabssss">
                  <div>
                    <br />
                  </div>
                  <Tabs value={activeTab} onChange={handleTabChange} centered>
                    <Tab label="Originator" />
                    <Tab label="Approver" />
                  </Tabs>
                  <form>
                    <Box mt={3}>{renderTabContent(activeTab)}</Box>
                  </form>
                  <div className="pt-28"></div>

                  {/* Save button */}
                  <div className="flex justify-between items-center mb-6 pt-2 px-4">
                    <h2 className="text-lg font-semibold text-gray-800"></h2>
                    <button
                      className="flex items-center px-4 py-2 button-custom-bg-color text-white rounded-md focus:outline-none focus:bg-blue-600"
                      onClick={handleSave}
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
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      )}

      {showOriginatorsList && (
        <Draggable>
          <div
            className="bg-white shadow-lg"
            style={{
              border: "1px solid #ccc",
              position: "absolute",
              top: "20%",
              left: "20%",
              maxHeight: "740px",
              overflowY: "auto",
              background: "white",
              zIndex: "9999",
            }}
          >
            <div
              className="grid grid-cols-2 p-2 text-left windowheader"
              style={{ cursor: "move" }}
            >
              <div>Select Originator</div>
              <div className="text-right">
                <span className="cursor-pointer" onClick={showOriginatorList}>
                  ❌
                </span>
              </div>
            </div>
            <div className="content">
              <div className="p-2">
                <div className="p-2">
                  <div className="content">
                    <div>
                      Search:{" "}
                      <input
                        type="text"
                        className="mb-1"
                        // value={searchTerm}
                        // onChange={handleSearchItem}
                      />
                    </div>
                    <table>
                      <thead className="tables">
                        <tr>
                          <th>User ID</th>
                          <th>User Name</th>
                          <th>Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {originators.map((originator: any) => (
                          // eslint-disable-next-line react/jsx-key
                          <tr
                            className="tdcus cursor-pointer"
                            key={originator.UserID}
                            onClick={() => handleOriginatorChange(originator)}
                          >
                            <td>{originator.UserID}</td>
                            <td>{originator.EmployeeName}</td>
                            <td>{originator.Position}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      )}

      {showApproversList && (
        <Draggable>
          <div
            className="bg-white shadow-lg"
            style={{
              border: "1px solid #ccc",
              position: "absolute",
              top: "20%",
              left: "20%",
              maxHeight: "740px",
              overflowY: "auto",
              background: "white",
              zIndex: "9999",
            }}
          >
            <div
              className="grid grid-cols-2 p-2 text-left windowheader"
              style={{ cursor: "move" }}
            >
              <div>Select Approver</div>
              <div className="text-right">
                <span className="cursor-pointer" onClick={showApproversLists}>
                  ❌
                </span>
              </div>
            </div>
            <div className="content">
              <div className="p-2">
                <div className="p-2">
                  <div className="content">
                    <div>
                      Search:{" "}
                      <input
                        type="text"
                        className="mb-1"
                        // value={searchTerm}
                        // onChange={handleSearchItem}
                      />
                    </div>
                    <table>
                      <thead className="tables">
                        <tr>
                          <th>User ID</th>
                          <th>User Name</th>
                          <th>Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {originators.map((originator: any) => (
                          // eslint-disable-next-line react/jsx-key
                          <tr
                            className="tdcus cursor-pointer"
                            key={originator.UserID}
                            onClick={() => handleApproverChanges(originator)}
                          >
                            <td>{originator.UserID}</td>
                            <td>{originator.EmployeeName}</td>
                            <td>{originator.Position}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Page;

// https://chatgpt.com/c/3e768ec8-1000-47f2-81ee-79d568d77617
