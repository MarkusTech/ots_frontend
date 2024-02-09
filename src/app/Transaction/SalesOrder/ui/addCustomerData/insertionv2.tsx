import React, { useState, useEffect } from 'react';

const YourComponent = () => {
  const [totalAfterVat, settotalAfterVat] = useState("");
  const [totalBeforeVat, setTotalBeforeVat] = useState("");
  const [totalVat, setTotalVat] = useState("");
  const [showSCPDW, setShowSCPWD] = useState(false);
  const [varSCPWDdisc, setVarSCPWDdisc] = useState(0);
  const [SCPWDdata, setSCPWDdata] = useState(0);
  const [totalAmoutDueData, settotalAmoutDueData] = useState(0);

  // Example: Use useEffect to recalculate whenever dependencies change
  useEffect(() => {
    // Hypothetical calculations, replace with your logic
    const calculatedTotalBeforeVat = // Your calculation logic here;
    const calculatedTotalVat = // Your calculation logic here;
    const calculatedTotalAfterVat = // Your calculation logic here;
    const calculatedSCPWDdata = // Your calculation logic here;
    const calculatedTotalAmountDue = // Your calculation logic here;

    // Update state with calculated values
    setTotalBeforeVat(calculatedTotalBeforeVat);
    setTotalVat(calculatedTotalVat);
    settotalAfterVat(calculatedTotalAfterVat);
    setSCPWDdata(calculatedSCPWDdata);
    settotalAmoutDueData(calculatedTotalAmountDue);
  }, [/* dependencies that trigger recalculation */]);

  return (
    <div className="text-right w-full grid justify-end">
      <div className="w-[440px]">
        {/* ... other JSX code ... */}
        <div className="grid grid-cols-2 text-right">
          <label htmlFor="documentnumber">Total Amount Before VAT</label>
          <div>
            <input value={totalBeforeVat} type="text" readOnly />
          </div>
        </div>
        <div className="grid grid-cols-2">
          <label htmlFor="documentnumber">Total VAT</label>
          <div>
            <input value={totalVat} type="text" readOnly />
          </div>
        </div>
        <div className="grid grid-cols-2">
          <label htmlFor="documentnumber">Total After VAT</label>
          <div>
            <input value={totalAfterVat} type="text" readOnly />
          </div>
        </div>
        <div className="grid grid-cols-2">
          <label htmlFor="documentnumber">SC/PWD Discount Total</label>
          <div>
            <input value={SCPWDdata} type="text" readOnly />
          </div>
        </div>
        <div className="grid grid-cols-2">
          <label htmlFor="documentnumber">Total Amount Due</label>
          <div>
            <input value={totalAmoutDueData} type="text" readOnly />
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourComponent;

// line 521
setTotalBeforeVat(localCurrency.format(tempSum2)); //total after vat
    settotalAfterVat(localCurrency.format(tempSum2 - taxAmountSum)); //Total Amount Before VAT
    setTotalVat(localCurrency.format(taxAmountSum)); //Total VAT
    setSCPWDdata(
      parseFloat(localCurrency.format((tempSum2 - taxAmountSum) * varSCPWDdisc))
    ); //SC/PWD Discount Total
    settotalAmoutDueData(
      // localCurrency.format(`${tempSum} - (${tempSum2} - ${taxAmountSum}) * ${varSCPWDdisc}`)
      parseFloat(
        localCurrency.format(
          tempSum2 - (tempSum2 - taxAmountSum) * varSCPWDdisc
        )
      )
    );
