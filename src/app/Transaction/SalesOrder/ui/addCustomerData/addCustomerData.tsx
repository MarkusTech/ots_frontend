import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import axios from "axios";

const AddCustomerDataPage = () => {
  const [showCustomer, setShowCustomer] = useState(false);
  const [taxCodeData, setTaxCodeData] = useState([]);
  const [cardCodedata, setCardCodedata] = useState("");
  //   const [taxRateData, setTaxRateData] = useState([]);
  const [taxRateData, setTaxRateData] = useState<TaxRate[]>([]);
  const [showWindow, setShowWindow] = useState(false);
  const [isClosed, setIsClosed] = useState(false); // open close customer page
  const [customerList, setCustomerDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lowerBoundData, setLowerBoundData] = useState("");
  const [UOMList, setUOMList] = useState([]);
  const [UOMListIndex, setUOMListIndex] = useState([]);
  const [scpdwdID, setscpdwdID] = useState("");
  const [showSCPDW, setShowSCPWD] = useState(false);
  const [showDoc, setShowDoc] = useState(false);
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

  // const manilaDate = now.toLocaleDateString('en-US', { timeZone: 'Asia/Manila' });

  const now = new Date();
  const manilaDate = now.toLocaleDateString("en-US", {
    timeZone: "Asia/Manila",
  });

  //show hide panel
  const handleShowDoc = () => {
    setShowDoc(!showDoc);
  };

  let customerData2 = [{}];
  let currentCustomerData = customerList;
  //   const arrayCustomer = [customerList];
  //retrieval customer data

  //retrieval customer data
  const onAddHeader = async () => {
    const customers = await axios.get(`${process.env.NEXT_PUBLIC_IP}/customer`);
    setCustomerDataList(customers.data);
  };

  //retrieval items
  //   const onAddheaderItems = async () => {
  //     const item = await axios.get(
  //       `${process.env.NEXT_PUBLIC_IP}/item/${priceListNum}/${warehouseCode}/C000174`
  //     );
  //     setItemDataList(item.data);
  //   };

  //retrieval UOM item
  const onAddHeaderUOM = async (itemcode: any, rowIndex: any) => {
    const uom = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/uom/${itemcode}`
    );
    setUOMList(uom.data);
    setUOMListIndex(rowIndex);
  };

  //retrieval taxcode
  const onAddHeaderTaxCode = async (cardCodex: any, whseCodex: any) => {
    const taxcode = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/tax-code/${cardCodex}/${whseCodex}`
    );
    console.log("Tax Code", taxcode.data);
    setTaxCodeData(taxcode.data);
  };

  //retrieval taxrate
  const onAddHeaderRateCode = async (taxcode: any) => {
    const taxrate = await axios.get(
      `${process.env.NEXT_PUBLIC_IP}/tax-rate/${taxcode}`
    );
    setTaxRateData(taxrate.data);
  };

  useEffect(() => {
    onAddHeader();
    // onAddheaderItems();
  }, []);

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

  const SCPWDinput = (id: any) => {
    console.log("SC", id);
    setscpdwdID(id);
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

  //   const openItemTable = (rowIndex: any) => {
  //     setOpenItemTablePanel(!openItemTablePanel);
  //     setSelectedRowIndex(rowIndex);

  //     taxCodeData.map((e) => {
  //       onAddHeaderRateCode(e.TaxCode);

  //       const updatedTableData = [...tableData];

  //       const listArryLen = updatedTableData.length;

  //       taxRateData.map((e) => {
  //         for (let i = 0; i < listArryLen; i++) {
  //           const item = updatedTableData[i];
  //           updatedTableData[i] = {
  //             ...item,
  //             taxCodePercentage: e.Rate,
  //           };
  //           setTableData(updatedTableData);
  //         }
  //       });
  //     });
  //   };
  const handleCloseCustomer = () => {
    setIsClosed(true);
  };

  if (isClosed) {
    return null; // Don't render the component if it's closed
  }

  return (
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
                          <button
                            className="cursor-pointer"
                            onClick={handleCloseCustomer}
                          >
                            ❌
                          </button>
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
                              {filteredData.map(
                                (rowData: any, rowIndex: any) => (
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
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </Draggable>
                )}
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
  );
};

export default AddCustomerDataPage;
