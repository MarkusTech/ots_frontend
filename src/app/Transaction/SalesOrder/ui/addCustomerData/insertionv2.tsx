import React, { useState } from "react";
import axios from "axios";

const YourComponent = () => {
  const [formData, setFormData] = useState({
    customerCode: "",
    customerName: "",
    customerCardFName: "",
    cusShipAddress: "",
    cusLicTradNum: "",
    // Add other fields as needed
  });

  const handleInputChange = (field: any, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const sendDataToAPI = () => {
    // Replace 'http://example.com/api/saveData' with your actual API endpoint
    const apiUrl = "http://example.com/api/saveData";

    axios
      .post(apiUrl, formData)
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        // Optionally, handle any additional logic after successful submission
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        // Optionally, handle errors or display an error message
      });
  };

  return (
    <div className="salesbody p-2 text-sm rounded-md flex gap-40 container overflow-x-auto shadow-lg">
      {/* ... (your existing JSX code for form inputs) ... */}

      {/* Button to send data to API */}
      <button onClick={sendDataToAPI}>Send Data to API</button>
    </div>
  );
};

export default YourComponent;




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