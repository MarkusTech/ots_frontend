"use client";

import React, { use, useEffect, useState } from "react";
import Data from "../../Data/Data.json"; //dummy data
// import SalesQoutation from "../SalesQoutation/SalesQoutation";
// import { height } from "@fortawesome/free-brands-svg-icons/fa42Group";
import Draggable from "react-draggable";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useRef } from "react";
import { table } from "console";
import AddCustomerDataPage from "./ui/addCustomerData/addCustomerData";

export default function SalesOrder() {
  const inputRef = useRef(null);

  const [customerList, setCustomerDataList] = useState([]);
  const [itemList, setItemDataList] = useState([]);
  const [UOMList, setUOMList] = useState([]);
  const [UOMListIndex, setUOMListIndex] = useState([]);
  const [WareHouseList, setWareHouseList] = useState([]);
  // const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

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

  const warehouseCode = "GSCNAPGS";
  const brandID = 4;
  const priceListNum = 14;
  const user = "Administrator";

  const now = new Date();

  // const manilaDate = now.toLocaleDateString('en-US', { timeZone: 'Asia/Manila' });
  const manilaDate = now.toLocaleDateString("en-US", {
    timeZone: "Asia/Manila",
  });

  const [itemcodetextalign, setitemcodetextalign] = useState("");

  const [openItemTablePanel, setOpenItemTablePanel] = useState(false);
  const [openOUMPanel, setOpenOUMPanel] = useState(false);
  const [openModRelTablePanel, setOpenModRelTablePanel] = useState(false);
  const [openLocationPanel, setOpenLocationPanel] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [totalAfterVat, settotalAfterVat] = useState("");
  const [totalBeforeVat, setTotalBeforeVat] = useState("");
  const [totalVat, setTotalVat] = useState("");
  const [sellingPriceAfterDiscountData, setSellingPriceAfterDis] = useState(0);

  const [showSCPDW, setShowSCPWD] = useState(false);
  const [varSCPWDdisc, setVarSCPWDdisc] = useState(0);
  const [SCPWDdata, setSCPWDdata] = useState(0);
  const [totalAmoutDueData, settotalAmoutDueData] = useState(0);

  const [scpdwdID, setscpdwdID] = useState("");

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

  // All data table
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

  //for PWD
  useEffect(() => {
    if (cardCodedata == "C000112") {
      setShowSCPWD(true);
      setVarSCPWDdisc(0.05);
    } else {
      setShowSCPWD(false);
      setVarSCPWDdisc(0);
    }
  });

  //table for header
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

  //retrieval customer data
  const onAddHeader = async () => {
    const customers = await axios.get(`${process.env.NEXT_PUBLIC_IP}/customer`);
    setCustomerDataList(customers.data);
  };

  //retrieval items
  const onAddheaderItems = async () => {
    const item = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/item/${priceListNum}/${warehouseCode}/C000174`
    );
    setItemDataList(item.data);
  };

  //retrieval UOM item
  const onAddHeaderUOM = async (itemcode: any, rowIndex: any) => {
    const uom = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/uom/${itemcode}`
    );
    setUOMList(uom.data);
    setUOMListIndex(rowIndex);
  };

  //retrieval location warehouse
  const onAddHeaderWareHouse = async (itemcode: any, name: any, uom: any) => {
    try {
      const warehouse = await axios.get(
        `${process.env.NEXT_PUBLIC_IP}/warehouse-soh/${itemcode}/${name}/${brandID}`
      );
      setWareHouseList(warehouse.data);
    } catch (e) {}
  };

  //retrieval taxcode
  const onAddHeaderTaxCode = async (cardCodex: any, whseCodex: any) => {
    const taxcode = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/tax-code/${cardCodex}/${whseCodex}`
    );
    console.log("Tax Code", taxcode.data);
    settaxCodeData(taxcode.data);
  };

  //retrieval taxrate
  const onAddHeaderRateCode = async (taxcode: any) => {
    const taxrate = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/tax-rate/${taxcode}`
    );
    settaxRateData(taxrate.data);
  };

  //retrieval lowerbound
  const onAddLowerBound = async (
    bid: any,
    taxcodex: any,
    itemcodex: any,
    whscodex: any,
    indexNum: any,
    uomLoweBound: any
  ) => {
    const lowerbound = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/lowerbound/${bid}/${taxcodex}/${itemcodex}/${whscodex}/${uomLoweBound}`
    );

    let lowerBoundArr = lowerbound.data;

    setLowerBoundData(lowerBoundArr[indexNum]);
  };

  useEffect(() => {
    onAddHeader();
    onAddheaderItems();
  }, []);

  //input change
  const handleInputChange = (rowIndex: any, fieldName: any, value: any) => {
    const newData: any = [...tableData];
    newData[rowIndex][fieldName] = value;
    console.log(value);
  };

  //button to add row
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

  //trial function/data
  const [customerData, setCustomerData] = useState([
    {
      customerCode: "00000",
      customerName: "N/A",
      customerCardFName: "",
      cusShipAddress: "N/A",
      cusLicTradNum: "N/A",
    },
  ]);

  //function search for customer
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

  // -----------------------------------------------------------------------------------

  //function to insert customer data
  type TaxRate = {
    Rate: number; // Assuming 'Rate' is a number, adjust accordingly
    // Other properties if present
  };

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

    taxRateData.forEach((e: TaxRate) => {
      for (let i = 0; i < listArryLen; i++) {
        const item = updatedTableData[i];
        updatedTableData[i] = {
          ...item,
          taxCodePercentage: e.Rate,
        };
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

    console.log(customerData2);
    setShowCustomer(!showCustomer);
  };

  const toggleShowWindow = () => {
    setShowWindow(!showWindow);
  };

  //handle remove row
  const handleRemoveRow = (rowIndex: any, Itemcodex: any) => {
    countAllItem = countAllItem - 1;

    let emptyData = {
      itemCode: "",
      itemName: "",
      quantity: 0,
      uom: "",
      uomConversion: "",
      excludeBO: "N",
      location: "",
      price: 0,
      inventoryStatus: "",
      sellingPriceBeforeDiscount: "",
      discountRate: "",
      sellingPriceAfterDiscount: "",
      sellingPriceAfterDiscountTemp: 0,
      lowerBound: 0,
      taxCode: "",
      taxCodePercentage: 0,
      taxAmount: "",
      volDisPrice: 0,
      belVolDisPrice: "N",
      cost: 0,
      belCost: 0,
      modeOfReleasing: "",
      scPwdDiscount: "N",
      grossTotal: "",
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
    };

    const newData: any = [...tableData];
    const newData2: any = newData[rowIndex];
    const newData3: any = (newData[rowIndex] = emptyData);

    const latestTableDataArr = tableData;

    setTableData((prevData) =>
      prevData.filter((_, index) => index !== rowIndex)
    );
    setmodeOfrelisingArr((prevData) =>
      prevData.filter((_, index) => index !== rowIndex)
    );

    console.log("new mode afterdelete", modeOfrelisingArr);
  };

  //show hide panel
  const handleShowDoc = () => {
    setShowDoc(!showDoc);
  };

  //hide/show customer panel
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

  const openConsole = () => {
    console.log("open sample");
  };

  //function to calculate
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
          parseInt(updatedTableData[i]["quantity"]);
      tempSum2 = tempSum2 + updatedTableData[i]["grossTotal"];
      taxAmountSum = taxAmountSum + updatedTableData[i]["taxAmount"];
      setmodeOfrelisingArrx[i] = {
        ...setmodeOfrelisingArrx[i],
        itemCode: updatedTableData[i]["itemCode"],
        modeReleasing: updatedTableData[i]["modeOfReleasing"],
      };
      setmodeOfrelisingArr(setmodeOfrelisingArrx);
    }

    setTotalBeforeVat(localCurrency.format(tempSum2)); //total after vat
    settotalAfterVat(localCurrency.format(tempSum2 - taxAmountSum)); //Total Amount Before VAT
    setTotalVat(localCurrency.format(taxAmountSum)); //Total VAT
    setSCPWDdata(
      localCurrency.format((tempSum2 - taxAmountSum) * varSCPWDdisc)
    ); //SC/PWD Discount Total
    settotalAmoutDueData(
      localCurrency.format(tempSum2 - (tempSum2 - taxAmountSum) * varSCPWDdisc)
    );
  });

  //function summation
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

  //function to open item panel
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

  //open/hide UOM panel
  const openOUMTable = (rowIndex: any, itemCode: any) => {
    setOpenOUMPanel(!openOUMPanel);
    setSelectedRowIndex(rowIndex);
    setItemCodeForUOM(itemCode);
    onAddHeaderUOM(itemCode, rowIndex);
  };

  //open/hide branch/location panel
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

  //open/hide Mode of Releasing panel
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

  //function when you click an item
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
        `${process.env.NEXT_PUBLIC_IP}/lowerbound/${priceListNum}/${taxCodeDataNow}/${item.ItemCode}/${warehouseCode}/1`
      );
      const lowerboundArr = lowerbound.data;
      const lowerBoundFinalItem = lowerboundArr[0]["LowerBound"];
      const disPriceBefDis =
        updatedTableData[selectedRowIndex]["sellingPriceBeforeDiscount"];

      let SCDiscount = "";

      const scdiscount = await axios.get(
        `${process.env.NEXT_PUBLIC_IP}/sc-discount/${cardCodedata}/${item.ItemCode}`
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

      // const disPrice = await axios.get(`${process.env.NEXT_PUBLIC_IP}/discount-price/${brandID}/${disPriceBefDis}/${disCardCode}/${disItemCode}/${quantity}/${disUOM}/${disLowerBound}/N/N/N/N/${disTaxCode}`);

      const disCardCode = cardCodedata;
      const disItemCode = item.ItemCode;
      const disQuantity = updatedTableData[selectedRowIndex]["quantity"];
      const disUOM = updatedTableData[selectedRowIndex]["uom"];
      const disLowerBound = lowerBoundFinalItem;
      const disTaxCode = taxCodeDataNow;
    }
  };

  //function when you change the quantity value
  const changeTextBoxValue = (rowIndex: any) => {
    let sellingAfDis = document.getElementById("sellingAfDis");

    const updatedTableData = [...tableData];
    const item = updatedTableData[rowIndex];

    const sellingAfterDis = item.sellingPriceAfterDiscount;

    const itemCodeID = item.itemCode;

    let idUOM = document.getElementById(itemCodeID);

    idUOM?.setAttribute("value", sellingAfterDis);
  };

  //function when you change the quantity value
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

      if (parseFloat(sellingAfterDis) < item.cost) {
        belCost = "Y";
      } else {
        belCost = "N";
      }

      console.log("enter", sellingAfterDis, item.cost, value);

      if (parseFloat(value) < parseFloat(sellingAfterDisTemp)) {
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

  //function when you change the quantity value
  const handleSelectAll = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  //function when you change the quantity value
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

      setTotalVat(taxAmountx);

      console.log(taxAmountx, "hehe");

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

  //function for Exclude BO
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

  //function for Discount Rate Change
  const handleDiscountRateChange = (rowIndex: any, discountRates: any) => {
    const updatedTableData = [...tableData];
    const item = updatedTableData[rowIndex];

    const amount = (discountRates / 100) * item.sellingPriceBeforeDiscount;

    const finalAmount = item.sellingPriceBeforeDiscount - amount;

    updatedTableData[rowIndex] = {
      ...item,
      discountRate: discountRates,
      sellingPriceAfterDiscount: finalAmount,
      grossTotal: finalAmount * item.quantity,
    };
    setTableData(updatedTableData);
  };

  //function for currency
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
        (value) =>
          value !== null &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .slice(0, 50);

  //function handle UOM
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

    // let quantityInp = document.getElementById('quantityInput');
    // quantityInp?.setAttribute('values', "0")

    var quantityChange = document.getElementById("quantityInput");
    quantityChange?.setAttribute("placeholder", 33);

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

  //change manual mode of releasing
  const changeManualModRel = (moderel: any) => {
    // Ensure that selectedRowIndex is within valid bounds
    if (selectedRowIndex < 0 || selectedRowIndex >= tableData.length) {
      console.error("Invalid selectedRowIndex");
      return;
    }

    // Create a copy of the tableData array to avoid mutating the original state directly
    const updatedTableData = [...tableData];

    // Update the specified item with the new modeOfReleasing value
    const updatedItem = {
      ...updatedTableData[selectedRowIndex],
      modeOfReleasing: moderel,
    };

    // Update the tableData array with the modified item
    updatedTableData[selectedRowIndex] = updatedItem;

    // Set the updatedTableData to the state
    setTableData(updatedTableData);

    // Toggle the state of openModRelTablePanel
    setOpenModRelTablePanel(
      (prevOpenModRelTablePanel) => !prevOpenModRelTablePanel
    );
  };
  // END of change manual mode of releasing

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

  const [isCheckedCash, setIsCheckedCash] = useState(false);
  const [isCheckedCreditCard, setIsCheckedCreditCard] = useState(false);
  const [isCheckedDebit, setIsCheckedDebit] = useState(false);
  const [isCheckedPDC, setIsCheckedPDC] = useState(false);
  const [isCheckedPO, setIsCheckedPO] = useState(false);
  const [isCheckedDatedCheck, setIsCheckedDatedCheck] = useState(false);
  const [isCheckedOnlineTransfer, setIsCheckedOnlineTransfer] = useState(false);
  const [isCheckedOnAccount, setIsCheckedOnAccount] = useState(false);
  const [isCheckedCashOnDel, setIsCheckedCashOnDel] = useState(false);

  const [creditcardstatus, setcreditcardstatus] = useState("N");
  const [debitstatus, setdebitstatus] = useState("N");
  const [pdcstatus, setpdcstatus] = useState("N");
  const [postatus, setpostatus] = useState("N");

  const [ccstatus, setccstatus] = useState(false);

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

        // console.log(disPriceArr, "disarr")

        // console.log(item['creditcard'], item['debit'], item['pdc'], item['po'], "Mode")
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

        // console.log(disPriceArr, "disarr")

        // console.log(item['creditcard'], item['debit'], item['pdc'], item['po'], "Mode")
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

        setfinalTotalList(finalArr);

        // console.log(disPriceArr, "disarr")

        // console.log(item['creditcard'], item['debit'], item['pdc'], item['po'], "Mode")
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

        // console.log(disPriceArr, "disarr")

        // console.log(item['creditcard'], item['debit'], item['pdc'], item['po'], "Mode")
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

        // console.log(disPriceArr, "disarr")

        // console.log(item['creditcard'], item['debit'], item['pdc'], item['po'], "Mode")
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

        // console.log(disPriceArr, "disarr")

        // console.log(item['creditcard'], item['debit'], item['pdc'], item['po'], "Mode")
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

        // console.log(disPriceArr, "disarr")

        // console.log(item['creditcard'], item['debit'], item['pdc'], item['po'], "Mode")
      }
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

        // console.log(disPriceArr, "disarr")

        // console.log(item['creditcard'], item['debit'], item['pdc'], item['po'], "Mode")
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

  const [showMessage, setshowMessage] = useState(false);
  const [showMessage2, setshowMessage2] = useState(false);
  const [showMessage3, setshowMessage3] = useState(false);
  const [showMessage4, setshowMessage4] = useState(false);
  const [showMessage5, setshowMessage5] = useState(false);
  const [showMessage6, setshowMessage6] = useState(false);
  const [showMessage7, setshowMessage7] = useState(false);

  const [errMessage, seterrMessage] = useState("");
  const [errMessage2, seterrMessage2] = useState("");
  const [errMessage3, seterrMessage3] = useState("");
  const [errMessage4, seterrMessage4] = useState("");
  const [errMessage5, seterrMessage5] = useState("");
  const [errMessage6, seterrMessage6] = useState("");
  const [errMessage7, seterrMessage7] = useState("");

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

  // ------------------------------- IMPORTANT! --------------------------------------------------
  const handleSaveDraft = () => {
    const finalTotalListArr = [...finalTotalList];
    const arrList = finalTotalListArr[0];

    const allItemsArr = [...tableData];
    const allItemsArrLen = allItemsArr.length;

    let countAllreleasing = 0;

    console.log("mode of rel", finalTotalList);

    for (let i = 0; i < allItemsArrLen; i++) {
      console.log(allItemsArr[i]["modeOfReleasing"]);
      if (allItemsArr[i]["modeOfReleasing"] == "") {
      } else {
        countAllreleasing++;
      }
    }

    if (countAllreleasing == allItemsArrLen) {
      setshowMessage2(false);
    } else {
      setshowMessage2(true);
      seterrMessage2("Please make sure all products have mode of releasing");
      setTimeout(() => {
        setshowMessage2(false);
      }, 10000);
    }

    if (arrList.totalVal == 0) {
      setshowMessage(true);
      seterrMessage("Please add atleast 1 product");
      setTimeout(() => {
        setshowMessage(false);
      }, 10000);
    }

    let countStatusInventory = 0;

    for (let ii = 0; ii < allItemsArrLen; ii++) {
      if (allItemsArr[ii]["inventoryStatus"] == "Out of Stocks") {
        countStatusInventory++;
      }
    }

    if (countStatusInventory <= 0) {
      setshowMessage3(false);
    } else {
      setshowMessage3(true);
      seterrMessage3("Please make sure all products are available");
      setTimeout(() => {
        setshowMessage3(false);
      }, 10000);
    }

    handleModeOfPayment();
    handleTotal();
    handleSalesCrew();
    handleSCPWD();
    handleSCPWDStatus();
  };

  const handleSCPWDStatus = () => {
    const allItemsArr = [...tableData];
    const allItemsArrLen = allItemsArr.length;

    let statuscount = 0;

    for (let i = 0; i < allItemsArrLen; i++) {
      if (allItemsArr[i]["scPwdDiscount"] == "N") {
        statuscount = statuscount + 1;
      }
    }

    if (cardCodedata == "C000112") {
      if (statuscount > 0) {
        setshowMessage7(true);
        seterrMessage7("Some items are not applicable for discounting.");
        setTimeout(() => {
          setshowMessage7(false);
        }, 10000);
      } else {
        setshowMessage7(false);
      }
    }
  };

  const handleSCPWD = () => {
    if (cardCodedata == "C000112") {
      if (scpdwdID == "") {
        setshowMessage6(true);
        seterrMessage6("SC/PWD ID is empty");
        setTimeout(() => {
          setshowMessage6(false);
        }, 10000);
      } else {
        setshowMessage6(false);
        // seterrMessage6("SC/PWD ID is empty.")
      }
    }
  };

  const addSalesCrew = (salescrewx: any) => {
    const arrForsales = [...finalTotalList];

    arrForsales[0] = {
      ...arrForsales[0],
      salescrew: salescrewx,
    };

    setfinalTotalList(arrForsales);
  };

  const handleSalesCrew = () => {
    const arrForsales = [...finalTotalList];

    if (arrForsales[0]["salescrew"] == "") {
      setshowMessage5(true);
      seterrMessage5("Please select salescrew");
      setTimeout(() => {
        setshowMessage5(false);
      }, 10000);
    } else {
      setshowMessage5(false);
    }

    console.log(arrForsales[0]["salescrew"], "sales");
  };

  const handleTotal = () => {
    let tempSum = 0;
    let tempSum2 = 0;
    let taxAmountSum = 0;
    let salescrewfinal = "";

    const updatedTableData = [...tableData];

    let arrayLen = updatedTableData.length;

    const setmodeOfrelisingArrx = [...modeOfrelisingArr];

    for (let i = 0; i < arrayLen; i++) {
      tempSum =
        tempSum +
        updatedTableData[i]["sellingPriceBeforeDiscount"] *
          parseInt(updatedTableData[i]["quantity"]);
      tempSum2 = tempSum2 + updatedTableData[i]["grossTotal"];
      taxAmountSum = taxAmountSum + updatedTableData[i]["taxAmount"];
    }

    const updatefinalTotalList = [...finalTotalList];

    updatefinalTotalList[0] = {
      ...updatefinalTotalList[0],
      totalVal: taxAmountSum,
      totalBeforeVat: tempSum - taxAmountSum,
      totalAfterVat: tempSum2,
      modeReleasingIndividual: modeOfrelisingArr,
    };

    setfinalTotalList(updatefinalTotalList);
  };

  const handleModeOfPayment = () => {
    const tabledataformodeofpayment = [...tableData];
    const finalArr = [...finalTotalList];

    console.log("tabledataformode", tabledataformodeofpayment[0]["cash"]);

    if (
      tabledataformodeofpayment[0]["cash"] == "N" &&
      tabledataformodeofpayment[0]["creditcard"] == "N" &&
      tabledataformodeofpayment[0]["debit"] == "N" &&
      tabledataformodeofpayment[0]["pdc"] == "N" &&
      tabledataformodeofpayment[0]["po"] == "N" &&
      tabledataformodeofpayment[0]["datedCheck"] == "N" &&
      tabledataformodeofpayment[0]["onlineTransfer"] == "N" &&
      tabledataformodeofpayment[0]["onAccount"] == "N" &&
      tabledataformodeofpayment[0]["cashOnDel"] == "N"
    ) {
      setshowMessage4(true);
      seterrMessage4("Please select atleast 1 mode of payment");
      setTimeout(() => {
        setshowMessage4(false);
      }, 10000);
    } else {
      setshowMessage3(false);
    }
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

  const [headerReply, setheaderReply] = useState("");

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

    // const response = await axios.post(`${process.env.NEXT_PUBLIC_IP_DB}/so-header`, headerFinal);

    // console.log(2)

    const baseURL = "http://172.16.10.217:3002/so-header";

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

  const SCPWDinput = (id: any) => {
    console.log("SC", id);
    setscpdwdID(id);
  };

  return (
    <>
      <div className="salesbody p-2 text-sm rounded-md flex gap-40  container overflow-x-auto shadow-lg">
        <div className="w-[] flex flex-wrap gap-5 col1 mr-3">
          <div>
            <div className="grid grid-cols-2">
              <label htmlFor="entrynumber">Customer Code</label>
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
                  {/* ------------ To show addCustomerDataPage ---------------- */}
                  {showCustomer && <AddCustomerDataPage />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="entrynumber">Customer Name</label>
              <div>
                <input
                  type="text"
                  value={customerData.map((e) => e.customerName)}
                  className="bg-slate-200"
                  readOnly
                />
              </div>
            </div>
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
              <label htmlFor="entrynumber">Walk-in Customer Name</label>
              <div>
                <input type="text" />
              </div>
            </div>
            <div className="grid grid-cols-2">
              <label className="" htmlFor="entrynumber">
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
              <label className="" htmlFor="entrynumber">
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
              <label className="" htmlFor="entrynumber">
                Customer Reference
              </label>
              <div>
                <input type="text" />
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
                  <input
                    onInput={(e: any) => {
                      SCPWDinput(e.target.value);
                    }}
                    type="text"
                  />
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
              <input type="text" readOnly />
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
      {/* -------------------------------------- table ----------------------------------- */}
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
              {tableData.map((rowData: any, rowIndex) => (
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
                    {rowData.itemCode == 0 ? (
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
                      value={rowData.quantity}
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
                    {rowData.quantity == 0
                      ? ""
                      : rowData.inventoryStatus +
                        " " +
                        rowData.cash +
                        " " +
                        rowData.creditcard +
                        " " +
                        rowData.debit +
                        " " +
                        rowData.pdc +
                        " " +
                        rowData.po +
                        " " +
                        rowData.datedCheck +
                        " " +
                        rowData.onlineTransfer +
                        " " +
                        rowData.onAccount +
                        " " +
                        rowData.cashOnDel}
                  </td>
                  {/* + " " + rowData.creditcard + " " + rowData.debit + " " + rowData.pdc + " " + rowData.po */}
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
                    {/* <input
                    className="border-transparent"
                    type=""
                    value={rowData.discountRate}
                    onChange={(e) => handleDiscountRateChange(rowIndex, e.target.value)}
                  /> */}

                    {rowData.quantity <= 0
                      ? ""
                      : parseFloat(Math.max(rowData.discountRate).toFixed(2)) <=
                        0
                      ? 0
                      : Math.max(rowData.discountRate).toFixed(2)}
                  </td>
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
                  {/* <td>
                  {
                    rowData.quantity == 0 ? '' : rowData.sellingPriceAfterDiscount
                  }
                </td> */}
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
                      className="mb-1"
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
                      {filteredDataItem.map((item, index) => (
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
                        {UOMList.map((e, rowIndex) => (
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
                top: "20%",
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
                        {WareHouseList.map((item, index) => (
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
      <div className="text-left p-2 grid grid-cols-2 col1 text-[14px] mt-5">
        <div className="w-[300px] ">
          <div className="grid grid-cols-2">
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
              <textarea name="" id=""></textarea>
            </div>
          </div>
        </div>
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
      </div>
      <div className="grid grid-cols-2">
        <div className="p-2 flex justify-start">
          <button
            className="p-2 mt-2 mb-1 mr-2 text-[12px] bg-[#F4D674]"
            onClick={handleSaveDraft}
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
        <div className="p-2 flex justify-end">
          {showMessage && (
            <div className="p-2 mt-2 mb-1 mr-2 text-[12px] bg-red-200 shadow-md">
              {errMessage}
            </div>
          )}
          {showMessage2 && (
            <div className="p-2 mt-2 mb-1 mr-2 text-[12px] bg-red-200 shadow-md">
              {errMessage2}
            </div>
          )}
          {showMessage3 && (
            <div className="p-2 mt-2 mb-1 mr-2 text-[12px] bg-red-200 shadow-md">
              {errMessage3}
            </div>
          )}
          {showMessage4 && (
            <div className="p-2 mt-2 mb-1 mr-2 text-[12px] bg-red-200 shadow-md">
              {errMessage4}
            </div>
          )}
          {showMessage5 && (
            <div className="p-2 mt-2 mb-1 mr-2 text-[12px] bg-red-200 shadow-md">
              {errMessage5}
            </div>
          )}
          {showMessage6 && (
            <div className="p-2 mt-2 mb-1 mr-2 text-[12px] bg-red-200 shadow-md">
              {errMessage6}
            </div>
          )}
          {showMessage7 && (
            <div className="p-2 mt-2 mb-1 mr-2 text-[12px] bg-red-200 shadow-md">
              {errMessage7}
            </div>
          )}
        </div>
      </div>
      {
        <div className="text-left">
          {/* <pre>{JSON.stringify(tableData, null, 2)}</pre> */}
          {/* {
            <pre>{JSON.stringify(finalTotalList, null, 2)}</pre>
          } */}
        </div>
      }
    </>
  );
}
