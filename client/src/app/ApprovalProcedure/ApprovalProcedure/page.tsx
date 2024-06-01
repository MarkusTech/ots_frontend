import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Grid, Typography, Container } from "@mui/material";
import Draggable from "react-draggable";

const page = () => {
  return (
    <Container component="main" maxWidth="md">
      <div>
        <br />
      </div>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="AppProcID"
              name="AppProcID"
              label="Approval Procedure ID"
              variant="outlined"
              // value={formData.userID}
              // onChange={handleChange}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button
              // fullWidth
              variant="outlined"
              // onClick={handleButtonClick}
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
              // value={formData.fullName}
              // onChange={handleChange}
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
              // value={formData.position}
              // onChange={handleChange}
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
              // value={formData.branchID}
              // onChange={handleChange}
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
              // value={formData.branchName}
              // onChange={handleChange}
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
              // value={formData.warehouseCode}
              // onChange={handleChange}
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
              // value={formData.priceListNumber}
              // onChange={handleChange}
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
              // value={formData.username}
              // onChange={handleChange}
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
              // value={formData.password}
              // onChange={handleChange}
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
      <div className="pt-72"></div>
    </Container>
  );
};
export default page;
