import React, { useState } from "react";

const PaymentSection = () => {
  const [isCheckedCash, setCheckedCash] = useState(false);
  const [isCheckedCreditCard, setCheckedCreditCard] = useState(false);
  const [isCheckedDebit, setCheckedDebit] = useState(false);
  const [isCheckedPDC, setCheckedPDC] = useState(false);
  const [isCheckedPO, setCheckedPO] = useState(false);
  const [isCheckedDatedCheck, setCheckedDatedCheck] = useState(false);
  const [isCheckedOnlineTransfer, setCheckedOnlineTransfer] = useState(false);
  const [isCheckedOnAccount, setCheckedOnAccount] = useState(false);
  const [isCheckedCashOnDel, setCheckedCashOnDel] = useState(false);
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(false);

  const handCash = () => {
    setCheckedCash(!isCheckedCash);
    setPaymentMethodSelected(true);
  };

  const handleCreditCard = () => {
    setCheckedCreditCard(!isCheckedCreditCard);
    setPaymentMethodSelected(true);
  };

  const handleDebit = () => {
    setCheckedDebit(!isCheckedDebit);
    setPaymentMethodSelected(true);
  };

  const handlePDC = () => {
    setCheckedPDC(!isCheckedPDC);
    setPaymentMethodSelected(true);
  };

  const handlePO = () => {
    setCheckedPO(!isCheckedPO);
    setPaymentMethodSelected(true);
  };

  const handleDatedCheck = () => {
    setCheckedDatedCheck(!isCheckedDatedCheck);
    setPaymentMethodSelected(true);
  };

  const handlOnlineTransfer = () => {
    setCheckedOnlineTransfer(!isCheckedOnlineTransfer);
    setPaymentMethodSelected(true);
  };

  const handleOnAccount = () => {
    setCheckedOnAccount(!isCheckedOnAccount);
    setPaymentMethodSelected(true);
  };

  const handleCashOnDel = () => {
    setCheckedCashOnDel(!isCheckedCashOnDel);
    setPaymentMethodSelected(true);
  };

  const handleValidation = () => {
    if (!paymentMethodSelected) {
      alert("You need to choose a payment method");
      // You can also set an error state and display it in your UI.
    }
    // Perform other validations if needed.
  };

  const handleSubmit = () => {
    handleValidation();
    // Continue with your form submission logic if validation passes.
  };

  return (
    <div className="grid grid-cols-2">
      <label htmlFor="documentnumber">Mode of Payment:</label>
      <div className="">
        <div className="flex justify-start gap-2 w-[100px]">
          <input
            className="w-[20px]"
            type="checkbox"
            checked={isCheckedCash}
            onChange={handCash}
          />
          Cash
        </div>
        <div className="flex justify-start gap-2">
          <input
            className="w-[20px]"
            type="checkbox"
            checked={isCheckedCreditCard}
            onChange={handleCreditCard}
          />
          Credit Card
        </div>
        {/* ... (similar checkboxes for other payment methods) */}
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default PaymentSection;
