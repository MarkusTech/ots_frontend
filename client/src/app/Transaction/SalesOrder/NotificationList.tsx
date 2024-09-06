import React from "react";

const NotificationList = () => {
  return (
    <div
      className="bg-white shadow-lg"
      style={{
        border: "1px solid #ccc",
        position: "absolute",
        top: "20%",
        left: "20%",
        maxHeight: "700px",
        overflowY: "auto",
      }}
    >
      <div
        className="grid grid-cols-2 p-2 text-left windowheader"
        style={{ cursor: "move" }}
      >
        <div>Search</div>
        <div className="text-right">
          <span className="cursor-pointer">❌</span>
        </div>
      </div>
      <div className="content">
        <div className="p-2">
          <div className="flex items-center">
            <div>
              Search:{" "}
              <input
                type="text"
                className="mb-1"
                // value={searchTerm}
                // onChange={handleSearchForDraft}
              />
            </div>
            <div className="flex-grow"></div>
            <div className="flex items-center">
              <label htmlFor="fromDate" className="mr-2">
                Filter By Date:
              </label>
              <input
                id="fromDate"
                type="date"
                className="w-24 md:w-32 px-2 py-1 border rounded"
                // onChange={(e) => setFromDate(e.target.value)}
              />
              <p>:&nbsp;</p>
              <button
                className="p-1 mt-2 mb-1 mr-2 text-xs bg-[#f69629] hover:bg-yellow-500 focus:outline-none focus:shadow-outline-yellow active:bg-yellow-600 rounded w-24"
                // onClick={handleFilter}
              >
                Filter
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="w-full">
              <thead className="tables">
                <tr>
                  <th>Draft Number</th>
                  <th>Customer Code</th>
                  <th>Customer Name</th>
                  <th>Walk-in Customer Name</th>
                  <th>Document Date</th>
                  <th>Sales Crew</th>
                </tr>
              </thead>
              <tbody>
                {/* {filteredSaveDraftData.map((customer: any, rowIndex) => (
                  <tr key={rowIndex} className="tdcus">
                    <td
                      onClick={() =>
                        addDraftData(
                          customer.DraftNum,
                          customer.CustomerCode,
                          customer.CustomerName,
                          customer.WalkInName,
                          customer.DocDate,
                          customer.CreatedBy
                        )
                      }
                    >
                      {customer.DraftNum}
                    </td>
                    <td
                      onClick={() =>
                        addDraftData(
                          customer.DraftNum,
                          customer.CustomerCode,
                          customer.CustomerName,
                          customer.WalkInName,
                          customer.DocDate,
                          customer.CreatedBy
                        )
                      }
                    >
                      {customer.CustomerCode}
                    </td>
                    <td
                      onClick={() =>
                        addDraftData(
                          customer.DraftNum,
                          customer.CustomerCode,
                          customer.CustomerName,
                          customer.WalkInName,
                          customer.DocDate,
                          customer.CreatedBy
                        )
                      }
                    >
                      {customer.CustomerName}
                    </td>
                    <td
                      onClick={() =>
                        addDraftData(
                          customer.DraftNum,
                          customer.CustomerCode,
                          customer.CustomerName,
                          customer.WalkInName,
                          customer.DocDate,
                          customer.CreatedBy
                        )
                      }
                    >
                      {customer.WalkInName}
                    </td>
                    <td
                      onClick={() =>
                        addDraftData(
                          customer.DraftNum,
                          customer.CustomerCode,
                          customer.CustomerName,
                          customer.WalkInName,
                          customer.DocDate,
                          customer.CreatedBy
                        )
                      }
                    >
                      {customer.DocDate}
                    </td>
                    <td
                      onClick={() =>
                        addDraftData(
                          customer.DraftNum,
                          customer.CustomerCode,
                          customer.CustomerName,
                          customer.WalkInName,
                          customer.DocDate,
                          customer.CreatedBy
                        )
                      }
                    >
                      {customer.CreatedBy}
                    </td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
