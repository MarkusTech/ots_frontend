import { useState } from "react";

export default function DateFilter() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleFilter = () => {
    // Here you can use the values of fromDate and toDate as needed
    console.log("From Date:", fromDate);
    console.log("To Date:", toDate);
  };

  return (
    <div className="flex items-center">
      <label htmlFor="fromDate" className="mr-2">
        Filter From:
      </label>
      <input
        id="fromDate"
        type="date"
        className="w-24 md:w-32 px-2 py-1 border rounded"
        onChange={(e) => setFromDate(e.target.value)}
      />
      <label htmlFor="toDate" className="ml-4 mr-2">
        To:
      </label>
      <input
        id="toDate"
        type="date"
        className="w-24 md:w-32 px-2 py-1 border rounded"
        onChange={(e) => setToDate(e.target.value)}
      />
      <p>:&nbsp;</p>
      <button
        className="p-2 mt-2 mb-1 mr-2 text-xs bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600 rounded w-24"
        onClick={handleFilter}
      >
        Filter
      </button>
    </div>
  );
}

// const PrintReceipt = () => {
//   const printWindow = window.open("", "_blank");

//   if (printWindow) {
//     printWindow.document.write(`
//     <div className="text-center">
//       <h4>SAFETYBUILD INC</h4>
//       <h4>DC-SBI GENSAN</h4>
//       <h3>SALES ORDER STUB </h3>
//       <h1>${docNumber}</h1>
//       <h4>${customerPrint}</h4>
//       <h4>${modeOfPaymentPrint}</h4>
//       <h4>${modeOfReleasingPrint}</h4>
//       <h4>GSCNAPGS</h4>
//       <h4>${selectedSalesCrew}</h4>
//       <h4>${totalAmoutDueData}</h4>
//     </div>
//   `);

//     printWindow.document.close();
//     printWindow.print();
//   }
// };

// 715
