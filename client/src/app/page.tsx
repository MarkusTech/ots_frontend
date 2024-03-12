"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SalesQoutation from "./Transaction/SalesQoutation/SalesQoutation";
import Draggable from "react-draggable";
import SalesOrder from "./Transaction/SalesOrder/SalesOrder";
import Image from "next/image";

export default function Home() {
  const router = useRouter(); //Router

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

  // Z-index

  // Window

  const [showSalesOrder, setShowSalesOrder] = useState(false);
  const [showSalesQoutation, setShowSalesQoutation] = useState(false);

  const toggleSalesOrder = () => {
    setShowSalesOrder(!showSalesOrder);
  };

  const toggleSalesQoutation = () => {
    setShowSalesQoutation(!showSalesQoutation);
  };

  const toggleWindow = (e: any) => {
    if (e === "salesqoutation") {
      setShowSalesQoutation(false);
      setShowSalesQoutation(!showSalesQoutation);
    } else if (e === "salesorder") {
      setShowSalesOrder(false);
      setShowSalesOrder(!showSalesOrder);
    }
  };

  // End Of Declaration

  function handleRounter(page: React.SetStateAction<string>) {
    if (page === "transaction") {
      setRounterName(page);
      // console.log("transaction", page);
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
      // console.log("items");
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
      // router.push('../Reports')
      // console.log("reports");
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
      // router.push('../Setup')
      // console.log("setup");
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

  function handleRounter2(page: React.SetStateAction<string>) {
    let split = window.location.pathname.split("/");

    if (page === "salesqoutation") {
      if (split[1] === "Transaction") {
        setSubsubmenuOpen1("active");
        setSubsubmenuOpen2("");
      } else {
        setSubsubmenuOpen1("active");
        setSubsubmenuOpen2("");
      }
    } else if (page === "salesorder") {
      if (split[1] === "Transaction") {
        setSubsubmenuOpen1("");
        setSubsubmenuOpen2("active");
      } else {
        console.log("salesorder");
        setSubsubmenuOpen1("");
        setSubsubmenuOpen2("active");
      }
    }
  }

  const handleSubmenuClick = (e: any) => {
    e.stopPropagation(); // Prevent the event from reaching the parent li
  };

  return (
    <>
      {/* <div className="fixed w-full bg-white z-10">
      ss
    </div> */}
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
                    <li
                      className={`p-2 linav ${
                        routerName === "setup" ? "active" : ""
                      }`}
                      onClick={() => handleRounter("setup")}
                    >
                      <span className={`${spanName4}`}>Set Up</span>
                      {submenuOpenSetUp && (
                        <ul className="submenu p-2">
                          <li>Users</li>
                          <li onClick={() => handleRounter("approval")}>
                            Approval
                            {submenuOpenSetUp && (
                              <ul className="submenu p-2">
                                <li>Price list & Stocks Inquiry</li>
                                <li>Credit Line Monitoring</li>
                                {/* Add more submenu items as needed */}
                              </ul>
                            )}
                          </li>
                          {/* Add more submenu items as needed */}
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* <div className="absolute  bg-red-200 w-[100%]">
              s
            </div> */}
          </div>
        </div>
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
                    {/* Rest of your Sales Order content */}
                    {/* ... */}
                    <SalesOrder />
                  </div>
                </div>
              </Draggable>
            )}

            {showSalesQoutation && (
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
                  }}
                >
                  <div
                    className="header grid grid-cols-2 p-2 text-left windowheader"
                    style={{ cursor: "move" }}
                  >
                    <div>Sales Qoutation</div>
                    <div></div>
                  </div>
                  <div className="content">
                    {/* Rest of your Sales Order content */}
                    {/* ... */}
                    <SalesQoutation />
                  </div>
                </div>
              </Draggable>
            )}

            <div className="absolute bottom-2 right-2 rounded-lg bg-white flex gap-3 shadow-xl text-[13px]">
              {/* <FloatingPanel /> */}
              <div className="flex gap-2 p-2 transition-all hover:text-[#F0AB00]">
                <div className="">User:</div>
                <span className="underline">Administrator</span>
              </div>
              <div className="flex gap-2 p-2">
                <div>Branch ID:</div>
                <span className="underline">4</span>
              </div>
              <div className="flex gap-2 p-2">
                <div>Branch:</div>
                <span className="underline">GENSAN BRANCH</span>
              </div>
              <div className="flex gap-2 p-2">
                <div>WHS Code:</div>
                <span className="underline">GSCNAPGS</span>
              </div>
              <div className="flex gap-2 p-2">
                <div>Pricelist Num:</div>
                <span className="underline">14</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
