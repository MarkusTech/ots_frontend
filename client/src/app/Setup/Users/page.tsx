import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Grid, Typography, Container } from "@mui/material";
import Draggable from "react-draggable";
import Swal from "sweetalert2";
import axios from "axios";

interface FormData {
  userID: string;
  fullName: string;
  position: string;
  branchID: string;
  branchName: string;
  warehouseCode: string;
  priceListNumber: string;
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
  username: "",
  password: "",
};

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [lastUserID, setLastUserID] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://172.16.10.217:3001/employees");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
      username: "",
      password: "",
    });
    setShowUsers(false); // Close the user selection table after selecting a user
  };

  return (
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
              style={{ height: "100%", width: "130px", fontWeight: "bold" }}
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
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 20 }}
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
                <span onClick={handleButtonClick} className="cursor-pointer">
                  ❌
                </span>
              </div>
            </div>
            <div className="content">
              <div className="p-2">
                <div className="flex items-center">
                  <div>
                    Search:{" "}
                    <input
                      type="text"
                      className="mb-1"
                      // value={searchTerm}
                      // onChange={handleSearchForDraft}
                    />
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
                      {users.map((user, index) => (
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
  );
}
