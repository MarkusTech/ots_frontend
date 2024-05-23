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
import { Container, Box, TextField, Button, CssBaseline } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const showLoginFunction = () => {
    setShowLogin(!showLogin);
  };

  const logoutUser = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Handle the logout process
        setFormData(initialFormData);
        setIsLoggedIn(!isLoggedIn);
        Swal.fire(
          "Logged Out!",
          "You have been logged out successfully.",
          "success"
        );
      }
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

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      const response = await axios.post(
        "http://172.16.10.169:5001/api/v1/login",
        {
          userName: username,
          Password: password,
        }
      );

      if (response.data.success) {
        // Handle successful login (e.g., redirect to another page or store user info)
        const user = response.data.user;
        setFormData({
          userID: user.UserID,
          fullName: user.EmpName,
          position: user.Position,
          branchID: user.BranchID,
          branchName: user.BranchName,
          warehouseCode: user.WhsCode,
          priceListNumber: user.PriceListNum,
          status: user.Status,
          username: user.UserName,
          password: user.Password,
        });
        setIsLoggedIn(!isLoggedIn);
        setShowLogin(!showLogin);
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome, ${user.EmpName}`,
        });
      } else {
        // Handle login failure (e.g., display an error message)
        alert(response.data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Wrong Username or Password",
      });
    }
  };

  return (
    <>
      <div className="flex z-20">
        <div className="p-2 nav w-60">
          <div className="">
            <div className="flex items-center justify-center">
              {/* LOGO */}
              <Image
                src="/image/Buildmore.png"
                alt="Logo Image"
                width={500}
                height={500}
              />
            </div>
            {isLoggedIn && (
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
            )}
            {/* Login Button */}
            <div className="SideBarButtonDown">
              <div>
                {isLoggedIn ? (
                  <button className="custom-button" onClick={logoutUser}>
                    Logout
                  </button>
                ) : (
                  <button className="custom-button" onClick={showLoginFunction}>
                    Login
                  </button>
                )}
              </div>
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
                  <Image
                    src="/image/Buildmore.png"
                    alt="Logout Image"
                    width={500}
                    height={500}
                  />
                  <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                      autoFocus
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      onClick={loginUser}
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: "#F69629",
                        color: "white",
                      }}
                    >
                      Login
                    </Button>
                  </Box>
                </Box>
              </Container>
            )}

            {/* FLOATER */}
            <div className="absolute bottom-2 right-2 rounded-lg bg-white flex gap-3 shadow-xl text-[13px]">
              {/* <FloatingPanel /> */}
              <div className="flex gap-2 p-2 transition-all hover:text-[#F0AB00]">
                <div className="">User:</div>
                <span className="underline">{formData.username}</span>
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
