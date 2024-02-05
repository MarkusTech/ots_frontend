const [selectedRowIndex, setSelectedRowIndex] = useState(null); // 22

//  957
const changeManualModRel = (moderel: any) => {
  const updatedTableData = [...tableData];

  console.log(moderel);

  const item = updatedTableData[selectedRowIndex];

  updatedTableData[selectedRowIndex] = {
    ...item,
    modeOfReleasing: moderel,
  };

  console.log(item);

  setTableData(updatedTableData);
  setOpenModRelTablePanel(!openModRelTablePanel);
};

//   ---------------------------------------------------------------------------------------

// 313
const filteredData = currentCustomerData
  .filter((rowData) => {
    return Object.values(rowData).some(
      (value) =>
        value !== null &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  })
  .slice(0, 20);

// function to display the searched text

//   ---------------------------------------------------------------------------------------

// 325
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

//   ---------------------------------------------------------------------------------------
