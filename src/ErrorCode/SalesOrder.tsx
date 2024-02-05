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
