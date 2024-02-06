import React, { useState } from 'react';
import axios from 'axios';

const YourComponent = () => {
  const [formData, setFormData] = useState({
    customerCode: '',
    customerName: '',
    customerCardFName: '',
    cusShipAddress: '',
    cusLicTradNum: '',
    // Add other fields as needed
  });

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleFormSubmit = () => {
    axios.post('/api/saveData', formData)
      .then((response) => {
        console.log('Data saved successfully:', response.data);
        // Optionally, reset the form or perform other actions
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  };

  return (
    <div className="salesbody p-2 text-sm rounded-md flex gap-40 container overflow-x-auto shadow-lg">
      {/* ... (your existing JSX code) ... */}
      <div className="w-[] flex flex-wrap gap-5 col1 mr-3">
        {/* ... (your existing JSX code) ... */}
        <div>
          {/* ... (your existing JSX code) ... */}
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
              {/* ... (your existing JSX code) ... */}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="entrynumber">Customer Name</label>
            <div>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className="bg-slate-200"
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
              <input
                type="text"
                onChange={(e) => handleInputChange('customerReference', e.target.value)}
              />
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
    </div>
    {/* ... (continue with the rest of your JSX code) ... */}
    <button onClick={handleFormSubmit}>Save Data</button>
  </div>
  );
};

export default YourComponent;