import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Draggable from "react-draggable";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";

// Define types for user data
interface User {
  UserID: string;
  EmpName: string;
  Position: string;
  BranchID: string;
  BranchName: string;
  WhsCode: string;
  PriceListNum: string;
  Status: string;
  UserName: string;
  Password: string;
}

interface FormData {
  userID: string;
  fullName: string;
  position: string;
  branchID: string;
  branchName: string;
  warehouseCode: string;
  priceListNumber: string;
  status: string;
  username: string;
  password: string;
}
interface EditFormData {
  userID: string;
  fullName: string;
  position: string;
  branchID: string;
  branchName: string;
  warehouseCode: string;
  priceListNumber: string;
  status: string;
  username: string;
  password: string;
}

interface UserData {
  EmpName: string;
  Position: string;
  BPLId: number;
  BPLName: string;
  DflWhs: string;
  PriceListNum: number;
}

const initialFormData: FormData = {
  userID: "",
  fullName: "",
  position: "",
  branchID: "",
  branchName: "",
  warehouseCode: "",
  priceListNumber: "",
  status: "",
  username: "",
  password: "",
};

const ViewPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editFormData, setEditFormData] =
    useState<EditFormData>(initialFormData);
  const [showUsers, setShowUsers] = useState(false);
  const [employees, setEmployees] = useState<UserData[]>([]);
  const [lastUserID, setLastUserID] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [addedItem, setAddedItem] = useState("");
  const [fetchTrigger, setFetchTrigger] = useState(0); // State to trigger re-fetch

  // get the the employees to register
  useEffect(() => {
    axios
      .get("http://172.16.10.217:3001/employees")
      .then((response) => {
        const data = response.data;
        setEmployees(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://172.16.10.169:5001/api/v2/userId")
      .then((response) => {
        const lastUserNum = response.data.data;
        const addOneUserNum = lastUserNum + 1;
        setLastUserID(addOneUserNum);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [fetchTrigger]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleStatusChange = (event: any) => {
    setEditFormData({
      ...editFormData,
      status: event.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      EmpName: formData.fullName,
      Position: formData.position,
      BranchID: Number(formData.branchID),
      BranchName: formData.branchName,
      WhsCode: formData.warehouseCode,
      PriceListNum: Number(formData.priceListNumber),
      userName: formData.username,
      Password: formData.password,
      Status: "Active",
    };

    if (formData.username == "" || formData.password == "") {
      Swal.fire({
        icon: "error",
        text: "Need to Fill Username and Password",
      });
    } else {
      try {
        const response = await fetch("http://172.16.10.169:5001/api/v2/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const responseData = await response.json();
          setShowAdd(!showAdd);
          setFetchTrigger((prev) => prev + 1);
          console.log("User registered successfully:", responseData);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "User registered successfully",
          });
          // Reset form
          setFormData(initialFormData);
        } else {
          console.error("Failed to register user:", response.statusText);
        }
      } catch (error) {
        console.error("Error registering user:", error);
      }
    }
  };

  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      EmpName: editFormData.fullName,
      Position: editFormData.position,
      BranchID: Number(editFormData.branchID),
      BranchName: editFormData.branchName,
      WhsCode: editFormData.warehouseCode,
      PriceListNum: Number(editFormData.priceListNumber),
      userName: editFormData.username,
      Password: editFormData.password,
      Status: editFormData.status,
    };

    if (editFormData.username === "" || editFormData.password === "") {
      Swal.fire({
        icon: "error",
        text: "Need to Fill Username and Password",
      });
      return; // Add return to stop the function execution if validation fails
    }

    try {
      const response = await axios.put(
        `http://172.16.10.169:5001/api/v2/user/${selectedUserID}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        // Check for successful response
        const responseData = response.data;
        setFetchTrigger((prev) => prev + 1);
        setShowEdit(!showEdit);
        console.log("User updated successfully:", responseData);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User updated successfully",
        });
        // Reset form
        setEditFormData(initialFormData);
      } else {
        console.error("Failed to update user:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update user",
      });
    }
  };

  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setShowUsers(!showUsers);
  };

  const handleUserSelect = (selectedUser: any) => {
    setFormData({
      userID: lastUserID,
      fullName: selectedUser.EmpName,
      position: selectedUser.Position,
      branchID: selectedUser.BPLId,
      branchName: selectedUser.BPLName,
      warehouseCode: selectedUser.DflWhs,
      priceListNumber: selectedUser.PriceListNum,
      status: "Active",
      username: "",
      password: "",
    });
    setShowUsers(false); // Close the user selection table after selecting a user
  };

  const handleSeletedEditUser = (selectedUser: any) => {
    setSelectedUserID(selectedUser.UserID);
  };

  const [selectedUserID, setSelectedUserID] = useState();
  useEffect(() => {
    if (selectedUserID) {
      axios
        .get(`http://172.16.10.169:5001/api/v2/user/${selectedUserID}`)
        .then((response) => {
          let data = response.data.data;
          setEditFormData({
            userID: selectedUserID,
            fullName: data.EmpName,
            position: data.Position,
            branchID: data.BranchID,
            branchName: data.BranchName,
            warehouseCode: data.WhsCode,
            priceListNumber: data.PriceListNum,
            status: data.Status,
            username: data.UserName,
            password: data.Password,
          });
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  }, [selectedUserID]);

  // -----------------------------------------------------------------------------
  // Update table data without reloading
  const getUsers = async () => {
    try {
      const response = await axios.get(
        "http://172.16.10.169:5001/api/v2/users"
      );
      setUsers(response.data.data);
      setAddedItem(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, [fetchTrigger]);

  // -----------------------------------------------------------------------------

  const handleShowEdit = () => {
    setShowEdit(!showEdit);
    setFormData(initialFormData);
  };

  const handleShowAdd = () => {
    setShowAdd(!showAdd);
    setFormData(initialFormData);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mx-auto">
      {/* the css on tableHeightView is on global css */}
      <div className="tableHeigthView overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <thead className="bg-gray-50">
            <tr className="bg-blue-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Branch ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Branch Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Warehouse Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Price List Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Status
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user: User) => (
              <tr
                key={user.UserID}
                onClick={() => handleSeletedEditUser(user)}
                className="hover:bg-blue-100 cursor-pointer transition-colors"
              >
                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.UserID}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {user.EmpName}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {user.Position}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {user.BranchID}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {user.BranchName}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {user.WhsCode}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {user.PriceListNum}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {user.UserName}
                </td>
                <td
                  className={`px-6 py-2 whitespace-nowrap text-sm ${
                    user.Status === "Active" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {user.Status}
                </td>

                <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={handleShowEdit}
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
          onClick={handleShowAdd}
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

      {/* ----------------------------------Draggable Show Edit ------------------------------------ */}
      {showEdit && (
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
              <div>Edit User</div>
              <div className="text-right">
                <span className="cursor-pointer" onClick={handleShowEdit}>
                  ❌
                </span>
              </div>
            </div>
            <div className="content">
              <div className="p-2">
                <Container component="main" maxWidth="md">
                  <div>
                    <br />
                    <br />
                    <Typography variant="h4" align="center" gutterBottom>
                      Edit User
                    </Typography>
                  </div>
                  <form onSubmit={handleEdit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="userID"
                          name="userID"
                          label="UserID"
                          variant="outlined"
                          value={editFormData.userID}
                          onChange={handleEditChange}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <div className="flex gap-4">
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleButtonClick} // You need to define handleButtonClick function
                            style={{
                              height: "55px",
                              width: "200px",
                              fontWeight: "bold",
                            }}
                          >
                            Select User
                          </Button>
                          <FormControl
                            variant="outlined"
                            style={{ width: "200px" }}
                          >
                            <InputLabel>Status</InputLabel>
                            <Select
                              value={editFormData.status}
                              onChange={handleStatusChange}
                              label="Status"
                              style={{ height: "55px", fontWeight: "bold" }}
                            >
                              <MenuItem value="Inactive">Inactive</MenuItem>
                              <MenuItem value="Active">Active</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="fullName"
                          name="fullName"
                          label="Full Name"
                          variant="outlined"
                          value={editFormData.fullName}
                          onChange={handleEditChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="position"
                          name="position"
                          label="Position"
                          variant="outlined"
                          value={editFormData.position}
                          onChange={handleEditChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="branchID"
                          name="branchID"
                          label="Branch ID"
                          variant="outlined"
                          value={editFormData.branchID}
                          onChange={handleEditChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="branchName"
                          name="branchName"
                          label="Branch Name"
                          variant="outlined"
                          value={editFormData.branchName}
                          onChange={handleEditChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="warehouseCode"
                          name="warehouseCode"
                          label="Warehouse Code"
                          variant="outlined"
                          value={editFormData.warehouseCode}
                          onChange={handleEditChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="priceListNumber"
                          name="priceListNumber"
                          label="Price List Number"
                          variant="outlined"
                          value={editFormData.priceListNumber}
                          onChange={handleEditChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="username"
                          name="username"
                          label="Username"
                          variant="outlined"
                          value={editFormData.username}
                          onChange={handleEditChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="password"
                          name="password"
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          variant="outlined"
                          value={editFormData.password}
                          onChange={handleEditChange}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
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
                      Update
                    </Button>
                  </form>

                  {/* --------------------------- Show Users Draggable ----------------------- */}
                  {showUsers && (
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
                          <div>Select User</div>
                          <div className="text-right">
                            <span
                              onClick={handleButtonClick}
                              className="cursor-pointer"
                            >
                              ❌
                            </span>
                          </div>
                        </div>
                        <div className="content">
                          <div className="p-2">
                            <div className="flex items-center">
                              <div>
                                Search: <input type="text" className="mb-1" />
                              </div>
                              <div className="flex-grow"></div>
                            </div>

                            <div className="table-container">
                              <table className="w-full">
                                <thead className="tables">
                                  <tr>
                                    <th>Employee Name</th>
                                    <th>Position</th>
                                    <th>Branch ID</th>
                                    <th>Branch Name</th>
                                    <th>Designated Warehouse</th>
                                    <th>Price List Number</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {employees.map((user, index) => (
                                    <tr
                                      key={index}
                                      onClick={() => handleUserSelect(user)}
                                      className="hover:bg-blue-100 cursor-pointer"
                                    >
                                      <td>{user.EmpName}</td>
                                      <td>{user.Position}</td>
                                      <td>{user.BPLId}</td>
                                      <td>{user.BPLName}</td>
                                      <td>{user.DflWhs}</td>
                                      <td>{user.PriceListNum}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Draggable>
                  )}
                  <div className="pt-72"></div>
                </Container>
              </div>
            </div>
          </div>
        </Draggable>
      )}

      {/* show add */}
      {showAdd && (
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
              <div>Register User</div>
              <div className="text-right">
                <span className="cursor-pointer" onClick={handleShowAdd}>
                  ❌
                </span>
              </div>
            </div>
            <div className="content">
              <div className="p-2">
                <Container component="main" maxWidth="md">
                  <div>
                    <br />
                    <br />
                    <Typography variant="h4" align="center" gutterBottom>
                      Register User
                    </Typography>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="userID"
                          name="userID"
                          label="UserID"
                          variant="outlined"
                          value={formData.userID}
                          onChange={handleChange}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button
                          // fullWidth
                          variant="outlined"
                          onClick={handleButtonClick} // You need to define handleButtonClick function
                          style={{
                            height: "100%",
                            width: "130px",
                            fontWeight: "bold",
                          }}
                        >
                          Select User
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="fullName"
                          name="fullName"
                          label="Full Name"
                          variant="outlined"
                          value={formData.fullName}
                          onChange={handleChange}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="position"
                          name="position"
                          label="Position"
                          variant="outlined"
                          value={formData.position}
                          onChange={handleChange}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="branchID"
                          name="branchID"
                          label="Branch ID"
                          variant="outlined"
                          value={formData.branchID}
                          onChange={handleChange}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="branchName"
                          name="branchName"
                          label="Branch Name"
                          variant="outlined"
                          value={formData.branchName}
                          onChange={handleChange}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="warehouseCode"
                          name="warehouseCode"
                          label="Warehouse Code"
                          variant="outlined"
                          value={formData.warehouseCode}
                          onChange={handleChange}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="priceListNumber"
                          name="priceListNumber"
                          label="Price List Number"
                          variant="outlined"
                          value={formData.priceListNumber}
                          onChange={handleChange}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="username"
                          name="username"
                          label="Username"
                          variant="outlined"
                          value={formData.username}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="password"
                          name="password"
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          variant="outlined"
                          value={formData.password}
                          onChange={handleChange}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
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
                  </form>

                  {/* Show Users Draggable */}
                  {showUsers && (
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
                          <div>Select User</div>
                          <div className="text-right">
                            <span
                              onClick={handleButtonClick}
                              className="cursor-pointer"
                            >
                              ❌
                            </span>
                          </div>
                        </div>
                        <div className="content">
                          <div className="p-2">
                            <div className="flex items-center">
                              <div>
                                Search: <input type="text" className="mb-1" />
                              </div>
                              <div className="flex-grow"></div>
                            </div>

                            <div className="table-container">
                              <table className="w-full">
                                <thead className="tables">
                                  <tr>
                                    <th>Employee Name</th>
                                    <th>Position</th>
                                    <th>Branch ID</th>
                                    <th>Branch Name</th>
                                    <th>Designated Warehouse</th>
                                    <th>Price List Number</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {employees.map((user, index) => (
                                    <tr
                                      key={index}
                                      onClick={() => handleUserSelect(user)}
                                      className="hover:bg-blue-100 cursor-pointer"
                                    >
                                      <td>{user.EmpName}</td>
                                      <td>{user.Position}</td>
                                      <td>{user.BPLId}</td>
                                      <td>{user.BPLName}</td>
                                      <td>{user.DflWhs}</td>
                                      <td>{user.PriceListNum}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Draggable>
                  )}
                  <div className="pt-72"></div>
                </Container>
              </div>
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default ViewPage;
