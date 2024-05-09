import React, { useState, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Grid, Typography, Container } from "@mui/material";
import Draggable from "react-draggable";

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setShowUsers(!showUsers);
  };

  return (
    <Container component="main" maxWidth="md">
      <div>
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleButtonClick} // You need to define handleButtonClick function
              style={{ height: "100%", fontWeight: "bold" }}
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
      {showUsers && (
        <Draggable>
          <div
            className="bg-white shadow-lg"
            style={{
              border: "1px solid #ccc",
              position: "absolute",
              top: "12%",
              left: "15%",
            }}
          >
            Hello World!
          </div>
        </Draggable>
      )}
      <br />
      <br />
      <div className="pt-72"></div>
    </Container>
  );
}
