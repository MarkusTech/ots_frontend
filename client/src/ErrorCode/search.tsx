import React, { useState, useEffect } from "react";
import axios from "axios";
import Draggable from "react-draggable";

const YourComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);

  // Add this interface at the beginning of your file
  interface Customer {
    EntryNum: string;
    DocNum: string;
    DraftNum: string;
    PostingDate: string;
    // ... other properties
  }

  // YourComponent remains the same...

  const YourComponent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [customers, setCustomers] = useState<Customer[]>([]);

    // ... rest of the component
  };

  useEffect(() => {
    // Fetch data from the API
    axios
      .get("http://localhost:5000/api/v1/customers")
      .then((response) => {
        // Update the state with the fetched data
        setCustomers(response.data.slice(0, 10)); // Display the first 10 records
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array to run the effect only once on mount

  const handleSearch = (event) => {
    // Implement your search logic here
    setSearchTerm(event.target.value);
  };

  const handleShowSearchHeader = () => {
    // Implement your logic to handle closing the search header
  };

  return (
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
        <div
          className="grid grid-cols-2 p-2 text-left windowheader"
          style={{ cursor: "move" }}
        >
          <div>Search</div>
          <div className="text-right">
            <span onClick={handleShowSearchHeader} className="cursor-pointer">
              ❌
            </span>
          </div>
        </div>
        <div className="content">
          <div className="p-2">
            <div>
              Search:{" "}
              <input
                type="text"
                className="mb-1"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <table>
              <thead className="tables">
                <tr>
                  <th>Customer Code</th>
                  <th>Customer Name</th>
                  <th>Foreign Name</th>
                  <th>Walk-in Customer Name</th>
                  <th>Draft Number</th>
                  <th>Document Date</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.customerCode}</td>
                    <td>{customer.customerName}</td>
                    <td>{customer.foreignName}</td>
                    <td>{customer.walkInCustomerName}</td>
                    <td>{customer.draftNumber}</td>
                    <td>{customer.documentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default YourComponent;
