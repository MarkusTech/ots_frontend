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
            <TextField
              fullWidth
              id="Type"
              name="Type"
              label="Type"
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
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
      <div className="pt-72"></div>
    </Container>
  );
};
export default page;
