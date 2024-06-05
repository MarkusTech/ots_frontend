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

const Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [type, setType] = useState("");

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

  useEffect(() => {
    axios.get("http://localhost:5000/api/v2/approval/type").then((response) => {
      console.log(response.data.data);
    });
  }, []);

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
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="AppTypeID"
              name="AppTypeID"
              label="Approval Type"
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
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
