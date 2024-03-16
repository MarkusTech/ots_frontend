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
