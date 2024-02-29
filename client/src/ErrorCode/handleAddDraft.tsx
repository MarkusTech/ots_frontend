import { useState } from "react";
// Other imports...

const YourComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    // You can also update input fields here if needed
    // Example:
    // setFieldValue('customerName', customer.CustomerName);
  };

  const currentSaveDraftData = customers;
  const filteredSaveDraftData = currentSaveDraftData
    .filter((rowData) => {
      return Object.values(rowData).some(
        (value: any) =>
          value !== null &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .slice(0, 20);

  return (
    <Draggable>
      <div
        className="bg-white shadow-lg"
        style={
          {
            /* ... */
          }
        }
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
            <div className="table-container">
              <table className="w-full">
                <thead className="tables">
                  <tr>
                    <th>Draft Number</th>
                    <th>Customer Code</th>
                    <th>Customer Name</th>
                    <th>Foreign Name</th>
                    <th>Walk-in Customer Name</th>
                    <th>Document Date</th>
                    <th>Sales Crew</th>
                  </tr>
                </thead>
                <tbody className="bg-white shadow-lg pt-3">
                  {filteredSaveDraftData.map((customer) => (
                    <tr
                      key={customer.DraftNum}
                      onClick={() => handleRowClick(customer)}
                    >
                      <td>{customer.DraftNum}</td>
                      <td>{customer.CustomerCode}</td>
                      <td>{customer.CustomerName}</td>
                      <td>{customer.ForeignName}</td>
                      <td>{customer.WalkInName}</td>
                      <td>{customer.DocDate}</td>
                      <td>{customer.CreatedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default YourComponent;
