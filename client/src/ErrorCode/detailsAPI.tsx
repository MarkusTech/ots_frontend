import React, { useState, useEffect } from "react";

const YourComponent = () => {
  const [draftNum, setDraftNum] = useState(""); // State to store the draftNum
  const [selectedData, setSelectedData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/getData?draftNum=${draftNum}`);
      const jsonData = await response.json();

      if (jsonData.length > 0) {
        const item = jsonData[0]; // Assuming draftNum is unique and only one item is expected
        const mappedData = {
          draftNumber: item.DraftNum,
          entryNumber: item.LineID,
          itemCode: item.ItemCode,
          itemName: item.ItemName,
          quantity: item.Quantity,
          uom: item.UoM,
          // ... other properties
        };

        setSelectedData(mappedData);
      } else {
        console.log("No data found for the given draftNum.");
        setSelectedData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (draftNum) {
      fetchData();
    }
  }, [draftNum]); // Run the effect whenever draftNum changes

  return (
    <div>
      {/* Input field to enter draftNum */}
      <input
        type="text"
        placeholder="Enter draftNum"
        value={draftNum}
        onChange={(e) => setDraftNum(e.target.value)}
      />

      {/* Render your component UI here */}
      {selectedData && (
        <div>
          {/* Display selectedData properties in your UI */}
          <p>Draft Number: {selectedData.draftNumber}</p>
          <p>Entry Number: {selectedData.entryNumber}</p>
          {/* ... other properties */}
        </div>
      )}
    </div>
  );
};

export default YourComponent;
