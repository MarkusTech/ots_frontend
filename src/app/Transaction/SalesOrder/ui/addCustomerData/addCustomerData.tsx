import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import axios from "axios";

const AddCustomerDataPage = () => {
  const [taxCodeData, setTaxCodeData] = useState([]);
  const [cardCodedata, setCardCodedata] = useState("");
  //   const [taxRateData, setTaxRateData] = useState([]);
  const [taxRateData, setTaxRateData] = useState<TaxRate[]>([]);
  const [showWindow, setShowWindow] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [customerList, setCustomerDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  let customerData2 = [{}];
  let currentCustomerData = customerList;
  //   const arrayCustomer = [customerList];

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

  //retrieval taxcode
  const onAddHeaderTaxCode = async (cardCodex: any, whseCodex: any) => {
    const taxcode = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/tax-code/${cardCodex}/${whseCodex}`
    );
    console.log("Tax Code", taxcode.data);
    setTaxCodeData(taxcode.data);
  };

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

    setCardCodedata(id);

    setCustomerData([newArray]);

    console.log(customerData2);
    setShowCustomer(!showCustomer);
  };
  //retrieval customer data
  const onAddHeader = async () => {
    const customers = await axios.get(`${process.env.NEXT_PUBLIC_IP}/customer`);
    setCustomerDataList(customers.data);
  };

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  //hide/show customer panel
  const handleShowCustomer = () => {
    setShowCustomer(!showCustomer);
    onAddHeader();

    const updatedTableData = [...tableData];

    const listArryLen = updatedTableData.length;

    taxRateData.map((e) => {
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

  return (
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
            <span onClick={handleShowCustomer} className="cursor-pointer">
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
                {filteredData.map((rowData: any, rowIndex: any) => (
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
                    {/* {Object.values(rowData).map((value, colIndex) => (
                                        <td className="tdcus" key={colIndex} onClick={()=>addCustomerData(rowData.customerCode, rowData.customerName, rowData.cusShipAddress, rowData.cusTIN)} >{value}</td>
                                      ))} */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default AddCustomerDataPage;
