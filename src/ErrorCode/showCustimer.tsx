import React from "react";
import Draggable from "react-draggable";

const showCustimer = () => {
  // 2110
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
          <div>Customer</div>
          <div className="text-right">
            <span onClick={handleShowCustomer} className="cursor-pointer">
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
                  <th>Name</th>
                  <th>Foreign Name</th>
                  <th>Shipping Address</th>
                  <th>LicTradNum</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((rowData: any, rowIndex) => (
                  <tr className="trcus" key={rowIndex}>
                    <td
                      className="tdcus"
                      onClick={() =>
                        addCustomerData(
                          rowData.CardCode,
                          rowData.CardName,
                          rowData.CardFName,
                          rowData.Address,
                          rowData.LicTradNum
                        )
                      }
                    >
                      {rowData.CardCode}
                    </td>
                    <td
                      className="tdcus"
                      onClick={() =>
                        addCustomerData(
                          rowData.CardCode,
                          rowData.CardName,
                          rowData.CardFName,
                          rowData.Address,
                          rowData.LicTradNum
                        )
                      }
                    >
                      {rowData.CardName}
                    </td>
                    <td
                      className="tdcus"
                      onClick={() =>
                        addCustomerData(
                          rowData.CardCode,
                          rowData.CardName,
                          rowData.CardFName,
                          rowData.Address,
                          rowData.LicTradNum
                        )
                      }
                    >
                      {rowData.CardFName}
                    </td>
                    <td
                      className="tdcus"
                      onClick={() =>
                        addCustomerData(
                          rowData.CardCode,
                          rowData.CardName,
                          rowData.CardFName,
                          rowData.Address,
                          rowData.LicTradNum
                        )
                      }
                    >
                      {rowData.Address}
                    </td>
                    <td
                      className="tdcus"
                      onClick={() =>
                        addCustomerData(
                          rowData.CardCode,
                          rowData.CardName,
                          rowData.CardFName,
                          rowData.Address,
                          rowData.LicTradNum
                        )
                      }
                    >
                      {rowData.LicTradNum}
                    </td>
                    {/* {Object.values(rowData).map((value, colIndex) => (
                                        <td className="tdcus" key={colIndex} onClick={()=>addCustomerData(rowData.customerCode, rowData.customerName, rowData.cusShipAddress, rowData.cusTIN)} >{value}</td>
                                      ))} */}
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

export default showCustimer;
