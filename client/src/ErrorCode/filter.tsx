import React, { useState } from "react";

function YourComponent() {
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
      location: "", // <-- This is where we'll store the pick-up location
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
    },
  ]);

  // Function to handle change in pick-up location
  function changeManualPickUpLocation(value) {
    // Update the pick-up location for the first item in tableData array
    const updatedTableData = [...tableData];
    updatedTableData[0].location = value;
    setTableData(updatedTableData);
  }

  // Function to save the pick-up location
  function savePickUpLocation(location) {
    // Here, you can implement your logic to save the location data in useState
    // For simplicity, we're directly updating the location field of the first item in tableData
    const updatedTableData = [...tableData];
    updatedTableData[0].location = location;
    setTableData(updatedTableData);
  }

  return (
    <tbody>
      <tr>
        <td>
          <select
            name=""
            className="w-full p-2"
            onChange={(e) => changeManualPickUpLocation(e.target.value)}
            id=""
            value={tableData[0].location} // Ensures the selected value is reflected in the dropdown
          >
            <option value="" disabled selected>
              Please Select
            </option>
            <option value="SA">Selling Area</option>
            <option value="Storage">Storage</option>
            <option value="Whse">Warehouse</option>{" "}
            {/* Fixed the typo in "Warehouse" */}
          </select>
        </td>
      </tr>
    </tbody>
  );
}

export default YourComponent;

//// 1830
