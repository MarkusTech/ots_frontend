 const [selectedRowIndex, setSelectedRowIndex] = useState(null); // 22
 
//  957
 const changeManualModRel = (moderel: any) => {
    const updatedTableData = [...tableData];

    console.log(moderel);

    const item = updatedTableData[selectedRowIndex];

    updatedTableData[selectedRowIndex] = {
      ...item,
      modeOfReleasing: moderel
    };

    console.log(item)

    setTableData(updatedTableData);
    setOpenModRelTablePanel(!openModRelTablePanel);
  }


//   ---------------------------------------------------------------------------------------

// 313
const filteredData = currentCustomerData
  .filter((rowData) => {
    return (
      Object.values(rowData).some((value) =>
        value !== null &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  })
  .slice(0, 20);

  function to display the searched text