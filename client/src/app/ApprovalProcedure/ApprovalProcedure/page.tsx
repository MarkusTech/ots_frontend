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

interface OriginatorData {
  UserID: number;
  EmployeeName: string;
  Position: string;
}

interface ApproverData {
  id: number;
  name: string;
  position: string;
  level: string;
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
  approvalProcedureId: string;
  approvalType: string;
  warehouseCode: string;
  documentType: string;
  type: string;
  numberOfApprover: number;
}

const rows: ApprovalData[] = [
  {
    approvalProcedureId: "001",
    approvalType: "Standard",
    warehouseCode: "WH01",
    documentType: "Invoice",
    type: "Automatic",
    numberOfApprover: 3,
  },
  {
    approvalProcedureId: "002",
    approvalType: "Express",
    warehouseCode: "WH02",
    documentType: "Purchase Order",
    type: "Manual",
    numberOfApprover: 2,
  },
  // Add more rows as needed
];

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
  const [showOriginators, setShowOriginators] = useState(false);

  // for tab changing
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const showApprovalButton = () => {
    setShowCreateApproval(!showCreateApproval);
  };

  useEffect(() => {
    axios
      .get("http://172.16.10.169:5001/api/v1/originator")
      .then((response: any) => {
        setOriginators(response.data.data);
      });
  }, []);

  const sshowOriginators = () => {
    setShowOriginators(!showOriginators);
  };

  const approvers: ApproverData[] = [
    { id: 1, name: "John Doe", position: "Developer", level: "1" },
    { id: 2, name: "Jane Smith", position: "Designer", level: "1" },
    { id: 3, name: "Alice Johnson", position: "Manager", level: "1" },
  ];

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

  const handleSave = () => {
    // console.log(lastApprovalID);
    setReload(!reload);
    // console.log(warehouseList);
    console.log(originators);
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
                  {/* {originators.map((originator) => (
                  <TableRow key={originator.UserID}>
                    <TableCell>{originator.UserID}</TableCell>
                    <TableCell>{originator.EmployeeName}</TableCell>
                    <TableCell>{originator.Position}</TableCell>
                  </TableRow>
                ))} */}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              variant="contained"
              color="primary"
              onClick={sshowOriginators}
              style={{ marginTop: "16px" }}
            >
              Add
            </Button>
          </div>
        );
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
                  {approvers.map((approver) => (
                    <TableRow key={approver.id}>
                      <TableCell>{approver.id}</TableCell>
                      <TableCell>{approver.name}</TableCell>
                      <TableCell>{approver.position}</TableCell>
                      <TableCell>{approver.level}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              variant="contained"
              color="primary"
              onClick={sshowOriginators}
              style={{ marginTop: "16px" }}
            >
              Add
            </Button>
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
            {rows.map((row) => (
              <tr
                key={row.approvalProcedureId}
                className="hover:bg-blue-100 cursor-pointer transition-colors"
              >
                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.approvalProcedureId}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {row.approvalType}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {row.warehouseCode}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {row.documentType}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {row.type}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {row.numberOfApprover}
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

      {showOriginators && (
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
                <span className="cursor-pointer" onClick={sshowOriginators}>
                  ❌
                </span>
              </div>
            </div>
            <div className="content">
              <div className="p-2">
                <div>
                  <br />
                </div>
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
                      {originators.map((originator) => (
                        <TableRow key={originator.UserID}>
                          <TableCell>{originator.UserID}</TableCell>
                          <TableCell>{originator.EmployeeName}</TableCell>
                          <TableCell>{originator.Position}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Page;
