import React, { useState } from 'react';

const YourComponent = () => {
  // State variables for each checkbox
  const [isCheckedCash, setCheckedCash] = useState(false);
  const [isCheckedCreditCard, setCheckedCreditCard] = useState(false);
  // ... (similar state variables for other checkboxes)

  // Validation function
  const validatePaymentMethod = () => {
    if (
      !isCheckedCash &&
      !isCheckedCreditCard &&
      // ... (similar conditions for other checkboxes)
    ) {
      alert("Need to Select Payment method");
      return false; // If no checkbox is checked, prevent form submission
    }
    return true; // Allow form submission
  };

  // Function to handle checkbox changes
  const handleCheckboxChange = (checkboxName: any) => {
    // Add logic to update state for the respective checkbox
    // For example:
    if (checkboxName === 'Cash') {
      setCheckedCash(!isCheckedCash);
    } else if (checkboxName === 'CreditCard') {
      setCheckedCreditCard(!isCheckedCreditCard);
    }
    // ... (similar logic for other checkboxes)
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    if (validatePaymentMethod()) {
      // Your form submission logic here
      console.log('Form submitted successfully!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2">
        <label htmlFor="documentnumber">Mode of Payment:</label>
        <div className="">
          {/* ... (checkboxes and their respective handlers) */}
          <div className="flex justify-start gap-2 w-[100px]">
            <input
              className="w-[20px]"
              type="checkbox"
              checked={isCheckedCash}
              onChange={() => handleCheckboxChange('Cash')}
            />
            Cash
          </div>
          {/* ... (similar code for other checkboxes) */}
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default YourComponent;
