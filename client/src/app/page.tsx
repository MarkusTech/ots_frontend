"use client";

import React, { useState } from "react";
import Draggable from "react-draggable";
import SalesOrder from "./Transaction/SalesOrder/SalesOrder";
import ViewUser from "./Setup/ViewUsers/page";
import ApprovalType from "./ApprovalProcedure/approvalType/page";
import ApprovalProcedure from "./ApprovalProcedure/ApprovalProcedure/page";
import Image from "next/image";
import { useWindowState } from "../app/Transaction/SalesOrder/WindowsState";
import { Container, Box, TextField, Button, CssBaseline } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import useNotifications from "@/hooks/useNotifications";
import NotificationBell from "@/components/NotificationBell";
import NotificationList from "./Transaction/SalesOrder/NotificationList";
import useOriginatorNotification from "@/hooks/originatorNotification";
import OriginatorNotificationList from "./Transaction/SalesOrder/OriginatorNotificationList";

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
  const {
    showSalesOrder,
    viewUsers,
    showApprovalType,
    showApprovalProcedure,
    toggleWindow,
  } = useWindowState(); // Use the state and functions

  // Notification Count
  const unseenCount = useNotifications();
  const unseenCountOriginator = useOriginatorNotification();

  // For submenu states
  const [submenuOpen, setSubmenuOpen] = useState<boolean>(false);
  const [submenuOpenInq, setSubmenuOpenInq] = useState<boolean>(false);
  const [submenuOpenReports, setSubmenuOpenReports] = useState<boolean>(false);
  const [submenuOpenSetUp, setSubmenuOpenSetUp] = useState<boolean>(false);
  const [submenuOpenApproval, setSubmenuOpenApproval] =
    useState<boolean>(false);

  // For span active
  const [spanName1, setSpanName1] = useState<string>("");
  const [spanName2, setSpanName2] = useState<string>("");
  const [spanName3, setSpanName3] = useState<string>("");
  const [spanName4, setSpanName4] = useState<string>("");
  const [spanName5, setSpanName5] = useState<string>("");

  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoggedInFloater, setIsLoggedInFloater] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showNotificationList, setShowNotificationList] =
    useState<boolean>(false);
  const [showOriginatorNotificationList, setShowOriginatorNotificationList] =
    useState<boolean>(false);
  const [isOriginatorLogin, setIsOriginatorLogin] = useState<boolean>(false);
  const [isApproverLogin, setIsApproverLogin] = useState<boolean>(false);

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
        setIsLoggedInFloater(!isLoggedInFloater);
        Swal.fire(
          "Logged Out!",
          "You have been logged out successfully.",
          "success"
        );
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    });
  };

  function handleRounter(page: React.SetStateAction<string>) {
    if (page === "transaction") {
      setSubmenuOpen(!submenuOpen);
      setSubmenuOpenInq(false);
      setSubmenuOpenReports(false);
      setSubmenuOpenSetUp(false);
      setSubmenuOpenApproval(false);

      setSpanName1("active");
      setSpanName2("");
      setSpanName3("");
      setSpanName4("");
      setSpanName5("");
    } else if (page === "inquiry") {
      setSubmenuOpenInq(!submenuOpenInq);
      setSubmenuOpen(false);
      setSubmenuOpenReports(false);
      setSubmenuOpenSetUp(false);
      setSubmenuOpenApproval(false);

      setSpanName1("");
      setSpanName2("active");
      setSpanName3("");
      setSpanName4("");
      setSpanName5("");
    } else if (page === "reports") {
      setSubmenuOpenReports(!submenuOpenReports);
      setSubmenuOpen(false);
      setSubmenuOpenInq(false);
      setSubmenuOpenSetUp(false);
      setSubmenuOpenApproval(false);

      setSpanName1("");
      setSpanName2("");
      setSpanName3("active");
      setSpanName4("");
      setSpanName5("");
    } else if (page === "approval") {
      setSubmenuOpenSetUp(false);
      setSubmenuOpen(false);
      setSubmenuOpenInq(false);
      setSubmenuOpenReports(false);
      setSubmenuOpenApproval(!submenuOpenApproval);

      setSpanName1("");
      setSpanName2("");
      setSpanName3("");
      setSpanName4("active");
      setSpanName5("");
    } else if (page === "setup") {
      setSubmenuOpenSetUp(!submenuOpenSetUp);
      setSubmenuOpen(false);
      setSubmenuOpenInq(false);
      setSubmenuOpenReports(false);
      setSubmenuOpenApproval(false);

      setSpanName1("");
      setSpanName2("");
      setSpanName3("");
      setSpanName4("");
      setSpanName5("active");
    }
  }

  const handleSubmenuClick = (e: any) => {
    e.stopPropagation(); // Prevent the event from reaching the parent li
  };

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isShowButton, setIsShowButton] = useState<boolean>(false);
  const [loginUserData, setLoginUserData] = useState<string>("");
  const [branchIdData, setBranchIdData] = useState<string>("");
  const [warehouseCodeData, setWarehouseCodeData] = useState<string>("");
  const [priceListNumData, setPriceListNumData] = useState<string>("");
  const [loginUserIDData, setLoginUserIDData] = useState<string>("");
  const [loginIDForNotification, setLoginIDForNotification] =
    useState<number>(0);

  let loginAttempts = 0;

  const loginUser = async () => {
    try {
      const response = await axios.post(
        "http://172.16.10.169:5001/api/v1/login",
        {
          userName: username,
          Password: password,
        }
      );

      if (response.data.message == "Sales Clerk") {
        const user = response.data.user;
        setLoginUserData(user.UserName);
        setBranchIdData(user.BranchID);
        setWarehouseCodeData(user.WhsCode);
        setPriceListNumData(user.PriceListNum);
        setLoginUserIDData(user.UserID); //new changes
        // Originator Login show notification
        setIsOriginatorLogin(!isOriginatorLogin);
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
        // Clear login attempts on successful login
        loginAttempts = 0;

        setIsLoggedInFloater(true);
        setIsLoggedIn(!isLoggedIn);
        setShowLogin(!showLogin);
        setIsShowButton(!isShowButton);
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome, ${user.EmpName}`,
        });
        setUsername("");
        setPassword("");
      } else if (
        response.data.message == "Admin" ||
        response.data.message == "Managing Director" ||
        response.data.message == "Store Supervisor" ||
        response.data.message === "Store Supervisor2"
      ) {
        const user = response.data.user;
        setLoginUserData(user.UserName);
        setBranchIdData(user.BranchID);
        setWarehouseCodeData(user.WhsCode);
        setPriceListNumData(user.PriceListNum);
        setLoginIDForNotification(user.UserID);
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
        // Clear login attempts on successful login
        loginAttempts = 0;
        setIsLoggedInFloater(true);
        setIsAdminLoggedIn(!isAdminLoggedIn);
        // Approver Login
        setIsApproverLogin(!isApproverLogin);
        setShowLogin(!showLogin);
        setIsShowButton(!isShowButton);
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome, ${user.EmpName}`,
        });
        setUsername("");
        setPassword("");
      } else {
        alert(response.data.message);
        loginAttempts++;
      }
    } catch (error) {
      loginAttempts++;
      if (loginAttempts <= 2) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Wrong Username or Password",
        });
      }
      // Check if the maximum login attempts reached
      if (loginAttempts === 3) {
        Swal.fire({
          icon: "warning",
          title: "Contact MIS Department",
          text: "You have reached the maximum number of login attempts with incorrect password. Please contact the MIS department.",
        });
        return;
      }
    }
  };

  const toggleNotificationList = () => {
    setShowNotificationList(!showNotificationList);
  };

  const originatorNotificationList = () => {
    setShowOriginatorNotificationList(!showOriginatorNotificationList);
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
            {/* If credentials are correct and the user is Admin */}
            {isAdminLoggedIn && (
              <div className="flex items-center justify-center">
                <div className="p-2">
                  <div className="w-[200px]">
                    <ul>
                      {/* ----------------------------- TRANSACTION ------------------------------- */}
                      <li
                        className={`p-2 linav`}
                        onClick={() => handleRounter("transaction")}
                      >
                        <span className={`${spanName1}`}>Transaction</span>
                        {submenuOpen && (
                          <ul className="submenu p-2">
                            <li onClick={handleSubmenuClick}>
                              <a onClick={() => toggleWindow("salesqoutation")}>
                                Sales Quotation
                              </a>
                            </li>
                            <li onClick={handleSubmenuClick}>
                              <a onClick={() => toggleWindow("salesorder")}>
                                Sales Order
                              </a>
                            </li>
                            {/* Add more submenu items as needed */}
                          </ul>
                        )}
                      </li>

                      {/* ----------------------------- INQUIRY ------------------------------- */}
                      <li
                        className={`p-2 linav`}
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
                        className={`p-2 linav`}
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

                      {/* ----------------------------- Approval Procedure ------------------------------- */}
                      <li
                        className={`p-2 linav`}
                        onClick={() => handleRounter("approval")}
                      >
                        <span className={`${spanName4}`}>
                          Approval Procedure
                        </span>
                        {submenuOpenApproval && (
                          <ul className="submenu p-2">
                            {/* Add more submenu items as needed */}
                            <li onClick={handleSubmenuClick}>
                              <a onClick={() => toggleWindow("approvalType")}>
                                Approval Type
                              </a>
                            </li>
                            <li onClick={handleSubmenuClick}>
                              <a
                                onClick={() =>
                                  toggleWindow("approvalProcedure")
                                }
                              >
                                Approval Procedure
                              </a>
                            </li>
                          </ul>
                        )}
                      </li>

                      {/* ----------------------------- SETUP ------------------------------- */}
                      <li
                        className={`p-2 linav`}
                        onClick={() => handleRounter("setup")}
                      >
                        <span className={`${spanName5}`}>Set Up</span>
                        {submenuOpenSetUp && (
                          <ul className="submenu p-2">
                            {/* Add more submenu items as needed */}
                            <li onClick={handleSubmenuClick}>
                              <a onClick={() => toggleWindow("view")}>Users</a>
                            </li>
                          </ul>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* If credentials are correct and the user is not admin */}
            {isLoggedIn && (
              <div className="flex items-center justify-center">
                <div className="p-2">
                  <div className="w-[200px]">
                    <ul>
                      {/* ----------------------------- TRANSACTION ------------------------------- */}
                      <li
                        className={`p-2 linav`}
                        onClick={() => handleRounter("transaction")}
                      >
                        <span className={`${spanName1}`}>Transaction</span>
                        {submenuOpen && (
                          <ul className="submenu p-2">
                            <li onClick={handleSubmenuClick}>
                              <a onClick={() => toggleWindow("salesqoutation")}>
                                Sales Quotation
                              </a>
                            </li>
                            <li onClick={handleSubmenuClick}>
                              <a onClick={() => toggleWindow("salesorder")}>
                                Sales Order
                              </a>
                            </li>
                            {/* Add more submenu items as needed */}
                          </ul>
                        )}
                      </li>

                      {/* ----------------------------- INQUIRY ------------------------------- */}
                      <li
                        className={`p-2 linav `}
                        onClick={() => handleRounter("inquiry")}
                      >
                        <span className={`${spanName2}`}>Inquiry</span>
                        {submenuOpenInq && (
                          <ul className="submenu p-2">
                            <li>Price list & Stocks Inquiry</li>
                            <li>Credit Line Monitoring</li>
                          </ul>
                        )}
                      </li>

                      {/* ----------------------------- REPORTS ------------------------------- */}
                      <li
                        className={`p-2 linav`}
                        onClick={() => handleRounter("reports")}
                      >
                        <span className={`${spanName3}`}>Reports</span>
                        {submenuOpenReports && (
                          <ul className="submenu p-2">
                            <li>Price list & Stocks Inquiry</li>
                            <li>Credit Line Monitoring</li>
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
                {isShowButton ? (
                  <button className="custom-button" onClick={logoutUser}>
                    Logout
                  </button>
                ) : (
                  <button></button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------- DRAGGABLE ------------------------------- */}
        <div className="w-full overflow-auto">
          <div className="body w-[100%] bg-red-50 h-screen overflow-auto">
            {showSalesOrder && (
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
                    <SalesOrder
                      userData={loginUserData}
                      userBranchID={branchIdData}
                      userWarehouseData={warehouseCodeData}
                      userPriceListNumData={priceListNumData}
                      userIDData={loginUserIDData}
                    />
                  </div>
                </div>
              </Draggable>
            )}

            {/* Set Users Draggable*/}
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
                    maxWidth: "80%", // Adjust the value as needed
                  }}
                >
                  <div
                    className="header grid grid-cols-1 p-2 text-left windowheader"
                    style={{ cursor: "move" }}
                  >
                    <div className="flex w-full justify-between">
                      <div>USER LIST</div>
                      <div>
                        <span
                          className="text-md text-red-600 cursor-pointer"
                          onClick={() => toggleWindow("view")}
                        >
                          ❌
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="content">
                    <ViewUser />
                  </div>
                </div>
              </Draggable>
            )}

            {/* Login */}
            {!showLogin && (
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
                        backgroundColor: "#F69629 !important",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#F69629 !important",
                          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                        },
                      }}
                    >
                      Login
                    </Button>
                  </Box>
                </Box>
              </Container>
            )}

            {/* Approval Type */}
            {showApprovalType && (
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
                    width: "600px", // Add this line to set the width
                  }}
                >
                  <div
                    className="header grid grid-cols-1 p-2 text-left windowheader"
                    style={{ cursor: "move" }}
                  >
                    <div className="flex justify-between items-center">
                      <div>Approval Type</div>
                      <div>
                        <span
                          className="text-md text-red-600 cursor-pointer"
                          onClick={() => toggleWindow("approvalType")}
                        >
                          ❌
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="content">
                    <ApprovalType />
                  </div>
                </div>
              </Draggable>
            )}

            {/* Approval Procedure */}
            {showApprovalProcedure && (
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
                    width: "1300px", // Add this line to set the width
                  }}
                >
                  <div
                    className="header grid grid-cols-1 p-2 text-left windowheader"
                    style={{ cursor: "move" }}
                  >
                    <div className="flex justify-between items-center">
                      <div>Approval Procedure</div>
                      <div>
                        <span
                          className="text-md text-red-600 cursor-pointer"
                          onClick={() => toggleWindow("approvalProcedure")}
                        >
                          ❌
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="content">
                    <ApprovalProcedure />
                  </div>
                </div>
              </Draggable>
            )}

            {/* Notification list */}
            {showNotificationList && (
              <Draggable>
                <NotificationList userIDData={loginIDForNotification} />
              </Draggable>
            )}

            {/* Orignator Notification List */}
            {showOriginatorNotificationList && (
              <Draggable>
                <OriginatorNotificationList />
              </Draggable>
            )}

            {/* Login Floater */}
            {isLoggedInFloater && (
              <div>
                {/* Approver Notification Bell */}
                {isApproverLogin && (
                  <div className="notification-container cursor-pointer">
                    <div className="notification">
                      <NotificationBell
                        unseenCount={unseenCount}
                        onClick={toggleNotificationList}
                      />
                    </div>
                  </div>
                )}

                {/* Originator Notification Bell */}
                {isOriginatorLogin && (
                  <div className="notification-container cursor-pointer">
                    <div className="notification">
                      <NotificationBell
                        unseenCount={unseenCountOriginator}
                        onClick={originatorNotificationList}
                      />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-2 right-2 rounded-lg bg-white flex gap-3 shadow-xl text-[13px]">
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
                    <span className="underline">
                      {formData.priceListNumber}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
