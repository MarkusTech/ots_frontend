import { Anybody } from 'next/font/google';
import React, { useState } from 'react';

const YourComponent = () => {
  const [formData, setFormData] = useState({
    customerCode: '',
    customerName: '',
    customerCardFName: '',
    cusShipAddress: '',
    cusLicTradNum: '',
    // Add other fields as needed
  });

  const [dataArray, setDataArray] = useState([]);

  const handleInputChange = (field: any, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSaveToLocal = () => {
    const newDataArray = [...dataArray, formData];
    localStorage.setItem('formDataArray', JSON.stringify(newDataArray));
    setDataArray(newDataArray);
    // Optionally, you can clear the form data after saving
    setFormData({
      customerCode: '',
      customerName: '',
      customerCardFName: '',
      cusShipAddress: '',
      cusLicTradNum: '',
      // Add other fields as needed
    });
  };

  return (
    <div className="salesbody p-2 text-sm rounded-md flex gap-40 container overflow-x-auto shadow-lg">
      {/* ... (your existing JSX code) ... */}
      <div className="w-[] flex flex-wrap gap-5 col1 mr-3">
        <div>
          <div className="grid grid-cols-2">
            <label htmlFor="entrynumber">Customer Code</label>
            <div>
              <input
                type="text"
                value={formData.customerCode}
                onChange={(e) => handleInputChange('customerCode', e.target.value)}
                className="bg-slate-200"
                readOnly
              />
              <button
                className="w-[20px] bg-slate-200"
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
                    {/* ... (your existing JSX code for the customer dropdown) ... */}
                  </div>
                </Draggable>
              )}
            </div>
          </div>
          {/* ... (your existing JSX code for other form fields) ... */}
          <div className="grid grid-cols-2">
            <label htmlFor="entrynumber">Customer Name</label>
            <div>
              <input
                type="text"
                value={formData.customerName}
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
                value={formData.customerCardFName}
                readOnly
              />
            </div>
          </div>
          {/* ... (continue adding similar code for other fields) ... */}
        </div>
        <div>
          {/* ... (your existing JSX code) ... */}
          <div className="grid grid-cols-2">
            <label className="" htmlFor="entrynumber">
              Customer Reference
            </label>
            <div>
              <input type="text" />
            </div>
          </div>
          {/* ... (continue adding similar code for other fields) ... */}
        </div>
      </div>
      <div className="w-[] col1">
        <div className="grid grid-cols-2">
          {/* ... (your existing JSX code) ... */}
        </div>
        {/* ... (your existing JSX code) ... */}
      </div>
      {/* Button to save to local storage */}
      <button onClick={handleSaveToLocal}>Save to Local Storage</button>
    </div>
    {/* ... (continue with the rest of your JSX code) ... */}
  </div>
  );
};

export default YourComponent;
