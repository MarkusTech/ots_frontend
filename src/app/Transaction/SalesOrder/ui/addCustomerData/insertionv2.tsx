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
