"use client";

import React, { use, useEffect, useState } from "react";
import Draggable from "react-draggable";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useRef } from "react";
import Swal from "sweetalert2";

export default function SalesOrder() {
  // const inputRef = useRef(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [customerList, setCustomerDataList] = useState([]);
  const [itemList, setItemDataList] = useState([]);
  const [UOMList, setUOMList] = useState([]);
  const [UOMListIndex, setUOMListIndex] = useState([]);
  const [WareHouseList, setWareHouseList] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const [cardCodedata, setcardCodedata] = useState("");
  const [taxCodeData, settaxCodeData] = useState([]);
  const [taxRateData, settaxRateData] = useState([]);
  const [lowerBoundData, setLowerBoundData] = useState("");

  const [itemcodewh, setitemcodewh] = useState("");
  const [itemnamews, setitemnamews] = useState("");
  const [itemuomws, setitemuomws] = useState("");

  const [showWindow, setShowWindow] = useState(false);
  const [showDoc, setShowDoc] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);

  const [openItemTablePanel, setOpenItemTablePanel] = useState(false);
  const [openOUMPanel, setOpenOUMPanel] = useState(false);
  const [openModRelTablePanel, setOpenModRelTablePanel] = useState(false);
  const [openLocationPanel, setOpenLocationPanel] = useState(false);
  const [showItems, setShowItems] = useState(false);

  const [sellingPriceAfterDiscountData, setSellingPriceAfterDis] = useState(0);

  const [totalAfterVat, settotalAfterVat] = useState("");
  const [totalBeforeVat, setTotalBeforeVat] = useState("");
  const [totalVat, setTotalVat] = useState("");
  const [showSCPDW, setShowSCPWD] = useState(false);
  const [varSCPWDdisc, setVarSCPWDdisc] = useState(0);
  const [SCPWDdata, setSCPWDdata] = useState("0");
  const [totalAmoutDueData, settotalAmoutDueData] = useState("0");

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

  // -------------------------------------- Insertion --------------------------------------
  const [walkInCustomer, setWalkingCustomer] = useState("");
  const [customerReference, setCustomerReference] = useState("");
  const [remarksField, setRemarksField] = useState("");
  const [scOrPwdField, setScOrPwdField] = useState("");
  const [draftNumber, setDraftNumber] = useState(null);
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
    DraftNum: "", // no value on backend
    EntryNum: "",
    DocNum: "",
    // Cutomer
    CustomerCode: "",
    CustomerName: "",
    ForeignName: "", // no value on backend
    WalkInName: "",
    ShippingAdd: "",
    TIN: "",
    Reference: "",
    // ReadOnly
    Branch: "",
    DocStat: "",
    BaseDoc: "",
    DocDate: manilaDate,
    PostingDate: manilaDate,
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
    TotalTax: "",
    TotalAmtAftTax: "",
    SCPWDDiscTotal: "",
    TotalAmtDue: "",
    Remarks: "",
    CreatedBy: "Administrator",
    DateCreated: manilaDate,
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

  const showAlert = () => {
    Swal.fire({
      text: "Successfully saved to draft",
      icon: "success",
    }).then(() => {
      // Reload the window after the user clicks "OK"
      window.location.reload();
    });
  };

  const sendDataToAPI = () => {
    const apiUrl = "http://localhost:5000/api/v1/ots";
    axios
      .post(apiUrl, formData)
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        showAlert();
        draftNumIncrementAPI();
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

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

  // Fetched DraftNumber
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/draftNumber")
      .then((res) => {
        const draftNumber = res.data.draftNumber;

        // Update DraftNum in the formData state
        setFormData((prevFormData) => ({
          ...prevFormData,
          DraftNum: draftNumber.toString(),
        }));

        // Update DraftNumber in a separate state
        setDraftNumber(draftNumber);
      })
      .catch((err) => console.log(err));
  }, []);

  // Post Increment Draft Number
  const draftNumIncrementAPI = () => {
    const apiUrl = "http://localhost:5000/api/v1/draftNumber";
    axios.post(apiUrl);
  };

  // -------------------------------------- End of insertion --------------------------------------

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

  const [tableData, setTableData] = useState([
    {
      itemCode: "",
      itemName: "",
      quantity: 0,
      uom: "",
      uomConversion: "",
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
      belVolDisPrice: "N",
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
    },
  ]);

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
    } catch (e) {}
  };

  const onAddHeaderTaxCode = async (cardCodex: any, whseCodex: any) => {
    const taxcode = await axios.get(
      `${fetchAPI}/tax-code/${cardCodex}/${whseCodex}`
    );
    console.log("Tax Code", taxcode.data);
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
        itemCode: "",
        itemName: "",
        quantity: 0,
        uom: "",
        uomConversion: "",
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
        belVolDisPrice: "N",
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
      },
    ]);

    setmodeOfrelisingArr((prevData) => [
      ...prevData,
      {
        itemCode: "",
        modeReleasing: "",
      },
    ]);

    console.log("Add setmodeOfrelisingArr", modeOfrelisingArr);

    onAddHeader();
    onAddheaderItems();
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

  // ---------------------------------------- IMPORTANT! --------------------------
  // add customer data in fields
  const addCustomerData = (
    id: any,
    name: any,
    fname: any,
    address: any,
    tin: any
  ) => {
    onAddHeaderTaxCode(id, "GSCNAPGS");

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

    setFormData({
      ...formData,
      CustomerCode: id,
      CustomerName: name,
      ForeignName: fname,
      ShippingAdd: address,
      TIN: tin,
    });

    console.log(customerData2);
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

    console.log("new mode afterdelete", modeOfrelisingArr);
  };

  const handleShowDoc = () => {
    setShowDoc(!showDoc);
  };

  const handleShowCustomer = () => {
    setShowCustomer(!showCustomer);
    onAddHeader();

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
        // wmr update
        // updatedTableData[i]["sellingPriceBeforeDiscount"] *
        //   parseInt(updatedTableData[i]["quantity"]);
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

    setTotalBeforeVat(calculationAfterVat); //total after vat
    settotalAfterVat(calculationBeforeVat); //Total Amount Before VAT
    setTotalVat(calculationTotalVat); //Total VAT
    setSCPWDdata(calculationForScORPwd); //SC/PWD Discount Total
    settotalAmoutDueData(calculationTotalAmoutDue);
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

      console.log(updateQuantityData, "qdata");

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
      // const disPriceBefDis =
      //   updatedTableData[selectedRowIndex]["sellingPriceBeforeDiscount"];

      let SCDiscount = "";

      const scdiscount = await axios.get(
        `${fetchAPI}/sc-discount/${cardCodedata}/${item.ItemCode}`
      );
      SCDiscount = scdiscount.data[0]["SCDiscount"];
      console.log("Damns", scdiscount.data[0]["SCDiscount"]);
      console.log(scdiscount.data, "hehe");

      updatedTableData[selectedRowIndex] = {
        ...updatedTableData[selectedRowIndex],
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
  };

  const changeTextBoxValue = (rowIndex: any) => {
    let sellingAfDis = document.getElementById("sellingAfDis");

    const updatedTableData = [...tableData];
    const item = updatedTableData[rowIndex];

    const sellingAfterDis = item.sellingPriceAfterDiscount;

    const itemCodeID = item.itemCode;

    let idUOM = document.getElementById(itemCodeID);

    // wmr change
    // idUOM?.setAttribute("value", sellingAfterDis);
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

      //wmr change
      // if (parseFloat(sellingAfterDis) < item.cost) {
      if (parseFloat(sellingAfterDis.toString()) < item.cost) {
        belCost = "Y";
      } else {
        belCost = "N";
      }

      console.log("enter", sellingAfterDis, item.cost, value);

      // wmr change
      // if (parseFloat(value) < parseFloat(sellingAfterDisTemp)) {
      if (parseFloat(value) < parseFloat(sellingAfterDisTemp.toString())) {
        console.log("Y");
        updatedTableData[rowIndex] = {
          ...item,
          grossTotal: value * item.quantity,
          belVolDisPrice: "Y",
          sellingPriceAfterDiscount: value,
          belCost: belCost,
        };

        setTableData(updatedTableData);
      } else {
        updatedTableData[rowIndex] = {
          ...item,
          grossTotal: value * item.quantity,
          belVolDisPrice: "N",
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

    console.log("QuantityNow: ", item);

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

      console.log("stocks", quantityXuomConversion);

      let unitprice = item.sellingPriceAfterDiscountTemp / (1 + 0.12);
      let taxAmountx = item.sellingPriceAfterDiscountTemp - unitprice;

      setTotalVat(taxAmountx.toString());
      // setTotalVat(taxAmountx); // wmr change

      console.log(
        "selPrice:",
        item.sellingPriceAfterDiscountTemp,
        "selprice/1.12:",
        unitprice,
        "taxamount:",
        taxAmountx
      );

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
    console.log(
      value,
      item.quantity,
      stocksAvailabilityArr[0]["StockAvailable"]
    );
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
    // quantityChange?.setAttribute("placeholder", 33); // it must be a 33 not a string
    quantityChange?.setAttribute("placeholder", "0"); // wmr change

    console.log(quantityChange);
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

    // console.log(moderel);

    // const item = updatedTableData[selectedRowIndex];

    // updatedTableData[selectedRowIndex] = {
    //   ...item,
    //   modeOfReleasing: moderel,
    // };

    // console.log(item);

    setTableData(updatedTableData);
    setOpenModRelTablePanel(!openModRelTablePanel);
  };

  const handleWarehoueChange = async (rowIndex: any, itemdata: any) => {
    const updatedTableData = [...tableData];
    const item = updatedTableData[selectedRowIndex];

    const quantityXuomConversion = item.quantity * item.uomConversion;

    const stocksAvailability = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/stocks-availability/0/${item.itemCode}/${itemdata}/${quantityXuomConversion}/${item.excludeBO}`
    );
    const stocksAvailabilityArr = stocksAvailability.data;

    console.log(stocksAvailabilityArr[0]["StockAvailable"]);

    updatedTableData[selectedRowIndex] = {
      ...item,
      location: itemdata,
      inventoryStatus: stocksAvailabilityArr[0]["StockAvailable"],
    };
    setTableData(updatedTableData);
  };

  // Payment section

  const handCash = async (event: any) => {
    setIsCheckedCash(event.target.checked);

    console.log(event.target.checked);

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

            console.log(
              i,
              disRateFor,
              item2.creditcard,
              item2.debit,
              item2.pdc,
              item2.po,
              "- Done CC"
            );

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

            console.log(
              i,
              disRateFor,
              item2.creditcard,
              item2.debit,
              item2.pdc,
              item2.po,
              "- Done CC"
            );

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

            console.log(
              i,
              disRateFor,
              item2.creditcard,
              item2.debit,
              item2.pdc,
              item2.po,
              "- Done Debit"
            );

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

            console.log(
              i,
              disRateFor,
              item2.creditcard,
              item2.debit,
              item2.pdc,
              item2.po,
              "- Done Debit"
            );

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

    console.log(event.target.checked);

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

    console.log(event.target.checked);

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

    console.log(event.target.checked);

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

    console.log(event.target.checked);

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

  const addSalesCrew = (salescrewx: any) => {
    const arrForsales = [...finalTotalList];

    arrForsales[0] = {
      ...arrForsales[0],
      salescrew: salescrewx,
    };

    setfinalTotalList(arrForsales);
  };

  type headerDetails = {
    DraftNum: number;
    EntryNum: string;
    DocNum: number;
    PostingDate: string;
    DocDate: string;
    CustomerCode: string;
    CustomerName: string;
    WalkInName: string;
    ShippingAdd: string;
    TIN: string;
    Reference: string;
    SCPWDIdNo: string;
    Branch: string;
    DocStat: string;
    BaseDoc: number;
    Cash: string;
    CreditCard: string;
    DebitCard: string;
    ODC: string;
    PDC: string;
    OnlineTransfer: string;
    OnAccount: string;
    COD: string;
    TotalAmtBefTax: number;
    TotalTax: number;
    TotalAmtAftTax: number;
    SCPWDDiscTotal: number;
    TotalAmtDue: number;
    Remarks: string;
    CreatedBy: number;
    DateCreated: string;
    UpdatedBy: number;
    DateUpdated: string;
  };

  // comit

  const commit = async () => {
    const headerFinal: headerDetails = {
      DraftNum: 0,
      EntryNum: "0",
      DocNum: 0,
      PostingDate: "",
      DocDate: "",
      CustomerCode: "02224113",
      CustomerName: "Dan",
      WalkInName: "WALK-IN",
      ShippingAdd: "General Santos City",
      TIN: "123-456-789",
      Reference: "02365",
      SCPWDIdNo: "123",
      Branch: "Gensan WOH",
      DocStat: "Active",
      BaseDoc: 0,
      Cash: "N",
      CreditCard: "N",
      DebitCard: "N",
      ODC: "N",
      PDC: "N",
      OnlineTransfer: "Y",
      OnAccount: "N",
      COD: "N",
      TotalAmtBefTax: 0,
      TotalTax: 10.5,
      TotalAmtAftTax: 110.5,
      SCPWDDiscTotal: 0,
      TotalAmtDue: 111.25,
      Remarks: "No Remarks",
      CreatedBy: 1,
      DateCreated: "",
      UpdatedBy: 1,
      DateUpdated: "",
    };

    const baseURL = "http://172.16.10.217:3002/so-header";
    // const baseUrl = "http://localhost:5000/api/v1/ots";

    axios
      .post(baseURL, {
        EntryNum: "0",
        DocNum: 0,
        PostingDate: "",
        DocDate: "",
        CustomerCode: "02224113",
        CustomerName: "Dan",
        WalkInName: "WALK-IN",
        ShippingAdd: "General Santos City",
        TIN: "123-456-789",
        Reference: "02365",
        SCPWDIdNo: "123",
        Branch: "Gensan WOH",
        DocStat: "Active",
        BaseDoc: 0,
        Cash: "N",
        CreditCard: "N",
        DebitCard: "N",
        ODC: "N",
        PDC: "N",
        OnlineTransfer: "Y",
        OnAccount: "N",
        COD: "N",
        TotalAmtBefTax: 0,
        TotalTax: 10.5,
        TotalAmtAftTax: 110.5,
        SCPWDDiscTotal: 0,
        TotalAmtDue: 111.25,
        Remarks: "No Remarks",
        CreatedBy: 1,
        DateCreated: "",
        UpdatedBy: 1,
        DateUpdated: "",
      })
      .then((response) => {
        console.log(response.data);
      });
  };

  // -------------------------------------------------------------------------------
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
              <label className="" htmlFor="entrynumber">
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
                <input type="text" onChange={handleWalkinCustomerChange} />
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
                <input type="text" onChange={handleCustomerChange} />
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
              <input value={0} type="text" />
            </div>

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
            <label htmlFor="documentnumber">Draft Number</label>
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
              <input type="text" readOnly />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="entrynumber">Document Date</label>
            <div>
              <input
                type="text"
                value={manilaDate}
                className="bg-slate-200"
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="entrynumber">Posting Date</label>
            <div>
              <input
                type="text"
                value={manilaDate}
                className="bg-slate-200"
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="entrynumber">Delivery Date</label>
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
                <th>SC/PWD Discount (Y/N)</th>
                <th>Gross Total</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((rowData, rowIndex) => (
                <tr className="trcus" key={rowIndex}>
                  <td>
                    <button
                      onClick={() =>
                        handleRemoveRow(rowIndex, rowData.itemCode)
                      }
                    >
                      <span className="text-md text-red-600">❌</span>
                    </button>
                  </td>
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
                  <td>{rowData.itemName}</td>

                  <td>
                    {/* {rowData.itemCode == 0 ? ( "WMR change"*/}
                    {rowData.itemCode == "0" ? (
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
                  <td>{rowData.uom == "" ? "" : rowData.uomConversion}</td>
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
                  <td>
                    <input
                      className=" border-l-white border-t-white border-r-white"
                      type="text"
                      placeholder="0"
                      // ref={inputRef}
                      onChange={(e) =>
                        handleQuantityChange(rowIndex, e.target.value)
                      }
                      id="quantityInput"
                      onClick={handleSelectAll}
                      // value={rowData.quantity}
                    />
                  </td>
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
                    {/* inventory status */}
                    {rowData.quantity == 0 ? "" : rowData.inventoryStatus}
                  </td>
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
                        <div>{rowData.sellingPriceAfterDiscountTemp}</div>
                      </div>
                    )}
                  </td>

                  <td>
                    {rowData.quantity == 0
                      ? ""
                      : localCurrency.format(rowData.lowerBound)}
                  </td>
                  <td>{rowData.taxCode}</td>
                  <td>{rowData.taxCodePercentage}%</td>
                  <td>
                    {rowData.quantity == 0
                      ? ""
                      : localCurrency.format(rowData.taxAmount)}
                  </td>
                  <td
                    className={
                      rowData.belVolDisPrice == "Y"
                        ? "bg-red-200 "
                        : "bg-green-200"
                    }
                  >
                    {rowData.quantity == 0 ? "" : rowData.belVolDisPrice}
                  </td>
                  <td>{Math.floor(rowData.cost).toFixed(2)}</td>
                  <td
                    className={
                      rowData.belCost == "Y" ? "bg-red-200" : "bg-green-200"
                    }
                  >
                    {rowData.belCost}
                  </td>
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
                  <td
                    className={
                      rowData.scPwdDiscount == "N"
                        ? "bg-red-200"
                        : "bg-green-200"
                    }
                  >
                    {rowData.scPwdDiscount}
                  </td>
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
                        <th>Item Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <select
                            name=""
                            className="w-full p-2"
                            onChange={(e) => changeManualModRel(e.target.value)}
                            id=""
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
            <label htmlFor="documentnumber">Mode of Payment:</label>
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
            <label htmlFor="documentnumber">Mode of Releasing</label>
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
            <label htmlFor="documentnumber">Sales Crew</label>
            <div>
              <select
                className="selections"
                onChange={(e) => addSalesCrew(e.target.value)}
                name=""
                id="salescrew"
              >
                <option value=""></option>
                <option value="Boss Mark">Boss Mark</option>
                <option value="Dan">Dan</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="documentnumber">Remarks</label>
            <div>
              <textarea
                name="remarks"
                id="remarks"
                // onChange={(e) => handleInputChange("Remarks", e.target.value)}
                onChange={handleRemarksChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* ----------------------------- Calculation ------------------------- */}
        <div className="text-right w-full grid justify-end">
          <div className="w-[440px] ">
            <div className="grid grid-cols-2 text-right">
              <label htmlFor="documentnumber" className="text-right">
                Total Amount Before VAT
              </label>
              <div>
                <input value={totalAfterVat} type="text" readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="documentnumber">Total VAT</label>
              <div>
                <input value={totalVat} type="text" readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="documentnumber">Total After VAT</label>
              <div>
                <input value={totalBeforeVat} type="text" readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="documentnumber">SC/PWD Discount Total</label>
              <div>
                <input value={SCPWDdata} type="text" readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="documentnumber">Total Amount Due</label>
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
          <button
            className="p-2 mt-2 mb-1 mr-2 text-[12px] bg-[#F4D674]"
            // onClick={handleSaveDraft}
            onClick={sendDataToAPI}
          >
            Save as draft
          </button>
          <button
            className="p-2 mt-2 mb-1 mr-2 text-[12px] bg-[#F4D674]"
            onClick={commit}
          >
            Commit
          </button>
        </div>
        <div className="p-2 flex justify-end"></div>
      </div>
    </>
  );
}
