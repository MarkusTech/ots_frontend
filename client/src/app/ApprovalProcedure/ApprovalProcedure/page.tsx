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
} from "@mui/material";
import axios from "axios";

interface OriginatorData {
  id: number;
  name: string;
  position: string;
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

const Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [type, setType] = useState<string>("");
  const [approvalType, setApprovalType] = useState<string>("");
  const [selectedAppTypeID, setSelectedAppTypeID] = useState<number | null>(
    null
  );
  const [approvalTypeArr, setApprovalTypeArr] = useState<ApprovalType[]>([]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const users: OriginatorData[] = [
    { id: 1, name: "John Doe", position: "Developer" },
    { id: 2, name: "Jane Smith", position: "Designer" },
    { id: 3, name: "Alice Johnson", position: "Manager" },
  ];

  const approvers: ApproverData[] = [
    { id: 1, name: "John Doe", position: "Developer", level: "1" },
    { id: 2, name: "Jane Smith", position: "Designer", level: "1" },
    { id: 3, name: "Alice Johnson", position: "Manager", level: "1" },
  ];

  const handleTypeChange = (event: any) => {
    setType(event.target.value);
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
  }, []); // Only run once when the component mounts

  const renderTabContent = (index: number) => {
    switch (index) {
      case 0:
        return (
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
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.position}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      case 1:
        return (
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
        );
      default:
        return null;
    }
  };

  // Main form
  return (
    <Container component="main" maxWidth="md">
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
              InputProps={{
                readOnly: true,
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
            <TextField
              fullWidth
              id="WhseCode"
              name="WhseCode"
              label="Warehouse Code"
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          {/* Second Row */}
          {/* ------------------ DocType Type ------------------ */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="DocType"
              name="DocType"
              label="Document Type"
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
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
              InputProps={{
                readOnly: true,
              }}
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
        <div className="pt-72"></div>
      </div>
    </Container>
  );
};

export default Page;
