import { useState, useEffect } from "react";

const YourComponent = () => {
  const [selectedDraftNum, setSelectedDraftNum] = useState(null);
  const [jsonData, setJsonData] = useState([]);

  useEffect(() => {
    // Fetch data from your API endpoint when selectedDraftNum changes
    const fetchData = async () => {
      try {
        if (selectedDraftNum) {
          const response = await fetch(
            `your-api-endpoint-url?draftNum=${selectedDraftNum}`
          );
          const data = await response.json();

          // Update the state with the fetched data
          setJsonData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetchData function when selectedDraftNum changes
    fetchData();
  }, [selectedDraftNum]); // Dependency array includes selectedDraftNum

  // Function to handle draft number selection
  const handleDraftNumSelect = (draftNum) => {
    setSelectedDraftNum(draftNum);
  };

  return (
    <div>
      <h1>Your Component</h1>

      {/* Your table where you select a draft number */}
      <table>
        {/* Your table content */}
        <tbody>
          <tr>
            <td>
              {/* Example button to select a draft number */}
              <button onClick={() => handleDraftNumSelect("10119")}>
                Select Draft 10119
              </button>
            </td>
            {/* Add more rows/buttons for other draft numbers */}
          </tr>
        </tbody>
      </table>

      {/* Use jsonData in your component */}
      <ul>
        {jsonData.map((item) => (
          <li key={item.LineID}>
            {item.ItemName} - Quantity: {item.Quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YourComponent;
