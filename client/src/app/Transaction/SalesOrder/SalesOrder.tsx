"use client";

import React, { use, useEffect, useState } from "react";
import Draggable from "react-draggable";
import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";
import { useWindowState } from "./WindowsState";

export default function SalesOrder() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isSaved, setIsSaved] = useState(false); // to hide handle submit
  const [isCommited, setIsCommited] = useState(false); // to hide commit
  const [showPrint, setShowPrint] = useState(false); // to hide print button

  const [customerList, setCustomerDataList] = useState([]);
  // Validate Customer Code to Disabled Walkin Customer field
  const [validateCustomerCode, setValidateCustomerCode] = useState("");
  const [todayDate, setTodayDate] = useState("");

  // Sales Crew
  const [salesCrew, setSalesCrew] = useState([]);
  const [selectedSalesCrew, setSelectedSalesCrew] = useState<string>("");
  const addSalesCrews = (value: string) => {
    setSelectedSalesCrew(value);
  };

  interface Customer {
    EntryNum: string;
    DocNum: string;
    DraftNum: string;
    PostingDate: string;
    CustomerCode: string;
    CustomerName: string;
    ForeignName: string;
    WalkInName: string;
    DocDate: string;
    CreatedBy: string;
    // ... other properties
  }
  const [customers, setCustomers] = useState<Customer[]>([]); // for the list of save as draft Customers

  const [itemList, setItemDataList] = useState([]);
  const [UOMList, setUOMList] = useState([]);
  const [UOMListIndex, setUOMListIndex] = useState([]);
  const [WareHouseList, setWareHouseList] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const [cardCodedata, setcardCodedata] = useState("");
  const [taxCodeData, settaxCodeData] = useState([]);
  const [taxRateData, settaxRateData] = useState([]);

  const [itemcodewh, setitemcodewh] = useState("");
  const [itemnamews, setitemnamews] = useState("");
  const [itemuomws, setitemuomws] = useState("");

  const [showWindow, setShowWindow] = useState(false);
  const [showDoc, setShowDoc] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [showSearchHeader, setShowSearchHeader] = useState(false);

  const [openItemTablePanel, setOpenItemTablePanel] = useState(false);
  const [openOUMPanel, setOpenOUMPanel] = useState(false);
  const [openModRelTablePanel, setOpenModRelTablePanel] = useState(false);
  const [openLocationPanel, setOpenLocationPanel] = useState(false);
  const [showItems, setShowItems] = useState(false);
  // const [openTruckPanel, setOpenTruckPanel] = useState(false);
  // const [openPickUpLocations, setOpenPickUpLocations] = useState(false);

  const [sellingPriceAfterDiscountData, setSellingPriceAfterDis] = useState(0);

  const [totalAfterVat, settotalAfterVat] = useState("");
  const [totalBeforeVat, setTotalBeforeVat] = useState("");
  const [totalVat, setTotalVat] = useState(0);
  const [showSCPDW, setShowSCPWD] = useState(false);
  const [varSCPWDdisc, setVarSCPWDdisc] = useState(0);
  const [SCPWDdata, setSCPWDdata] = useState("");
  const [totalAmoutDueData, settotalAmoutDueData] = useState("");

  const [scpdwdID, setscpdwdID] = useState("");

  // Payment useState
  const [isCheckedCash, setIsCheckedCash] = useState(false);
  const [isCheckedCreditCard, setIsCheckedCreditCard] = useState(false);
  const [isCheckedDebit, setIsCheckedDebit] = useState(false);
  const [isCheckedPDC, setIsCheckedPDC] = useState(false);
  const [isCheckedPO, setIsCheckedPO] = useState(false);
  const [isCheckedDatedCheck, setIsCheckedDatedCheck] = useState(false);
  const [isCheckedOnlineTransfer, setIsCheckedOnlineTransfer] = useState(false);
  const [isCheckedOnAccount, setIsCheckedOnAccount] = useState(false);
  const [isCheckedCashOnDel, setIsCheckedCashOnDel] = useState(false);

  // print mode of releasing and payment
  const [modeOfPaymentPrint, setModeOfPaymentPrint] = useState("");
  const [modeOfReleasingPrint, setModeOfReleasingPrint] = useState("");
  const [customerPrint, setCustomerPrint] = useState("");

  const [ccstatus, setccstatus] = useState(false);
  // End of Payment useState

  const warehouseCode = "GSCNAPGS";
  const brandID = 4;
  const priceListNum = 14;
  const user = "Administrator";

  const now = new Date();
  // Date Now()
  const manilaDate = now.toLocaleDateString("en-US", {
    timeZone: "Asia/Manila",
  });

  // -------------------------------------- <WMR CODE> Header Insertion --------------------------------------
  const backendAPI = "http://172.16.10.169:5000";

  const [docNumber, setDocNumber] = useState("0");
  const isDocNumberGreaterThanZero = parseInt(docNumber) > 0; // if DocNum is Greater Than Zero the commit and update button will be disabled
  const printButtonDisabled = parseInt(docNumber) == 0;

  const [walkInCustomer, setWalkingCustomer] = useState("");
  const [customerReference, setCustomerReference] = useState("");
  const [remarksField, setRemarksField] = useState("");
  const [scOrPwdField, setScOrPwdField] = useState("");
  const [draftNumber, setDraftNumber] = useState(null); // no value
  const [entryNumbers, setEntryNumbers] = useState(null);
  const [customerData, setCustomerData] = useState([
    {
      customerCode: "00000",
      customerName: "N/A",
      customerCardFName: "",
      cusShipAddress: "N/A",
      cusLicTradNum: "N/A",
    },
  ]);

  const [formData, setFormData] = useState({
    DraftNum: "",
    EntryNum: "",
    DocNum: 0,
    // Cutomer
    CustomerCode: "",
    CustomerName: "",
    ForeignName: "",
    WalkInName: "",
    ShippingAdd: "",
    TIN: "",
    Reference: "",
    SalesCrew: selectedSalesCrew,
    // ReadOnly
    Branch: "",
    DocStat: "",
    BaseDoc: 0,
    DocDate: todayDate,
    PostingDate: todayDate,
    SCPWDIdNo: "",
    // Payment Method
    Cash: "",
    CreditCard: "",
    DebitCard: "",
    ODC: "",
    PDC: "",
    OnlineTransfer: "",
    OnAccount: "",
    COD: "",
    // taxees
    TotalAmtBefTax: "",
    TotalTax: 0, //the use state is change from "" to 0
    TotalAmtAftTax: "",
    SCPWDDiscTotal: "",
    TotalAmtDue: "",
    Remarks: "",
    CreatedBy: "Administrator",
    DateCreated: todayDate,
    UpdatedBy: "",
    DateUpdated: "",
  });

  // wmr code
  const [isPaymentCash, setIsPaymentCash] = useState("N");
  const [isPaymentCreditCard, setIsPaymentCreditCard] = useState("N");
  const [isPaymentDebitCard, setIsPaymentDebitCard] = useState("N");
  const [isPaymentODC, setIsPaymentODC] = useState("N");
  const [isPaymentPDC, setIsPaymentPDC] = useState("N");
  const [isPaymentPO, setIsPaymentPO] = useState("N");
  const [isPaymentOnlineTransfer, setIsPaymentOnlineTransfer] = useState("N");
  const [setOnAccount, setIsPaymentOnAccount] = useState("N");
  const [isPaymentCOD, setIsPaymentCOD] = useState("N");

  useEffect(() => {
    setFormData({
      ...formData,
      // taxees
      TotalAmtBefTax: totalAfterVat,
      TotalTax: totalVat,
      TotalAmtAftTax: totalBeforeVat,
      SCPWDDiscTotal: SCPWDdata,
      TotalAmtDue: totalAmoutDueData,
      // end of taxees
      WalkInName: walkInCustomer,
      Reference: customerReference,
      Remarks: remarksField,
      SCPWDIdNo: scOrPwdField,
      // Payment Method
      Cash: isPaymentCash,
      CreditCard: isPaymentCreditCard,
      DebitCard: isPaymentDebitCard,
      ODC: isPaymentODC,
      PDC: isPaymentPDC,
      OnlineTransfer: isPaymentOnlineTransfer,
      OnAccount: setOnAccount,
      COD: isPaymentCOD,
    });
  });

  // ----------------------------- Header POST API --------------------------------
  const [finalTotalAmtBefTax, setFinalTotalAmtBefTax] = useState(0);
  const [finalTotalTax, setFinalTotalTax] = useState(0);
  const [finalTotalAmtAftTax, setFinalTotalAmtAftTax] = useState(0);
  const [finalSCPWDDiscTotal, setFinalSCPWDDiscTotal] = useState(0);
  const [finalTotalAmtDue, setFinalTotalAmtDue] = useState(0);
  const sendToProductionAPI = () => {
    Swal.fire({
      title: "Do you want to save this Draft?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
        const axiosInstance = axios.create({
          baseURL: "http://172.16.10.169:5000/api/v1",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const saveHeaderDetails = {
          EntryNum: formData.EntryNum,
          DocNum: 0,
          PostingDate: todayDate,
          DocDate: todayDate,
          CustomerCode: formData.CustomerCode,
          CustomerName: formData.CustomerName,
          WalkInName: formData.WalkInName,
          ShippingAdd: formData.ShippingAdd,
          TIN: formData.TIN,
          Reference: formData.Reference,
          SCPWDIdNo: formData.SCPWDIdNo,
          Branch: formData.Branch,
          DocStat: formData.DocStat,
          BaseDoc: 1,
          Cash: formData.Cash,
          CreditCard: formData.CreditCard,
          DebitCard: formData.DebitCard,
          ODC: formData.ODC,
          PDC: formData.PDC,
          OnlineTransfer: formData.OnlineTransfer,
          OnAccount: formData.OnAccount,
          COD: formData.COD,
          TotalAmtBefTax: finalTotalAmtBefTax,
          TotalTax: finalTotalTax,
          TotalAmtAftTax: finalTotalAmtAftTax,
          SCPWDDiscTotal: finalSCPWDDiscTotal,
          TotalAmtDue: finalTotalAmtDue,
          Remarks: formData.Remarks,
          CreatedBy: "administrator",
          DateCreated: todayDate,
          UpdatedBy: 1,
          DateUpdated: "",
          SalesCrew: selectedSalesCrew,
          ForeignName: formData.ForeignName,
        };

        axiosInstance
          .post("/header", saveHeaderDetails)
          .then((response) => {
            console.log("Data sent successfully:", response.data);
            setIsSaved(true);

            // Getting Response Value and set DraftNumber
            const responseData = response.data;
            const headerValue = responseData.saveDraftNum;

            setFormData((prevFormData) => ({
              ...prevFormData,
              DraftNum: headerValue.toString(),
            }));
            setDraftNumber(headerValue);
            const idiotDraftNumber = headerValue;
            setIsSaved(true);
            setTimeout(() => {
              // detailsOnSaveToAPI(); // production API
              const dataTable = [...tableData];
              const detailsPostAPI = "http://172.16.10.217:3002/so-details";

              dataTable.forEach((rowData) => {
                const saveDetails = {
                  DraftNum: idiotDraftNumber,
                  ItemCode: rowData["itemCode"],
                  ItemName: rowData["itemName"],
                  Quantity: rowData["quantity"],
                  UoM: rowData["uom"],
                  UoMConv: rowData["uomConversion"],
                  Whse: rowData["location"],
                  InvStat: rowData["inventoryStatus"],
                  SellPriceBefDisc: rowData["sellingPriceBeforeDiscount"],
                  DiscRate: rowData["discountRate"],
                  SellPriceAftDisc: rowData["sellingPriceAfterDiscount"],
                  LowerBound: rowData["lowerBound"],
                  TaxCode: rowData["taxCode"],
                  TaxCodePerc: rowData["taxCodePercentage"],
                  TaxAmt: rowData["taxAmount"],
                  BelPriceDisc: rowData["belVolDisPrice"],
                  Cost: rowData["cost"],
                  BelCost: rowData["belCost"],
                  ModeReleasing: rowData["modeOfReleasing"],
                  SCPWDdisc: rowData["scPwdDiscount"],
                  GrossTotal: rowData["grossTotal"],
                  TruckerForDropShipOrBackOrder:
                    rowData["truckPanelORDropShip"],
                  PickUpLocation: rowData["pickUpLocation"],
                };

                // Send each item to the API
                axios
                  .post(detailsPostAPI, saveDetails)
                  .then((response) => {
                    console.log("Data sent successfully:", response.data);
                  })
                  .catch((error) => {
                    console.error("Error sending data:", error);
                  });
              });

              Swal.fire({
                icon: "success",
                text: "Successfully Save to Draft",
              });
            }, 2000);
          })
          .catch((error) => {
            console.error("Error sending data:", error);
            Swal.fire(
              "Internal Server Error, Contact MIS Department",
              "",
              "error"
            );
          });
      } else if (result.isDenied) {
        Swal.fire("Draft is not saved", "", "info");
      }
    });
  };
  // ----------------------------- Header POST API --------------------------------

  const handleWalkinCustomerChange = (event: any) => {
    setWalkingCustomer(event.target.value);
  };

  const handleCustomerChange = (event: any) => {
    setCustomerReference(event.target.value);
  };

  const handleRemarksChange = (event: any) => {
    setRemarksField(event.target.value);
  };

  const handleScOrPwd = (event: any) => {
    setScOrPwdField(event.target.value);
  };

  // UUID
  useEffect(() => {
    const fetchEntryNumber = async () => {
      try {
        const response = await axios.get(
          "http://172.16.10.169:5000/api/v1/generateUniqueId"
        );
        const entryNumber = response.data.uniqueId;

        setFormData((prevFormData) => ({
          ...prevFormData,
          EntryNum: entryNumber.toString(),
        }));
        setEntryNumbers(entryNumber);
      } catch (error) {
        console.error("Error fetching draft number:", error);
      }
    };
    fetchEntryNumber();
  }, []);

  // ------------------------------------------ Product Details insertion -------------------------------------------
  const [tableData, setTableData] = useState([
    {
      draftNumber: "",
      entryNumber: "", // sample
      itemCode: "",
      itemName: "",
      quantity: 0,
      uom: "",
      uomConversion: 0,
      excludeBO: "N",
      location: "",
      price: 0,
      inventoryStatus: "",
      sellingPriceBeforeDiscount: 0,
      discountRate: 0,
      sellingPriceAfterDiscount: 0,
      sellingPriceAfterDiscountTemp: 0,
      lowerBound: 0,
      taxCode: "",
      taxCodePercentage: 0,
      taxAmount: 0,
      volDisPrice: 0,
      belVolDisPrice: 0,
      cost: 0,
      belCost: "",
      modeOfReleasing: "",
      scPwdDiscount: "N",
      grossTotal: 0,
      selected: false,
      cash: "N",
      creditcard: "N",
      debit: "N",
      pdc: "N",
      po: "N",
      datedCheck: "N",
      onlineTransfer: "N",
      onAccount: "N",
      cashOnDel: "N",
      truckPanelORDropShip: "",
      pickUpLocation: "",
    },
  ]);

  // Handle Draft Submit && Handle Payment Validation
  const handleSubmit = () => {
    const validateTable = [...tableData];

    const finalTotalListArr = [...finalTotalList];
    const arrList = finalTotalListArr[0];

    const allItemsArr = [...tableData];
    const allItemsArrLen = allItemsArr.length;

    let countAllreleasing = 0;

    // mode of realeasing
    for (let i = 0; i < allItemsArrLen; i++) {
      if (allItemsArr[i]["modeOfReleasing"] == "") {
      } else {
        countAllreleasing++;
      }
    }

    setIsCommited(true);
    // Inventory Status
    let countStatusInventory = 0;

    for (let ii = 0; ii < allItemsArrLen; ii++) {
      if (allItemsArr[ii]["inventoryStatus"] == "Out of Stocks") {
        countStatusInventory++;
      }
    }

    if (formData.CustomerCode == "") {
      Swal.fire({
        icon: "error",
        text: "Need to Select Customer First!",
      });
    } else if (selectedSalesCrew == "") {
      Swal.fire({
        icon: "error",
        text: "Need to Select Sales Crew!",
      });
    } else if (validateTable[0]["itemCode"] == "") {
      Swal.fire({
        icon: "error",
        text: "Need to Select Atleast 1 Product!",
      });
    } else if (countStatusInventory > 0) {
      Swal.fire({
        icon: "error",
        text: "Please make sure all products are available",
      });
    } else if (validateTable[0]["inventoryStatus"] == "") {
      Swal.fire({
        icon: "error",
        text: "Please Input a valid Quantity",
      });
    } else if (
      isPaymentCash == "N" &&
      isPaymentCreditCard == "N" &&
      isPaymentDebitCard == "N" &&
      isPaymentODC == "N" &&
      isPaymentPDC == "N" &&
      isPaymentPO == "N" &&
      isPaymentOnlineTransfer == "N" &&
      setOnAccount == "N" &&
      isPaymentCOD == "N"
    ) {
      Swal.fire({
        icon: "error",
        text: "Need to Select Payment Method!",
      });
    } else if (countAllreleasing == allItemsArrLen) {
      //  if the whole validation is done it will show an alert to save or cancel
      sendToProductionAPI();
    } else {
      Swal.fire({
        icon: "error",
        text: "Please make sure all products have mode of releasing",
      });
    }
  };

  // Update Header and Details
  const handleUpdate = () => {
    const validateTable = [...tableData];

    const finalTotalListArr = [...finalTotalList];
    const arrList = finalTotalListArr[0];

    const allItemsArr = [...tableData];
    const allItemsArrLen = allItemsArr.length;

    let countAllreleasing = 0;

    // mode of realeasing
    for (let i = 0; i < allItemsArrLen; i++) {
      if (allItemsArr[i]["modeOfReleasing"] == "") {
      } else {
        countAllreleasing++;
      }
    }

    // Inventory Status
    let countStatusInventory = 0;

    for (let ii = 0; ii < allItemsArrLen; ii++) {
      if (allItemsArr[ii]["inventoryStatus"] == "Out of Stocks") {
        countStatusInventory++;
      }
    }

    if (formData.CustomerCode == "") {
      Swal.fire({
        icon: "error",
        text: "Need to Select Customer First!",
      });
    } else if (validateTable[0]["itemCode"] == "") {
      Swal.fire({
        icon: "error",
        text: "Need to Select Atleast 1 Product!",
      });
    } else if (selectedSalesCrew == "") {
      Swal.fire({
        icon: "error",
        text: "Need to Select Sales Crew!",
      });
    } else if (countStatusInventory > 0) {
      Swal.fire({
        icon: "error",
        text: "Please make sure all products are available",
      });
    } else if (validateTable[0]["inventoryStatus"] == "") {
      Swal.fire({
        icon: "error",
        text: "Please Input a valid Quantity",
      });
    } else if (
      isPaymentCash == "N" &&
      isPaymentCreditCard == "N" &&
      isPaymentDebitCard == "N" &&
      isPaymentODC == "N" &&
      isPaymentPDC == "N" &&
      isPaymentPO == "N" &&
      isPaymentOnlineTransfer == "N" &&
      setOnAccount == "N" &&
      isPaymentCOD == "N"
    ) {
      Swal.fire({
        icon: "error",
        text: "Need to Select Payment Method!",
      });
    } else if (countAllreleasing == allItemsArrLen) {
      //  if the whole validation is done it will show an alert to save or cancel!
      updateProductionAPI();
    } else {
      Swal.fire({
        icon: "error",
        text: "Please make sure all products have mode of releasing",
      });
    }
  };

  const deleteDetailsThenSave = () => {
    const deleteId = draftNumber;
    axios.delete(`http://172.16.10.217:3002/so-details/${deleteId}`);
  };

  // Update Production API
  const updateProductionAPI = () => {
    Swal.fire({
      title: "Do you want to update this Draft?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        // delete details upon saving
        deleteDetailsThenSave();

        const draftNum = draftNumber;
        const axiosInstance = axios.create({
          baseURL: "http://172.16.10.217:3002",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const saveOnUpdateHeaderDetails = {
          EntryNum: formData.EntryNum,
          DocNum: 0,
          PostingDate: todayDate,
          DocDate: todayDate,
          CustomerCode: formData.CustomerCode,
          CustomerName: formData.CustomerName,
          WalkInName: formData.WalkInName,
          ShippingAdd: formData.ShippingAdd,
          TIN: formData.TIN,
          Reference: formData.Reference,
          SCPWDIdNo: formData.SCPWDIdNo,
          Branch: formData.Branch,
          DocStat: formData.DocStat,
          BaseDoc: 1,
          Cash: formData.Cash,
          CreditCard: formData.CreditCard,
          DebitCard: formData.DebitCard,
          ODC: formData.ODC,
          PDC: formData.PDC,
          OnlineTransfer: formData.OnlineTransfer,
          OnAccount: formData.OnAccount,
          COD: formData.COD,
          TotalAmtBefTax: finalTotalAmtBefTax,
          TotalTax: finalTotalTax,
          TotalAmtAftTax: finalTotalAmtAftTax,
          SCPWDDiscTotal: finalSCPWDDiscTotal,
          TotalAmtDue: finalTotalAmtDue,
          Remarks: formData.Remarks,
          CreatedBy: "administrator",
          DateCreated: todayDate,
          UpdatedBy: 1,
          DateUpdated: "",
          SalesCrew: selectedSalesCrew,
        };

        axiosInstance
          .patch(`/so-header/${draftNum}`, saveOnUpdateHeaderDetails)
          .then((response) => {
            console.log("Data sent successfully:", response.data);
            // detailsOnSaveToAPI(); // production API
            const dataTable = [...tableData];
            const detailsPostAPI = "http://172.16.10.217:3002/so-details";

            dataTable.forEach((rowData) => {
              const saveDetails = {
                DraftNum: draftNum,
                ItemCode: rowData["itemCode"],
                ItemName: rowData["itemName"],
                Quantity: rowData["quantity"],
                UoM: rowData["uom"],
                UoMConv: rowData["uomConversion"],
                Whse: rowData["location"],
                InvStat: rowData["inventoryStatus"],
                SellPriceBefDisc: rowData["sellingPriceBeforeDiscount"],
                DiscRate: rowData["discountRate"],
                SellPriceAftDisc: rowData["sellingPriceAfterDiscount"],
                LowerBound: rowData["lowerBound"],
                TaxCode: rowData["taxCode"],
                TaxCodePerc: rowData["taxCodePercentage"],
                TaxAmt: rowData["taxAmount"],
                BelPriceDisc: rowData["belVolDisPrice"],
                Cost: rowData["cost"],
                BelCost: rowData["belCost"],
                ModeReleasing: rowData["modeOfReleasing"],
                SCPWDdisc: rowData["scPwdDiscount"],
                GrossTotal: rowData["grossTotal"],
                TruckerForDropShipOrBackOrder: rowData["truckPanelORDropShip"],
                PickUpLocation: rowData["pickUpLocation"],
              };

              // Send each item to the API
              axios
                .post(detailsPostAPI, saveDetails)
                .then((response) => {
                  console.log("Data sent successfully:", response.data);
                })
                .catch((error) => {
                  console.error("Error sending data:", error);
                });
            });

            // Show success message
            Swal.fire({
              icon: "success",
              text: "Updated Successfully",
            });
          })
          .catch((error) => {
            console.error("Error sending data:", error);

            if (error.response) {
              // Log the full error response
              console.error("Full error response:", error.response.data);
              Swal.fire(
                "Internal Server Error, Contact MIS Department",
                "",
                "error"
              );
            }

            // Show error message
            Swal.fire(
              "Internal Server Error, Contact MIS Department",
              "",
              "error"
            );
          });
      } else if (result.isDenied) {
        // Show info message
        Swal.fire("Draft is not Updated", "", "info");
      }
    });
  };

  const handleSaveCommit = async () => {
    const validateTable = [...tableData];

    const finalTotalListArr = [...finalTotalList];
    const arrList = finalTotalListArr[0];

    const allItemsArr = [...tableData];
    const allItemsArrLen = allItemsArr.length;

    let countAllreleasing = 0;

    // mode of realeasing
    for (let i = 0; i < allItemsArrLen; i++) {
      if (allItemsArr[i]["modeOfReleasing"] == "") {
      } else {
        countAllreleasing++;
      }
    }

    // Inventory Status
    let countStatusInventory = 0;

    for (let ii = 0; ii < allItemsArrLen; ii++) {
      if (allItemsArr[ii]["inventoryStatus"] == "Out of Stocks") {
        countStatusInventory++;
      }
    }

    if (formData.CustomerCode == "") {
      Swal.fire({
        icon: "error",
        text: "Need to Select Customer First!",
      });
    } else if (selectedSalesCrew == "") {
      Swal.fire({
        icon: "error",
        text: "Need to Select Sales Crew!",
      });
    } else if (validateTable[0]["itemCode"] == "") {
      Swal.fire({
        icon: "error",
        text: "Need to Select Atleast 1 Product!",
      });
    } else if (countStatusInventory > 0) {
      Swal.fire({
        icon: "error",
        text: "Please make sure all products are available",
      });
    } else if (
      isPaymentCash == "N" &&
      isPaymentCreditCard == "N" &&
      isPaymentDebitCard == "N" &&
      isPaymentODC == "N" &&
      isPaymentPDC == "N" &&
      isPaymentPO == "N" &&
      isPaymentOnlineTransfer == "N" &&
      setOnAccount == "N" &&
      isPaymentCOD == "N"
    ) {
      Swal.fire({
        icon: "error",
        text: "Need to Select Payment Method!",
      });
    } else if (countAllreleasing == allItemsArrLen) {
      //  if the whole validation is done it will show an alert to save or cancel
      saveCommit();
    } else {
      Swal.fire({
        icon: "error",
        text: "Please make sure all products have mode of releasing",
      });
    }
  };

  const saveCommit = async () => {
    Swal.fire({
      title: "Do you want to Commit?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        const draftNum = draftNumber;
        try {
          axios
            .put("http://localhost:5000/api/v1/final-commit", {
              DraftNum: draftNum,
            })
            .then((response) => {
              const responseData = response.data.incrementedDraftNum;
              console.log(responseData);
              setDocNumber(responseData);
              //
            });
          Swal.fire("Successfully Commited", "", "success");
        } catch (error) {
          console.error("Error updating draft:", error);
          Swal.fire("Error!", "Failed to update draft", "error");
        }
      } else if (result.isDenied) {
        // Show info message
        Swal.fire("Not Commited", "", "info");
      }
    });
  };

  const swalCommit = () => {
    Swal.fire("Need To Save as a Draft first!", "", "info");
  };

  // --------------------------------------- End of Product Details insertion ---------------------------------------

  // -------------------------------------- End of <WMR CODE> header insertion --------------------------------------

  // -------------------------- Filter Date --------------------------
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleFilter = () => {
    console.log("From Date:", fromDate);
    console.log("To Date:", toDate);
    setTodayDate(manilaDate);
    setSearchTerm(fromDate);
  };

  // ------------------------ End Filter Date --------------------------

  let customerData2 = [{}];
  let currentCustomerData = customerList;
  const arrayCustomer = [customerList];

  const [modeOfrelisingArr, setmodeOfrelisingArr] = useState([
    {
      itemCode: "",
      modeReleasing: "",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const fetchAPI = process.env.NEXT_PUBLIC_IP;

  useEffect(() => {
    if (cardCodedata == "C000112") {
      setShowSCPWD(true);
      setVarSCPWDdisc(0.05);
    } else {
      setShowSCPWD(false);
      setVarSCPWDdisc(0);
    }
  });

  const [finalTotalList, setfinalTotalList] = useState([
    {
      documentNum: "",
      modeOfPayment: [],
      cash: "N",
      creditcard: "N",
      debit: "N",
      pdc: "N",
      po: "N",
      datedCheck: "N",
      onlineTransfer: "N",
      onAccount: "N",
      cashOnDel: "N",
      totalVal: 0,
      totalBeforeVat: 0,
      totalAfterVat: 0,
      salescrew: "",
      modeReleasingIndividual: [],
      modeReleasingAll: "",
      scpwddisctotal: 0,
      totalamoutdue: 0,
    },
  ]);

  const onAddHeader = async () => {
    const customers = await axios.get(`${fetchAPI}/customer`);
    setCustomerDataList(customers.data);
    // setTodayDate(manilaDate);
  };

  const onAddheaderItems = async () => {
    const item = await axios.get(
      `${fetchAPI}/item/${priceListNum}/${warehouseCode}/C000174`
    );
    setItemDataList(item.data);
  };

  const onAddHeaderUOM = async (itemcode: any, rowIndex: any) => {
    const uom = await axios.get(`${fetchAPI}/uom/${itemcode}`);
    setUOMList(uom.data);
    setUOMListIndex(rowIndex);
  };

  const onAddHeaderWareHouse = async (itemcode: any, name: any, uom: any) => {
    try {
      const warehouse = await axios.get(
        `${fetchAPI}/warehouse-soh/${itemcode}/${name}/${brandID}`
      );
      setWareHouseList(warehouse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onAddHeaderTaxCode = async (cardCodex: any, whseCodex: any) => {
    const taxcode = await axios.get(
      `${fetchAPI}/tax-code/${cardCodex}/${whseCodex}`
    );
    settaxCodeData(taxcode.data);
  };

  const onAddHeaderRateCode = async (taxcode: any) => {
    const taxrate = await axios.get(`${fetchAPI}/tax-rate/${taxcode}`);
    settaxRateData(taxrate.data);
  };

  useEffect(() => {
    onAddHeader();
    onAddheaderItems();
  }, []);

  const handleAddRow = (rowIndex: any, fieldName: any) => {
    setTableData((prevData) => [
      ...prevData,
      {
        draftNumber: "",
        entryNumber: "", // sample
        itemCode: "",
        itemName: "",
        quantity: 0,
        uom: "",
        uomConversion: 0,
        excludeBO: "N",
        location: "",
        price: 0,
        inventoryStatus: "",
        sellingPriceBeforeDiscount: 0,
        discountRate: 0,
        sellingPriceAfterDiscount: 0,
        sellingPriceAfterDiscountTemp: 0,
        lowerBound: 0,
        taxCode: "",
        taxCodePercentage: 0,
        taxAmount: 0,
        volDisPrice: 0,
        belVolDisPrice: 0,
        cost: 0,
        belCost: "",
        modeOfReleasing: "",
        scPwdDiscount: "N",
        grossTotal: 0,
        selected: false,
        cash: "N",
        creditcard: "N",
        debit: "N",
        pdc: "N",
        po: "N",
        datedCheck: "N",
        onlineTransfer: "N",
        onAccount: "N",
        cashOnDel: "N",
        truckPanelORDropShip: "",
        pickUpLocation: "",
      },
    ]);

    setmodeOfrelisingArr((prevData) => [
      ...prevData,
      {
        itemCode: "",
        modeReleasing: "",
      },
    ]);

    onAddHeader();
    onAddheaderItems();
  };

  // handle search for draft data
  const handleSearchForDraft = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = currentCustomerData
    .filter((rowData) => {
      // Check if any property value in rowData contains the searchTerm
      return Object.values(rowData).some(
        (value: any) =>
          value !== null &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .slice(0, 20); // Get the first 20 results after filtering

  // ----------------------------- On Save Draft Data ----------------------------------
  const currentSaveDraftData = customers;
  const filteredSaveDraftData = currentSaveDraftData
    .filter((rowData) => {
      return Object.values(rowData).some(
        (value: any) =>
          value !== null &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .slice(0, 20);

  // ---------------------------------------- IMPORTANT! --------------------------
  // Add Draft Save Data

  const addDraftData = async (
    draftNum: any,
    customerCode: any,
    customerName: any,
    walkinNmae: any,
    docDate: any,
    createdBy: any
  ) => {
    setFormData({
      ...formData,
      DraftNum: draftNum,
      CustomerCode: customerCode,
      CustomerName: customerName,
      WalkInName: walkinNmae,
      DocDate: docDate,
      CreatedBy: createdBy,
    });
    setCustomerPrint(customerName);
    setIsCommited(true);

    // Header DraftData
    const draftData = await axios.get(
      `${backendAPI}/api/v1/get-draft/${draftNum}`
    );

    const apiData = draftData.data;
    setJsonDraftNum(draftNum);
    setCustomerData([
      {
        customerCode: customerCode,
        customerName: customerName,
        customerCardFName: apiData.ForeignName,
        cusShipAddress: apiData.ShippingAdd,
        cusLicTradNum: apiData.TIN,
      },
    ]);
    setWalkingCustomer(apiData.WalkInName); // walkin customer
    setCustomerReference(apiData.Reference); // Customer Reference
    setScOrPwdField(apiData.SCPWDIdNo); // SC/PWD ID
    setDraftNumber(apiData.DraftNum); // Draft Number
    setSelectedSalesCrew(apiData.SalesCrew); // Sales Crew
    setRemarksField(apiData.Remarks); // Remarks

    // Payment Method
    setIsPaymentCash(apiData.Cash);
    setIsPaymentCreditCard(apiData.CreditCard);
    setIsPaymentDebitCard(apiData.DebitCard);
    setIsPaymentODC(apiData.ODC);
    setIsPaymentPDC(apiData.PDC);
    setIsPaymentOnlineTransfer(apiData.OnlineTransfer);
    setIsPaymentOnAccount(apiData.OnAccount);
    setIsPaymentCOD(apiData.COD);

    // -------------- date ----------------
    const dateString = apiData.PostingDate;
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    setTodayDate(formattedDate);
    // ----------- End Date --------------

    setDocNumber(apiData.DocNum);

    // payment method
    const Yes = "Y";
    if (draftData.data.Cash == Yes) {
      setIsCheckedCash(true);
      setModeOfPaymentPrint("Cash");
    } else if (draftData.data.CreditCard == Yes) {
      setIsCheckedCreditCard(true);
      setModeOfPaymentPrint("CreditCard");
    } else if (draftData.data.DebitCard == Yes) {
      setIsCheckedDebit(true);
      setModeOfPaymentPrint("DebitCard");
      // draftData;
    } else if (draftData.data.ODC == Yes) {
      setIsCheckedDatedCheck(true);
      setModeOfPaymentPrint("ODC");
    } else if (draftData.data.PDC == Yes) {
      setIsCheckedPDC(true);
      setModeOfPaymentPrint("PDC");
    } else if (draftData.data.OnlineTransfer == Yes) {
      setIsCheckedOnlineTransfer(true);
      setModeOfPaymentPrint("OnlineTransfer");
    } else if (draftData.data.OnAccount == Yes) {
      setIsCheckedOnAccount(true);
      setModeOfPaymentPrint("OnAccount");
    } else if (draftData.data.COD) {
      setIsCheckedCashOnDel(true);
      setModeOfPaymentPrint("COD");
    } else {
      Swal.fire("Please Select Payment Method!", "", "info");
    }

    // To addrow if you select draft item
    setcardCodedata(customerCode);
    onAddHeaderTaxCode(customerCode, "GSCNAPGS");

    // to clear search input history
    setSearchTerm("");

    // for open and close draggable and for the button save and update
    setShowSearchHeader(!showSearchHeader);
    setIsSaved(true);
  };

  // add customer data in fields
  const addCustomerData = (
    id: any,
    name: any,
    fname: any,
    address: any,
    tin: any
  ) => {
    onAddHeaderTaxCode(id, "GSCNAPGS");
    setValidateCustomerCode(id);
    setTodayDate(manilaDate);

    const updatedTableData = [...tableData];

    const listArryLen = updatedTableData.length;

    taxRateData.map((e: any) => {
      for (let i = 0; i < listArryLen; i++) {
        const item = updatedTableData[i];
        updatedTableData[i] = {
          ...item,
          taxCodePercentage: e.Rate,
        };
        setTableData(updatedTableData);
      }
    });

    let newArray = {
      customerCode: id,
      customerName: name,
      customerCardFName: fname,
      cusShipAddress: address,
      cusLicTradNum: tin,
    };

    setcardCodedata(id);

    setCustomerData([newArray]);

    // to clear search input history
    setSearchTerm("");

    setFormData({
      ...formData,
      CustomerCode: id,
      CustomerName: name,
      ForeignName: fname,
      ShippingAdd: address,
      TIN: tin,
    });
    setShowCustomer(!showCustomer);
  };

  const toggleShowWindow = () => {
    setShowWindow(!showWindow);
  };

  const handleRemoveRow = (rowIndex: any, Itemcodex: any) => {
    countAllItem = countAllItem - 1;

    setTableData((prevData) =>
      prevData.filter((_, index) => index !== rowIndex)
    );
    setmodeOfrelisingArr((prevData) =>
      prevData.filter((_, index) => index !== rowIndex)
    );
  };

  const handleShowDoc = () => {
    setShowDoc(!showDoc);
  };

  const handleShowCustomer = () => {
    setShowCustomer(!showCustomer);
    onAddHeader();
    setSearchTerm("");

    const updatedTableData = [...tableData];

    const listArryLen = updatedTableData.length;

    taxRateData.map((e: any) => {
      for (let i = 0; i < listArryLen; i++) {
        const item = updatedTableData[i];
        updatedTableData[i] = {
          ...item,
          taxCodePercentage: e.Rate,
        };
        setTableData(updatedTableData);
      }
    });
  };

  const handleShowSearchHeader = () => {
    setShowSearchHeader(!showSearchHeader);
    setSearchTerm("");
  };

  // show print
  const handleShowPrint = () => {
    setShowPrint(!showPrint);
  };

  // ---------------------------------------- Details API ------------------------------------------
  const [jsonDraftNum, setJsonDraftNum] = useState("");
  const [jsonDetails, setJsonDetails] = useState([]); // temporary storage for details
  useEffect(() => {
    if (jsonDraftNum) {
      axios
        .get(`${backendAPI}/api/v1/get-detail/'${jsonDraftNum}'`)
        .then((response) => {
          setJsonDetails(response.data);
          console.log(jsonDetails);

          const newData = response.data.map((item: any) => ({
            draftNumber: item.DraftNum,
            itemCode: item.ItemCode,
            itemName: item.ItemName,
            quantity: item.Quantity,
            uom: item.UoM,
            uomConversion: item.UoMConv,
            location: item.Whse,
            inventoryStatus: item.InvStat,
            price: item.SellPriceBefDisc,
            sellingPriceBeforeDiscount: item.SellPriceBefDisc,
            discountRate: item.DiscRate,
            sellingPriceAfterDiscount: item.SellPriceAftDisc,
            lowerBound: item.LowerBound,
            taxCode: item.TaxCode,
            taxCodePercentage: item.TaxCodePerc,
            taxAmount: item.TaxAmt,
            belVolDisPrice: item.BelPriceDisc,
            cost: item.Cost,
            belCost: item.BelCost,
            modeOfReleasing: item.ModeReleasing,
            scPwdDiscount: item.SCPWDdisc,
            grossTotal: item.GrossTotal,
          }));

          // add the data from selected details
          setTableData([...tableData, ...newData]);

          if (newData.length > 0) {
            setModeOfReleasingPrint(newData[0].modeOfReleasing);
          }

          // to remove 1 row on adding the details
          setTableData((prevData) => prevData.filter((_, index) => index));
          setmodeOfrelisingArr((prevData) =>
            prevData.filter((_, index) => index)
          );
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [jsonDraftNum]);

  // sales Crew
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://172.16.10.217:3001/salescrew");
        setSalesCrew(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Header
  useEffect(() => {
    axios
      .get(`${backendAPI}/api/v1/get-draft`)
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // UseEffect start
  useEffect(() => {
    let tempSum = 0;
    let tempSum2 = 0;
    let taxAmountSum = 0;
    let salescrewfinal = varSCPWDdisc;

    const updatedTableData = [...tableData];

    let arrayLen = updatedTableData.length;

    const setmodeOfrelisingArrx = [...modeOfrelisingArr];

    for (let i = 0; i < arrayLen; i++) {
      tempSum =
        tempSum +
        updatedTableData[i]["sellingPriceBeforeDiscount"] *
          Number(updatedTableData[i]["quantity"]);
      tempSum2 = tempSum2 + updatedTableData[i]["grossTotal"];
      taxAmountSum = taxAmountSum + updatedTableData[i]["taxAmount"];
      setmodeOfrelisingArrx[i] = {
        ...setmodeOfrelisingArrx[i],
        itemCode: updatedTableData[i]["itemCode"],
        modeReleasing: updatedTableData[i]["modeOfReleasing"],
      };
      setmodeOfrelisingArr(setmodeOfrelisingArrx);
    }

    const calculationAfterVat = localCurrency.format(tempSum2);
    const calculationBeforeVat = localCurrency.format(tempSum2 - taxAmountSum);
    const calculationTotalVat = localCurrency.format(taxAmountSum);
    const calculationForScORPwd = localCurrency.format(
      (tempSum2 - taxAmountSum) * varSCPWDdisc
    );
    const calculationTotalAmoutDue = localCurrency.format(
      tempSum2 - (tempSum2 - taxAmountSum) * varSCPWDdisc
    );

    setTotalBeforeVat(calculationAfterVat);
    settotalAfterVat(calculationBeforeVat);
    setTotalVat(calculationTotalVat);
    setSCPWDdata(calculationForScORPwd);
    settotalAmoutDueData(calculationTotalAmoutDue);

    // WMR Code
    const calcAfterVat = tempSum2;
    const calcBeforeVat = tempSum2 - taxAmountSum;
    const calcTotalVat = taxAmountSum;
    const calcForScORPwd = (tempSum2 - taxAmountSum) * varSCPWDdisc;
    const calcTotalAmoutDue =
      tempSum2 - (tempSum2 - taxAmountSum) * varSCPWDdisc;

    const roundedAfterVat = Number(calcAfterVat.toFixed(2));
    const roundedBeforeVat = Number(calcBeforeVat.toFixed(2));
    const roundedTotalVat = Number(calcTotalVat.toFixed(2));
    const roundedForScORPwd = Number(calcForScORPwd.toFixed(2));
    const roundedTotalAmoutDue = Number(calcTotalAmoutDue.toFixed(2));

    setFinalTotalAmtBefTax(roundedBeforeVat);
    setFinalTotalTax(roundedTotalVat);
    setFinalTotalAmtAftTax(roundedAfterVat);
    setFinalSCPWDDiscTotal(roundedForScORPwd);
    setFinalTotalAmtDue(roundedTotalAmoutDue);
  });

  // End UseEffect start

  function sum() {
    let tempSum = 0;

    const updatedTableData = [...tableData];

    let arrayLen = updatedTableData.length;

    for (let i = 0; i < arrayLen; i++) {
      tempSum = tempSum + updatedTableData[i]["grossTotal"];
    }
  }

  sum();

  const [itemCodeForUOM, setItemCodeForUOM] = useState("");

  const openItemTable = (rowIndex: any) => {
    setOpenItemTablePanel(!openItemTablePanel);
    setSelectedRowIndex(rowIndex);

    taxCodeData.map((e: any) => {
      onAddHeaderRateCode(e.TaxCode);

      const updatedTableData = [...tableData];

      const listArryLen = updatedTableData.length;

      taxRateData.map((e: any) => {
        for (let i = 0; i < listArryLen; i++) {
          const item = updatedTableData[i];
          updatedTableData[i] = {
            ...item,
            taxCodePercentage: e.Rate,
          };
          setTableData(updatedTableData);
        }
      });
    });
  };

  const openOUMTable = (rowIndex: any, itemCode: any) => {
    setOpenOUMPanel(!openOUMPanel);
    setSelectedRowIndex(rowIndex);
    setItemCodeForUOM(itemCode);
    onAddHeaderUOM(itemCode, rowIndex);
  };

  // handle Warehouse
  const openLocationTable = (
    rowIndex: any,
    itemcode: any,
    name: any,
    uom: any,
    itemname: any
  ) => {
    setOpenLocationPanel(!openLocationPanel);
    setSelectedRowIndex(rowIndex);
    onAddHeaderWareHouse(itemcode, name, uom);

    setitemcodewh(itemcode);
    setitemnamews(itemname);
    setitemuomws(name);
  };

  const openModRelTable = (rowIndex: any) => {
    setOpenModRelTablePanel(!openModRelTablePanel);
    setSelectedRowIndex(rowIndex);
  };

  // ---------------------- trucker and pick up location -------------------------
  const [openTruckPanel, setOpenTruckPanel] = useState(false);
  const [openPickUpLocations, setOpenPickUpLocations] = useState(false);

  const openTruckerTable = (rowIndex: any) => {
    setOpenTruckPanel(!openTruckPanel);
    setSelectedRowIndex(rowIndex);
  };

  const openPickUpLocation = (rowIndex: any) => {
    setOpenPickUpLocations(!openPickUpLocations);
    setSelectedRowIndex(rowIndex);
  };
  // -----------------------------------------------------------------------------

  const [quantityData, setquantityData] = useState([
    {
      itemCode: "",
      tempQuantity: 0,
    },
  ]);

  let countAllItem = 0;

  const handleItemClick = async (item: any) => {
    countAllItem = countAllItem + 1;

    if (selectedRowIndex !== null) {
      const updateQuantityData = [...quantityData];

      updateQuantityData[selectedRowIndex] = {
        ...updateQuantityData[selectedRowIndex],
        itemCode: item.itemCode,
        tempQuantity: 0,
      };

      setquantityData(updateQuantityData);

      const updatedTableData = [...tableData];

      let taxRateDataNow = 0;
      let taxCodeDataNow = "";
      let lowerBoundNow = 0;

      taxRateData.map((e: any) => {
        taxRateDataNow = e.Rate;
      });

      taxCodeData.map((e: any) => {
        taxCodeDataNow = e.TaxCode;
      });

      const lowerbound = await axios.get(
        `${fetchAPI}/lowerbound/${priceListNum}/${taxCodeDataNow}/${item.ItemCode}/${warehouseCode}/1`
      );
      const lowerboundArr = lowerbound.data;
      const lowerBoundFinalItem = lowerboundArr[0]["LowerBound"];

      let SCDiscount = "";

      const scdiscount = await axios.get(
        `${fetchAPI}/sc-discount/${cardCodedata}/${item.ItemCode}`
      );
      SCDiscount = scdiscount.data[0]["SCDiscount"];

      updatedTableData[selectedRowIndex] = {
        ...updatedTableData[selectedRowIndex],
        entryNumber: formData.DraftNum, //sample
        itemCode: item.ItemCode,
        itemName: item.ItemName,
        quantity: 1,
        discountRate: 0,
        uom: item.UomCode,
        location: "GSCNAPGS",
        price: item.SRP,
        lowerBound: lowerBoundFinalItem,
        taxCode: taxCodeDataNow,
        uomConversion: item.NumInSale,
        taxCodePercentage: taxRateDataNow,
        belCost: "N",
        sellingPriceBeforeDiscount: item.SRP,
        sellingPriceAfterDiscount: item.SRP,
        sellingPriceAfterDiscountTemp: item.SRP,
        taxAmount: item.SRP * 0.12,
        grossTotal: item.SRP,
        scPwdDiscount: SCDiscount,
      };
      setTableData(updatedTableData);
      setShowItems(false);
      setSelectedRowIndex(null);
      setOpenItemTablePanel(!openItemTablePanel);
      setSellingPriceAfterDis(item.Price);
    }
    // to clear search input history
    setSearchTerm("");
  };

  const changeTextBoxValue = (rowIndex: any) => {
    let sellingAfDis = document.getElementById("sellingAfDis");

    const updatedTableData = [...tableData];
    const item = updatedTableData[rowIndex];

    const sellingAfterDis = item.sellingPriceAfterDiscount;

    const itemCodeID = item.itemCode;

    let idUOM = document.getElementById(itemCodeID);

    idUOM?.setAttribute("value", sellingAfterDis.toString());
  };

  const handleKeyPressSel = (
    event: { key: string },
    rowIndex: any,
    value: any
  ) => {
    const updatedTableData = [...tableData];
    const item = updatedTableData[rowIndex];
    const sellingAfterDis = item.sellingPriceAfterDiscount;
    const sellingAfterDisTemp = item.sellingPriceAfterDiscountTemp;

    if (event.key === "Enter") {
      let belCost = "";

      if (parseFloat(sellingAfterDis.toString()) < item.cost) {
        belCost = "Y";
      } else {
        belCost = "N";
      }

      if (parseFloat(value) < parseFloat(sellingAfterDisTemp.toString())) {
        updatedTableData[rowIndex] = {
          ...item,
          grossTotal: value * item.quantity,
          // belVolDisPrice: "Y",
          belVolDisPrice: 0,
          sellingPriceAfterDiscount: value,
          belCost: belCost,
        };

        setTableData(updatedTableData);
      } else {
        updatedTableData[rowIndex] = {
          ...item,
          grossTotal: value * item.quantity,
          // belVolDisPrice: "N",
          belVolDisPrice: 0,
          sellingPriceAfterDiscount: value,
          belCost: belCost,
        };
        setTableData(updatedTableData);
      }
    } else {
    }
  };

  const handleSelectAll = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleQuantityChange = async (rowIndex: any, quantity: any) => {
    const updatedTableData = [...tableData];
    const item = updatedTableData[rowIndex];
    const discount = item.discountRate;
    const amount = quantity * item.sellingPriceBeforeDiscount;

    const disPriceBefDis = item.sellingPriceBeforeDiscount;
    const disCardCode = cardCodedata;
    const disItemCode = item.itemCode;
    const disUOM = item.uom;
    const disLowerBound = item.lowerBound;
    const disTaxCode = item.taxCode;

    try {
      const disPrice = await axios.get(
        `${process.env.NEXT_PUBLIC_IP}/discount-price/${brandID}/${disPriceBefDis}/${disCardCode}/${disItemCode}/${quantity}/${disUOM}/${disLowerBound}/N/N/N/N/${disTaxCode}`
      );

      const disPriceArr = disPrice.data;

      const disAfterPrice = disPriceArr[0]["DiscPrice"];

      const disRateFor =
        ((disPriceBefDis - disAfterPrice) / disPriceBefDis) * 100;

      const cost = await axios.get(
        `${process.env.NEXT_PUBLIC_IP}/cost/${item.itemCode}/${warehouseCode}`
      );
      const costArr = cost.data;

      let belowCostBool = "";

      if (item.sellingPriceAfterDiscount < costArr[0]["Cost"]) {
        belowCostBool = "N";
      } else {
        belowCostBool = "Y";
      }

      const quantityXuomConversion = quantity * item.uomConversion;

      const stocksAvailability = await axios.get(
        `${process.env.NEXT_PUBLIC_IP}/stocks-availability/0/${disItemCode}/${item.location}/${quantityXuomConversion}/${item.excludeBO}`
      );
      const stocksAvailabilityArr = stocksAvailability.data;

      let unitprice = item.sellingPriceAfterDiscountTemp / (1 + 0.12);
      let taxAmountx = item.sellingPriceAfterDiscountTemp - unitprice;

      setTotalVat(taxAmountx);

      updatedTableData[rowIndex] = {
        ...item,
        quantity: quantity,
        discountRate: disRateFor,
        cost: costArr[0]["Cost"] * item.uomConversion,
        sellingPriceAfterDiscount: disPriceArr[0]["DiscPrice"],
        sellingPriceAfterDiscountTemp: disPriceArr[0]["DiscPrice"],
        grossTotal: quantity * item.sellingPriceAfterDiscount,
        taxAmount: taxAmountx * quantity,
        inventoryStatus: stocksAvailabilityArr[0]["StockAvailable"],
      };
      setTableData(updatedTableData);
      setSellingPriceAfterDis(item.sellingPriceAfterDiscount);
    } catch (e) {}
  };

  const handleChangeExcludeBO = async (value: any, rowIndex: any) => {
    const updatedTableData = [...tableData];
    const item = updatedTableData[rowIndex];
    const stocksAvailability = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/stocks-availability/0/${item.itemCode}/${item.location}/${item.quantity}/${value}`
    );
    const stocksAvailabilityArr = stocksAvailability.data;

    updatedTableData[rowIndex] = {
      ...item,
      excludeBO: value,
      inventoryStatus: stocksAvailabilityArr[0]["StockAvailable"],
    };

    setTableData(updatedTableData);
  };

  let localCurrency = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP", // Philippines currency code for Philippine Peso
  });

  const handleSearchItem = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filteredDataItem = itemList
    .filter((rowData) => {
      return Object.values(rowData).some(
        (value: any) =>
          value !== null &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .slice(0, 50);

  const handleUOM = async (rowindex: any, BaseQty: any, UomCode: any) => {
    const updatedTableData = [...tableData];
    const item = updatedTableData[UOMListIndex];

    const uomtaxCode = item["taxCode"];
    const uomitemCode = item["itemCode"];
    const uomtaxAmout = item["taxAmount"];

    const lowerbound = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/lowerbound/${priceListNum}/${uomtaxCode}/${uomitemCode}/${warehouseCode}/${BaseQty}`
    );
    const lowerboundArr = lowerbound.data;
    const lowerBoundFinalItem = lowerboundArr[0]["LowerBound"];

    const srp = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/srp/${uomitemCode}/${BaseQty}/${UomCode}/${uomtaxCode}/${lowerBoundFinalItem}/${cardCodedata}/${priceListNum}`
    );
    const srpdata = srp.data;

    const quantityXuomConversion = item.quantity * BaseQty;

    let warehousecurrent = "";

    if (item.location == "") {
      warehousecurrent = warehouseCode;
    } else {
      warehousecurrent = item.location;
    }

    const disPrice = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/discount-price/${brandID}/${item.sellingPriceAfterDiscount}/${cardCodedata}/${item.itemCode}/${item.quantity}/${UomCode}/${item.lowerBound}/N/N/N/N/${item.taxCode}`
    );
    const disPriceArr = disPrice.data;
    const disAfterPrice = disPriceArr[0]["DiscPrice"];

    const stocksAvailability = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/stocks-availability/0/${item.itemCode}/${item.location}/${quantityXuomConversion}/${item.excludeBO}`
    );
    const stocksAvailabilityArr = stocksAvailability.data;

    updatedTableData[UOMListIndex] = {
      ...item,
      uomConversion: BaseQty,
      uom: UomCode,
      lowerBound: lowerBoundFinalItem,
      sellingPriceBeforeDiscount: srpdata[0]["SRP"],
      grossTotal: item.price * BaseQty * item.quantity,
      quantity: 0,
      setSellingPriceAfterDis: item.sellingPriceAfterDiscountTemp * BaseQty,
      inventoryStatus: stocksAvailabilityArr[0]["StockAvailable"],
    };
    setTableData(updatedTableData);
    setOpenOUMPanel(!openOUMPanel);

    var quantityChange = document.getElementById("quantityInput");
    quantityChange?.setAttribute("placeholder", "0"); // wmr change
  };

  // Mode of Releasing Function
  const modeReleasing = (value: any) => {
    const updatedTableData = [...tableData];

    const listArryLen = updatedTableData.length;

    for (let i = 0; i < listArryLen; i++) {
      const item = updatedTableData[i];
      updatedTableData[i] = {
        ...item,
        modeOfReleasing: value,
      };
      setTableData(updatedTableData);
    }
  };

  const changeManualModRel = (moderel: any) => {
    const updatedTableData = [...tableData];

    const item = updatedTableData[selectedRowIndex];

    updatedTableData[selectedRowIndex] = {
      ...item,
      modeOfReleasing: moderel,
    };

    setTableData(updatedTableData);
    setOpenModRelTablePanel(!openModRelTablePanel);
  };

  // Task
  const changeManualTruckPanel = (trucker: any) => {
    const updatedTableData = [...tableData];

    const item = updatedTableData[selectedRowIndex];

    updatedTableData[selectedRowIndex] = {
      ...item,
      truckPanelORDropShip: trucker,
    };

    setTableData(updatedTableData);
    setOpenTruckPanel(!openTruckPanel);
  };

  const changeManualPickUpLocation = (location: any) => {
    const updatedTableData = [...tableData];

    const item = updatedTableData[selectedRowIndex];

    updatedTableData[selectedRowIndex] = {
      ...item,
      pickUpLocation: location,
    };

    setTableData(updatedTableData);
    setOpenPickUpLocations(!openPickUpLocations);
  };

  const consoleLog = () => {
    console.log(tableData);
  };

  const handleWarehoueChange = async (rowIndex: any, itemdata: any) => {
    const updatedTableData = [...tableData];
    const item = updatedTableData[selectedRowIndex];

    const quantityXuomConversion = item.quantity * item.uomConversion;

    const stocksAvailability = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/stocks-availability/0/${item.itemCode}/${itemdata}/${quantityXuomConversion}/${item.excludeBO}`
    );
    const stocksAvailabilityArr = stocksAvailability.data;

    updatedTableData[selectedRowIndex] = {
      ...item,
      location: itemdata,
      inventoryStatus: stocksAvailabilityArr[0]["StockAvailable"],
    };
    setTableData(updatedTableData);
    setOpenLocationPanel(!openLocationPanel);
  };

  // Payment section

  const handCash = async (event: any) => {
    setIsCheckedCash(event.target.checked);

    if (isCheckedCash != true) {
      setccstatus(true);

      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          cash: "Y",
        };

        setTableData(updatedTableData);
        setIsPaymentCash("Y"); //WMR code
      }

      setccstatus(false);
    } else {
      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        setccstatus(true);

        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          cash: "N",
        };

        setTableData(updatedTableData);

        setccstatus(false);
      }
    }
  };

  const handleCreditCard = async (event: any) => {
    setIsCheckedCreditCard(event.target.checked);

    if (isCheckedCreditCard != true) {
      setccstatus(true);

      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          creditcard: "Y",
        };

        setTableData(updatedTableData);

        const item2 = updatedTableData[i];

        axios
          .get(
            `${process.env.NEXT_PUBLIC_IP}/discount-price/${brandID}/${item.sellingPriceBeforeDiscount}/${cardCodedata}/${item.itemCode}/${item.quantity}/${item.uom}/${item.lowerBound}/${item2.creditcard}/${item2.debit}/${item2.pdc}/${item2.po}/${item2.taxCode}`
          )
          .then((response) => {
            const disPriceArr = response.data;
            const disAfterPrice = disPriceArr[0]["DiscPrice"];
            const disRateFor =
              ((item.sellingPriceBeforeDiscount - disAfterPrice) /
                item.sellingPriceBeforeDiscount) *
              100;

            const newupdatedTableData = [...tableData];
            const itemnew = newupdatedTableData[i];

            updatedTableData[i] = {
              ...itemnew,
              creditcard: "Y",
              discountRate: disRateFor,
              sellingPriceAfterDiscount: itemnew.sellingPriceBeforeDiscount,
              sellingPriceAfterDiscountTemp: itemnew.sellingPriceBeforeDiscount,
            };
            setTableData(updatedTableData);

            setccstatus(false);
          })
          .catch((e) => {
            console.error("Error credit card", e);
          });

        const finalArr = [...finalTotalList];

        finalArr[0] = {
          ...finalArr[0],
          creditcard: "Y",
        };

        setfinalTotalList(finalArr);
        setIsPaymentCreditCard("Y");
      }
    } else {
      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        setccstatus(true);

        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          creditcard: "N",
        };

        setTableData(updatedTableData);

        const item2 = updatedTableData[i];

        axios
          .get(
            `${process.env.NEXT_PUBLIC_IP}/discount-price/${brandID}/${item.sellingPriceBeforeDiscount}/${cardCodedata}/${item.itemCode}/${item.quantity}/${item.uom}/${item.lowerBound}/${item2.creditcard}/${item2.debit}/${item2.pdc}/${item2.po}/${item2.taxCode}`
          )
          .then((response) => {
            const disPriceArr = response.data;
            const disAfterPrice = disPriceArr[0]["DiscPrice"];
            const disRateFor =
              ((item.sellingPriceBeforeDiscount - disAfterPrice) /
                item.sellingPriceBeforeDiscount) *
              100;

            const newupdatedTableData = [...tableData];
            const itemnew = newupdatedTableData[i];

            updatedTableData[i] = {
              ...itemnew,
              creditcard: "N",
              discountRate: disRateFor,
              sellingPriceAfterDiscount: disAfterPrice,
              sellingPriceAfterDiscountTemp: disAfterPrice,
            };
            setTableData(updatedTableData);

            setccstatus(false);
          })
          .catch((e) => {
            console.error("Error credit card", e);
          });

        const finalArr = [...finalTotalList];

        finalArr[0] = {
          ...finalArr[0],
          creditcard: "N",
        };

        setfinalTotalList(finalArr);
      }
    }
  };

  const handleDebit = async (event: any) => {
    setIsCheckedDebit(event.target.checked);

    if (isCheckedDebit != true) {
      setccstatus(true);

      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          debit: "Y",
        };

        setTableData(updatedTableData);

        const item2 = updatedTableData[i];

        axios
          .get(
            `${process.env.NEXT_PUBLIC_IP}/discount-price/${brandID}/${item.sellingPriceBeforeDiscount}/${cardCodedata}/${item.itemCode}/${item.quantity}/${item.uom}/${item.lowerBound}/${item2.creditcard}/${item2.debit}/${item2.pdc}/${item2.po}/${item.taxCode}`
          )
          .then((response) => {
            const disPriceArr = response.data;
            const disAfterPrice = disPriceArr[0]["DiscPrice"];
            const disRateFor =
              ((item.sellingPriceBeforeDiscount - disAfterPrice) /
                item.sellingPriceBeforeDiscount) *
              100;

            const newupdatedTableData = [...tableData];
            const itemnew = newupdatedTableData[i];

            updatedTableData[i] = {
              ...itemnew,
              debit: "Y",
              discountRate: disRateFor,
              sellingPriceAfterDiscount: itemnew.sellingPriceBeforeDiscount,
              sellingPriceAfterDiscountTemp: itemnew.sellingPriceBeforeDiscount,
            };
            setTableData(updatedTableData);

            setccstatus(false);
          })
          .catch((e) => {
            console.error("Error credit card", e);
          });

        const finalArr = [...finalTotalList];

        finalArr[0] = {
          ...finalArr[0],
          debit: "Y",
        };

        setIsPaymentDebitCard("Y");
        setfinalTotalList(finalArr);
      }
    } else {
      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        setccstatus(true);

        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          debit: "N",
        };

        setTableData(updatedTableData);

        const item2 = updatedTableData[i];

        axios
          .get(
            `${fetchAPI}/discount-price/${brandID}/${item.sellingPriceBeforeDiscount}/${cardCodedata}/${item.itemCode}/${item.quantity}/${item.uom}/${item.lowerBound}/${item2.creditcard}/${item2.debit}/${item2.pdc}/${item2.po}/${item.taxCode}`
          )
          .then((response) => {
            const disPriceArr = response.data;
            const disAfterPrice = disPriceArr[0]["DiscPrice"];
            const disRateFor =
              ((item.sellingPriceBeforeDiscount - disAfterPrice) /
                item.sellingPriceBeforeDiscount) *
              100;

            const newupdatedTableData = [...tableData];
            const itemnew = newupdatedTableData[i];

            updatedTableData[i] = {
              ...itemnew,
              debit: "N",
              discountRate: disRateFor,
              sellingPriceAfterDiscount: disAfterPrice,
              sellingPriceAfterDiscountTemp: disAfterPrice,
            };
            setTableData(updatedTableData);

            setccstatus(false);
          })
          .catch((e) => {
            console.error("Error credit card", e);
          });

        const finalArr = [...finalTotalList];

        finalArr[0] = {
          ...finalArr[0],
          debit: "N",
        };

        setfinalTotalList(finalArr);
      }
    }
  };

  const handlePDC = async (event: any) => {
    setIsCheckedPDC(event.target.checked);

    if (isCheckedPDC != true) {
      setccstatus(true);

      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          pdc: "Y",
        };

        setTableData(updatedTableData);

        const finalArr = [...finalTotalList];

        finalArr[0] = {
          ...finalArr[0],
          pdc: "Y",
        };

        setfinalTotalList(finalArr);

        setccstatus(false);
        setIsPaymentPDC("Y");
      }
    } else {
      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        setccstatus(true);

        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          pdc: "N",
        };

        setTableData(updatedTableData);

        const finalArr = [...finalTotalList];

        finalArr[0] = {
          ...finalArr[0],
          pdc: "N",
        };

        setfinalTotalList(finalArr);

        setccstatus(false);
      }
    }
  };

  const handlePO = async (event: any) => {
    setIsCheckedPO(event.target.checked);

    const finalArr = [...finalTotalList];

    if (isCheckedPO != true) {
      setccstatus(true);

      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          po: "Y",
        };

        setTableData(updatedTableData);

        const item2 = updatedTableData[i];

        setccstatus(false);
      }
      setIsPaymentPO("Y");
    } else {
      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        setccstatus(true);

        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          po: "N",
        };

        setTableData(updatedTableData);

        const item2 = updatedTableData[i];

        setccstatus(false);
      }
    }
  };

  const handleDatedCheck = (event: any) => {
    setIsCheckedDatedCheck(event.target.checked);

    const finalArr = [...finalTotalList];

    if (isCheckedDatedCheck != true) {
      setccstatus(true);

      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          datedCheck: "Y",
        };

        setTableData(updatedTableData);

        finalArr[0] = {
          ...finalArr[0],
          datedCheck: "Y",
        };

        setfinalTotalList(finalArr);
        setIsPaymentODC("Y");
      }

      setccstatus(false);
    } else {
      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        setccstatus(true);

        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          datedCheck: "N",
        };

        setTableData(updatedTableData);

        finalArr[0] = {
          ...finalArr[0],
          datedCheck: "N",
        };

        setfinalTotalList(finalArr);

        setccstatus(false);
      }
    }
  };

  const handlOnlineTransfer = (event: any) => {
    setIsCheckedOnlineTransfer(event.target.checked);

    const finalArr = [...finalTotalList];

    if (isCheckedOnlineTransfer != true) {
      setccstatus(true);

      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          onlineTransfer: "Y",
        };

        setTableData(updatedTableData);

        finalArr[0] = {
          ...finalArr[0],
          onlineTransfer: "Y",
        };

        setfinalTotalList(finalArr);
        setIsPaymentOnlineTransfer("Y");
      }

      setccstatus(false);
    } else {
      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        setccstatus(true);

        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          onlineTransfer: "N",
        };

        setTableData(updatedTableData);

        finalArr[0] = {
          ...finalArr[0],
          onlineTransfer: "N",
        };

        setfinalTotalList(finalArr);

        setccstatus(false);
      }
    }
  };

  const handleOnAccount = (event: any) => {
    setIsCheckedOnAccount(event.target.checked);
    if (isCheckedOnAccount != true) {
      setccstatus(true);

      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          onAccount: "Y",
        };

        setTableData(updatedTableData);

        const finalArr = [...finalTotalList];

        finalArr[0] = {
          ...finalArr[0],
          onAccount: "Y",
        };

        setfinalTotalList(finalArr);
        setIsPaymentOnAccount("Y");
      }

      setccstatus(false);
    } else {
      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        setccstatus(true);

        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          onAccount: "N",
        };

        setTableData(updatedTableData);

        const finalArr = [...finalTotalList];

        finalArr[0] = {
          ...finalArr[0],
          onAccount: "N",
        };

        setfinalTotalList(finalArr);

        setccstatus(false);
      }
    }
  };

  const handleCashOnDel = (event: any) => {
    setIsCheckedCashOnDel(event.target.checked);

    if (isCheckedCashOnDel != true) {
      setccstatus(true);

      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          cashOnDel: "Y",
        };

        setTableData(updatedTableData);

        const finalArr = [...finalTotalList];

        finalArr[0] = {
          ...finalArr[0],
          cashOnDel: "Y",
        };

        setfinalTotalList(finalArr);
        setIsPaymentCOD("Y");
      }

      setccstatus(false);
    } else {
      const updatedTableData = [...tableData];
      const tableDatalen = tableData.length;

      for (let i = 0; i < tableDatalen; i++) {
        setccstatus(true);

        const item = updatedTableData[i];

        updatedTableData[i] = {
          ...item,
          cashOnDel: "N",
        };

        setTableData(updatedTableData);

        const finalArr = [...finalTotalList];

        finalArr[0] = {
          ...finalArr[0],
          cashOnDel: "N",
        };

        setfinalTotalList(finalArr);

        setccstatus(false);
      }
    }
  };

  // END of Payment function

  const [displayModeDrop, setDisplayModeDrop] = useState(false);

  useEffect(() => {
    const allItemsArr = [...tableData];
    const allItemsArrLen = allItemsArr.length;

    let countAllreleasing = 0;

    for (let i = 0; i < allItemsArrLen; i++) {
      if (allItemsArr[i]["modeOfReleasing"] == "") {
      } else {
        countAllreleasing++;
      }
    }

    if (countAllreleasing == allItemsArrLen) {
      setDisplayModeDrop(false);
    } else {
      setDisplayModeDrop(true);
    }
  });

  // ------------------------------ Windows Print -------------------------------
  const PrintReceipt = () => {
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Sales Order Stub</title>
                <style>
                    @media print {
                        @page {
                            size: auto;
                            margin: 0mm;
                        }
                        body {
                            margin: 0;
                            padding: 20px;
                            font-family:"Calibri", sans-serif;
                            text-align: center;
                        }
                        h3 {
                            margin: 0;
                            padding: 0;
                        }
                        h4 {
                            margin: 5px 0;
                            font-size: 13px;
                        }
                        h1 {
                          font-size: 50px;
                          margin: 0;
                          padding: 0;
                        }
                        p {
                          margin: 0;
                          padding: 0;
                          font-size: 15px;
                        }
                        .normal{
                          margin: 5px 0;
                          font-size: 13px;
                        }
                    }
                </style>
            </head>
            <body>
                <div>
                    <h4>SAFETYBUILD INC.</h4>
                    <p class="normal">GSC-DADIANGAS CORNERSTONE CENTER</p>
                    <h3 class="salesOrder">SALES ORDER STUB</h3>
                    <h1>${docNumber}</h1>
                    <p>${customerPrint}</p>
                    <p>${modeOfPaymentPrint}</p>
                    <p>${modeOfReleasingPrint}</p>
                    <p>Tracker</p>
                    <p>SA</p>
                    <p>${selectedSalesCrew}</p>
                    <p>${totalAmoutDueData}</p>
                </div>
            </body>
            </html>
        `);

      printWindow.document.close();
      printWindow.print();

      // Close the print window after printing
      setTimeout(() => {
        printWindow.close();
      }, 1000); // Adjust the timeout as needed
    }
  };

  // --------------------------- End Windows Print ------------------------------
  return (
    <>
      <div className="salesbody p-2 text-sm rounded-md flex gap-40  container overflow-x-auto shadow-lg">
        <div className="w-[] flex flex-wrap gap-5 col1 mr-3">
          <div>
            <div className="grid grid-cols-2">
              <label htmlFor="CustomerCode">Customer Code</label>
              <div>
                <input
                  type="text"
                  value={customerData.map((e) => e.customerCode)}
                  className="bg-slate-200"
                  readOnly
                />
                <button
                  className="w-[20px]  bg-slate-200"
                  onClick={handleShowCustomer}
                >
                  =
                </button>
                {showCustomer && (
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
                      <div
                        className="grid grid-cols-2 p-2 text-left windowheader"
                        style={{ cursor: "move" }}
                      >
                        <div>Customer</div>
                        <div className="text-right">
                          <span
                            onClick={handleShowCustomer}
                            className="cursor-pointer"
                          >
                            ❌
                          </span>
                        </div>
                      </div>
                      <div className="content">
                        <div className="p-2">
                          <div>
                            Search:{" "}
                            <input
                              type="text"
                              className="mb-1"
                              value={searchTerm}
                              onChange={handleSearch}
                            />
                          </div>
                          <table>
                            <thead className="tables">
                              <tr>
                                <th>Customer Code</th>
                                <th>Name</th>
                                <th>Foreign Name</th>
                                <th>Shipping Address</th>
                                <th>LicTradNum</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData.map((rowData: any, rowIndex) => (
                                <tr className="trcus" key={rowIndex}>
                                  <td
                                    className="tdcus"
                                    onClick={() =>
                                      addCustomerData(
                                        rowData.CardCode,
                                        rowData.CardName,
                                        rowData.CardFName,
                                        rowData.Address,
                                        rowData.LicTradNum
                                      )
                                    }
                                  >
                                    {rowData.CardCode}
                                  </td>
                                  <td
                                    className="tdcus"
                                    onClick={() =>
                                      addCustomerData(
                                        rowData.CardCode,
                                        rowData.CardName,
                                        rowData.CardFName,
                                        rowData.Address,
                                        rowData.LicTradNum
                                      )
                                    }
                                  >
                                    {rowData.CardName}
                                  </td>
                                  <td
                                    className="tdcus"
                                    onClick={() =>
                                      addCustomerData(
                                        rowData.CardCode,
                                        rowData.CardName,
                                        rowData.CardFName,
                                        rowData.Address,
                                        rowData.LicTradNum
                                      )
                                    }
                                  >
                                    {rowData.CardFName}
                                  </td>
                                  <td
                                    className="tdcus"
                                    onClick={() =>
                                      addCustomerData(
                                        rowData.CardCode,
                                        rowData.CardName,
                                        rowData.CardFName,
                                        rowData.Address,
                                        rowData.LicTradNum
                                      )
                                    }
                                  >
                                    {rowData.Address}
                                  </td>
                                  <td
                                    className="tdcus"
                                    onClick={() =>
                                      addCustomerData(
                                        rowData.CardCode,
                                        rowData.CardName,
                                        rowData.CardFName,
                                        rowData.Address,
                                        rowData.LicTradNum
                                      )
                                    }
                                  >
                                    {rowData.LicTradNum}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </Draggable>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="CustomerName">Customer Name</label>
              <div>
                <input
                  type="text"
                  value={customerData.map((e) => e.customerName)}
                  className="bg-slate-200"
                  readOnly
                />
              </div>
            </div>

            {/* need to edit */}
            <div className="grid grid-cols-2">
              <label className="" htmlFor="foreignName">
                Foreign Name
              </label>
              <div>
                <input
                  type="text"
                  value={customerData.map((e) => e.customerCardFName)}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-2">
              <label htmlFor="WalkInName">Walk-in Customer Name</label>
              <div>
                {validateCustomerCode === "C000107" ||
                validateCustomerCode === "C000111" ? (
                  <input
                    type="text"
                    onChange={handleWalkinCustomerChange}
                    value={walkInCustomer}
                  />
                ) : (
                  <input
                    type="text"
                    onChange={handleWalkinCustomerChange}
                    value={walkInCustomer}
                    disabled
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2">
              <label className="" htmlFor="ShippingAdd">
                Customer Shipping Address
              </label>
              <div>
                <input
                  type="text"
                  value={customerData.map((e) => e.cusShipAddress)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2">
              <label className="" htmlFor="TIN">
                Customer TIN
              </label>
              <div>
                <input
                  type="text"
                  value={customerData.map((e) => e.cusLicTradNum)}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2">
              <label className="" htmlFor="Reference">
                Customer Reference
              </label>
              <div>
                <input
                  type="text"
                  value={customerReference}
                  onChange={handleCustomerChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2">
              <label className="" htmlFor="entrynumber">
                Branch
              </label>
              <div>
                <input type="text" readOnly />
              </div>
            </div>

            <div className="grid grid-cols-2">
              <label className="" htmlFor="entrynumber">
                Document Status
              </label>
              <div>
                <input type="text" readOnly />
              </div>
            </div>

            <div className="grid grid-cols-2">
              <label className="" htmlFor="entrynumber">
                Base Document
              </label>
              <div>
                <input type="text" readOnly />
              </div>
            </div>

            {showSCPDW && (
              <div className="grid grid-cols-2">
                <label className="" htmlFor="entrynumber">
                  SC/PWD ID
                </label>
                <div>
                  <input onChange={handleScOrPwd} type="text" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-[] col1">
          <div className="grid grid-cols-2">
            <label htmlFor="documentnumber">Document Number</label>
            <div>
              <input value={docNumber !== "0" ? docNumber : 0} type="text" />
            </div>
            {/*  */}
            {/* Document Number */}
            {showDoc && (
              <Draggable>
                <div
                  className="w-[400px] h-[100px] bg-white shadow-lg"
                  style={{
                    border: "1px solid #ccc",
                    position: "absolute",
                    top: "12%",
                    left: "68.3%",
                  }}
                >
                  <div
                    className="grid grid-cols-2 p-2 text-left windowheader"
                    style={{ cursor: "move" }}
                  >
                    <div>Document Number</div>
                    <div className="text-right">
                      <span onClick={handleShowDoc} className="cursor-pointer">
                        ❌
                      </span>
                    </div>
                  </div>
                  <div className="content"></div>
                </div>
              </Draggable>
            )}
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="draftNumber">Draft Number</label>
            <div>
              <input
                type="text"
                readOnly
                value={draftNumber !== null ? draftNumber : ""}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="entrynumber">Entry Number</label>
            <div>
              <input
                type="text"
                readOnly
                value={entryNumbers !== null ? entryNumbers : ""}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="docdate">Document Date</label>
            <div>
              <input type="text" value={todayDate} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="postDate">Posting Date</label>
            <div>
              <input type="text" value={todayDate} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="deliveryDate">Delivery Date</label>
            <div>
              <input type="date" />
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------- TABLE --------------------------------------- */}
      <div className="fields mt-2 rounded-md text-left container bg-white overflow-x-auto shadow-xl p-2 max-h-[200px]">
        <div className="">
          <table>
            <thead className="tables">
              <tr>
                <th></th>
                <th>Item Codes</th>
                <th>Item Name</th>
                <th>Unit of Measure (UOM)</th>
                <th>UOM Conversion</th>
                <th>Exclude BO</th>
                <th>Warehouse</th>
                <th>Quantity</th>
                <th>Inventory Status</th>
                <th>Price</th>
                <th>Selling Price before Discount</th>
                <th>Discount Rate (%)</th>
                <th>Selling Price after Discount</th>
                <th>Lower Bound</th>
                <th>Tax Code</th>
                <th>Tax Rate %</th>
                <th>Tax Amount</th>
                {/* <th>Vol. Disc. Price</th> */}
                <th>Below Vol. Disc. Price</th>
                <th>Cost</th>
                <th>Below Cost</th>
                <th>Mode of Releasing</th>
                <th>Trucker for Dropship/Back-order</th>
                <th>Pick up Location</th>
                <th>SC/PWD Discount (Y/N)</th>
                <th>Gross Total</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((rowData, rowIndex) => (
                <tr className="trcus" key={rowIndex}>
                  {/* Handle Remove Row */}
                  <td>
                    <button
                      onClick={() =>
                        handleRemoveRow(rowIndex, rowData.itemCode)
                      }
                    >
                      <span className="text-md text-red-600">❌</span>
                    </button>
                  </td>
                  {/* Item Code */}
                  <td>
                    <div className="flex gap-3 justify-end">
                      <div>{rowData.itemCode}</div>
                      <div className="text-right">
                        {cardCodedata != "" && (
                          <button
                            className="bg-[#F0AB00] pr-1 pl-1"
                            onClick={() => openItemTable(rowIndex)}
                          >
                            =
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* Item Name */}
                  <td>{rowData.itemName}</td>
                  {/* Unit of Measurement */}
                  <td>
                    {/* {rowData.itemCode == 0 */}
                    {rowData.itemCode == "" ? (
                      ""
                    ) : (
                      <div className="grid grid-cols-2">
                        <div>{rowData.uom}</div>
                        <div className="text-right">
                          {rowData.itemCode != "" && (
                            <button
                              onClick={() =>
                                openOUMTable(rowIndex, rowData.itemCode)
                              }
                              className="bg-[#F0AB00] pr-1 pl-1"
                            >
                              =
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                  {/* UOM Conversion */}
                  <td>{rowData.uom == "" ? "" : rowData.uomConversion}</td>
                  {/* Handle Exlude BO */}
                  <td>
                    <select
                      name=""
                      onChange={(e) =>
                        handleChangeExcludeBO(e.target.value, rowIndex)
                      }
                      className="w-[100px] h-[20px]"
                    >
                      <option value="N" selected>
                        N
                      </option>
                      <option value="Y">Y</option>
                    </select>
                  </td>
                  {/* Warehouse */}
                  <td>
                    {rowData.uom == "" ? (
                      ""
                    ) : (
                      <div className="flex gap-3 justify-end">
                        <div>{rowData.location}</div>
                        <div className="text-right">
                          {rowData.uom != "" && (
                            <button
                              onClick={() =>
                                openLocationTable(
                                  rowIndex,
                                  rowData.itemCode,
                                  rowData.uom,
                                  rowData.uomConversion,
                                  rowData.itemName
                                )
                              }
                              className="bg-[#F0AB00] pr-1 pl-1"
                            >
                              =
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                  {/* Quantity */}
                  <td>
                    <input
                      className=" border-l-white border-t-white border-r-white"
                      type="text"
                      placeholder={
                        rowData.quantity === 0
                          ? ""
                          : rowData.quantity.toString()
                      }
                      onChange={(e) =>
                        handleQuantityChange(rowIndex, e.target.value)
                      }
                      id="quantityInput"
                      onClick={handleSelectAll}
                    />
                  </td>
                  {/* Inventory Status */}
                  <td
                    className={
                      rowData.quantity == 0
                        ? "bg-white"
                        : rowData.inventoryStatus === "Available"
                        ? "bg-green-200"
                        : rowData.inventoryStatus === "Out of Stocks"
                        ? "bg-red-200"
                        : ""
                    }
                  >
                    {rowData.quantity == 0 ? "" : rowData.inventoryStatus}
                  </td>
                  {/* price */}
                  <td>
                    {rowData.quantity == 0
                      ? ""
                      : localCurrency.format(rowData.price)}
                  </td>
                  <td>
                    {rowData.quantity == 0
                      ? ""
                      : localCurrency.format(
                          rowData.sellingPriceBeforeDiscount
                        )}
                  </td>
                  <td
                    className={
                      rowData.discountRate <= 0 ? "bg-red-200 " : "bg-green-200"
                    }
                  >
                    {rowData.quantity <= 0
                      ? ""
                      : parseFloat(Math.max(rowData.discountRate).toFixed(2)) <=
                        0
                      ? 0
                      : Math.max(rowData.discountRate).toFixed(2)}
                  </td>
                  {/* Selling Price After Discount wmr code */}
                  <td>
                    {rowData.quantity == 0 ? (
                      ""
                    ) : (
                      <div className="flex gap-2">
                        <div>
                          <input
                            className="w-[100px] border-l-white border-t-white border-r-white"
                            type="number"
                            id={rowData.itemCode}
                            onClick={(e) => changeTextBoxValue(rowIndex)}
                            onKeyPress={(e: any) =>
                              handleKeyPressSel(e, rowIndex, e.target.value)
                            }
                          />
                        </div>
                        {/* <div>{rowData.sellingPriceAfterDiscountTemp}</div> */}
                        <div>{rowData.sellingPriceAfterDiscount}</div>
                      </div>
                    )}
                  </td>
                  {/* Lower Bound */}
                  <td>
                    {rowData.quantity == 0
                      ? ""
                      : localCurrency.format(rowData.lowerBound)}
                  </td>
                  {/* tax code */}
                  <td>{rowData.taxCode}</td>
                  {/* Tax rate */}
                  <td>{rowData.taxCodePercentage}%</td>
                  {/* Tax Amount */}
                  <td>
                    {rowData.quantity == 0
                      ? ""
                      : localCurrency.format(rowData.taxAmount)}
                  </td>
                  {/* Below Volume Discount Price */}
                  <td
                    className={
                      rowData.belVolDisPrice == 0 // i change it from "Y" and then swap the color
                        ? "bg-green-200"
                        : "bg-red-200 "
                    }
                  >
                    {rowData.quantity == 0 ? "" : rowData.belVolDisPrice}
                  </td>
                  {/* Cost */}
                  <td>{Math.floor(rowData.cost).toFixed(2)}</td>
                  {/* Below Cost */}
                  <td
                    className={
                      rowData.belCost == "Y" ? "bg-red-200" : "bg-green-200"
                    }
                  >
                    {rowData.belCost}
                  </td>
                  {/* Mode Of Releasing */}
                  <td>
                    {rowData.quantity == 0 ? (
                      ""
                    ) : (
                      <div className="flex gap-3 justify-end">
                        <div>{rowData.modeOfReleasing}</div>
                        <div className="text-right">
                          <button
                            onClick={() => openModRelTable(rowIndex)}
                            className="bg-[#F0AB00] pr-1 pl-1"
                          >
                            =
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                  {/* -------------- Tracker --------------- */}
                  <td>
                    {rowData.quantity == 0 ? (
                      ""
                    ) : (
                      <div className="flex gap-3 justify-end">
                        <div>{rowData.truckPanelORDropShip}</div>
                        <div className="text-right">
                          <button
                            onClick={() => openTruckerTable(rowIndex)}
                            className="bg-[#F0AB00] pr-1 pl-1"
                          >
                            =
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                  {/* ---------------------------------------- */}
                  {/* -------------- Pick Up Location --------------- */}
                  <td>
                    {rowData.quantity == 0 ? (
                      ""
                    ) : (
                      <div className="flex gap-3 justify-end">
                        <div>{rowData.pickUpLocation}</div>
                        <div className="text-right">
                          <button
                            onClick={() => openPickUpLocation(rowIndex)}
                            className="bg-[#F0AB00] pr-1 pl-1"
                          >
                            =
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                  {/* ---------------------------------------- */}
                  {/* SC/PWD Discount */}
                  <td
                    className={
                      rowData.scPwdDiscount == "N"
                        ? "bg-red-200"
                        : "bg-green-200"
                    }
                  >
                    {rowData.scPwdDiscount}
                  </td>
                  {/* Gross Total */}
                  <td>
                    {rowData.quantity == 0
                      ? ""
                      : localCurrency.format(rowData.grossTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {openItemTablePanel && (
          <Draggable>
            <div
              className="fields h-[500px] overflow-x-auto bg-white shadow-lg"
              style={{
                border: "1px solid #ccc",
                position: "absolute",
                width: "80%",
                top: "10%",
                left: "10%",
              }}
            >
              <div
                className="grid grid-cols-2 p-2 text-left windowheader"
                style={{ cursor: "move" }}
              >
                <div>Item List</div>
                <div className="text-right">
                  <span onClick={openItemTable} className="cursor-pointer">
                    ❌
                  </span>
                </div>
              </div>
              <div className="p-2">
                <div className="content">
                  <div>
                    Search:{" "}
                    <input
                      type="text"
                      className="mb-1"
                      value={searchTerm}
                      onChange={handleSearchItem}
                    />
                  </div>
                  <table>
                    <thead className="tables">
                      <tr>
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th>Item Price</th>
                        <th>Availability</th>
                        <th>UOM</th>
                        <th>Num In Sale</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDataItem.map((item: any, index) => (
                        // eslint-disable-next-line react/jsx-key
                        <tr className="trcus cursor-pointer">
                          <td
                            className="tdcus"
                            key={index}
                            onClick={() => handleItemClick(item)}
                          >
                            {item.ItemCode}
                          </td>
                          <td
                            className="tdcus"
                            key={index}
                            onClick={() => handleItemClick(item)}
                          >
                            {item.ItemName}
                          </td>
                          <td
                            className="tdcus"
                            key={index}
                            onClick={() => handleItemClick(item)}
                          >
                            {localCurrency.format(item.SRP)}
                          </td>
                          <td
                            className="tdcus"
                            key={index}
                            onClick={() => handleItemClick(item)}
                          >
                            {item.Availability}
                          </td>
                          <td
                            className="tdcus"
                            key={index}
                            onClick={() => handleItemClick(item)}
                          >
                            {item.UomCode}
                          </td>
                          <td
                            className="tdcus"
                            key={index}
                            onClick={() => handleItemClick(item)}
                          >
                            {item.NumInSale}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Draggable>
        )}

        {openOUMPanel && (
          <Draggable>
            <div
              className="fields overflow-x-auto bg-white shadow-lg"
              style={{
                border: "1px solid #ccc",
                position: "absolute",
                top: "45%",
                left: "35%",
              }}
            >
              <div
                className="grid grid-cols-2 p-2 text-left windowheader"
                style={{ cursor: "move" }}
              >
                <div>Select OUM</div>
                <div className="text-right">
                  <span onClick={openOUMTable} className="cursor-pointer">
                    ❌
                  </span>
                </div>
              </div>
              <div className="p-2">
                <div className="content">
                  <div>
                    <table>
                      <thead className="tables">
                        <tr>
                          <th>UOM</th>
                          <th>Conversion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {UOMList.map((e: any, rowIndex: any) => (
                          // eslint-disable-next-line react/jsx-key
                          <tr className="trcus cursor-pointer">
                            <td
                              className="tdcus cursor-pointer"
                              onClick={() =>
                                handleUOM(rowIndex, e.BaseQty, e.UomCode)
                              }
                            >
                              {e.UomCode}
                            </td>
                            <td
                              className="tdcus cursor-pointer"
                              onClick={() =>
                                handleUOM(rowIndex, e.BaseQty, e.UomCode)
                              }
                            >
                              {e.BaseQty}
                            </td>
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

        {/* Open Mode Of Releasing */}
        {openModRelTablePanel && (
          <Draggable>
            <div
              className="fields overflow-x-auto bg-white shadow-lg"
              style={{
                border: "1px solid #ccc",
                position: "absolute",
                top: "40%",
                left: "65%",
              }}
            >
              <div
                className="grid grid-cols-2 p-2 text-left windowheader"
                style={{ cursor: "move" }}
              >
                <div>Mode of Releasing</div>
                <div className="text-right">
                  <span onClick={openModRelTable} className="cursor-pointer">
                    ❌
                  </span>
                </div>
              </div>
              <div className="p-2">
                <div className="content">
                  <table>
                    <thead className="tables">
                      <tr>
                        <th>Mode Of Releasing</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <select
                            name=""
                            className="w-full p-2"
                            onChange={(e) => changeManualModRel(e.target.value)}
                          >
                            <option value="" disabled selected>
                              Please Select
                            </option>
                            <option value="Standard-Pick-up">
                              Standard-Pick-up
                            </option>
                            <option value="Standard-Delivery">
                              Standard-Delivery
                            </option>
                            <option value="Standard-Pick-up to Other Store">
                              Standard-Pick-up to Other Store
                            </option>
                            <option value="Back Order-Pick-up">
                              Back Order-Pick-up
                            </option>
                            <option value="Back Order-Delivery">
                              Back Order-Delivery
                            </option>
                            <option value="Back Order-Pick-up to Other Store">
                              Back Order-Pick-up to Other Store
                            </option>
                            <option value="Drop-Ship-Pick-up to DC">
                              Drop-Ship-Pick-up to DC
                            </option>
                            <option value="Drop-Ship-Pick-up to Vendor">
                              Drop-Ship-Pick-up to Vendor
                            </option>
                            <option value="Drop-Ship-Delivery from DC">
                              Drop-Ship-Delivery from DC
                            </option>
                            <option value="Drop-Ship-Delivery from Vendor">
                              Drop-Ship-Delivery from Vendor
                            </option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Draggable>
        )}

        {/* Open Trucker Table */}
        {openTruckPanel && (
          <Draggable>
            <div
              className="fields overflow-x-auto bg-white shadow-lg"
              style={{
                border: "1px solid #ccc",
                position: "absolute",
                top: "40%",
                left: "65%",
              }}
            >
              <div
                className="grid grid-cols-2 p-2 text-left windowheader"
                style={{ cursor: "move" }}
              >
                <div>Trucker for Dropship/Back-order</div>
                <div className="text-right">
                  <span onClick={openTruckerTable} className="cursor-pointer">
                    ❌
                  </span>
                </div>
              </div>
              <div className="p-2">
                <div className="content">
                  <table>
                    <thead className="tables">
                      <tr>
                        <th>Trucker for Dropship/Back-order</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <select
                            name=""
                            className="w-full p-2"
                            onChange={(e) =>
                              changeManualTruckPanel(e.target.value)
                            }
                          >
                            <option value="" disabled selected>
                              Please Select
                            </option>
                            <option value="Customer">Customer</option>
                            <option value="Store">Store</option>
                            <option value="Vendor">Vendor</option>
                            <option value="N/A">N/A</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Draggable>
        )}

        {/* Open Pick Up Location Panel */}
        {openPickUpLocations && (
          <Draggable>
            <div
              className="fields overflow-x-auto bg-white shadow-lg"
              style={{
                border: "1px solid #ccc",
                position: "absolute",
                top: "40%",
                left: "65%",
              }}
            >
              <div
                className="grid grid-cols-2 p-2 text-left windowheader"
                style={{ cursor: "move" }}
              >
                <div>Pick Up Location</div>
                <div className="text-right">
                  <span onClick={openPickUpLocation} className="cursor-pointer">
                    ❌
                  </span>
                </div>
              </div>
              <div className="p-2">
                <div className="content">
                  <table>
                    <thead className="tables">
                      <tr>
                        <th>Pick Up Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <select
                            name=""
                            className="w-full p-2"
                            onChange={(e) =>
                              changeManualPickUpLocation(e.target.value)
                            }
                          >
                            <option value="" disabled selected>
                              Please Select
                            </option>
                            <option value="SA">Selling Area</option>
                            <option value="Storage">Storage</option>
                            <option value="Whse">Wharehouse</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Draggable>
        )}

        {/* Open Location Panel */}
        {openLocationPanel && (
          <Draggable>
            <div
              className="fields overflow-x-auto bg-white shadow-lg"
              style={{
                border: "1px solid #ccc",
                position: "absolute",
                top: "40%",
                left: "20%",
                height: "300px",
              }}
            >
              <div
                className="grid grid-cols-2 p-2 text-left windowheader"
                style={{ cursor: "move" }}
              >
                <div>Warehouse</div>
                <div className="text-right">
                  <span onClick={openLocationTable} className="cursor-pointer">
                    ❌
                  </span>
                </div>
              </div>
              <div className="p-2">
                <div className="content">
                  <div>
                    <div className="mb-2 text-[13px] flex gap-5">
                      <div>
                        Item Code:{" "}
                        <span className="underline">{itemcodewh}</span>
                      </div>
                      <div>
                        Item Name:{" "}
                        <span className="underline">{itemnamews}</span>
                      </div>
                      <div>
                        UOM: <span className="underline">{itemuomws}</span>
                      </div>
                    </div>
                    <table>
                      <thead className="tables">
                        <tr>
                          <th>Warehouse Code</th>
                          <th>Warehouse Name</th>
                          <th>Availability</th>
                          <th>On-hand</th>
                          <th>Commited</th>
                        </tr>
                      </thead>
                      <tbody>
                        {WareHouseList.map((item: any, index) => (
                          // eslint-disable-next-line react/jsx-key
                          <tr>
                            <td
                              className="tdcus"
                              key={index}
                              onClick={(e) =>
                                handleWarehoueChange(index, item.WhsCode)
                              }
                            >
                              {item.WhsCode}
                            </td>
                            <td
                              className="tdcus"
                              key={index}
                              onClick={(e) =>
                                handleWarehoueChange(index, item.WhsCode)
                              }
                            >
                              {item.WhsName}
                            </td>
                            <td
                              className="tdcus"
                              key={index}
                              onClick={(e) =>
                                handleWarehoueChange(index, item.WhsCode)
                              }
                            >
                              {item.Availability}
                            </td>
                            <td
                              className="tdcus"
                              key={index}
                              onClick={(e) =>
                                handleWarehoueChange(index, item.WhsCode)
                              }
                            >
                              {item.OnHand}
                            </td>
                            <td
                              className="tdcus"
                              key={index}
                              onClick={(e) =>
                                handleWarehoueChange(index, item.WhsCode)
                              }
                            >
                              {item.Committed}
                            </td>
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
      </div>
      {/* ----------------------------------------------------- End of Table ----------------------------------------------- */}

      <div className="text-left ml-2">
        {cardCodedata != "" && (
          <button
            onClick={handleAddRow}
            className="p-1 mt-2 mb-1 text-[12px] bg-[#F4D674]"
          >
            <span>+</span> Add Row
          </button>
        )}
      </div>

      {/* --------------------------------------------------- Bottom Form-------------------------------------------------------- */}
      <div className="text-left p-2 grid grid-cols-2 col1 text-[14px] mt-5">
        <div className="w-[300px] ">
          <div className="grid grid-cols-2">
            {/* ------------------------ Mode of Payment! ------------------------- */}
            <label htmlFor="modeofpayment">Mode of Payment:</label>
            <div className="">
              <div className="flex justify-start gap-2 w-[100px]">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedCash}
                  onChange={handCash}
                  disabled={ccstatus}
                />
                Cash
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedCreditCard}
                  onChange={handleCreditCard}
                  disabled={ccstatus}
                />
                Credit Card
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedDebit}
                  onChange={handleDebit}
                  disabled={ccstatus}
                />
                Debit Card
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedPDC}
                  onChange={handlePDC}
                  disabled={ccstatus}
                />
                PDC
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedPO}
                  onChange={handlePO}
                  disabled={ccstatus}
                />
                PO
              </div>
              <div className="flex justify-start gap-2 w-[200px]">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedDatedCheck}
                  onChange={handleDatedCheck}
                  disabled={ccstatus}
                />
                Dated Check
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedOnlineTransfer}
                  onChange={handlOnlineTransfer}
                  disabled={ccstatus}
                />
                Online Transfer
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedOnAccount}
                  onChange={handleOnAccount}
                  disabled={ccstatus}
                />
                On Account
              </div>
              <div className="flex justify-start gap-2">
                <input
                  className="w-[20px]"
                  type="checkbox"
                  checked={isCheckedCashOnDel}
                  onChange={handleCashOnDel}
                  disabled={ccstatus}
                />
                Cash on Delivery
              </div>
            </div>
          </div>
          {/* End of mode of payment */}

          <div className="grid grid-cols-2">
            <label htmlFor="moderel">Mode of Releasing</label>
            <div>
              <select
                className="selections"
                onChange={(e) => modeReleasing(e.target.value)}
                name=""
                id=""
              >
                <option value="" disabled selected>
                  Please Select
                </option>
                <option value="Standard-Pick-up">Standard-Pick-up</option>
                <option value="Standard-Delivery">Standard-Delivery</option>
                <option value="Standard-Pick-up to Other Store">
                  Standard-Pick-up to Other Store
                </option>
                <option value="Back Order-Pick-up">Back Order-Pick-up</option>
                <option value="Back Order-Delivery">Back Order-Delivery</option>
                <option value="Back Order-Pick-up to Other Store">
                  Back Order-Pick-up to Other Store
                </option>
                <option value="Drop-Ship-Pick-up to DC">
                  Drop-Ship-Pick-up to DC
                </option>
                <option value="Drop-Ship-Pick-up to Vendor">
                  Drop-Ship-Pick-up to Vendor
                </option>
                <option value="Drop-Ship-Delivery from DC">
                  Drop-Ship-Delivery from DC
                </option>
                <option value="Drop-Ship-Delivery from Vendor">
                  Drop-Ship-Delivery from Vendor
                </option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="salescrew">Sales Crew</label>
            <div>
              <select
                className="selections"
                onChange={(e) => addSalesCrews(e.target.value)}
                value={selectedSalesCrew}
                id="salescrew"
              >
                <option value="">Select a Sales Crew</option>
                {salesCrew.map((crew: any, index: any) => (
                  <option key={index} value={crew.SlpName}>
                    {crew.SlpName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="remarks">Remarks</label>
            <div>
              <textarea
                name="remarks"
                id="remarks"
                onChange={handleRemarksChange}
                value={remarksField}
              ></textarea>
            </div>
          </div>
        </div>

        {/* ----------------------------- Calculation ------------------------- */}
        <div className="text-right w-full grid justify-end">
          <div className="w-[440px] ">
            <div className="grid grid-cols-2 text-right">
              <label htmlFor="totAmountBefVat" className="text-right">
                Total Amount Before VAT
              </label>
              <div>
                <input value={totalAfterVat} type="text" readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="totalVat">Total VAT</label>
              <div>
                <input value={totalVat} type="text" readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="totalAftVat">Total After VAT</label>
              <div>
                <input value={totalBeforeVat} type="text" readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="PwdDisTotal">SC/PWD Discount Total</label>
              <div>
                <input value={SCPWDdata} type="text" readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="totAmtDue">Total Amount Due</label>
              <div>
                <input value={totalAmoutDueData} type="text" readOnly />
              </div>
            </div>
          </div>
        </div>
        {/* ----------------------------- End Calculation ------------------------- */}
      </div>
      <div className="grid grid-cols-2">
        <div className="p-2 flex justify-start">
          <div className="flex space-x-2">
            <div>
              {isSaved ? (
                // Show the "Update" button when the form is saved
                <button
                  className={`p-2 mt-2 mb-1 text-[12px] ${
                    isDocNumberGreaterThanZero
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-[#F4D674] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600"
                  } rounded w-24`}
                  onClick={handleUpdate}
                  disabled={isDocNumberGreaterThanZero}
                >
                  Update draft
                </button>
              ) : (
                // Show the "Save as draft" button when the form is not saved
                <button
                  className={`p-2 mt-2 mb-1 text-[12px] ${
                    isDocNumberGreaterThanZero
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-[#F4D674] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600"
                  } rounded w-24`}
                  onClick={handleSubmit}
                  disabled={isDocNumberGreaterThanZero}
                >
                  Save as draft
                </button>
              )}
            </div>

            <div>
              {isCommited ? (
                <button
                  className={`p-2 mt-2 mb-1 mr-2 text-[12px] ${
                    isDocNumberGreaterThanZero
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-[#F4D674] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600"
                  } rounded w-24`}
                  onClick={handleSaveCommit}
                  disabled={isDocNumberGreaterThanZero}
                >
                  Commit
                </button>
              ) : (
                // display a sweet alert
                <button
                  className={`p-2 mt-2 mb-1 mr-2 text-[12px] ${
                    isDocNumberGreaterThanZero
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-[#F4D674] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600"
                  } rounded w-24`}
                  onClick={swalCommit}
                  disabled={isDocNumberGreaterThanZero}
                >
                  Commit
                </button>
              )}
            </div>

            {/* ------------------------------------------- Print Button ------------------------------------------ */}
            <div>
              <button
                className={`p-2 mt-2 mb-1 mr-2 text-[12px] ${
                  printButtonDisabled
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-[#F4D674] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600"
                } rounded w-24`}
                disabled={printButtonDisabled}
                onClick={PrintReceipt}
              >
                Print
              </button>
            </div>

            <div>
              <button
                className="p-2 mt-2 mb-1 mr-2 text-[12px] bg-[#F4D674] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600 rounded w-24"
                onClick={consoleLog}
              >
                Trial
              </button>
            </div>

            {/* ------------------------------------------ Search Button ---------------------------------------------- */}
            <div>
              <button
                className="p-2 mt-2 mb-1 mr-2 text-[12px] bg-[#F4D674] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600 rounded w-24"
                onClick={handleShowSearchHeader}
              >
                Search
              </button>
              {showSearchHeader && (
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
                    }}
                  >
                    <div
                      className="grid grid-cols-2 p-2 text-left windowheader"
                      style={{ cursor: "move" }}
                    >
                      <div>Search</div>
                      <div className="text-right">
                        <span
                          onClick={handleShowSearchHeader}
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
                            Search:{" "}
                            <input
                              type="text"
                              className="mb-1"
                              value={searchTerm}
                              onChange={handleSearchForDraft}
                            />
                          </div>
                          <div className="flex-grow"></div>
                          <div className="flex items-center">
                            <label htmlFor="fromDate" className="mr-2">
                              Filter By Date:
                            </label>
                            <input
                              id="fromDate"
                              type="date"
                              className="w-24 md:w-32 px-2 py-1 border rounded"
                              onChange={(e) => setFromDate(e.target.value)}
                            />
                            <p>:&nbsp;</p>
                            <button
                              className="p-1 mt-2 mb-1 mr-2 text-xs bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600 rounded w-24"
                              onClick={handleFilter}
                            >
                              Filter
                            </button>
                          </div>
                        </div>

                        <div className="table-container">
                          <table className="w-full">
                            <thead className="tables">
                              <tr>
                                <th>Draft Number</th>
                                <th>Customer Code</th>
                                <th>Customer Name</th>
                                <th>Walk-in Customer Name</th>
                                <th>Document Date</th>
                                <th>Sales Crew</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredSaveDraftData.map(
                                (customer: any, rowIndex) => (
                                  <tr key={rowIndex}>
                                    <td
                                      className="tdcus"
                                      onClick={() =>
                                        addDraftData(
                                          customer.DraftNum,
                                          customer.CustomerCode,
                                          customer.CustomerName,
                                          customer.WalkInName,
                                          customer.DocDate,
                                          customer.CreatedBy
                                        )
                                      }
                                    >
                                      {customer.DraftNum}
                                    </td>
                                    <td
                                      className="tdcus"
                                      onClick={() =>
                                        addDraftData(
                                          customer.DraftNum,
                                          customer.CustomerCode,
                                          customer.CustomerName,
                                          customer.WalkInName,
                                          customer.DocDate,
                                          customer.CreatedBy
                                        )
                                      }
                                    >
                                      {customer.CustomerCode}
                                    </td>
                                    <td
                                      className="tdcus"
                                      onClick={() =>
                                        addDraftData(
                                          customer.DraftNum,
                                          customer.CustomerCode,
                                          customer.CustomerName,
                                          customer.WalkInName,
                                          customer.DocDate,
                                          customer.CreatedBy
                                        )
                                      }
                                    >
                                      {customer.CustomerName}
                                    </td>
                                    <td
                                      className="tdcus"
                                      onClick={() =>
                                        addDraftData(
                                          customer.DraftNum,
                                          customer.CustomerCode,
                                          customer.CustomerName,
                                          customer.WalkInName,
                                          customer.DocDate,
                                          customer.CreatedBy
                                        )
                                      }
                                    >
                                      {customer.WalkInName}
                                    </td>
                                    <td
                                      className="tdcus"
                                      onClick={() =>
                                        addDraftData(
                                          customer.DraftNum,
                                          customer.CustomerCode,
                                          customer.CustomerName,
                                          customer.WalkInName,
                                          customer.DocDate,
                                          customer.CreatedBy
                                        )
                                      }
                                    >
                                      {customer.DocDate}
                                    </td>
                                    <td
                                      className="tdcus"
                                      onClick={() =>
                                        addDraftData(
                                          customer.DraftNum,
                                          customer.CustomerCode,
                                          customer.CustomerName,
                                          customer.WalkInName,
                                          customer.DocDate,
                                          customer.CreatedBy
                                        )
                                      }
                                    >
                                      {customer.CreatedBy}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </Draggable>
              )}
            </div>

            {/* End of Search Button */}
          </div>
        </div>
        <div className="p-2 flex justify-end"></div>
      </div>
    </>
  );
}
