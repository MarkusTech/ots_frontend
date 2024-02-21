const dataTable = [...tableData];
const detailsPostAPI = "http://localhost:5000/api/v1/product-detail";

const detailsOnSaveToAPI = () => {
  const apiUrl = detailsPostAPI;

  // Map through each item in the dataTable array
  dataTable.forEach((rowData) => {
    const saveDetails = {
      LineID: 0,
      EntryNum: formData.DraftNum,
      ItemCode: rowData["itemCode"],
      ItemName: rowData["itemName"],
      Quantity: rowData["quantity"],
      Uom: rowData["uom"],
      UoMConv: rowData["uomConversion"],
      Whse: rowData["location"],
      InvStat: rowData["inventoryStatus"],
      SellPriceBeDisc: rowData["sellingPriceBeforeDiscount"],
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
    };

    // Send each item to the API
    axios
      .post(apiUrl, saveDetails)
      .then((response) => {
        console.log("Data sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  });
};

// Call the function to save all details to the API
detailsOnSaveToAPI();
