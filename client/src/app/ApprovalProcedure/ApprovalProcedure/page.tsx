import React, { useState } from "react";
import { TextField, Grid, Container, Tabs, Tab, Box } from "@mui/material";

const Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderTabContent = (index: number) => {
    switch (index) {
      case 0:
        return (
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
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
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
        );
      default:
        return null;
    }
  };

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

      <div className="tabssss">
        <div>
          <br />
        </div>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Tab 1" />
          <Tab label="Tab 2" />
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
