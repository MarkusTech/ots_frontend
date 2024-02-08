import React, { useState } from 'react';

const YourComponent: React.FC = () => {
  const [customerData, setCustomerData] = useState([
    // Your customer data
  ]);

  const [formData, setFormData] = useState({
    // Your existing formData state
  });

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  const handleGetFieldValues = () => {
    // Get values from the fields and save them to your data or perform other actions
    const customerCode = document.getElementById('CustomerCode')?.getAttribute('value');
    const customerName = document.getElementById('CustomerName')?.getAttribute('value');
    const foreignName = document.getElementById('ForeignName')?.getAttribute('value');
    const walkInName = document.getElementById('WalkInName')?.getAttribute('value');
    const shippingAddress = document.getElementById('ShippingAdd')?.getAttribute('value');
    const customerTIN = document.getElementById('TIN')?.getAttribute('value');

    // Use the retrieved values as needed
    console.log('Customer Code:', customerCode);
    console.log('Customer Name:', customerName);
    console.log('Foreign Name:', foreignName);
    console.log('Walk-in Customer Name:', walkInName);
    console.log('Customer Shipping Address:', shippingAddress);
    console.log('Customer TIN:', customerTIN);

    // Save values to your data or perform other actions
    setCustomerData([
      // ... Update your customer data based on the retrieved values
    ]);
  };

  // Your existing code...

  return (
    <div className="salesbody p-2 text-sm rounded-md flex gap-40 container overflow-x-auto shadow-lg">
      {/* ... (other code) */}
      
      {/* Updated Foreign Name input */}
      <div className="grid grid-cols-2">
        <label className="" htmlFor="ForeignName">
          Foreign Name
        </label>
        <div>
          <input
            type="text"
            value={customerData.map((e) => e.customerCardFName)}
            onChange={(e) => handleInputChange('CustomerName', e.target.value)}
            readOnly
          />
        </div>
      </div>

      {/* ... (other fields) */}

      {/* Button to trigger getting field values */}
      <button onClick={handleGetFieldValues}>Get Field Values</button>
    </div>
  );
};

export default YourComponent;

// -----------------------------------------------------------------------

import React, { useState } from 'react';

const YourComponent: React.FC = () => {
  const [customerData, setCustomerData] = useState([
    // Your customer data
  ]);

  const [formData, setFormData] = useState({
    CustomerCode: '',
    CustomerName: '',
    ForeignName: '',
    WalkInName: '',
    ShippingAdd: '',
    TIN: '',
    // ... other form fields
  });

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  const handleGetFieldValues = () => {
    const customerCode = document.getElementById('CustomerCode')?.getAttribute('value');
    const customerName = document.getElementById('CustomerName')?.getAttribute('value');
    const foreignName = document.getElementById('ForeignName')?.getAttribute('value');
    const walkInName = document.getElementById('WalkInName')?.getAttribute('value');
    const shippingAddress = document.getElementById('ShippingAdd')?.getAttribute('value');
    const customerTIN = document.getElementById('TIN')?.getAttribute('value');

    console.log('Customer Code:', customerCode);
    console.log('Customer Name:', customerName);
    console.log('Foreign Name:', foreignName);
    console.log('Walk-in Customer Name:', walkInName);
    console.log('Customer Shipping Address:', shippingAddress);
    console.log('Customer TIN:', customerTIN);

    setCustomerData([
      // ... Update your customer data based on the retrieved values
    ]);
  };

  // Your existing code...

  return (
    <div className="salesbody p-2 text-sm rounded-md flex gap-40 container overflow-x-auto shadow-lg">
      <div className="w-[] flex flex-wrap gap-5 col1 mr-3">
        <div>
          <div className="grid grid-cols-2">
            <label htmlFor="CustomerCode">Customer Code</label>
            <div>
              <input
                type="text"
                value={customerData.map((e) => e.customerCode)}
                onChange={(e) => handleInputChange('CustomerCode', e.target.value)}
                className="bg-slate-200"
                readOnly
              />
              <button
                className="w-[20px]  bg-slate-200"
                onClick={handleShowCustomer}
              >
                =
              </button>
              {showCustomer && (
                // ... (your existing Draggable code)
              )}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="CustomerName">Customer Name</label>
            <div>
              <input
                type="text"
                value={customerData.map((e) => e.customerName)}
                onChange={(e) => handleInputChange('CustomerName', e.target.value)}
                className="bg-slate-200"
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label className="" htmlFor="ForeignName">
              Foreign Name
            </label>
            <div>
              <input
                type="text"
                value={customerData.map((e) => e.customerCardFName)}
                onChange={(e) => handleInputChange('ForeignName', e.target.value)}
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label htmlFor="WalkInName">Walk-in Customer Name</label>
            <div>
              <input
                type="text"
                onChange={(e) => handleInputChange('WalkInName', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label className="" htmlFor="ShippingAdd">
              Customer Shipping Address
            </label>
            <div>
              <input
                type="text"
                value={customerData.map((e) => e.cusShipAddress)}
                onChange={(e) => handleInputChange('ShippingAdd', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <label className="" htmlFor="TIN">
              Customer TIN
            </label>
            <div>
              <input
                type="text"
                value={customerData.map((e) => e.cusLicTradNum)}
                onChange={(e) => handleInputChange('TIN', e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* ... (rest of your code) */}
      </div>
    </div>
  );
};

export default YourComponent;
