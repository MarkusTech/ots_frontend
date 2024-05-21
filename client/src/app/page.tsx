"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SalesQoutation from "./Transaction/SalesQoutation/SalesQoutation";
import Draggable from "react-draggable";
import SalesOrder from "./Transaction/SalesOrder/SalesOrder";
import Users from "./Setup/Users/page";
import ViewUser from "./Setup/ViewUsers/page";
import Image from "next/image";
import { useWindowState } from "../app/Transaction/SalesOrder/WindowsState";
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  CssBaseline,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

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

export default function Home() {
  const router = useRouter(); //Router
  const { showSalesOrder, showUsers, viewUsers, toggleWindow } =
    useWindowState(); // Use the state and functions

  const [rounterName, setRounterName] = React.useState("");

  // For submenu states
  const [subsubmenuOpen, setSubsubmenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [submenuOpenInq, setSubmenuOpenInq] = useState(false);
  const [submenuOpenReports, setSubmenuOpenReports] = useState(false);
  const [submenuOpenSetUp, setSubmenuOpenSetUp] = useState(false);
  const [routerName, setRouterName] = useState("");

  // submenu transaction
  const [subsubmenuOpen1, setSubsubmenuOpen1] = useState("");
  const [subsubmenuOpen2, setSubsubmenuOpen2] = useState("");

  // For span active
  const [spanName1, setSpanName1] = useState("");
  const [spanName2, setSpanName2] = useState("");
  const [spanName3, setSpanName3] = useState("");
  const [spanName4, setSpanName4] = useState("");

  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  let userLogin = 0;

  const loginUser = () => {
    userLogin += 1;
    alert(userLogin);
  };

  const showLoginFunction = () => {
    setShowLogin(!showLogin);
    setFormData({
      userID: "selectedUserID",
      fullName: "data.EmpName",
      position: "data.Position",
      branchID: "data.BranchID",
      branchName: "data.BranchName",
      warehouseCode: "data.WhsCode",
      priceListNumber: "data.PriceListNum",
      status: "data.Status",
      username: "data.UserName",
      password: "data.Password",
    });
  };

  function handleRounter(page: React.SetStateAction<string>) {
    if (page === "transaction") {
      setRounterName(page);
      setSubmenuOpen(!submenuOpen);
      setSubmenuOpenInq(false);
      setSubmenuOpenReports(false);
      setSubmenuOpenSetUp(false);

      setSpanName1("active");
      setSpanName2("");
      setSpanName3("");
      setSpanName4("");
    } else if (page === "inquiry") {
      setRounterName(page);
      setSubmenuOpenInq(!submenuOpenInq);
      setSubmenuOpen(false);
      setSubmenuOpenReports(false);
      setSubmenuOpenSetUp(false);

      setSpanName1("");
      setSpanName2("active");
      setSpanName3("");
      setSpanName4("");
    } else if (page === "reports") {
      setRounterName(page);
      setSubmenuOpenReports(!submenuOpenReports);
      setSubmenuOpen(false);
      setSubmenuOpenInq(false);
      setSubmenuOpenSetUp(false);

      setSpanName1("");
      setSpanName2("");
      setSpanName3("active");
      setSpanName4("");
    } else if (page === "setup") {
      setRounterName(page);
      setSubmenuOpenSetUp(!submenuOpenSetUp);
      setSubmenuOpen(false);
      setSubmenuOpenInq(false);
      setSubmenuOpenReports(false);

      setSpanName1("");
      setSpanName2("");
      setSpanName3("");
      setSpanName4("active");
    }
  }

  const handleSubmenuClick = (e: any) => {
    e.stopPropagation(); // Prevent the event from reaching the parent li
  };

  return (
    <>
      <div className="flex z-20">
        <div className="p-2 nav w-60">
          <div className="">
            <div className="flex items-center justify-center">
              {/* LOGO */}
              <Image src="/image/ots.jpg" alt="logo" width={70} height={70} />
            </div>
            <div className="flex items-center justify-center">
              <div className="p-2">
                <div className="w-[200px]">
                  <ul>
                    {/* ----------------------------- TRANSACTION ------------------------------- */}
                    <li
                      className={`p-2 linav ${
                        routerName === "transaction" ? "active" : ""
                      }`}
                      onClick={() => handleRounter("transaction")}
                    >
                      <span className={`${spanName1}`}>Transaction</span>
                      {submenuOpen && (
                        <ul className="submenu p-2">
                          <li onClick={handleSubmenuClick}>
                            <a
                              onClick={() => toggleWindow("salesqoutation")}
                              className={`${subsubmenuOpen1}`}
                            >
                              Sales Quotation
                            </a>
                          </li>
                          <li onClick={handleSubmenuClick}>
                            <a
                              onClick={() => toggleWindow("salesorder")}
                              className={`${subsubmenuOpen2}`}
                            >
                              Sales Order
                            </a>
                          </li>
                          {/* Add more submenu items as needed */}
                        </ul>
                      )}
                    </li>

                    {/* ----------------------------- INQUIRY ------------------------------- */}
                    <li
                      className={`p-2 linav ${
                        routerName === "inquiry" ? "active" : ""
                      }`}
                      onClick={() => handleRounter("inquiry")}
                    >
                      <span className={`${spanName2}`}>Inquiry</span>
                      {submenuOpenInq && (
                        <ul className="submenu p-2">
                          <li>Price list & Stocks Inquiry</li>
                          <li>Credit Line Monitoring</li>
                          {/* Add more submenu items as needed */}
                        </ul>
                      )}
                    </li>

                    {/* ----------------------------- REPORTS ------------------------------- */}
                    <li
                      className={`p-2 linav ${
                        routerName === "reports" ? "active" : ""
                      }`}
                      onClick={() => handleRounter("reports")}
                    >
                      <span className={`${spanName3}`}>Reports</span>
                      {submenuOpenReports && (
                        <ul className="submenu p-2">
                          <li>Price list & Stocks Inquiry</li>
                          <li>Credit Line Monitoring</li>
                          {/* Add more submenu items as needed */}
                        </ul>
                      )}
                    </li>

                    {/* ----------------------------- SETUP ------------------------------- */}
                    <li
                      className={`p-2 linav ${
                        routerName === "setup" ? "active" : ""
                      }`}
                      onClick={() => handleRounter("setup")}
                    >
                      <span className={`${spanName4}`}>Set Up</span>
                      {submenuOpenSetUp && (
                        <ul className="submenu p-2">
                          {/* Add more submenu items as needed */}
                          <li onClick={handleSubmenuClick}>
                            <a
                              onClick={() => toggleWindow("view")}
                              className={`${subsubmenuOpen2}`}
                            >
                              Users
                            </a>
                          </li>
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Login Button */}
            <div className="SideBarButtonDown">
              <button className="custom-button" onClick={showLoginFunction}>
                Login
              </button>
            </div>
          </div>
        </div>

        {/* ----------------------------- DRAGGABLE ------------------------------- */}
        <div className="w-full overflow-auto">
          <div className="body w-[100%] bg-red-50 h-screen overflow-auto">
            {showSalesOrder && (
              // onDrag={handleDrag}
              <Draggable handle=".header">
                <div
                  className="container bg-white"
                  style={{
                    border: "1px solid #ccc",
                    position: "absolute",
                    zIndex: 2,
                    top: "5%",
                    left: "15%",
                    transform: "translate(-50%, -50%)",
                    borderBottom: "solid 2px #F0AB00",
                  }}
                >
                  <div
                    className="header grid grid-cols-2 p-2 text-left windowheader"
                    style={{
                      cursor: "move",
                      borderBottom: "solid 2px #F0AB00",
                    }}
                  >
                    <div className="">Sales Order Header</div>
                    <div className="text-right">
                      <span
                        className="text-md text-red-600 cursor-pointer"
                        onClick={() => toggleWindow("salesorder")}
                      >
                        ❌
                      </span>
                    </div>
                  </div>
                  <div className="content">
                    <SalesOrder />
                  </div>
                </div>
              </Draggable>
            )}

            {/* Set Users Draggable*/}
            {showUsers && (
              <Draggable handle=".header">
                <div
                  className="container bg-white"
                  style={{
                    border: "1px solid #ccc",
                    position: "absolute",
                    zIndex: 2,
                    top: "5%",
                    left: "15%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="header grid grid-cols-2 p-2 text-left windowheader"
                    style={{ cursor: "move" }}
                  >
                    <div>SETUP USER</div>
                    <div>
                      {/* <span
                        className="text-md text-red-600 cursor-pointer"
                        onClick={() => toggleWindow("salesorder")}
                      >
                        ❌
                      </span> */}
                    </div>
                  </div>
                  <div className="content">
                    <Users />
                  </div>
                </div>
              </Draggable>
            )}
            {viewUsers && (
              <Draggable handle=".header">
                <div
                  className="container bg-white"
                  style={{
                    border: "1px solid #ccc",
                    position: "absolute",
                    zIndex: 2,
                    top: "5%",
                    left: "15%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="header grid grid-cols-2 p-2 text-left windowheader"
                    style={{ cursor: "move" }}
                  >
                    <div className="flex justify-between items-center">
                      <div>USER LIST</div>
                      {/* <div>
                        <span
                          className="text-md text-red-600 cursor-pointer"
                          onClick={() => toggleWindow("view")}
                        >
                          ❌
                        </span>
                      </div> */}
                    </div>
                  </div>
                  <div className="content">
                    <ViewUser />
                  </div>
                </div>
              </Draggable>
            )}

            {/* Login */}
            {showLogin && (
              <Draggable>
                <Container component="main" maxWidth="xs">
                  <CssBaseline />
                  <Box
                    sx={{
                      marginTop: 8,
                      backgroundColor: "white",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {/* Change bgcolor to a custom color */}
                    <Avatar sx={{ m: 1, bgcolor: "#1976D2" }}>
                      <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                      Login
                    </Typography>
                    <Box
                      component="form"
                      onClick={loginUser}
                      noValidate
                      sx={{ mt: 1 }}
                    >
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 3,
                          mb: 2,
                          backgroundColor: "#1976D2",
                          color: "white",
                        }} // Custom color for the button
                      >
                        Login
                      </Button>
                    </Box>
                  </Box>
                </Container>
              </Draggable>
            )}

            {/* FLOATER */}
            <div className="absolute bottom-2 right-2 rounded-lg bg-white flex gap-3 shadow-xl text-[13px]">
              {/* <FloatingPanel /> */}
              <div className="flex gap-2 p-2 transition-all hover:text-[#F0AB00]">
                <div className="">User:</div>
                <span className="underline">{formData.fullName}</span>
              </div>
              <div className="flex gap-2 p-2">
                <div>Branch ID:</div>
                <span className="underline">{formData.branchID}</span>
              </div>
              <div className="flex gap-2 p-2">
                <div>Branch:</div>
                <span className="underline">{formData.branchName}</span>
              </div>
              <div className="flex gap-2 p-2">
                <div>WHS Code:</div>
                <span className="underline">{formData.warehouseCode}</span>
              </div>
              <div className="flex gap-2 p-2">
                <div>Pricelist Num:</div>
                <span className="underline">{formData.priceListNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
