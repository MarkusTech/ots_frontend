import React, { useState } from "react";

const YourComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      DraftNum: customer.DraftNum,
      EntryNum: customer.EntryNum,
      DocNum: customer.DocNum,
      CustomerCode: customer.CustomerCode,
      CustomerName: customer.CustomerName,
      ForeignName: customer.ForeignName,
      WalkInName: customer.WalkInName,
      ShippingAdd: customer.ShippingAdd,
      TIN: customer.TIN,
      Reference: customer.Reference,
      Branch: customer.Branch,
      DocStat: customer.DocStat,
      BaseDoc: customer.BaseDoc,
      DocDate: customer.DocDate,
      PostingDate: customer.PostingDate,
      SCPWDIdNo: customer.SCPWDIdNo,
      Cash: customer.Cash,
      CreditCard: customer.CreditCard,
      DebitCard: customer.DebitCard,
      ODC: customer.ODC,
      PDC: customer.PDC,
      OnlineTransfer: customer.OnlineTransfer,
      OnAccount: customer.OnAccount,
      COD: customer.COD,
      TotalAmtBefTax: customer.TotalAmtBefTax,
      TotalTax: customer.TotalTax,
      TotalAmtAftTax: customer.TotalAmtAftTax,
      SCPWDDiscTotal: customer.SCPWDDiscTotal,
      TotalAmtDue: customer.TotalAmtDue,
      Remarks: customer.Remarks,
      CreatedBy: customer.CreatedBy,
      DateCreated: customer.DateCreated,
      UpdatedBy: customer.UpdatedBy,
      DateUpdated: customer.DateUpdated,
    });
  };

  // Mockup data for customers
  const customers = [
    // ... (your mockup data here)
  ];

  const [formData, setFormData] = useState({
    DraftNum: "",
    EntryNum: "",
    DocNum: 0,
    CustomerCode: "",
    CustomerName: "",
    ForeignName: "",
    WalkInName: "",
    ShippingAdd: "",
    TIN: "",
    Reference: "",
    Branch: "",
    DocStat: "",
    BaseDoc: 0,
    DocDate: "",
    PostingDate: "",
    SCPWDIdNo: "",
    Cash: "",
    CreditCard: "",
    DebitCard: "",
    ODC: "",
    PDC: "",
    OnlineTransfer: "",
    OnAccount: "",
    COD: "",
    TotalAmtBefTax: "",
    TotalTax: 0,
    TotalAmtAftTax: "",
    SCPWDDiscTotal: "",
    TotalAmtDue: "",
    Remarks: "",
    CreatedBy: "Administrator",
    DateCreated: "",
    UpdatedBy: "",
    DateUpdated: "",
  });

  return (
    <div>
      {/* Your existing code here */}
      {/* ... */}

      {/* Display the selected customer data */}
      <div>
        <h2>Selected Customer Data</h2>
        <pre>{JSON.stringify(selectedCustomer, null, 2)}</pre>
      </div>
    </div>
  );
};

export default YourComponent;

import React, { useState } from "react";
import Draggable from "react-draggable";

const YourComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      DraftNum: customer.DraftNum,
      EntryNum: customer.EntryNum,
      DocNum: customer.DocNum,
      CustomerCode: customer.CustomerCode,
      CustomerName: customer.CustomerName,
      ForeignName: customer.ForeignName,
      WalkInName: customer.WalkInName,
      ShippingAdd: customer.ShippingAdd,
      TIN: customer.TIN,
      Reference: customer.Reference,
      Branch: customer.Branch,
      DocStat: customer.DocStat,
      BaseDoc: customer.BaseDoc,
      DocDate: customer.DocDate,
      PostingDate: customer.PostingDate,
      SCPWDIdNo: customer.SCPWDIdNo,
      Cash: customer.Cash,
      CreditCard: customer.CreditCard,
      DebitCard: customer.DebitCard,
      ODC: customer.ODC,
      PDC: customer.PDC,
      OnlineTransfer: customer.OnlineTransfer,
      OnAccount: customer.OnAccount,
      COD: customer.COD,
      TotalAmtBefTax: customer.TotalAmtBefTax,
      TotalTax: customer.TotalTax,
      TotalAmtAftTax: customer.TotalAmtAftTax,
      SCPWDDiscTotal: customer.SCPWDDiscTotal,
      TotalAmtDue: customer.TotalAmtDue,
      Remarks: customer.Remarks,
      CreatedBy: customer.CreatedBy,
      DateCreated: customer.DateCreated,
      UpdatedBy: customer.UpdatedBy,
      DateUpdated: customer.DateUpdated,
    });
  };

  // Mockup data for customers
  const customers = [
    {
      DraftNum: "D001",
      EntryNum: "E001",
      DocNum: 1,
      CustomerCode: "C001",
      CustomerName: "John Doe",
      ForeignName: "John Doe",
      WalkInName: "John",
      ShippingAdd: "123 Main St",
      TIN: "123456789",
      Reference: "REF001",
      Branch: "Branch A",
      DocStat: "Approved",
      BaseDoc: 0,
      DocDate: "2024-02-29",
      PostingDate: "2024-02-29",
      SCPWDIdNo: "ID001",
      Cash: "100",
      CreditCard: "200",
      DebitCard: "50",
      ODC: "30",
      PDC: "40",
      OnlineTransfer: "120",
      OnAccount: "80",
      COD: "60",
      TotalAmtBefTax: "800",
      TotalTax: 20,
      TotalAmtAftTax: "820",
      SCPWDDiscTotal: "10",
      TotalAmtDue: "830",
      Remarks: "Sample Remarks",
      CreatedBy: "Administrator",
      DateCreated: "2024-02-29",
      UpdatedBy: "",
      DateUpdated: "",
    },
    // Add more customer objects as needed
  ];

  const [formData, setFormData] = useState({
    DraftNum: "",
    EntryNum: "",
    DocNum: 0,
    CustomerCode: "",
    CustomerName: "",
    ForeignName: "",
    WalkInName: "",
    ShippingAdd: "",
    TIN: "",
    Reference: "",
    Branch: "",
    DocStat: "",
    BaseDoc: 0,
    DocDate: "",
    PostingDate: "",
    SCPWDIdNo: "",
    Cash: "",
    CreditCard: "",
    DebitCard: "",
    ODC: "",
    PDC: "",
    OnlineTransfer: "",
    OnAccount: "",
    COD: "",
    TotalAmtBefTax: "",
    TotalTax: 0,
    TotalAmtAftTax: "",
    SCPWDDiscTotal: "",
    TotalAmtDue: "",
    Remarks: "",
    CreatedBy: "Administrator",
    DateCreated: "",
    UpdatedBy: "",
    DateUpdated: "",
  });

  return (
    <Draggable>
      <div
        className="bg-white shadow-lg"
        style={{
          border: "1px solid #ccc",
          position: "absolute",
          top: "30%",
          left: "15%",
          maxHeight: "500px",
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
              onClick={() => {
                /* handleShowSearchHeader function implementation */
              }}
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
            <div className="table-container">
              <table className="w-full">
                <thead className="tables">
                  <tr>
                    <th>Draft Number</th>
                    <th>Customer Code</th>
                    <th>Customer Name</th>
                    <th>Foreign Name</th>
                    <th>Walk-in Customer Name</th>
                    <th>Document Date</th>
                    <th>Sales Crew</th>
                  </tr>
                </thead>
                <tbody className="bg-white shadow-lg pt-3">
                  {customers.map((customer) => (
                    <tr
                      key={customer.DraftNum}
                      onClick={() => handleRowClick(customer)}
                    >
                      <td>{customer.DraftNum}</td>
                      <td>{customer.CustomerCode}</td>
                      <td>{customer.CustomerName}</td>
                      <td>{customer.ForeignName}</td>
                      <td>{customer.WalkInName}</td>
                      <td>{customer.DocDate}</td>
                      <td>{customer.CreatedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default YourComponent;
